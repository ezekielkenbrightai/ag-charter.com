# OAG Kenya Digital Transformation Platform

Full-stack web application for the Office of the Attorney General & Department of Justice, Republic of Kenya. PostgreSQL-backed with Express.js, server-side sessions, 7-tier RBAC, and 80+ seeded users.

> **Deep-dive docs**: See `docs/` for [Architecture](docs/architecture.md) | [Deployment](docs/deployment.md) | [Frontend](docs/frontend.md) | [Gotchas](docs/gotchas.md)

## Tech Stack
- **Runtime**: Node.js (>=18), Express 4.x, CommonJS modules
- **Database**: PostgreSQL 16+ (local `oag_kenya`, Railway PG 17 SSL)
- **Auth**: `express-session` + `connect-pg-simple` (server-side sessions in PG)
- **Passwords**: `bcryptjs` (all demo users: `oag2025`)
- **Hosting**: Railway (production), custom domain `ag-charter.com`

## Directory Structure
```
server.js              # Express entry (trust proxy, sessions, static, 5 route mounts)
db/
  index.js             # PG Pool (SSL in prod, max 20)
  init.js              # Schema + seed runner (__HASH__ → bcrypt)
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
  index.html           # SPA shell (~990 lines) — 13 page sections, 5 modals
  app.js               # Nav, 6 lazy renderers, global search (~210-entry index), notifications (1,222 lines)
  styles.css           # Full CSS with responsive, print, accessibility (563 lines)
  login.html/css/js    # Two-panel login with demo accounts
  charter.html         # Service Charter (standalone page)
  data/oag-data.js     # window.OAG namespace (org, legal, workflow, budget data)
docs/
  architecture.md      # Auth flow, RBAC, SPA patterns, API routes, DB schema, data sources
  deployment.md        # Railway config, env vars, CLI, local dev setup
  frontend.md          # app.js execution order, search, notifications, profile, style guide
  gotchas.md           # CSS layout, JS error cascading, auth/session, search, Railway pitfalls
```

## Key Commands
```bash
npm run db:init          # Create tables + seed 80 users (drops existing!)
npm run db:reset         # Same as db:init (schema has DROP IF EXISTS)
npm start                # Start server on PORT (default 3000)
```

## Critical Rules
1. **Footer placement**: `<footer>` MUST be inside `<main>`, not a sibling — `body { display: flex }` creates columns. See [gotchas](docs/gotchas.md).
2. **JS error cascading**: An uncaught error in `app.js` blocks everything below it (search, notifications). Always null-guard `getElementById()`. See [gotchas](docs/gotchas.md).
3. **Schema is destructive**: `db:init` DROP+CREATEs all tables — never run on production without intent.
4. **Auth field name**: Backend expects `staff_id` (snake_case), NOT `staffId`.
5. **RBAC**: Lower tier number = more access. `requireTier(n)` allows `tier_level <= n`.
6. **Search index**: Adding new data sources? Update `buildSearchIndex()` in `app.js`. See [frontend](docs/frontend.md).
