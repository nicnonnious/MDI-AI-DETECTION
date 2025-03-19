# MDI AI Detection - Backend

This is the backend API for the MDI AI Detection application.

## Setup

1. Create a virtual environment (recommended):
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Unix/MacOS
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   python app.py
   ```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/detections` - Get all AI detections
- `POST /api/detections` - Add a new AI detection
- `DELETE /api/detections/<id>` - Delete a detection by ID

## Testing

You can test the API using curl or Postman:

### Get all detections
```
curl http://localhost:5000/api/detections
```

### Add a new detection
```
curl -X POST -H "Content-Type: application/json" -d '{"type":"person","confidence":0.88,"status":"confirmed","coordinates":{"x":400,"y":300}}' http://localhost:5000/api/detections
```

### Delete a detection
```
curl -X DELETE http://localhost:5000/api/detections/1
```

## Notes

This backend is designed to receive and store AI detection data from a computer vision API.
In a production environment, you would use a database to store the detections. 