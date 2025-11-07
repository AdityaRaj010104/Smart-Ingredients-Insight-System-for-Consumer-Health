from flask import Blueprint, request, jsonify, session
import sqlite3
import bcrypt
from database.connection import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('full_name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match!"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('INSERT INTO users (full_name, username, email, password, confirm_password) VALUES (?, ?, ?, ?, ?)',
                    (full_name, username, email, hashed_pw, hashed_pw))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or email already exists!"}), 409
    finally:
        conn.close()


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cur.fetchone()
    conn.close()

    if user is None:
        return jsonify({"error": "Invalid email or password!"}), 401

    stored_pw = user['password']
    # Check hashed password
    if bcrypt.checkpw(password.encode('utf-8'), stored_pw):
        # ✅ Save user session
        session['user_id'] = user['id']
        session['username'] = user['username']

        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"error": "Invalid email or password!"}), 401


# ---------------- LOGOUT ----------------
@auth_bp.route('/logout', methods=['POST'])
def logout():
    if 'user_id' in session:
        session.pop('user_id', None)
        session.pop('username', None)
        return jsonify({"message": "Logged out successfully!"}), 200
    else:
        return jsonify({"message": "No active session found."}), 400