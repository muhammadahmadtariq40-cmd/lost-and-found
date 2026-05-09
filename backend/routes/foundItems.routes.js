const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth.middleware');
const { runMatchingEngine } = require('../services/matching.service');

const router = express.Router();

// Publicly visible found items (limited fields)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, category, date_found, location_found, image_url, status FROM found_items WHERE status = 'AVAILABLE' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Full details for authenticated users
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM found_items WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, category, date_found, location_found, custody_location, description, image_url } = req.body;
    const result = await db.query(
      'INSERT INTO found_items (user_id, title, category, date_found, location_found, custody_location, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.user.id, title, category, date_found, location_found, custody_location, description, image_url]
    );
    
    const newItem = result.rows[0];
    
    // Run matching engine asynchronously
    runMatchingEngine('found', newItem.id);
    
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
