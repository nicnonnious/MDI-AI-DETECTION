# MDI AI Detection - Frontend

This is the React frontend for the MDI AI Detection application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

This will start the React development server on http://localhost:3000.

## Features

- Timeline view to visualize AI detections with green (confirmed) and red (suspicious) markers
- Detailed list view of all AI detections with confidence scores
- Real-time updates when new detections are added
- Delete functionality for individual detections

## Components

- **App.js**: Main application component and state management
- **Timeline.js**: Visualizes detections on a timeline with color-coded markers
- **DetectionList.js**: Displays a tabular view of all detections

## API Integration

The frontend is configured to communicate with the backend API at http://localhost:5000. The proxy setting in package.json handles this connection in development.

## Testing

The frontend includes several test cases to ensure components are rendering correctly and API calls are functioning as expected.

Run the tests with:
```
npm test
```

## Production Build

Create a production build with:
```
npm run build
```

This will create optimized files in the `build` folder that can be deployed to any static hosting service. 