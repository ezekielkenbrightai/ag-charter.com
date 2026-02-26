/**
 * Performance Contract Routes
 *
 * GET  /api/performance/categories       — All PC categories with weights
 * GET  /api/performance/indicators       — All indicators with sub-indicators
 * GET  /api/performance/indicators/:code — Single indicator detail
 * PUT  /api/performance/indicators/:id   — Update actual values (Tier 1-4)
 * GET  /api/performance/summary          — Weighted overall score
 */
const express = require('express');
const db = require('../db');
const { requireAuth, requireTier } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/performance/categories
router.get('/categories', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*,
        (SELECT COUNT(*) FROM pc_indicators i WHERE i.category_id = c.id) as indicator_count
      FROM pc_categories c
      ORDER BY c.code ASC
    `);
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/performance/indicators
router.get('/indicators', async (req, res) => {
  try {
    const { category_id, status } = req.query;
    let sql = `
      SELECT i.*, c.code as category_code, c.name as category_name
      FROM pc_indicators i
      JOIN pc_categories c ON i.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (category_id) {
      sql += ` AND i.category_id = $${idx++}`;
      params.push(category_id);
    }
    if (status) {
      sql += ` AND i.status = $${idx++}`;
      params.push(status);
    }

    sql += ' ORDER BY c.code ASC, i.indicator_code ASC';
    const indicators = await db.query(sql, params);

    // Fetch all sub-indicators in one query
    const subResult = await db.query(`
      SELECT * FROM pc_sub_indicators ORDER BY indicator_id, id
    `);

    // Group sub-indicators by indicator_id
    const subMap = {};
    for (const sub of subResult.rows) {
      if (!subMap[sub.indicator_id]) subMap[sub.indicator_id] = [];
      subMap[sub.indicator_id].push(sub);
    }

    // Attach sub-indicators to each indicator
    const data = indicators.rows.map(ind => ({
      ...ind,
      sub_indicators: subMap[ind.id] || []
    }));

    res.json({ indicators: data, total: data.length });
  } catch (err) {
    console.error('Indicators error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/performance/indicators/:code
router.get('/indicators/:code', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, c.code as category_code, c.name as category_name, c.weight as category_weight
      FROM pc_indicators i
      JOIN pc_categories c ON i.category_id = c.id
      WHERE i.indicator_code = $1
    `, [req.params.code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    const indicator = result.rows[0];

    // Get sub-indicators
    const subs = await db.query(
      'SELECT * FROM pc_sub_indicators WHERE indicator_id = $1 ORDER BY id',
      [indicator.id]
    );

    res.json({ indicator: { ...indicator, sub_indicators: subs.rows } });
  } catch (err) {
    console.error('Indicator detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/performance/indicators/:id — Update actual value and status
router.put('/indicators/:id', requireTier(4), async (req, res) => {
  try {
    const { actual_value, status } = req.body;
    const sets = [];
    const params = [];
    let idx = 1;

    if (actual_value !== undefined) {
      sets.push(`actual_value = $${idx++}`);
      params.push(actual_value);
    }
    if (status) {
      sets.push(`status = $${idx++}`);
      params.push(status);
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    const result = await db.query(`
      UPDATE pc_indicators SET ${sets.join(', ')} WHERE id = $${idx}
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Indicator not found' });
    }

    // Audit
    await db.query(
      'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'update_indicator', `Updated indicator ${result.rows[0].indicator_code}`, req.ip]
    );

    res.json({ indicator: result.rows[0] });
  } catch (err) {
    console.error('Update indicator error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/performance/summary
router.get('/summary', async (req, res) => {
  try {
    // Calculate weighted completion by category
    const result = await db.query(`
      SELECT
        c.id, c.code, c.name, c.weight as category_weight,
        COUNT(i.id) as total_indicators,
        COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_indicators,
        COUNT(CASE WHEN i.status = 'in_progress' THEN 1 END) as in_progress_indicators,
        COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as overdue_indicators,
        ROUND(
          CASE WHEN COUNT(i.id) > 0
            THEN COUNT(CASE WHEN i.status = 'completed' THEN 1 END)::NUMERIC / COUNT(i.id) * 100
            ELSE 0
          END, 1
        ) as completion_pct
      FROM pc_categories c
      LEFT JOIN pc_indicators i ON i.category_id = c.id
      GROUP BY c.id, c.code, c.name, c.weight
      ORDER BY c.code
    `);

    // Overall weighted score
    let weightedScore = 0;
    for (const cat of result.rows) {
      weightedScore += (parseFloat(cat.completion_pct) / 100) * parseFloat(cat.category_weight);
    }

    res.json({
      categories: result.rows,
      overall_score: Math.round(weightedScore * 100) / 100,
      fiscal_year: 'FY 2025/26',
      total_budget: 4008672579,
      development_budget: 250000000,
      recurrent_budget: 3758672579
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
