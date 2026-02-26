/**
 * Organization Structure Routes
 *
 * GET /api/org/departments  — Full department tree
 * GET /api/org/tiers        — Access tier definitions
 * GET /api/org/stats        — Summary statistics
 */
const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// GET /api/org/departments
router.get('/departments', async (req, res) => {
  try {
    const { tier, type } = req.query;
    let sql = `
      SELECT d.*,
        (SELECT COUNT(*) FROM users u WHERE u.department_id = d.id AND u.is_active = true) as staff_count
      FROM departments d
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (tier) {
      sql += ` AND d.tier = $${idx++}`;
      params.push(tier);
    }
    if (type) {
      sql += ` AND d.type = $${idx++}`;
      params.push(type);
    }

    sql += ' ORDER BY d.sort_order ASC, d.name ASC';

    const result = await db.query(sql, params);

    // Build tree structure
    const deptMap = {};
    const roots = [];

    for (const dept of result.rows) {
      dept.children = [];
      deptMap[dept.id] = dept;
    }

    for (const dept of result.rows) {
      if (dept.parent_id && deptMap[dept.parent_id]) {
        deptMap[dept.parent_id].children.push(dept);
      } else {
        roots.push(dept);
      }
    }

    res.json({ departments: roots, flat: result.rows });
  } catch (err) {
    console.error('Departments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/org/tiers
router.get('/tiers', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*,
        (SELECT COUNT(*) FROM users u WHERE u.tier_level = a.level AND u.is_active = true) as user_count
      FROM access_tiers a
      ORDER BY a.level ASC
    `);
    res.json({ tiers: result.rows });
  } catch (err) {
    console.error('Tiers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/org/stats
router.get('/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM users WHERE is_active = false) as inactive_users,
        (SELECT COUNT(*) FROM departments) as total_departments,
        (SELECT COUNT(*) FROM departments WHERE type = 'agency') as agencies,
        (SELECT COUNT(*) FROM departments WHERE tier = 'Executive Office') as executive_units,
        (SELECT COUNT(*) FROM departments WHERE tier = 'SLO') as slo_units,
        (SELECT COUNT(*) FROM departments WHERE tier = 'SDJHCA') as sdjhca_units
    `);
    res.json({ stats: result.rows[0] });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
