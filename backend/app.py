from flask import Flask, request, jsonify
from auth.routes import auth_bp
from flask_cors import CORS
from products.routes import products_bp  # ✅ import
from recommendation_routes import recommendation_bp  # ✅ recommendation
from deep_translator import GoogleTranslator


app = Flask(__name__)
CORS(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
# You need a secret key for session management
app.secret_key = 'your_super_secret_key'  # Change this to something secure

# Register the auth blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(products_bp, url_prefix='/api')  # ✅ register
app.register_blueprint(recommendation_bp, url_prefix='/api')  # ✅ recommendation

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text')
    target = data.get('target', 'hi')

    try:
        translated = GoogleTranslator(source='en', target=target).translate(text)
        return jsonify({"translatedText": translated})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
translation_cache = {}

@app.route('/translate-batch', methods=['POST'])
def translate_batch():
    data = request.json
    texts = data.get('texts', [])
    target = data.get('target', 'hi')

    translator = GoogleTranslator(source='en', target=target)

    result = {}

    for text in texts:
        key = f"{text}_{target}"

        if key in translation_cache:
            result[text] = translation_cache[key]
        else:
            translated = translator.translate(text)
            translation_cache[key] = translated
            result[text] = translated

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)