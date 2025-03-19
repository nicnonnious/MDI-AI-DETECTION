const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Create Express app
const app = express();

// Create log directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create storage directories if they don't exist
const storageDir = path.join(__dirname, 'storage');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
  fs.mkdirSync(path.join(storageDir, 'videos'), { recursive: true });
  fs.mkdirSync(path.join(storageDir, 'screenshots'), { recursive: true });
  fs.mkdirSync(path.join(storageDir, 'temp'), { recursive: true });
}

// Setup logging
const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'),
  { flags: 'a' }
);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// Logging middleware
if (config.server.environment === 'production') {
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: config.api.rateLimitWindow,
  max: config.api.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/cameras', require('./routes/cameras'));
// Additional routes will be added below as they are implemented
app.use('/api/detections', require('./routes/detections'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/search', require('./routes/search'));

// Serve static assets in production
if (config.server.environment === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Default route for API server in development
  app.get('/', (req, res) => {
    res.json({ 
      message: 'MDI AI Detection API Server', 
      version: '1.0.0',
      environment: config.server.environment
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({
    message: 'Server Error',
    error: config.server.environment === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.server.environment} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, we might want to exit and let a process manager restart the app
  if (config.server.environment === 'production') {
    process.exit(1);
  }
});

module.exports = app; 