/**
 * User Profile Routes (Self-service — any authenticated user)
 *
 * GET    /api/profile/me              — Full profile with department & tier info
 * PUT    /api/profile/email           — Update own email
 * PUT    /api/profile/password        — Change own password (requires current)
 * GET    /api/profile/sessions        — List own active sessions
 * DELETE /api/profile/sessions/:sid   — Revoke a specific session
 * GET    /api/profile/activity        — Own audit log (last 50 entries)
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication (any tier)
router.use(requireAuth);

// GET /api/profile/me — rich profile data
router.get('/me', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.staff_id, u.email, u.full_name, u.title,
             u.department_id, u.tier_level, u.is_active, u.created_at, u.updated_at,
             d.name as department_name, d.short_name as department_short,
             d.tier as department_tier, d.type as department_type,
             a.name as tier_name, a.description as tier_description
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN access_tiers a ON u.tier_level = a.level
      WHERE u.id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile/email — update own email
router.put('/email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = await db.query(`
      UPDATE users SET email = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, updated_at
    `, [email.trim().toLowerCase(), req.user.id]);

    // Update session with new email
    req.session.user.email = result.rows[0].email;

    // Audit log
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'update_email', `Email updated to: ${email.trim().toLowerCase()}`, req.ip]
    );

    res.json({ success: true, email: result.rows[0].email });
  } catch (err) {
    if (err.code === '23505') { // unique violation
      return res.status(409).json({ error: 'This email is already in use' });
    }
    console.error('Email update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile/password — change own password
router.put('/password', async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Verify current password
    const userResult = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash and save new password
    const hash = await bcrypt.hash(new_password, 10);
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hash, req.user.id]
    );

    // Invalidate all other sessions for this user (security best practice)
    const currentSid = req.sessionID;
    await db.query(
      `DELETE FROM sessions WHERE sid != $1 AND sess::jsonb -> 'user' ->> 'id' = $2`,
      [currentSid, String(req.user.id)]
    );

    // Audit log
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'change_password', 'Password changed successfully', req.ip]
    );

    res.json({ success: true, message: 'Password changed. Other sessions have been signed out.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/profile/sessions — list own active sessions
router.get('/sessions', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT sid, sess, expire
      FROM sessions
      WHERE sess::jsonb -> 'user' ->> 'id' = $1
        AND expire > NOW()
      ORDER BY expire DESC
    `, [String(req.user.id)]);

    const sessions = result.rows.map(row => {
      const sessData = typeof row.sess === 'string' ? JSON.parse(row.sess) : row.sess;
      return {
        sid: row.sid,
        is_current: row.sid === req.sessionID,
        expires: row.expire,
        // Cookie info if available
        created: sessData.cookie?.originalMaxAge ? new Date(row.expire - sessData.cookie.originalMaxAge) : null
      };
    });

    res.json({ sessions, total: sessions.length });
  } catch (err) {
    console.error('Sessions list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/profile/sessions/:sid — revoke a specific session
router.delete('/sessions/:sid', async (req, res) => {
  try {
    const targetSid = req.params.sid;

    // Cannot revoke own current session
    if (targetSid === req.sessionID) {
      return res.status(400).json({ error: 'Cannot revoke your current session. Use logout instead.' });
    }

    // Verify the session belongs to this user
    const check = await db.query(
      `SELECT sid FROM sessions WHERE sid = $1 AND sess::jsonb -> 'user' ->> 'id' = $2`,
      [targetSid, String(req.user.id)]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await db.query('DELETE FROM sessions WHERE sid = $1', [targetSid]);

    // Audit log
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'revoke_session', `Revoked session: ${targetSid.substring(0, 8)}...`, req.ip]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Session revoke error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/profile/activity — own audit log (last 50)
router.get('/activity', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const result = await db.query(`
      SELECT id, action, details, ip_address, created_at
      FROM audit_log
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [req.user.id, limit]);

    res.json({ activities: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('Activity log error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
