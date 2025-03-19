from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simulated database for AI detections
# In a real application, this would be stored in a database
detections = [
    {
        "id": 1,
        "timestamp": "2025-03-13T14:30:00",
        "type": "person",
        "confidence": 0.92,
        "status": "confirmed",  # Will be shown as green
        "coordinates": {"x": 450, "y": 280}
    },
    {
        "id": 2,
        "timestamp": "2025-03-13T14:35:00",
        "type": "vehicle",
        "confidence": 0.78,
        "status": "suspicious",  # Will be shown as red
        "coordinates": {"x": 320, "y": 420}
    },
    {
        "id": 3,
        "timestamp": "2025-03-13T14:40:00",
        "type": "person",
        "confidence": 0.85,
        "status": "confirmed",
        "coordinates": {"x": 520, "y": 350}
    }
]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint for health check"""
    return jsonify({"status": "healthy", "message": "MDI AI Detection API is running"})

@app.route('/api/detections', methods=['GET'])
def get_detections():
    """Get all AI detections"""
    return jsonify(detections)

@app.route('/api/detections', methods=['POST'])
def add_detection():
    """Add a new AI detection (from computer vision API)"""
    detection = request.json
    
    # Add validation here in a real application
    if not detection or not isinstance(detection, dict):
        return jsonify({"error": "Invalid detection data"}), 400
    
    # Generate a new ID
    new_id = max([d["id"] for d in detections], default=0) + 1
    detection["id"] = new_id
    
    # Add timestamp if not provided
    if "timestamp" not in detection:
        detection["timestamp"] = datetime.now().isoformat()
    
    detections.append(detection)
    return jsonify(detection), 201

@app.route('/api/detections/<int:detection_id>', methods=['DELETE'])
def delete_detection(detection_id):
    """Delete an AI detection"""
    global detections
    original_count = len(detections)
    detections = [d for d in detections if d["id"] != detection_id]
    
    if len(detections) == original_count:
        return jsonify({"error": "Detection not found"}), 404
    
    return jsonify({"message": f"Detection {detection_id} deleted successfully"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=True) 