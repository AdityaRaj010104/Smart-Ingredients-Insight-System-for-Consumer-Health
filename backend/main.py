import json
import pickle
import joblib
from extractor import extract_json_from_image
from fastapi import UploadFile, File, HTTPException
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

""""
MODEL_PATH = "model/final_model_rf.pkl"   # change if needed

# Load model (joblib → pickle fallback)
def load_model(path):
    try:
        return joblib.load(path)
    except:
        with open(path, "rb") as f:
            return pickle.load(f)

def predict_from_features(features_dict, model):
    # Convert dict → ordered list of feature values
    # IMPORTANT: Use the same order used during training

    feature_order = ['ENERGY_KCAL', 'PROTEIN_G', 'CARBOHYDRATE_G', 'SUGARS_TOTALG',
    'FIBER_TOTAL_DIETARY_G', 'TOTAL_FAT_G', 'FATTY_ACIDS_TOTAL_SATURATED_G',
    'CHOLESTEROL_MG', 'VITAMIN_C_MG', 'CALCIUM_MG', 'IRONMG', 'SODIUM_MG',
    'TOTAL_VITAMIN_A_MCG']  
    # ↑ Change this to match your model's feature order exactly

    feature_values = []

    for key in feature_order:
        feature_values.append(features_dict.get(key, 0))  # default missing values to 0

    # Make prediction
    prediction = model.predict([feature_values])
    return prediction[0]

def main():
    image_path = input("Enter image path: ")

    print("\n🔍 Extracting nutrition data from image...\n")
    data = extract_json_from_image(image_path)

    print("✅ Extracted JSON:")
    print(json.dumps(data, indent=4))

    if "error" in data:
        print("\n❌ OCR/Extraction error:", data["error"])
        return

    print("\n📦 Loading ML model...")
    model = load_model(MODEL_PATH)

    print("🤖 Making prediction...")
    final_output = predict_from_features(data, model)

    print("\n✅ FINAL PREDICTION:", final_output)

if __name__ == "__main__":
    main()

    """

app = FastAPI(title="Smart Ingredients Insight System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Load Model
# ---------------------------
with open("model/final_model_rf.pkl", "rb") as f:
    model = pickle.load(f)

# ---------------------------
# Input Schema
# ---------------------------
class FoodInput(BaseModel):
    ENERGY_KCAL: float
    PROTEIN_G: float
    CARBOHYDRATE_G: float
    SUGARS_TOTALG: float
    FIBER_TOTAL_DIETARY_G: float
    TOTAL_FAT_G: float
    FATTY_ACIDS_TOTAL_SATURATED_G: float
    CHOLESTEROL_MG: float
    VITAMIN_C_MG: float
    CALCIUM_MG: float
    IRONMG: float
    SODIUM_MG: float
    TOTAL_VITAMIN_A_MCG: float

# ---------------------------
# Helper Function: Predict
# ---------------------------
@app.post("/predict")
def predict_food_nova(data: FoodInput):
    features = np.array([[
        data.ENERGY_KCAL,
        data.PROTEIN_G,
        data.CARBOHYDRATE_G,
        data.SUGARS_TOTALG,
        data.FIBER_TOTAL_DIETARY_G,
        data.TOTAL_FAT_G,
        data.FATTY_ACIDS_TOTAL_SATURATED_G,
        data.CHOLESTEROL_MG,
        data.VITAMIN_C_MG,
        data.CALCIUM_MG,
        data.IRONMG,
        data.SODIUM_MG,
        data.TOTAL_VITAMIN_A_MCG
    ]])

    features_log = np.log1p(features)

    probs = model.predict_proba(features_log)[0]  # class probabilities
    nova_class = int(np.argmax(probs) + 1)    # predicted NOVA
    fpro_score = float(((1 - probs[0]) + probs[3]) / 2)  # simplified FPro

    return {
        "nova_class": nova_class,
        "fpro_score": round(fpro_score, 4)
    }

@app.post("/extract_and_predict")
async def extract_and_predict(file: UploadFile = File(...)):
    try:
        # Save uploaded image temporarily
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        # Extract nutrient info from Gemini
        extracted_data = extract_json_from_image(temp_path)

        if "error" in extracted_data:
            raise HTTPException(status_code=500, detail=extracted_data["error"])

        # Predict from extracted features
        features = np.array([[
            extracted_data.get('ENERGY_KCAL', 0),
            extracted_data.get('PROTEIN_G', 0),
            extracted_data.get('CARBOHYDRATE_G', 0),
            extracted_data.get('SUGARS_TOTALG', 0),
            extracted_data.get('FIBER_TOTAL_DIETARY_G', 0),
            extracted_data.get('TOTAL_FAT_G', 0),
            extracted_data.get('FATTY_ACIDS_TOTAL_SATURATED_G', 0),
            extracted_data.get('CHOLESTEROL_MG', 0),
            extracted_data.get('VITAMIN_C_MG', 0),
            extracted_data.get('CALCIUM_MG', 0),
            extracted_data.get('IRONMG', 0),
            extracted_data.get('SODIUM_MG', 0),
            extracted_data.get('TOTAL_VITAMIN_A_MCG', 0)
        ]])

        probs = model.predict_proba(features)[0]
        nova_class = int(np.argmax(probs) + 1)
        fpro_score = float(((1 - probs[0]) + probs[3]) / 2)

        return {
            "nova_class": nova_class,
            "fpro_score": round(fpro_score, 4),
            "extracted_features": extracted_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------
# Test Root Endpoint
# ---------------------------
@app.get("/")
def root():
    return {"message": "NOVA & FPro Prediction API is running 🚀"}

