# Frontend Systems

## app.js Execution Order (1,222 lines)
The file executes top-to-bottom. Order matters — an uncaught error blocks everything below it.

```
Lines 1-40     — Page navigation (pageTitles, nav click handlers, sidebar toggle)
Lines 41-99    — Data generators (counties, case types, counsel names, helpers)
Lines 100-168  — Cases table + filters (casesData, renderCases)
Lines 170-185  — Legal Aid table (aidData)
Lines 188-197  — Training table (trainingData)
Lines 205-221  — Workflow table (workflowData)
Lines 223-390  — initPage() switch (lazy renderers for all 13 pages)
Lines 391-580  — Page renderers: org-structure, legal-framework, sdjhca, performance, users
Lines 581-906  — Profile system: renderProfile(), wireEmailEdit(), wirePasswordChange()
Lines 908-1070 — Global Search: buildSearchIndex() + search IIFE
Lines 1072-1222— Notification System: IIFE with bell toggle, badge, dropdown
```

## Global Search
- `buildSearchIndex()` builds ~210-entry flat array from `window.OAG` + generated data arrays + `pageTitles`
- Search: `String.includes()` on debounced input (250ms), grouped by category, `<mark>` highlights
- RBAC: checks `navItem.style.display !== 'none'` at query time — reuses `applyTierVisibility()`
- Navigation: clicking a result triggers `document.querySelector('[data-page="..."]').click()`
- Keyboard: ArrowUp/Down navigate, Enter selects, Escape closes
- Dropdown follows notification pattern: `stopPropagation()`, outside click close
- Null-guard at IIFE top prevents error cascading to notification system below

### Indexed Content
| Category | Source | Target Page | Count |
|----------|--------|-------------|-------|
| Organization | `OAG.ORG` (units, divisions, agencies, heads) | `org-structure` / `sdjhca` | ~38 |
| Legal Framework | `OAG.LEGAL.ARTICLES` | `legal-framework` | 6 |
| Statutes | `OAG.LEGAL.STATUTES` | `legal-framework` | 15 |
| Timeline | `OAG.LEGAL.TIMELINE` | `legal-framework` | 11 |
| AG Functions | `OAG.KEY_FUNCTIONS` | `legal-framework` | 12 |
| Access Tiers | `OAG.ACCESS_TIERS` | `org-structure` | 7 |
| Workflows | `OAG.WORKFLOWS` stages + `workflowData` instances | `workflows` | ~24 |
| Cases | `casesData` (generated) | `cases` | 40 |
| Legal Aid | `aidData` (generated) | `legal-aid` | 15 |
| Training | `trainingData` | `training` | 8 |
| Counties | `COUNTIES` (47 counties in 3 groups) | `counties` | 47 |
| Navigation | `pageTitles` (page names) | respective pages | 13 |

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

## Style Guide
- Government green: `#1a5632`, Red: `#c8102e`, Gold: `#d4a017`, Navy: `#1e3a5f`
- AG honorific: `Hon. Dorcas Aganda Oduor, SC, OGW, EBS`
- PS honorific: `Hon. Judith Pareno`
- SG: `Shadrack Mose`
