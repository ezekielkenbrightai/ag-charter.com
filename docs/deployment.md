# Deployment

## Railway Production
- **Services**: `ag-charter.com` (Node.js), `Postgres` (PG 17 SSL), `Redis`
- **Domain**: `ag-charter.com` + `ag-chartercom-production.up.railway.app`
- **Build**: Nixpacks (`railway.toml` specifies `node server.js` start command)
- **Health check**: `GET /login.html` with 30s timeout

### Required Environment Variables
| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Railway reference) |
| `SESSION_SECRET` | Secret string for express-session |
| `NODE_ENV` | `production` |
| `PORT` | `8080` |

### Production SSL & Proxy
- SSL: `{ rejectUnauthorized: false }` when `NODE_ENV=production`
- Trust proxy: `app.set('trust proxy', 1)` in production for secure cookies

### Railway Token & CLI Access
The **Railway project token** is stored locally in `.env` as `RAILWAY_TOKEN`. This is a project-scoped token (not a personal token).

```bash
# Read the token from .env and use it to prefix CLI commands:
RAILWAY_TOKEN=<token from .env> railway status --service ag-charter.com
RAILWAY_TOKEN=<token from .env> railway vars --service ag-charter.com
RAILWAY_TOKEN=<token from .env> railway logs --service ag-charter.com

# Get Postgres public connection URL (needed for remote seeding):
RAILWAY_TOKEN=<token from .env> railway vars --service Postgres
# Look for DATABASE_PUBLIC_URL in the output
```

**CLI quirk**: Project tokens only work for `status`, `vars`, `logs`, `service` — NOT `link`, `list`, `whoami`.

### Seeding Railway DB
Auto-deploy does **NOT** re-seed the database. When `seed.sql` changes, you must manually seed:

```bash
# 1. Get the public DATABASE_URL from Railway Postgres service vars
# 2. Run init.js with that URL:
DATABASE_URL="postgresql://postgres:<pw>@turntable.proxy.rlwy.net:31389/railway" NODE_ENV=production node db/init.js
```

**Warning**: `db:init` is destructive — it DROP+CREATEs all tables. All sessions, audit logs, and any runtime data will be wiped.

### Deploy Flow
1. `git push origin main` triggers Railway auto-deploy (~60s build + deploy)
2. If `seed.sql` changed, re-seed the production DB (see above)
3. Verify: `curl https://ag-charter.com/login.html` returns 200
4. Verify data: `curl -X POST https://ag-charter.com/api/auth/login -H "Content-Type: application/json" -d '{"staff_id":"AG/EXE/001","password":"oag2025"}'`

## Local Development (Windows)
- **PostgreSQL 16**: `C:\Program Files\PostgreSQL\16\bin\psql.exe`
- **Local DB**: `postgresql://postgres:postgres@localhost:5432/oag_kenya`
- **Port**: 3000 (default)
- **CRLF warnings**: Git will warn — safe to ignore
- **Untracked files**: `cookies.txt` and `nul` — do not commit
