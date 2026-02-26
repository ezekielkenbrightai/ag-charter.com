# OAG Kenya Digital Transformation Platform

## Project Overview
Full-stack web application for the Office of the Attorney General & Department of Justice, Republic of Kenya. PostgreSQL-backed with Express.js, server-side sessions, 7-tier RBAC, and 80+ seeded users.

## Tech Stack
- **Runtime**: Node.js (>=18), Express 4.x
- **Database**: PostgreSQL 16+ (local `oag_kenya`, Railway `railway`)
- **Auth**: `express-session` + `connect-pg-simple` (server-side sessions stored in PG)
- **Passwords**: `bcryptjs` (all demo users: `oag2025`)
- **Hosting**: Railway (production), custom domain `ag-charter.com`

## Architecture

### Directory Structure
```
server.js              # Express app entry point (trust proxy, sessions, static serving)
db/
  index.js             # PG Pool (SSL in production, max 20 connections)
  init.js              # Schema + seed runner (replaces __HASH__ with bcrypt hash)
  schema.sql           # 8 tables: access_tiers, departments, users, sessions, pc_*, audit_log
  seed.sql             # 7 tiers, 43 departments, 80 users, 6 PC categories, 36 indicators, 65 sub-indicators
routes/
  auth.js              # POST login/logout, GET me
  users.js             # CRUD (Tier 1-2 only)
  performance.js       # PC categories, indicators, sub-indicators, summary
  org.js               # Department tree, tiers, stats
middleware/
  auth.js              # requireAuth, requireTier(maxLevel)
public/
  index.html           # SPA shell (732 lines) — 12 page sections, 5 modals
  app.js               # Page nav, lazy init, 5 renderers (org, legal, sdjhca, performance, users)
  styles.css           # Full CSS with responsive, print, accessibility
  login.html/css/js    # Two-panel login with demo accounts
  charter.html         # Service Charter (standalone page)
  data/oag-data.js     # window.OAG namespace (static org/legal/workflow/budget data)
```

### Authentication Flow
1. `login.js` sends `POST /api/auth/login` with `{ staff_id, password }`
2. Server validates against `users` table with bcrypt compare
3. On success: session created in PG `sessions` table, user data stored in `req.session.user`
4. Protected pages: middleware checks `req.session.user`, redirects to `/login.html` if missing
5. Frontend: `index.html` auth guard calls `GET /api/auth/me` on load

### 7-Tier Access Control
- **Tier 1**: Full Access (ICT Admin) — `AG/ICT/001`
- **Tier 2**: Executive Dashboard (AG, advisors) — `AG/EXE/001`
- **Tier 3**: Full State Dept Access (SG, PS, ICT Director) — `AG/SG/001`
- **Tier 4**: Department Dashboard (HODs) — `AG/CIV/001`
- **Tier 5**: Operational Access (State Counsel) — `AG/CIV/002`
- **Tier 6**: ODA Access (Dev partners) — `ODA/UNDP/001`
- **Tier 7**: One Way / Data Entry — `AG/CLK/001`

Lower number = higher privilege. `requireTier(n)` allows tier_level <= n.

### Staff ID Format
Pattern: `{ORG}/{DEPT}/{SEQ}` — e.g. `AG/ICT/001`, `DOJ/HR/001`, `ODA/UNDP/001`

### Frontend SPA Pattern
- Navigation via `data-page` attributes on `.nav-item` elements
- Page sections: `<section class="page" id="page-{slug}">`
- Lazy initialization: `initPage(page)` switch triggers renderers on first visit
- Tier visibility: `data-max-tier` attribute hides nav items for insufficient access

## Key Commands
```bash
npm run db:init          # Create tables + seed 80 users (drops existing!)
npm run db:reset         # Same as db:init (schema has DROP IF EXISTS)
npm start                # Start server on PORT (default 3000)
```

## Railway Deployment
- **Project token**: Set as `RAILWAY_TOKEN` env var
- **Services**: `ag-charter.com` (Node.js), `Postgres` (PG 17 SSL), `Redis`
- **Required env vars on web service**: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`, `PORT=8080`
- **DATABASE_URL**: Uses Railway reference `${{Postgres.DATABASE_URL}}`
- **SSL**: `{ rejectUnauthorized: false }` when `NODE_ENV=production`
- **Trust proxy**: `app.set('trust proxy', 1)` in production for secure cookies
- **Domain**: `ag-charter.com` + `ag-chartercom-production.up.railway.app`
- **Seeding Railway DB**: `DATABASE_URL="postgresql://postgres:<pw>@turntable.proxy.rlwy.net:31389/railway" NODE_ENV=production node db/init.js`
- **CLI quirk**: Project tokens only work for `status`, `vars`, `logs`, `service` — NOT `link`, `list`, `whoami`
- **Check vars**: `RAILWAY_TOKEN=<token> railway vars --service ag-charter.com`

## Important Patterns
- `window.__oagUser` is set by auth guard in `<head>` before `app.js` loads
- `setTimeout(applyTierVisibility, 500)` waits for async auth guard to populate `__oagUser`
- `connect-pg-simple` has `createTableIfMissing: true` for Railway first-deploy safety
- Schema SQL always DROP+CREATE (not idempotent — running db:init wipes data)
- `__HASH__` placeholder in seed.sql replaced at runtime by `db/init.js` with bcrypt hash
- Auth route expects `staff_id` (snake_case), NOT `staffId` — login.js maps form field accordingly
- Public files (login.html/css/js, styles.css, app.js, oag-data.js) served without auth
- All other static files require session

## Local Dev (Windows)
- PostgreSQL 16 binary: `C:\Program Files\PostgreSQL\16\bin\psql.exe`
- Local DB: `postgresql://postgres:postgres@localhost:5432/oag_kenya`
- Git will warn about CRLF — safe to ignore
- Untracked `cookies.txt` and `nul` — do not commit

## Data Sources
Four government documents inform the data:
- **AG Outline**: Org structure (3-tier), access protocols (7 levels), workflow definitions
- **Performance Contract FY 2025-26**: 6 categories, 25+ KPIs, KSh 4.008B budget
- **AG Mandate**: Constitutional articles (Art 156, 132(4)(a), 21, 10, 259), 14 statutes
- **State Department doc**: SDJHCA divisions, agencies (NLAS, WPA, ARA, VPB, MAT)

## Style Notes
- Government green: `#1a5632`, Red: `#c8102e`, Gold: `#d4a017`, Navy: `#1e3a5f`
- AG honorific: `Hon. Dorcas Aganda Oduor, SC, OGW, EBS`
- PS honorific: `Hon. Judith Pareno`
- SG: `Shadrack Mose`
