/**
 * Database Initialization Script
 *
 * Creates the oag_kenya database (if needed), runs schema.sql,
 * then seeds with seed.sql (replacing __HASH__ placeholders
 * with a real bcrypt hash of 'oag2025').
 *
 * Usage:
 *   node db/init.js          — Create tables and seed
 *   node db/init.js --reset  — Drop all tables first, then recreate and seed
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DEFAULT_PASSWORD = 'oag2025';
const SALT_ROUNDS = 10;
const isProduction = process.env.NODE_ENV === 'production';

// SSL config for Railway / cloud Postgres
const sslConfig = isProduction ? { rejectUnauthorized: false } : false;

// Parse the DATABASE_URL to extract the database name
function parseDatabaseUrl(url) {
  const match = url.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : 'oag_kenya';
}

// Connect to the default 'postgres' database to create our target DB
// Skipped on Railway/cloud where the DB is pre-provisioned
async function ensureDatabase() {
  const dbName = parseDatabaseUrl(process.env.DATABASE_URL);

  // On Railway, the database is pre-created as 'railway' — skip creation
  if (isProduction || dbName === 'railway') {
    console.log(`Database "${dbName}" (cloud-provisioned) — skipping CREATE DATABASE.`);
    return;
  }

  const adminUrl = process.env.DATABASE_URL.replace(/\/[^/?]+(\?|$)/, '/postgres$1');
  const adminPool = new Pool({ connectionString: adminUrl, ssl: sslConfig });

  try {
    // Check if database exists
    const result = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (result.rows.length === 0) {
      console.log(`Creating database "${dbName}"...`);
      // Can't use parameterized query for CREATE DATABASE
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } finally {
    await adminPool.end();
  }
}

// Run a SQL file against the target database
async function runSqlFile(pool, filePath, replacements = {}) {
  let sql = fs.readFileSync(filePath, 'utf8');

  // Apply any string replacements (e.g., __HASH__ → bcrypt hash)
  for (const [placeholder, value] of Object.entries(replacements)) {
    // Escape special regex characters in the placeholder
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    sql = sql.replace(new RegExp(escaped, 'g'), value);
  }

  await pool.query(sql);
}

async function main() {
  const isReset = process.argv.includes('--reset');

  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   OAG Kenya Platform — Database Initialization  ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log();

  // Step 1: Ensure the database exists
  console.log('Step 1/4: Checking database...');
  await ensureDatabase();

  // Step 2: Connect to target database
  console.log('Step 2/4: Connecting to target database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: sslConfig });

  try {
    // Step 3: Run schema (includes DROP IF EXISTS at top)
    console.log('Step 3/4: Running schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    await runSqlFile(pool, schemaPath);
    console.log('  ✓ Tables created (access_tiers, departments, users, sessions, pc_categories, pc_indicators, pc_sub_indicators, audit_log)');

    // Step 4: Generate password hash and run seed
    console.log('Step 4/4: Seeding data...');
    console.log(`  Generating bcrypt hash for default password "${DEFAULT_PASSWORD}"...`);
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    console.log(`  ✓ Hash generated: ${hash.substring(0, 20)}...`);

    const seedPath = path.join(__dirname, 'seed.sql');
    await runSqlFile(pool, seedPath, { '__HASH__': hash });

    // Report what was seeded
    const counts = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM access_tiers) as tiers,
        (SELECT COUNT(*) FROM departments) as departments,
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM pc_categories) as categories,
        (SELECT COUNT(*) FROM pc_indicators) as indicators,
        (SELECT COUNT(*) FROM pc_sub_indicators) as sub_indicators
    `);

    const c = counts.rows[0];
    console.log();
    console.log('  ┌─────────────────────────────────┐');
    console.log(`  │ Access Tiers:     ${String(c.tiers).padStart(3)}           │`);
    console.log(`  │ Departments:      ${String(c.departments).padStart(3)}           │`);
    console.log(`  │ Users:            ${String(c.users).padStart(3)}           │`);
    console.log(`  │ PC Categories:    ${String(c.categories).padStart(3)}           │`);
    console.log(`  │ PC Indicators:    ${String(c.indicators).padStart(3)}           │`);
    console.log(`  │ PC Sub-Indicators:${String(c.sub_indicators).padStart(3)}           │`);
    console.log('  └─────────────────────────────────┘');
    console.log();
    console.log('✓ Database initialization complete!');
    console.log();
    console.log('Demo login credentials:');
    console.log('  Staff ID: AG/ICT/001  (Tier 1 - Full Access)');
    console.log('  Staff ID: AG/EXE/001  (Tier 2 - Executive)');
    console.log('  Staff ID: AG/SG/001   (Tier 3 - State Dept)');
    console.log('  Staff ID: AG/CIV/001  (Tier 4 - Department)');
    console.log('  Staff ID: AG/CIV/002  (Tier 5 - Operational)');
    console.log('  Staff ID: ODA/UNDP/001 (Tier 6 - ODA)');
    console.log('  Staff ID: AG/CLK/001  (Tier 7 - One Way)');
    console.log(`  Password (all): ${DEFAULT_PASSWORD}`);

  } catch (err) {
    console.error('\n✗ Database initialization failed:');
    console.error('  ' + err.message);
    if (err.detail) console.error('  Detail: ' + err.detail);
    if (err.hint) console.error('  Hint: ' + err.hint);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
