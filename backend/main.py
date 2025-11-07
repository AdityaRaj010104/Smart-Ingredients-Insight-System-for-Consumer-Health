import json
import pickle
import joblib
from extractor import extract_json_from_image

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
