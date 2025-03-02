import os
import pymysql
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_mysqldb import MySQL
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app) 

# MySQL Configuration
app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "root"
app.config["MYSQL_DB"] = "plagiarism_checker"

mysql = MySQL(app, origins=['http://localhost:4200'])

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

if __name__ == "__main__":
    app.run(debug=True)
