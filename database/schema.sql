-- MDI AI Detection System Database Schema
-- PostgreSQL 13+ compatible

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- user, admin, viewer
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create Camera Types Enum
CREATE TYPE camera_type AS ENUM ('static', 'ptz', 'webcam', 'thermal', 'onvif');

-- Create Cameras Table
CREATE TABLE cameras (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    camera_type camera_type NOT NULL DEFAULT 'static',
    location VARCHAR(100),
    rtsp_url VARCHAR(255),
    onvif_address VARCHAR(255),
    username VARCHAR(100),
    password VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_connection TIMESTAMP,
    connection_info JSONB DEFAULT '{}',
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thumbnail_url VARCHAR(255),
    recording_enabled BOOLEAN DEFAULT TRUE,
    retention_days INTEGER DEFAULT 30,
    resolution VARCHAR(20) DEFAULT '1080p' -- 720p, 1080p, 4K
);

-- Create Detection Types Enum
CREATE TYPE detection_type AS ENUM ('person', 'vehicle', 'face', 'bag', 'weapon', 'phone');

-- Create Detection Status Enum
CREATE TYPE detection_status AS ENUM ('pending', 'confirmed', 'rejected');

-- Create Detections Table
CREATE TABLE detections (
    id SERIAL PRIMARY KEY,
    camera_id INTEGER REFERENCES cameras(id) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detection_type detection_type NOT NULL,
    confidence DECIMAL(5,2) NOT NULL, -- 0-100 percentage
    x_coord INTEGER NOT NULL,
    y_coord INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    status detection_status NOT NULL DEFAULT 'pending',
    metadata JSONB DEFAULT '{}', -- Additional detection metadata (colors, descriptions)
    image_path VARCHAR(255), -- Path to the detection snapshot
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event_id UUID DEFAULT uuid_generate_v4() -- Group related detections
);

-- Create index for faster detection queries
CREATE INDEX idx_detections_camera_id ON detections(camera_id);
CREATE INDEX idx_detections_timestamp ON detections(timestamp);
CREATE INDEX idx_detections_type ON detections(detection_type);
CREATE INDEX idx_detections_event_id ON detections(event_id);

-- Create Alert Types Enum
CREATE TYPE alert_type AS ENUM ('intrusion', 'loitering', 'object_removed', 'unattended_object', 'crowd_formation');

-- Create Alert Severity Enum
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create Alert Status Enum
CREATE TYPE alert_status AS ENUM ('active', 'resolved', 'false_positive', 'acknowledged');

-- Create Alerts Table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    camera_id INTEGER REFERENCES cameras(id) NOT NULL,
    detection_id INTEGER REFERENCES detections(id),
    alert_type alert_type NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'medium',
    status alert_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(id),
    notes TEXT,
    event_id UUID -- Link to the same event_id in detections
);

-- Create index for faster alert queries
CREATE INDEX idx_alerts_camera_id ON alerts(camera_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_alerts_event_id ON alerts(event_id);

-- Create UserSettings Table
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    layout_pref VARCHAR(20) DEFAULT 'single', -- single, 2x2, 3x3
    auto_login BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Notification Types Enum
CREATE TYPE notification_type AS ENUM ('email', 'push', 'sms', 'in_app');

-- Create NotificationSettings Table
CREATE TABLE notification_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    alert_type alert_type NOT NULL,
    notification_type notification_type NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create CameraLayouts Table
CREATE TABLE camera_layouts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    layout_type VARCHAR(20) NOT NULL, -- single, 2x2, 3x3, custom
    configuration JSONB NOT NULL, -- Camera positions and sizes
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create SavedSearches Table
CREATE TABLE saved_searches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    search_query TEXT NOT NULL,
    filter_criteria JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create ApiTokens Table
CREATE TABLE api_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP
);

-- Create Recordings Table for video segments
CREATE TABLE recordings (
    id SERIAL PRIMARY KEY,
    camera_id INTEGER REFERENCES cameras(id) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL,
    has_detections BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_recordings_camera_id ON recordings(camera_id);
CREATE INDEX idx_recordings_time_range ON recordings(start_time, end_time);

-- Create AI Model Configurations Table
CREATE TABLE ai_models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- object_detection, face_recognition, etc.
    endpoint_url VARCHAR(255),
    api_key VARCHAR(255),
    confidence_threshold DECIMAL(5,2) DEFAULT 70.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    configuration JSONB DEFAULT '{}'
);

-- Create Camera-Model Association (which cameras use which AI models)
CREATE TABLE camera_ai_models (
    camera_id INTEGER REFERENCES cameras(id) NOT NULL,
    model_id INTEGER REFERENCES ai_models(id) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    confidence_threshold DECIMAL(5,2), -- override default confidence threshold
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (camera_id, model_id)
);

-- Create Timeline Bookmarks Table
CREATE TABLE timeline_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    camera_id INTEGER REFERENCES cameras(id),
    timestamp TIMESTAMP NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#3498db',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create System Audit Log
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- login, logout, create, update, delete
    resource_type VARCHAR(50) NOT NULL, -- user, camera, detection, alert
    resource_id INTEGER,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing

