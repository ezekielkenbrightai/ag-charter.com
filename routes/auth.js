/**
 * Authentication Routes
 *
 * POST /api/auth/login   — Validate credentials, create session
 * POST /api/auth/logout  — Destroy session
 * GET  /api/auth/me      — Return current session user (for page-load checks)
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { staff_id, password } = req.body;

    if (!staff_id || !password) {
      return res.status(400).json({ error: 'Staff ID and password are required' });
    }

    // Look up user by staff_id (case-insensitive)
    const result = await db.query(`
      SELECT u.*, d.name as department_name, d.short_name as department_short,
             d.tier as department_tier, a.name as tier_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN access_tiers a ON u.tier_level = a.level
      WHERE LOWER(u.staff_id) = LOWER($1) AND u.is_active = true
    `, [staff_id.trim()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid Staff ID or password' });
    }

    const user = result.rows[0];

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid Staff ID or password' });
    }

    // Build session user (omit password_hash)
    const sessionUser = {
      id: user.id,
      staff_id: user.staff_id,
      email: user.email,
      full_name: user.full_name,
      title: user.title,
      department_id: user.department_id,
      department_name: user.department_name,
      department_short: user.department_short,
      department_tier: user.department_tier,
      tier_level: user.tier_level,
      tier_name: user.tier_name
    };

    req.session.user = sessionUser;

    // Audit log
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [user.id, 'login', `Login via staff_id: ${staff_id}`, req.ip]
    );

    res.json({ success: true, user: sessionUser });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const userId = req.session?.user?.id;

  req.session.destroy(async (err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    // Audit log (best effort — session already destroyed)
    if (userId) {
      try {
        await db.query(
          'INSERT INTO audit_log (user_id, action, ip_address) VALUES ($1, $2, $3)',
          [userId, 'logout', req.ip]
        );
      } catch (e) { /* non-critical */ }
    }

    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});

module.exports = router;
