/**
 * Configuration for the MDI AI Detection backend
 * 
 * Environment variables can be used to override these settings
 */

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // Database configuration
  db: {
    user: process.env.DB_USER || 'mdi_user',
    password: process.env.DB_PASSWORD || 'mdi_password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mdi_detection',
    ssl: process.env.DB_SSL === 'true',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  },
  
  // Authentication settings
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'mdi-development-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
  },
  
  // API settings
  api: {
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes in milliseconds
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'), // Maximum requests per window
  },
  
  // Storage settings for video recordings and screenshots
  storage: {
    videoPath: process.env.VIDEO_STORAGE_PATH || './storage/videos',
    screenshotPath: process.env.SCREENSHOT_STORAGE_PATH || './storage/screenshots',
    tempPath: process.env.TEMP_STORAGE_PATH || './storage/temp',
    maxAgeInDays: parseInt(process.env.STORAGE_MAX_AGE_DAYS || '30'),
  },
  
  // AI Model settings
  ai: {
    modelPath: process.env.AI_MODEL_PATH || './models',
    confidenceThreshold: parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || '0.6'),
    processingInterval: parseInt(process.env.AI_PROCESSING_INTERVAL || '1000'), // ms between frame processing
  },
  
  // RTSP stream settings
  rtsp: {
    streamSecret: process.env.RTSP_STREAM_SECRET || 'streamsecret',
    chunkSize: parseInt(process.env.RTSP_CHUNK_SIZE || '4096'),
  },
  
  // Notification settings
  notifications: {
    emailFrom: process.env.EMAIL_FROM || 'notifications@mdi-detection.com',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpSecure: process.env.SMTP_SECURE === 'true',
  }
};

// Validate essential configuration
if (config.server.environment === 'production') {
  if (config.auth.jwtSecret === 'mdi-development-secret-key') {
    console.warn('WARNING: Using default JWT secret in production environment!');
  }
}

module.exports = config; 