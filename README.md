# MDI AI Detection System

A comprehensive security camera system with AI-powered object detection, smart searching, and alerting capabilities.

## Overview

The MDI AI Detection System is designed to provide intelligent monitoring of security cameras, automatically detect objects of interest (people, vehicles, weapons, etc.), and alert users based on customizable rules. The system includes:

- ONVIF/RTSP camera support
- Local webcam integration for testing
- AI-powered object detection
- Smart timeline with search capabilities
- Alerting system
- User authentication and management
- Comprehensive settings management

## System Architecture

The system consists of three main components:

1. **Frontend**: React-based web application providing the user interface
2. **Backend API**: Node.js/Express REST API for data persistence and business logic
3. **Database**: PostgreSQL database for storing users, cameras, detections, and application settings

## Getting Started

### Prerequisites

- Node.js 14+ (for frontend and backend)
- PostgreSQL 12+ (for database)
- Modern web browser (Chrome, Firefox, Edge)

### Installation

#### 1. Database Setup

Set up the PostgreSQL database:

```bash
cd database
chmod +x setup_db.sh
./setup_db.sh
```

This script will:
- Create a new database user if needed
- Create a new database
- Set up the schema with all required tables
- Add sample data for testing

#### 2. Backend Setup

Install and start the backend server:

```bash
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:3001 by default.

#### 3. Frontend Setup

The frontend is a React-based web application that provides the user interface for the MDI AI Detection System.

##### Requirements
- Node.js 14+ (LTS version recommended)
- npm 6+ or yarn
- Modern web browser (Chrome, Firefox, Edge)

##### Installation and Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or if using yarn:
   ```bash
   yarn install
   ```

3. Configure environment (if needed):
   - Copy `.env.example` to `.env` (if it exists)
   - Update any environment variables as needed
   - By default, the frontend will connect to the backend at http://localhost:3001

4. Start the development server:
   ```bash
   npm start
   ```
   or with yarn:
   ```bash
   yarn start
   ```

The frontend will start on http://localhost:3000 by default. The application will automatically open in your default browser.

##### Available Scripts

- `npm start` - Runs the app in development mode with hot-reload
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run eject` - Ejects the create-react-app configuration (one-way operation)

##### Production Deployment

To deploy the frontend to production:

1. Create an optimized production build:
   ```bash
   npm run build
   ```
   or
   ```bash
   yarn build
   ```

2. The `build` folder will contain the production-ready files that can be deployed to any static hosting service (Netlify, Vercel, AWS S3, etc.)

##### Features

The frontend includes:
- Real-time camera feed display
- AI detection visualization
- Interactive timeline with detection events
- User authentication and profile management
- Camera configuration interface
- Alert management system
- Responsive design for desktop and mobile devices

##### Troubleshooting

Common issues and solutions:

1. If the app fails to start, ensure:
   - All dependencies are installed (`npm install`)
   - The correct Node.js version is being used
   - Port 3000 is not in use by another application

2. If you can't connect to the backend:
   - Verify the backend is running on http://localhost:3001
   - Check your firewall settings
   - Ensure the proxy settings in package.json are correct

For more detailed information about the frontend, refer to the `frontend/README.md` file.

## Database Schema

The database consists of the following main tables:

### Users

