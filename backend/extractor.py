

import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import os
import json

# Load .env file
load_dotenv()

# Get API key
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env file")

# Configure Gemini
genai.configure(api_key=API_KEY)

# Load the model
model = genai.GenerativeModel("gemini-2.5-flash")

def extract_json_from_image(image_path):
    try:
        image = Image.open(image_path)

        # Ask Gemini to return clean JSON only
        prompt = """
       Extract all nutrient names and their numeric values from this nutrition label.
        Return ONLY a valid JSON object.Ignore salt if found. Keep in mind ignore only salt, nothing else.Keep sodium.
        Remove units like g, mg, kcal. Use numbers only.
        Example response:
        {
            "Energy": 250,
            "Protein": 5,
            "Carbohydrates": 30,
            "Sugar": 12,
            "Fat": 10
        }
        
        And if the extracted nutrient are not among these ['ENERGY_KCAL', 'PROTEIN_G', 'CARBOHYDRATE_G', 'SUGARS_TOTALG',
    'FIBER_TOTAL_DIETARY_G', 'TOTAL_FAT_G', 'FATTY_ACIDS_TOTAL_SATURATED_G',
    'CHOLESTEROL_MG', 'VITAMIN_C_MG', 'CALCIUM_MG', 'IRONMG', 'SODIUM_MG',
    'TOTAL_VITAMIN_A_MCG'] assign te value zero to them and if any one from this set is missing in extracted nutrients then again assign that nutrientional value to 0.
        
        
        """

        response = model.generate_content([prompt, image])

        # Try to parse JSON
        try:
            data = json.loads(response.text)
        except:
            # If Gemini adds extra text, clean it
            cleaned = response.text.strip("```json").strip("```").strip()
            data = json.loads(cleaned)

        return data

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    img = r"C:\Users\ra709\OneDrive\Desktop\rough\image.png"

    output = extract_json_from_image(img)

    print("\n✅ Extracted Nutrition JSON:\n")
    print(json.dumps(output, indent=4))
