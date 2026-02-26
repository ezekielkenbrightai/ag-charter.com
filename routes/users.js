/**
 * User Management Routes (Admin-only: Tier 1-2)
 *
 * GET    /api/users       — List all users (with department & tier info)
 * GET    /api/users/:id   — Get single user
 * POST   /api/users       — Create new user
 * PUT    /api/users/:id   — Update user
 * DELETE /api/users/:id   — Soft-delete (deactivate) user
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireTier } = require('../middleware/auth');

const router = express.Router();

// All routes require Tier 2 or higher
router.use(requireTier(2));

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const { department_id, tier_level, is_active, search } = req.query;
    let sql = `
      SELECT u.id, u.staff_id, u.email, u.full_name, u.title,
             u.department_id, u.tier_level, u.is_active, u.created_at, u.updated_at,
             d.name as department_name, d.short_name as department_short, d.tier as department_tier,
             a.name as tier_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN access_tiers a ON u.tier_level = a.level
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (department_id) {
      sql += ` AND u.department_id = $${idx++}`;
      params.push(department_id);
    }
    if (tier_level) {
      sql += ` AND u.tier_level = $${idx++}`;
      params.push(tier_level);
    }
    if (is_active !== undefined) {
      sql += ` AND u.is_active = $${idx++}`;
      params.push(is_active === 'true');
    }
    if (search) {
      sql += ` AND (u.full_name ILIKE $${idx} OR u.staff_id ILIKE $${idx} OR u.email ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    sql += ' ORDER BY u.tier_level ASC, u.full_name ASC';

    const result = await db.query(sql, params);
    res.json({ users: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.staff_id, u.email, u.full_name, u.title,
             u.department_id, u.tier_level, u.is_active, u.created_at, u.updated_at,
             d.name as department_name, d.short_name as department_short,
             a.name as tier_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN access_tiers a ON u.tier_level = a.level
      WHERE u.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { staff_id, email, password, full_name, title, department_id, tier_level } = req.body;

    if (!staff_id || !full_name || !tier_level) {
      return res.status(400).json({ error: 'staff_id, full_name, and tier_level are required' });
    }

    // Default password if none provided
    const pw = password || 'oag2025';
    const hash = await bcrypt.hash(pw, 10);

    const result = await db.query(`
      INSERT INTO users (staff_id, email, password_hash, full_name, title, department_id, tier_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, staff_id, email, full_name, title, department_id, tier_level, is_active, created_at
    `, [staff_id, email || null, hash, full_name, title || null, department_id || null, tier_level]);

    // Audit
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'create_user', `Created user: ${staff_id}`, req.ip]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // unique violation
      return res.status(409).json({ error: 'Staff ID or email already exists' });
    }
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { email, full_name, title, department_id, tier_level, password, is_active } = req.body;
    const userId = req.params.id;

    // Build dynamic SET clause
    const sets = [];
    const params = [];
    let idx = 1;

    if (full_name !== undefined) { sets.push(`full_name = $${idx++}`); params.push(full_name); }
    if (email !== undefined) { sets.push(`email = $${idx++}`); params.push(email || null); }
    if (title !== undefined) { sets.push(`title = $${idx++}`); params.push(title || null); }
    if (department_id !== undefined) { sets.push(`department_id = $${idx++}`); params.push(department_id || null); }
    if (tier_level !== undefined) { sets.push(`tier_level = $${idx++}`); params.push(tier_level); }
    if (is_active !== undefined) { sets.push(`is_active = $${idx++}`); params.push(is_active); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      sets.push(`password_hash = $${idx++}`);
      params.push(hash);
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    sets.push(`updated_at = NOW()`);
    params.push(userId);

    const result = await db.query(`
      UPDATE users SET ${sets.join(', ')} WHERE id = $${idx}
      RETURNING id, staff_id, email, full_name, title, department_id, tier_level, is_active, updated_at
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Audit
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'update_user', `Updated user ID: ${userId}`, req.ip]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:id  (soft delete — Tier 1 only)
router.delete('/:id', requireTier(1), async (req, res) => {
  try {
    const result = await db.query(`
      UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1
      RETURNING id, staff_id, full_name, is_active
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Audit
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'deactivate_user', `Deactivated user: ${result.rows[0].staff_id}`, req.ip]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