-- Create admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name) 
VALUES ('admin', 'admin@security.com', '$2a$10$tS/WbPnXEkqn.2mfZ7DVfOXJNDxV5lVnHQZn.XnWPNnLB/Vq0uYQC', 'admin', 'Admin', 'User');

-- Create regular user (password: user123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name) 
VALUES ('user', 'user@security.com', '$2a$10$1tG8.rMVPmF5rL9TjNXVn.D0AuLLLkWVbcK6KdUSQrfXZkQ1IlS2a', 'user', 'Regular', 'User');

-- Create sample cameras
INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('North Entrance', 'static', 'Building North Side', 'rtsp://example.com/north', TRUE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('Warehouse Floor', 'ptz', 'Warehouse', 'rtsp://example.com/warehouse', TRUE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('Parking Lot A', 'static', 'Outdoor Parking', 'rtsp://example.com/parking', TRUE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('Loading Dock', 'static', 'Loading Area', 'rtsp://example.com/loading', FALSE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('Office Entrance', 'static', 'Main Office', 'rtsp://example.com/office', TRUE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('South Gate', 'ptz', 'Building South Side', 'rtsp://example.com/south', TRUE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('East Wing', 'static', 'Building East Side', 'rtsp://example.com/east', TRUE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('West Wing', 'static', 'Building West Side', 'rtsp://example.com/west', FALSE, 1);

INSERT INTO cameras (name, camera_type, location, rtsp_url, is_active, owner_id) 
VALUES ('Reception', 'static', 'Reception Area', 'rtsp://example.com/reception', TRUE, 1);

INSERT INTO cameras (name, camera_type, location, is_active, owner_id) 
VALUES ('Laptop Webcam', 'webcam', 'Admin Office', TRUE, 1);

-- Insert sample detections
INSERT INTO detections (camera_id, detection_type, confidence, x_coord, y_coord, width, height, status, metadata)
VALUES (1, 'person', 95.5, 240, 320, 100, 200, 'confirmed', '{"color": "red", "direction": "entering"}');

INSERT INTO detections (camera_id, detection_type, confidence, x_coord, y_coord, width, height, status, metadata)
VALUES (2, 'vehicle', 88.2, 500, 400, 200, 150, 'confirmed', '{"color": "blue", "type": "car"}');

INSERT INTO detections (camera_id, detection_type, confidence, x_coord, y_coord, width, height, status, metadata)
VALUES (3, 'person', 75.8, 320, 240, 80, 180, 'pending', '{"color": "black", "action": "walking"}');

-- Insert sample alerts
INSERT INTO alerts (camera_id, detection_id, alert_type, severity, status)
VALUES (1, 1, 'intrusion', 'high', 'active');

INSERT INTO alerts (camera_id, detection_id, alert_type, severity, status)
VALUES (2, 2, 'object_removed', 'medium', 'acknowledged');

INSERT INTO alerts (camera_id, detection_id, alert_type, severity, status, resolved_at, resolved_by)
VALUES (3, 3, 'loitering', 'low', 'resolved', CURRENT_TIMESTAMP - INTERVAL '1 hour', 1);

-- Insert user settings
INSERT INTO user_settings (user_id, theme, layout_pref)
VALUES (1, 'dark', 'single');

INSERT INTO user_settings (user_id, theme, layout_pref)
VALUES (2, 'dark', '2x2');

-- Insert notification settings
INSERT INTO notification_settings (user_id, alert_type, notification_type, is_enabled, email)
VALUES (1, 'intrusion', 'email', TRUE, 'admin@security.com');

INSERT INTO notification_settings (user_id, alert_type, notification_type, is_enabled, email)
VALUES (1, 'intrusion', 'push', TRUE, NULL);

-- Insert sample camera layout
INSERT INTO camera_layouts (name, user_id, layout_type, configuration, is_default)
VALUES ('Main View', 1, '2x2', '{"slots": [{"position": 1, "camera_id": 1}, {"position": 2, "camera_id": 2}, {"position": 3, "camera_id": 3}, {"position": 4, "camera_id": 5}]}', TRUE);

-- Insert sample AI model
INSERT INTO ai_models (name, model_type, confidence_threshold)
VALUES ('YOLOv5 Object Detection', 'object_detection', 80.00);

-- Associate AI model with cameras
INSERT INTO camera_ai_models (camera_id, model_id)
VALUES (1, 1), (2, 1), (3, 1), (5, 1), (6, 1), (7, 1), (9, 1);

-- Add initial timeline bookmark
INSERT INTO timeline_bookmarks (user_id, camera_id, timestamp, name, description)
VALUES (1, 1, CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Suspicious Activity', 'Person loitering at north entrance');

-- Function to clean up old detections and recordings (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS void AS $$
BEGIN
  -- Delete detections older than retention period
  DELETE FROM detections
  WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';
  
  -- Delete recordings older than retention period (unless they have detections)
  DELETE FROM recordings
  WHERE end_time < CURRENT_TIMESTAMP - INTERVAL '30 days'
  AND has_detections = FALSE;
  
  -- Archive resolved alerts older than 90 days (in a real system, you'd move these to an archive table)
  UPDATE alerts
  SET notes = notes || ' [ARCHIVED]'
  WHERE status = 'resolved'
  AND resolved_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql; 