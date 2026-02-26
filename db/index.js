/**
 * PostgreSQL Connection Pool
 *
 * Exports a shared pool for all database operations.
 * The pool manages connection lifecycle (open, reuse, close)
 * so individual routes never handle raw connections.
 *
 * Usage:
 *   const db = require('./db');
 *   const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Pool limits — conservative defaults for a government intranet app
  max: 20,                    // max simultaneous connections
  idleTimeoutMillis: 30000,   // close idle connections after 30s
  connectionTimeoutMillis: 5000 // fail fast if DB unreachable
});

// Log pool-level errors (don't crash the server)
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  // Convenience: get a client for transactions (BEGIN/COMMIT/ROLLBACK)
  getClient: () => pool.connect()
};
