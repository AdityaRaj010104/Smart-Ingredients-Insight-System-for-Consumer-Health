"""
recommendation_routes.py
========================
Flask Blueprint that powers the /api/recommend endpoint.

Pipeline:
1. Accept  user_ingredients (str)  +  user_nova (int)  +  lang (str)
2. Load FINAL_MERGED_DATASET_new.csv (once, cached in memory)
3. Build a "search text" from MAIN_FOOD_DESCRIPTION + WWEIA_CATEGORY_DESCRIPTION
   (since INGREDIENTS column is mostly empty in the dataset, we fall back to
   description columns as a semantic proxy)
4. TF-IDF cosine similarity  →  Top 5 most ingredient-similar products
5. For each of the 5, run the 13-nutrient feature vector through the existing
   Random Forest model  →  predicted NOVA class
6. Keep only products whose predicted NOVA < user_nova  (strictly healthier)
7. Sort ascending by predicted NOVA  →  pick Top 2-3
8. Ask Gemini to generate a 1-2 line explanation per recommendation in `lang`
9. Return JSON to the frontend
"""

import os
import pickle
import traceback
import numpy as np
import pandas as pd
from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from dotenv import load_dotenv

# ── env / config ──────────────────────────────────────────────────────────────
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
CSV_PATH   = os.path.join(BASE_DIR, "database", "FINAL_MERGED_DATASET_new.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model", "final_model_rf.pkl")

# Feature order must exactly match the training order used in main.py
FEATURE_ORDER = [
    "ENERGY_KCAL", "PROTEIN_G", "CARBOHYDRATE_G", "SUGARS_TOTALG",
    "FIBER_TOTAL_DIETARY_G", "TOTAL_FAT_G", "FATTY_ACIDS_TOTAL_SATURATED_G",
    "CHOLESTEROL_MG", "VITAMIN_C_MG", "CALCIUM_MG", "IRONMG",
    "SODIUM_MG", "TOTAL_VITAMIN_A_MCG",
]

# ── module-level cache ─────────────────────────────────────────────────────────
_df = None
_rf_model = None
_gemini_model = None


def _get_df() -> pd.DataFrame:
    """Load and cache the CSV dataset."""
    global _df
    if _df is None:
        print("[RECOMMEND] Loading dataset from CSV …")
        _df = pd.read_csv(CSV_PATH, low_memory=False)

        def _make_search_text(row):
            ing = str(row.get("INGREDIENTS", "")).strip()
            if ing and ing.lower() not in ("", "nan"):
                return ing.lower()
            desc = str(row.get("MAIN_FOOD_DESCRIPTION", "")).strip()
            cat  = str(row.get("WWEIA_CATEGORY_DESCRIPTION", "")).strip()
            return f"{desc} {cat}".lower()

        _df["_search_text"] = _df.apply(_make_search_text, axis=1)
        _df = _df[_df["_search_text"].str.strip() != ""]

        # ── Column alias: CSV uses VITAMIN_A_RAE_MCG_RAE but the RF model
        #    was trained with the feature name TOTAL_VITAMIN_A_MCG ──────────────
        if "VITAMIN_A_RAE_MCG_RAE" in _df.columns and "TOTAL_VITAMIN_A_MCG" not in _df.columns:
            _df["TOTAL_VITAMIN_A_MCG"] = _df["VITAMIN_A_RAE_MCG_RAE"]
            print("[RECOMMEND] ✅ Column alias created: VITAMIN_A_RAE_MCG_RAE → TOTAL_VITAMIN_A_MCG")

        for col in FEATURE_ORDER:
            if col in _df.columns:
                _df[col] = pd.to_numeric(_df[col], errors="coerce").fillna(0.0)
        print(f"[RECOMMEND] Dataset ready: {len(_df)} rows")
    return _df


def _get_model():
    """Load and cache the Random Forest pickle."""
    global _rf_model
    if _rf_model is None:
        print("[RECOMMEND] Loading RF model …")
        with open(MODEL_PATH, "rb") as f:
            _rf_model = pickle.load(f)
        print(f"[RECOMMEND] RF model loaded: {type(_rf_model).__name__}")
    return _rf_model


