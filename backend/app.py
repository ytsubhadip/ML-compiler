from flask import Flask, request, jsonify

app = Flask(__name__)

# Home Route
@app.route("/")
def home():
    return "🚀 CodeArena Backend Running Successfully!"

# Run Code Route
@app.route("/run", methods=["POST"])
def run_code():

    data = request.json

    language = data.get("language")
    code = data.get("code")

    return jsonify({
        "message": "Code received successfully",
        "language": language,
        "code": code
    })

if __name__ == "__main__":
    app.run(debug=True)
    
    
    
from flask_cors import CORS

app = Flask(__name__)
CORS(app)