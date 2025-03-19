const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/users/register
 * @desc    Register a user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // Check if user already exists
    const userCheck = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(config.auth.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.query(
      `INSERT INTO users (
        username, email, password_hash, first_name, last_name, 
        role, is_active, created_at, last_login
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NULL) RETURNING id, username, email, role`,
      [
        username,
        email,
        hashedPassword,
        firstName || null,
        lastName || null,
        'USER', // Default role
        true // Active by default
      ]
    );

    // Create token
    const payload = {
      user: {
        id: result.rows[0].id
      }
    };

    jwt.sign(
      payload,
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: result.rows[0].id,
            username: result.rows[0].username,
            email: result.rows[0].email,
            role: result.rows[0].role
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const result = await db.query(
      'SELECT id, username, email, password_hash, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/users/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    // Get user details
    const result = await db.query(
      `SELECT 
        u.id, u.username, u.email, u.first_name, u.last_name, u.role, u.created_at,
        (SELECT COUNT(*) FROM cameras WHERE user_id = u.id) as camera_count,
        (SELECT COUNT(*) FROM detections d 
         JOIN cameras c ON d.camera_id = c.id 
         WHERE c.user_id = u.id AND d.created_at > NOW() - INTERVAL '24 hours') as detection_count_24h
      FROM users u
      WHERE u.id = $1`,
      [req.user.id]
    );

    // Get user settings
    const settingsResult = await db.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );

    const userSettings = settingsResult.rows.length > 0 
      ? settingsResult.rows[0] 
      : { theme: 'dark', language: 'en', default_layout: '2x2' };

    // Get notification settings
    const notificationResult = await db.query(
      'SELECT * FROM notification_settings WHERE user_id = $1',
      [req.user.id]
    );

    const notifications = notificationResult.rows.length > 0 
      ? notificationResult.rows[0] 
      : { 
          email_alerts: false, 
          push_alerts: false,
          sound_alerts: true,
          alert_types: ['PERSON', 'VEHICLE']
        };

    res.json({
      user: result.rows[0],
      settings: userSettings,
      notifications: notifications
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    // Update profile
    const result = await db.query(
      `UPDATE users 
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, username, email, first_name, last_name, role`,
      [firstName, lastName, email, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  try {
    // Get current password hash
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(config.auth.saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/settings
 * @desc    Update user settings
 * @access  Private
 */
router.put('/settings', auth, async (req, res) => {
  const { theme, language, defaultLayout, timeline } = req.body;

  try {
    // Check if settings exist
    const checkResult = await db.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );

    let result;

    if (checkResult.rows.length === 0) {
      // Create new settings
      result = await db.query(
        `INSERT INTO user_settings (
          user_id, theme, language, default_layout, timeline_settings, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW()) 
        RETURNING *`,
        [req.user.id, theme, language, defaultLayout, timeline]
      );
    } else {
      // Update existing settings
      result = await db.query(
        `UPDATE user_settings 
        SET 
          theme = COALESCE($1, theme),
          language = COALESCE($2, language),
          default_layout = COALESCE($3, default_layout),
          timeline_settings = COALESCE($4, timeline_settings),
          updated_at = NOW()
        WHERE user_id = $5
        RETURNING *`,
        [theme, language, defaultLayout, timeline, req.user.id]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/notifications
 * @desc    Update notification settings
 * @access  Private
 */
router.put('/notifications', auth, async (req, res) => {
  const { 
    emailAlerts, 
    pushAlerts, 
    soundAlerts, 
    alertTypes, 
    emailSettings,
    autoResolveTimeout
  } = req.body;

  try {
    // Check if settings exist
    const checkResult = await db.query(
      'SELECT * FROM notification_settings WHERE user_id = $1',
      [req.user.id]
    );

    let result;

    if (checkResult.rows.length === 0) {
      // Create new notification settings
      result = await db.query(
        `INSERT INTO notification_settings (
          user_id, email_alerts, push_alerts, sound_alerts, 
          alert_types, email_settings, auto_resolve_timeout, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
        RETURNING *`,
        [
          req.user.id, 
          emailAlerts || false, 
          pushAlerts || false, 
          soundAlerts || true,
          alertTypes || ['PERSON', 'VEHICLE'],
          emailSettings || null,
          autoResolveTimeout || 300 // 5 minutes default
        ]
      );
    } else {
      // Update existing notification settings
      result = await db.query(
        `UPDATE notification_settings 
        SET 
          email_alerts = COALESCE($1, email_alerts),
          push_alerts = COALESCE($2, push_alerts),
          sound_alerts = COALESCE($3, sound_alerts),
          alert_types = COALESCE($4, alert_types),
          email_settings = COALESCE($5, email_settings),
          auto_resolve_timeout = COALESCE($6, auto_resolve_timeout),
          updated_at = NOW()
        WHERE user_id = $7
        RETURNING *`,
        [
          emailAlerts, 
          pushAlerts, 
          soundAlerts, 
          alertTypes, 
          emailSettings,
          autoResolveTimeout,
          req.user.id
        ]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating notification settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 