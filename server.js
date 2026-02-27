/**
 * OAG Kenya Digital Transformation Platform — Server
 *
 * Express application with:
 * - PostgreSQL session store (connect-pg-simple)
 * - API routes: /api/auth, /api/users, /api/performance, /api/org, /api/profile
 * - Auth-protected static file serving
 * - Unprotected: login.html, login.css, login.js, and API auth endpoints
 */
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// ─── Trust proxy (Railway / Heroku / Render) ────
// Required so express-session can set secure cookies behind a reverse proxy
if (isProduction) {
  app.set('trust proxy', 1);
}

// ─── Body parsing ───────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Session middleware ─────────────────────────
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'sessions',
    createTableIfMissing: true  // Auto-create if missing (Railway first deploy)
  }),
  secret: process.env.SESSION_SECRET || 'fallback-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000,   // 8 hours
    httpOnly: true,                 // Prevent XSS cookie theft
    secure: isProduction,           // HTTPS only in production
    sameSite: 'lax'
  }
}));

// ─── API Routes (before static files) ───────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/org', require('./routes/org'));
app.use('/api/profile', require('./routes/profile'));

// ─── Public static files (no auth required) ─────
// Login page and its assets must be accessible without a session
const publicFiles = [
  '/login.html', '/login.css', '/login.js',
  '/styles.css', '/app.js',  // CSS/JS needed after login redirect
  '/data/oag-data.js'        // Static data layer
];

app.get(publicFiles, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.path));
});

// ─── Auth-protected static serving ──────────────
// Everything else in /public requires a valid session
app.use((req, res, next) => {
  // Allow API routes through (already handled above)
  if (req.path.startsWith('/api/')) return next();

  // Allow favicon and common assets
  if (req.path === '/favicon.ico') {
    return res.sendFile(path.join(__dirname, 'public', 'favicon.ico'), (err) => {
      if (err) res.status(204).end();
    });
  }

  // Check session for all other requests
  if (!req.session || !req.session.user) {
    return res.redirect('/login.html');
  }

  next();
});

// Serve protected static files
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  index: 'index.html'  // Authenticated users land on the dashboard
}));

// ─── Fallback ───────────────────────────────────
// Root path: redirect based on auth state
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.redirect('/login.html');
});

// Catch-all: authenticated users get index.html, others get login
app.get('*', (req, res) => {
  if (req.session && req.session.user) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.redirect('/login.html');
});

// ─── Start ──────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OAG Kenya Platform running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
