const express = require('express');
const db = require('../db');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');
const { sendEmail } = require('../services/email.service');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await db.query(`
        SELECT c.*, f.title as found_item_title, l.title as lost_item_title, u.email as user_email
        FROM claims c
        JOIN found_items f ON c.found_item_id = f.id
        LEFT JOIN lost_items l ON c.lost_item_id = l.id
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
      `);
    } else {
      result = await db.query(`
        SELECT c.*, f.title as found_item_title
        FROM claims c
        JOIN found_items f ON c.found_item_id = f.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC
      `, [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { found_item_id, lost_item_id, proof_description, proof_image_url } = req.body;
    
    const result = await db.query(
      'INSERT INTO claims (user_id, found_item_id, lost_item_id, proof_description, proof_image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, found_item_id, lost_item_id, proof_description, proof_image_url]
    );

    // Notify admin
    await sendEmail('admin@university.edu', 'New Claim Submitted', '<p>A new claim has been submitted and is pending review.</p>');

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const claimId = req.params.id;

    const claimResult = await db.query('SELECT * FROM claims WHERE id = $1', [claimId]);
    if (claimResult.rows.length === 0) return res.status(404).json({ error: 'Claim not found' });
    
    const claim = claimResult.rows[0];

    await db.query(
      'UPDATE claims SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, admin_notes, claimId]
    );

    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [claim.user_id]);
    const userEmail = userResult.rows[0].email;

    if (status === 'APPROVED') {
      await db.query("UPDATE found_items SET status = 'RESOLVED' WHERE id = $1", [claim.found_item_id]);
      if (claim.lost_item_id) {
        await db.query("UPDATE lost_items SET status = 'RESOLVED' WHERE id = $1", [claim.lost_item_id]);
      }
      await sendEmail(userEmail, 'Claim Approved', '<p>Your claim has been approved!</p>');
    } else if (status === 'REJECTED') {
      await sendEmail(userEmail, 'Claim Rejected', '<p>Your claim has been rejected.</p>');
    } else if (status === 'INFO_REQUESTED') {
      await sendEmail(userEmail, 'More Info Requested for Claim', `<p>Admin requested more info: ${admin_notes}</p>`);
    }

    res.json({ message: 'Claim updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