Stores user account information and authentication details.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  last_login TIMESTAMP
);
```

### Cameras

Stores camera configuration details for RTSP, ONVIF, and webcam sources.

```sql
CREATE TABLE cameras (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  location VARCHAR(100),
  rtsp_url VARCHAR(255),
  onvif_address VARCHAR(255),
  username VARCHAR(50),
  password VARCHAR(100),
  is_recording_enabled BOOLEAN DEFAULT FALSE,
  detection_areas JSONB,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Detections

Stores AI detection events from cameras.

```sql
CREATE TABLE detections (
  id SERIAL PRIMARY KEY,
  camera_id INTEGER REFERENCES cameras(id) ON DELETE CASCADE,
  timestamp TIMESTAMP NOT NULL,
  detection_type VARCHAR(20) NOT NULL,
  confidence FLOAT NOT NULL,
  bounding_box JSONB NOT NULL,
  screenshot_path VARCHAR(255),
  metadata JSONB,
  status VARCHAR(20) DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Alerts

Stores alert events generated from detections.

```sql
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  detection_id INTEGER REFERENCES detections(id) ON DELETE CASCADE,
  camera_id INTEGER REFERENCES cameras(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  resolved_at TIMESTAMP,
  resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);
```

### User Settings

Stores user preferences and application settings.

```sql
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'dark',
  language VARCHAR(10) DEFAULT 'en',
  default_layout VARCHAR(20) DEFAULT '2x2',
  timeline_settings JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Notification Settings

Stores user notification preferences.

```sql
CREATE TABLE notification_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email_alerts BOOLEAN DEFAULT FALSE,
  push_alerts BOOLEAN DEFAULT FALSE,
  sound_alerts BOOLEAN DEFAULT TRUE,
  alert_types VARCHAR(20)[] DEFAULT ARRAY['PERSON', 'VEHICLE']::VARCHAR(20)[],
  email_settings JSONB,
  auto_resolve_timeout INTEGER DEFAULT 300,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Camera Layouts

Stores user-defined camera view layouts.

```sql
CREATE TABLE camera_layouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  layout_type VARCHAR(20) NOT NULL,
  camera_ids INTEGER[] NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### Saved Searches

Stores user-saved search criteria for quick access.

```sql
CREATE TABLE saved_searches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  criteria JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

### API Tokens

Stores API tokens for integrations.

```sql
CREATE TABLE api_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_name VARCHAR(50) NOT NULL,
  token_hash VARCHAR(100) NOT NULL,
  permissions VARCHAR(20)[] NOT NULL,
  expires_at TIMESTAMP,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Recordings

Stores video recording information.

```sql
CREATE TABLE recordings (
  id SERIAL PRIMARY KEY,
  camera_id INTEGER REFERENCES cameras(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  size_bytes BIGINT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## API Endpoints

The backend provides RESTful API endpoints for all functionality:

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login with credentials
- `GET /api/users/me` - Get current user information

### Camera Management

- `GET /api/cameras` - Get all cameras for the current user
- `GET /api/cameras/:id` - Get a specific camera
- `POST /api/cameras` - Create a new camera
- `PUT /api/cameras/:id` - Update a camera
- `DELETE /api/cameras/:id` - Delete a camera
- `POST /api/cameras/test-connection` - Test a camera connection

### Detections

- `GET /api/detections` - Get all detections (with filtering)
- `GET /api/detections/:id` - Get a specific detection
- `GET /api/cameras/:id/detections` - Get detections for a camera
- `POST /api/detections/search` - Search detections with criteria

### Alerts

- `GET /api/alerts` - Get all alerts (with filtering)
- `GET /api/alerts/:id` - Get a specific alert
- `PUT /api/alerts/:id` - Update an alert (e.g., resolve)
- `POST /api/alerts/batch-update` - Batch update alerts

### User Settings

- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update user settings
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `PUT /api/users/notifications` - Update notification settings

## Frontend Features

The frontend provides a rich user interface for interacting with the system:

- **Camera View**: Displays camera feeds in different layouts (single, 2x2, 3x3)
- **Timeline**: Shows a timeline of detection events with filtering
- **Smart Search**: Allows searching for specific objects in recorded video
- **Settings Panel**: Provides interface for configuring cameras, detection settings, and notifications
- **Alert Management**: Displays alerts and allows acknowledgment/resolution
- **User Profile**: Manages user settings and preferences

## Development

### Environment Variables

The backend can be configured with the following environment variables:

- `NODE_ENV` - Environment (development, production)
- `PORT` - Server port
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time

### Data Flow

1. **Authentication**: Users authenticate via the API to get a JWT token
2. **Camera Setup**: Users configure cameras through the settings panel
3. **Live Viewing**: Users view camera feeds in real-time
4. **AI Detection**: Backend processes camera feeds and detects objects
5. **Alerting**: System generates alerts based on detection criteria
6. **Timeline & Search**: Users can view past events and search for specific objects

## License

This project is licensed under the MIT License - see the LICENSE file for details. 