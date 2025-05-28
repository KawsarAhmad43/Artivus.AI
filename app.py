from flask import Flask, send_from_directory
from flask_cors import CORS
from utils.utils_routes import register_routes
from utils.utils_logging import setup_logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
CORS(app)  # Enable CORS for frontend

# Setup logging
setup_logging()

# Serve frontend
@app.route('/')
def serve_index():
    return send_from_directory('frontend', 'index.html')

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory('frontend/assets', path)

# Register API routes
register_routes(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)