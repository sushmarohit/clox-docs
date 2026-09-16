# Manual stage deploy (Phase 1)

**Status:** Optional playbook — auto-CD is **not** required for M0.  
**When:** Before multi-dev sharing or Flutter API kickoff.

## Prerequisites

- Stage host with Node 22+ and managed Postgres (**PostGIS** enabled)
- Secrets in host env / secret manager (never commit)
- This repo checked out on the stage machine (or CI artifact)

## One-time DB

```bash
# On managed Postgres (once)
CREATE EXTENSION IF NOT EXISTS postgis;
```

Confirm:

```sql
SELECT PostGIS_Version();
```

## Deploy API

```bash
cd api
cp ../.env.example .env   # then edit stage values
npm ci
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed       # Super Admin + VIC region
npm run build
NODE_ENV=production npm run start:prod
```

Or run behind PM2 / systemd / container — same migrate → seed → start order.

## Smoke

```bash
curl -sS https://<stage-api>/v1/health
# expect: database=up, postgis=up
```

OpenAPI (non-prod): `https://<stage-api>/v1/docs`

## Notes

- Local Docker (`docker/docker-compose.yml`) is **dev only** — not production runtime.
- Thin CI (lint / tsc / tests) stays on PR; this playbook stays **manual** until you add CD.
