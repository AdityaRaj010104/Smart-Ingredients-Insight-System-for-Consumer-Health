from flask import Flask
from auth.routes import auth_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# You need a secret key for session management
app.secret_key = 'your_super_secret_key'  # Change this to something secure

# Register the auth blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
