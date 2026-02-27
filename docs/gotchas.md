# Gotchas & Lessons Learned

Hard-won lessons from building this platform. Read before modifying any of these areas.

## CSS & Layout (Critical)
- `body { display: flex }` — every direct child of `<body>` becomes a flex item
- The `<footer>` MUST be inside `<main class="main-content">`, not a sibling — otherwise it renders as a third flex column next to the sidebar and main content, creating white space on the right
- `.main-content` needs `min-width: 0; overflow-x: hidden` — flex items default to `min-width: auto`, which lets wide content (tables, charts) push past 100vw
- When moving HTML elements between containers, check the parent's `display` mode (flex, grid) — siblings in flex/grid layouts get their own column/row

## JavaScript Error Cascading (Critical)
- An uncaught `TypeError` in `app.js` halts ALL subsequent script execution
- The notification system IIFE is at the bottom of `app.js` — any error above it prevents notifications from initializing
- Always null-guard `document.getElementById()` calls for elements that may not exist on every page
- Example: `performanceTableBody` was removed from HTML when that page moved to API rendering, but the old JS code referencing it remained — classic stale reference bug
- When adding new features at the end of a JS file, verify that no earlier code throws uncaught errors that would block execution
- Both global search and notification IIFEs have null-guards at top to isolate failures

## Auth & Session Gotchas
- Auth route expects `staff_id` (snake_case), NOT `staffId` — login.js maps form field accordingly
- `window.__oagUser` is set async in `<head>` — `app.js` uses `setTimeout(applyTierVisibility, 500)` to wait for it
- Password change must invalidate OTHER sessions but keep current alive — uses PG JSON operator `sess::jsonb -> 'user' ->> 'id'`
- Email update must also patch `req.session.user.email` to keep in-memory session in sync with DB
- Cannot use `req.sessionID` directly for session queries — `connect-pg-simple` stores the `sid` column

## Railway Deployment
- Project tokens only work for `status`, `vars`, `logs`, `service` — NOT `link`, `list`, `whoami`
- Env vars set via `railway vars --set` with `${{Postgres.DATABASE_URL}}` reference syntax
- Railway auto-deploys on git push — wait ~60s for new code to go live
- Schema SQL always DROP+CREATE — running `db:init` on Railway wipes production data

## Search System
- Search index is built once at page load — adding new data sources requires updating `buildSearchIndex()`
- RBAC filtering happens at query time (checks DOM visibility), not at index build time — so it always reflects current tier state
- The search IIFE is placed before the notification IIFE — a bug in search must not block notifications
- Dropdown z-index (200) is above topbar (50) but below modals
