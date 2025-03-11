import os
import pymysql
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_mysqldb import MySQL
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager, create_access_token
import bcrypt

app = Flask(__name__)
CORS(app) 

# MySQL Configuration
app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "root"
app.config["MYSQL_DB"] = "plagiarism_checker"

mysql = MySQL(app)

# File Upload Configuration
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "files" not in request.files:
        return jsonify({"error": "No file part"}), 400

    files = request.files.getlist("files")  # Multiple files
    file_paths = []

    for file in files:
        if file.filename == "":
            continue

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)
        file_paths.append(file_path)

        # Store in MySQL
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO files (filename, filepath) VALUES (%s, %s)", (filename, file_path))
        mysql.connection.commit()
        cur.close()

    return jsonify({"message": "Files uploaded successfully", "files": file_paths}), 200

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
jwt = JWTManager(app)

# 🟢 Register User
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cur = mysql.connection.cursor()
    try:
        cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
        mysql.connection.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except:
        return jsonify({'error': 'User already exists'}), 400
    finally:
        cur.close()

# 🟢 Login User
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):  # User[3] = hashed password
        access_token = create_access_token(identity=user[0])  # User[0] = user_id
        return jsonify({'token': access_token, 'message': 'Login successful'})
    
    return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == "__main__":
    app.run(debug=True)
