import sqlite3
import os

# Get the absolute path of the database file (works everywhere)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "nutritionDB.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # optional but useful for dict-like results
    return conn
print("Connecting to:", DB_PATH)
