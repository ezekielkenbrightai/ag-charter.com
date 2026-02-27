# Architecture

## Authentication Flow
1. `login.js` sends `POST /api/auth/login` with `{ staff_id, password }`
2. Server validates against `users` table with bcrypt compare
3. On success: session created in PG `sessions` table, user data stored in `req.session.user`
4. Protected pages: middleware checks `req.session.user`, redirects to `/login.html` if missing
5. Frontend: `index.html` auth guard calls `GET /api/auth/me` on load

## 7-Tier Access Control
| Tier | Name | Example Staff ID | Description |
|------|------|-----------------|-------------|
| 1 | Full Access | `AG/ICT/001` | ICT Admin — complete system access |
| 2 | Executive Dashboard | `AG/EXE/001` | AG, advisors — strategic oversight |
| 3 | Full State Dept Access | `AG/SG/001` | SG, PS, ICT Director |
| 4 | Department Dashboard | `AG/CIV/001` | HODs — department-level views |
| 5 | Operational Access | `AG/CIV/002` | State Counsel — day-to-day ops |
| 6 | ODA Access | `ODA/UNDP/001` | Development partners |
| 7 | One Way / Data Entry | `AG/CLK/001` | Data entry only, no read access |

Lower number = higher privilege. `requireTier(n)` allows tier_level <= n.

### Staff ID Format
Pattern: `{ORG}/{DEPT}/{SEQ}` — e.g. `AG/ICT/001`, `DOJ/HR/001`, `ODA/UNDP/001`

## Frontend SPA Pattern
- Navigation via `data-page` attributes on `.nav-item` elements
- Page sections: `<section class="page" id="page-{slug}">`
- Lazy initialization: `initPage(page)` switch triggers renderers on first visit
- Tier visibility: `data-max-tier` attribute hides nav items for insufficient access
- `window.__oagUser` is set by auth guard in `<head>` before `app.js` loads
- `setTimeout(applyTierVisibility, 500)` waits for async auth guard to populate `__oagUser`

## Backend Patterns
- `connect-pg-simple` has `createTableIfMissing: true` for Railway first-deploy safety
- Schema SQL always DROP+CREATE (not idempotent — running db:init wipes data)
- `__HASH__` placeholder in seed.sql replaced at runtime by `db/init.js` with bcrypt hash
- Auth route expects `staff_id` (snake_case), NOT `staffId` — login.js maps form field accordingly
- Public files (login.html/css/js, styles.css, app.js, oag-data.js) served without auth
- All other static files require session

## API Routes

### `routes/auth.js` (109 lines)
- `POST /api/auth/login` — authenticate with `{ staff_id, password }`
- `POST /api/auth/logout` — destroy session
- `GET /api/auth/me` — return current user from session

### `routes/users.js` (204 lines)
- `GET /api/users` — list users with filters (`tier_level`, `is_active`, `search`)
- `POST /api/users` — create user (Tier 1-2 only)
- `PUT /api/users/:id` — update user (Tier 1-2 only)
- `DELETE /api/users/:id` — deactivate user (Tier 1-2 only)

### `routes/performance.js` (201 lines)
- `GET /api/performance/categories` — all PC categories with weights
- `GET /api/performance/indicators` — all indicators with filtering
- `GET /api/performance/indicators/:code` — single indicator detail
- `GET /api/performance/summary` — overall weighted score by category

### `routes/org.js` (102 lines)
- `GET /api/org/departments` — department tree with filters (`tier`, `type`)
- `GET /api/org/tiers` — all 7 access tiers + user counts
- `GET /api/org/stats` — summary counts (users, departments, agencies)

### `routes/profile.js` (226 lines)
- `GET /api/profile/me` — rich profile with department + tier info
- `PUT /api/profile/email` — update email (validates format, checks uniqueness, syncs session)
- `PUT /api/profile/password` — change password (invalidates all other sessions)
- `GET /api/profile/sessions` — list active sessions (PG JSON operators on `sess` column)
- `DELETE /api/profile/sessions/:sid` — revoke session (cannot revoke own current)
- `GET /api/profile/activity` — last 50 audit_log entries for user

## Database Schema (8 tables)
```
access_tiers      — 7 tiers with level, name, description
departments       — 43 departments with parent hierarchy, tier, type
users             — 80 seeded users with staff_id, password_hash, tier_level
sessions          — connect-pg-simple session store (sess JSONB column)
pc_categories     — 6 performance contract categories
pc_indicators     — 36 performance indicators
pc_sub_indicators — 65 sub-indicators
audit_log         — user activity tracking (action, details, ip, timestamp)
```

## Data Sources
Four government documents inform the data:
- **AG Outline**: Org structure (3-tier), access protocols (7 levels), workflow definitions
- **Performance Contract FY 2025-26**: 6 categories, 25+ KPIs, KSh 4.008B budget
- **AG Mandate**: Constitutional articles (Art 156, 132(4)(a), 21, 10, 259), 14 statutes
- **State Department doc**: SDJHCA divisions, agencies (NLAS, WPA, ARA, VPB, MAT)
