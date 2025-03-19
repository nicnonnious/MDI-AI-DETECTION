const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');

/**
 * Authentication middleware
 * Verifies the JWT token from the Authorization header
 * and attaches the user object to the request
 */
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token') || 
                req.header('Authorization')?.replace('Bearer ', '') || 
                null;

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No authentication token, access denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    
    // Get user from database to ensure they still exist and are active
    const result = await db.query(
      'SELECT id, username, email, role, is_active FROM users WHERE id = $1',
      [decoded.user.id]
    );
    
    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ message: 'Invalid token or user is inactive' });
    }
    
    // Attach user object to request
    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 