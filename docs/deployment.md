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

### CLI Commands
```bash
# Status, logs, vars (project token only supports these)
RAILWAY_TOKEN=<token> railway status --service ag-charter.com
RAILWAY_TOKEN=<token> railway vars --service ag-charter.com
RAILWAY_TOKEN=<token> railway logs --service ag-charter.com
```

**CLI quirk**: Project tokens only work for `status`, `vars`, `logs`, `service` — NOT `link`, `list`, `whoami`.

### Seeding Railway DB
```bash
DATABASE_URL="postgresql://postgres:<pw>@turntable.proxy.rlwy.net:31389/railway" NODE_ENV=production node db/init.js
```

### Deploy Flow
1. `git push origin main` triggers Railway auto-deploy
2. Wait ~60s for Nixpacks build + deploy
3. Verify via `curl https://ag-charter.com/login.html`

## Local Development (Windows)
- **PostgreSQL 16**: `C:\Program Files\PostgreSQL\16\bin\psql.exe`
- **Local DB**: `postgresql://postgres:postgres@localhost:5432/oag_kenya`
- **Port**: 3000 (default)
- **CRLF warnings**: Git will warn — safe to ignore
- **Untracked files**: `cookies.txt` and `nul` — do not commit
