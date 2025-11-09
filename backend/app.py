from flask import Flask
from auth.routes import auth_bp
from flask_cors import CORS
from products.routes import products_bp  # ✅ import


app = Flask(__name__)
CORS(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
# You need a secret key for session management
app.secret_key = 'your_super_secret_key'  # Change this to something secure

# Register the auth blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(products_bp, url_prefix='/api')  # ✅ register


if __name__ == '__main__':
    print(app.url_map)

    app.run(debug=True)
