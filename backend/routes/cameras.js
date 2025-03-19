const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/cameras
 * @desc    Get all cameras for the authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM detections d WHERE d.camera_id = c.id AND d.created_at > NOW() - INTERVAL '24 hours') as detection_count_24h
      FROM cameras c
      WHERE c.user_id = $1
      ORDER BY c.name ASC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching cameras:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/cameras/:id
 * @desc    Get camera by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM detections d WHERE d.camera_id = c.id) as total_detections
      FROM cameras c
      WHERE c.id = $1 AND c.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching camera:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/cameras
 * @desc    Create a new camera
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  const { 
    name, 
    type, 
    location, 
    rtsp_url, 
    onvif_address, 
    username, 
    password,
    is_recording_enabled,
    detection_areas
  } = req.body;

  // Basic validation
  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  if (type === 'RTSP' && !rtsp_url) {
    return res.status(400).json({ message: 'RTSP URL is required for RTSP cameras' });
  }

  if (type === 'ONVIF' && !onvif_address) {
    return res.status(400).json({ message: 'ONVIF address is required for ONVIF cameras' });
  }

  try {
    const result = await db.query(
      `INSERT INTO cameras (
        name, type, location, rtsp_url, onvif_address, 
        username, password, is_recording_enabled, detection_areas, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
        name, 
        type, 
        location || null, 
        rtsp_url || null, 
        onvif_address || null, 
        username || null, 
        password || null, 
        is_recording_enabled || false,
        detection_areas || null,
        req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating camera:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/cameras/:id
 * @desc    Update a camera
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  const { 
    name, 
    type, 
    location, 
    rtsp_url, 
    onvif_address, 
    username, 
    password,
    is_recording_enabled,
    detection_areas
  } = req.body;

  try {
    // First check if camera exists and belongs to user
    const checkResult = await db.query(
      'SELECT * FROM cameras WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Camera not found' });
    }

    const result = await db.query(
      `UPDATE cameras SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        location = COALESCE($3, location),
        rtsp_url = COALESCE($4, rtsp_url),
        onvif_address = COALESCE($5, onvif_address),
        username = COALESCE($6, username),
        password = COALESCE($7, password),
        is_recording_enabled = COALESCE($8, is_recording_enabled),
        detection_areas = COALESCE($9, detection_areas),
        updated_at = NOW()
      WHERE id = $10 AND user_id = $11
      RETURNING *`,
      [
        name, 
        type, 
        location, 
        rtsp_url, 
        onvif_address, 
        username, 
        password,
        is_recording_enabled,
        detection_areas,
        req.params.id,
        req.user.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating camera:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/cameras/:id
 * @desc    Delete a camera
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Using a transaction to delete camera and related data
    await db.transaction(async (client) => {
      // First check if camera exists and belongs to user
      const checkResult = await client.query(
        'SELECT * FROM cameras WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Camera not found' });
      }

      // Delete related detections
      await client.query('DELETE FROM detections WHERE camera_id = $1', [req.params.id]);
      
      // Delete related alerts
      await client.query('DELETE FROM alerts WHERE camera_id = $1', [req.params.id]);
      
      // Delete camera from layouts
      await client.query(
        'UPDATE camera_layouts SET camera_ids = array_remove(camera_ids, $1) WHERE $1 = ANY(camera_ids)',
        [req.params.id]
      );
      
      // Delete camera
      await client.query('DELETE FROM cameras WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    });

    res.json({ message: 'Camera deleted successfully' });
  } catch (err) {
    console.error('Error deleting camera:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/cameras/:id/detections
 * @desc    Get detections for a specific camera
 * @access  Private
 */
router.get('/:id/detections', auth, async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const startDate = req.query.start_date || '1970-01-01';
    const endDate = req.query.end_date || new Date().toISOString();
    const detectionType = req.query.type || null;
    
    // Query parameters
    const params = [req.params.id, req.user.id, startDate, endDate, limit, offset];
    let typeCondition = '';
    
    if (detectionType) {
      typeCondition = 'AND d.detection_type = $7';
      params.push(detectionType);
    }

    // Get detections with pagination
    const result = await db.query(
      `SELECT d.* 
      FROM detections d
      JOIN cameras c ON d.camera_id = c.id
      WHERE d.camera_id = $1 
        AND c.user_id = $2
        AND d.created_at BETWEEN $3 AND $4
        ${typeCondition}
      ORDER BY d.created_at DESC
      LIMIT $5 OFFSET $6`,
      params
    );

    // Get total count for pagination
    const countParams = [req.params.id, req.user.id, startDate, endDate];
    let countQuery = `
      SELECT COUNT(*) 
      FROM detections d
      JOIN cameras c ON d.camera_id = c.id
      WHERE d.camera_id = $1 
        AND c.user_id = $2
        AND d.created_at BETWEEN $3 AND $4
    `;
    
    if (detectionType) {
      countQuery += 'AND d.detection_type = $5';
      countParams.push(detectionType);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      data: result.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching camera detections:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/cameras/test-connection
 * @desc    Test connection to a camera (doesn't save)
 * @access  Private
 */
router.post('/test-connection', auth, async (req, res) => {
  const { type, rtsp_url, onvif_address, username, password } = req.body;

  try {
    // This would normally involve actual connection testing logic
    // For now, we'll just do basic validation
    
    if (type === 'RTSP') {
      if (!rtsp_url || !rtsp_url.startsWith('rtsp://')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid RTSP URL format' 
        });
      }
      
      // Simulate connection test
      // In a real implementation, this would try to connect to the RTSP stream
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      return res.json({
        success: isSuccess,
        message: isSuccess ? 'Successfully connected to RTSP stream' : 'Failed to connect to RTSP stream'
      });
    } 
    else if (type === 'ONVIF') {
      if (!onvif_address) {
        return res.status(400).json({ 
          success: false, 
          message: 'ONVIF address is required' 
        });
      }
      
      // Simulate ONVIF connection test
      // In a real implementation, this would try to discover and connect to the ONVIF device
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      
      return res.json({
        success: isSuccess,
        message: isSuccess ? 'Successfully connected to ONVIF device' : 'Failed to connect to ONVIF device'
      });
    }
    else if (type === 'WEBCAM') {
      // Webcams are always considered available for testing
      return res.json({
        success: true,
        message: 'Webcam is available'
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      message: 'Unsupported camera type' 
    });
    
  } catch (err) {
    console.error('Error testing camera connection:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while testing connection' 
    });
  }
});

module.exports = router; 