def _get_gemini():
    """Return a cached Gemini generative model."""
    global _gemini_model
    if _gemini_model is None and GEMINI_API_KEY:
        _gemini_model = genai.GenerativeModel("gemini-2.5-flash")
    return _gemini_model


# ── blueprint ─────────────────────────────────────────────────────────────────
recommendation_bp = Blueprint("recommendation", __name__)


@recommendation_bp.route("/recommend", methods=["POST"])
def recommend():
    """
    Expected JSON body:
    {
        "user_ingredients": "<text>",
        "user_nova":        4,
        "lang":             "en"
    }
    """
    try:
        data = request.get_json(force=True) or {}

        user_ingredients = str(data.get("user_ingredients", "")).strip()
        user_nova        = int(data.get("user_nova", 4))
        lang             = str(data.get("lang", "en")).split("-")[0].lower()

        print(f"\n{'='*60}")
        print(f"[RECOMMEND] ▶ New request")
        print(f"[RECOMMEND]   lang={lang!r}  user_nova={user_nova}")
        print(f"[RECOMMEND]   ingredients (first 120 chars): {user_ingredients[:120]!r}")
        print(f"{'='*60}")

        if not user_ingredients:
            print("[RECOMMEND] ❌ No ingredients provided — returning early.")
            return jsonify({"recommendations": [], "message": "No ingredients provided."}), 200

        df    = _get_df()
        model = _get_model()

        # ── Step 1: TF-IDF cosine similarity ──────────────────────────────────
        print("[RECOMMEND] Step 1 — Building TF-IDF corpus …")
        corpus       = [user_ingredients.lower()] + df["_search_text"].tolist()
        vectorizer   = TfidfVectorizer(max_features=5000, stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(corpus)
        sim_scores   = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        top5_indices = sim_scores.argsort()[::-1][:5]
        top5_indices = [i for i in top5_indices if sim_scores[i] > 0.01]

        print(f"[RECOMMEND] Step 1 — Candidates (sim > 0.01): {len(top5_indices)}")
        for i in top5_indices:
            name = str(df.iloc[i].get("MAIN_FOOD_DESCRIPTION", "?"))[:60]
            print(f"             score={sim_scores[i]:.4f}  name={name!r}")

        if not top5_indices:
            print("[RECOMMEND] ❌ No candidates above similarity threshold.")
            return jsonify({
                "recommendations": [],
                "message": "No better alternative product found."
            }), 200

        top5_df = df.iloc[top5_indices].copy()
        top5_df["_sim_score"] = [sim_scores[i] for i in top5_indices]

        # ── Step 2: Predict NOVA via existing RF model for each of the 5 ──────
        print("[RECOMMEND] Step 2 — Predicting NOVA via RF model …")
        feature_matrix = top5_df[FEATURE_ORDER].values
        feature_log    = np.log1p(feature_matrix)
        feature_df     = pd.DataFrame(feature_log, columns=FEATURE_ORDER)

        probs_all   = model.predict_proba(feature_df)
        nova_preds  = (np.argmax(probs_all, axis=1) + 1).tolist()
        fpro_scores = [float(((1 - p[0]) + p[3]) / 2) for p in probs_all]

        top5_df = top5_df.reset_index(drop=True)
        top5_df["_pred_nova"] = nova_preds
        top5_df["_pred_fpro"] = fpro_scores

        print(f"[RECOMMEND] Step 2 — Predicted NOVAs : {nova_preds}")
        print(f"[RECOMMEND] Step 2 — FPro scores     : {[round(s, 4) for s in fpro_scores]}")

        # ── Step 3: Keep ONLY products with strictly lower NOVA ───────────────
        print(f"[RECOMMEND] Step 3 — Filtering NOVA ≤ {user_nova} …")
        healthier = top5_df[top5_df["_pred_nova"] <= user_nova].copy()
        print(f"[RECOMMEND] Step 3 — Healthier candidates: {len(healthier)}")

        if healthier.empty:
            print("[RECOMMEND] ❌ No candidates with NOVA ≤ user_nova. No better alternative.")
            return jsonify({
                "recommendations": [],
                "message": "No better alternative product found."
            }), 200

        healthier = healthier.sort_values("_pred_nova").head(3)
        print(f"[RECOMMEND] Step 3 — Final picks ({len(healthier)}):")
        for _, row in healthier.iterrows():
            print(f"             {str(row['MAIN_FOOD_DESCRIPTION'])[:60]!r}"
                  f"  NOVA={row['_pred_nova']}  FPro={row['_pred_fpro']:.4f}")

        # ── Step 4: Build structured product list ─────────────────────────────
        recommendations_raw = []
        for _, row in healthier.iterrows():
            name = str(row.get("MAIN_FOOD_DESCRIPTION", "Unknown")).split(",")[0].strip()
            recommendations_raw.append({
                "name":      name,
                "nova":      int(row["_pred_nova"]),
                "fpro":      round(float(row["_pred_fpro"]), 4),
                "calories":  round(float(row.get("ENERGY_KCAL", 0)), 1),
                "protein":   round(float(row.get("PROTEIN_G", 0)), 1),
                "carbs":     round(float(row.get("CARBOHYDRATE_G", 0)), 1),
                "fat":       round(float(row.get("TOTAL_FAT_G", 0)), 1),
                "fiber":     round(float(row.get("FIBER_TOTAL_DIETARY_G", 0)), 1),
                "sugar":     round(float(row.get("SUGARS_TOTALG", 0)), 1),
                "sodium":    round(float(row.get("SODIUM_MG", 0)), 1),
                "category":  str(row.get("WWEIA_CATEGORY_DESCRIPTION", "")),
                "sim_score": round(float(row["_sim_score"]), 4),
            })

        # ── Step 5: Gemini multilingual explanation ───────────────────────────
        print(f"[RECOMMEND] Step 5 — Gemini explanations (lang={lang!r}) …")
        gemini = _get_gemini()
        explanations = []

        if gemini and recommendations_raw:
            lang_label       = "Hindi (Devanagari script)" if lang == "hi" else "English"
            original_summary = (
                f"Original product: ingredients='{user_ingredients}', NOVA={user_nova}"
            )
            for rec in recommendations_raw:
                prompt = f"""
You are a nutrition expert. Given the information below, write exactly 1-2 sentences
in {lang_label} explaining why the recommended product is a healthier choice than
the original product.

{original_summary}

Recommended product:
- Name: {rec['name']}
- NOVA class: {rec['nova']} (lower is healthier; 1=unprocessed, 4=ultra-processed)
- Calories: {rec['calories']} kcal, Protein: {rec['protein']}g, Fat: {rec['fat']}g,
  Sugar: {rec['sugar']}g, Fiber: {rec['fiber']}g, Sodium: {rec['sodium']}mg

Keep the explanation simple and consumer-friendly.
Respond ONLY with the explanation text, no extra formatting.
""".strip()
                try:
                    response = gemini.generate_content(prompt)
                    explanations.append(response.text.strip())
                    print(f"[RECOMMEND] ✅ Gemini OK for {rec['name']!r}")
                except Exception as gem_err:
                    print(f"[RECOMMEND] ⚠️  Gemini failed for {rec['name']!r}: {gem_err}")
                    explanations.append("")
        else:
            print("[RECOMMEND] ⚠️  Gemini skipped (no model or no recs).")
            explanations = [""] * len(recommendations_raw)

        # ── Assemble final output ──────────────────────────────────────────────
        final = []
        for rec, explanation in zip(recommendations_raw, explanations):
            rec["explanation"] = explanation
            final.append(rec)

        print(f"[RECOMMEND] ✅ Done — returning {len(final)} recommendation(s).\n")
        return jsonify({"recommendations": final}), 200

    except Exception as e:
        print(f"[RECOMMEND] 💥 Unhandled exception: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e), "recommendations": []}), 500
