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
  profile.js           # Self-service profile: email, password, sessions, activity
middleware/
  auth.js              # requireAuth, requireTier(maxLevel)
public/
  index.html           # SPA shell (~860 lines) — 13 page sections, 5 modals
  app.js               # Page nav, lazy init, 6 renderers (org, legal, sdjhca, performance, users, profile)
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

## Layout & CSS Gotchas
- `body { display: flex }` — every direct child of `<body>` becomes a flex item
- The `<footer>` MUST be inside `<main class="main-content">`, not a sibling — otherwise it renders as a third flex column next to the sidebar and main content, creating white space on the right
- `.main-content` needs `min-width: 0; overflow-x: hidden` — flex items default to `min-width: auto`, which lets wide content (tables, charts) push past 100vw
- When moving HTML elements between containers, check the parent's `display` mode (flex, grid) — siblings in flex/grid layouts get their own column/row

## JavaScript Error Cascading
- An uncaught `TypeError` in `app.js` halts ALL subsequent script execution
- The notification system IIFE is at the bottom of `app.js` — any error above it prevents notifications from initializing
- Always null-guard `document.getElementById()` calls for elements that may not exist on every page (e.g. `performanceTableBody` was removed when that page moved to API rendering, but the old code referencing it remained)
- When adding new features at the end of a JS file, verify that no earlier code throws uncaught errors that would block execution

## Notification System
- Client-side IIFE at bottom of `app.js` — no backend notification table
- 8 system-generated notifications referencing real platform entities (PC deadlines, cases, workflows)
- Click individual notification to mark as read, "Mark all read" button clears all
- Badge shows unread count, hides when zero
- Dropdown uses `stopPropagation()` to prevent closing when clicking inside; `document.addEventListener('click')` closes on outside click

## User Profile System
- Route: `routes/profile.js` — 6 endpoints, all use `requireAuth` (any tier)
- Endpoints: `GET /me`, `PUT /email`, `PUT /password`, `GET /sessions`, `DELETE /sessions/:sid`, `GET /activity`
- Password change invalidates all other sessions via `DELETE FROM sessions WHERE sid != current AND sess::jsonb -> 'user' ->> 'id' = userId`
- Email update also patches `req.session.user.email` to keep session in sync
- Sessions table queried with PostgreSQL `sess::jsonb` JSON operators to filter by user ID
- Sidebar avatar (`.user-info#sidebar-user-link`) clicks trigger `[data-page="profile"]` nav item
- `renderProfile()` uses `Promise.all()` to fire 3 API calls in parallel (profile, activity, sessions)
- `wireEmailEdit()` and `wirePasswordChange()` attach event listeners once per init — follows lazy page pattern

## Global Search
- `buildSearchIndex()` + IIFE in `app.js` (between profile code and notification IIFE)
- Builds ~210-entry flat array from `window.OAG` namespace + generated data arrays (`casesData`, `aidData`, `trainingData`, `workflowData`, `COUNTIES`) + `pageTitles`
- Search: `String.includes()` on debounced input (250ms), grouped by category, `<mark>` highlights
- RBAC: checks `navItem.style.display !== 'none'` at query time — reuses `applyTierVisibility()` mechanism
- Navigation: clicking a result triggers `document.querySelector('[data-page="..."]').click()`
- Keyboard: ArrowUp/Down, Enter to select, Escape to close
- Dropdown follows notification pattern: `stopPropagation()`, outside click close, `position: absolute`
- Null-guard at IIFE top prevents error cascading to notification system below

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
