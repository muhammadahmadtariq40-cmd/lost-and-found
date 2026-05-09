const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth.middleware');
const { runMatchingEngine } = require('../services/matching.service');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await db.query('SELECT * FROM lost_items ORDER BY created_at DESC');
    } else {
      result = await db.query('SELECT * FROM lost_items WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, category, date_lost, location_lost, description, image_url } = req.body;
    const result = await db.query(
      'INSERT INTO lost_items (user_id, title, category, date_lost, location_lost, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, title, category, date_lost, location_lost, description, image_url]
    );
    
    const newItem = result.rows[0];
    
    // Run matching engine asynchronously
    runMatchingEngine('lost', newItem.id);
    
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM lost_items WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    // Check permission
    if (req.user.role !== 'admin' && result.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
