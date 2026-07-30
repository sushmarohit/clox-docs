# Phase 0 go-live runbook

Operational checklist for deploying CLOX Pre-Launch to client domains.

## Domains

| Host | App | Notes |
|------|-----|-------|
| `clox.com.au` | `web/` | Public registry, EOI, investors |
| `dev.clox.com.au` | `admin/` | Super Admin only |
| `api.clox.com.au` | `api/` | NestJS `/v1` |

TLS required on all three.

## Pre-flight (local)

1. Start Docker Desktop, then: `npm run docker:up`
2. `cd api && npm ci && npx prisma generate && npx prisma migrate deploy && npm run prisma:seed`
3. Confirm `GET http://localhost:3000/v1/health` returns `"database":"up"`
4. OpenAPI: `http://localhost:3000/v1/docs` (disabled when `NODE_ENV=production` unless `ENABLE_OPENAPI=true`)
5. Smoke: `npm --prefix e2e test` (API-backed EOI test needs DB up)

Seed Super Admin email defaults to `abc@example.com` — change via `SEED_SUPER_ADMIN_EMAIL` before production seed.

## Environment (production)

Copy from `.env.example`. Critical values:

- `DATABASE_URL` — managed Postgres
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — ≥32 chars, unique per env
- `CORS_ORIGINS` — `https://clox.com.au,https://dev.clox.com.au`
- `SMTP_*` + `MAIL_FROM` — Gmail or Workspace for OTP + lead alerts
- `NOTIFY_EMAIL` — Super Admin inbox
- `INVEST_NOTIFY_EMAIL` — optional CC for investor leads (`invest@clox.com.au`)
- Public web (Next.js): `SITE_URL=https://clox.com.au`, `API_BASE_URL=https://api.clox.com.au/v1`, optional `AI_PROVIDER` / provider keys
- Admin Vite: `VITE_API_BASE_URL=https://api.clox.com.au/v1`

Never commit real secrets.

## Deploy steps (generic)

1. Provision Postgres; run `prisma migrate deploy` + seed Super Admin
2. Deploy API behind TLS; health check `/v1/health`
3. Build & deploy `web` (Next.js Node/server or container) and `admin` static assets to their hosts
4. Point DNS A/AAAA (or CNAME) for the three hostnames
5. Verify public lead proxies (`/api/leads/*`) and CORS for admin
6. Request OTP to seeded Super Admin email; complete login on `dev.clox.com.au`
7. Submit one registry, one EOI, one investor lead; confirm admin queues + email notify
8. Export CSV; confirm audit log entries
9. Verify PWA install/offline shell, `/llms.txt`, and site guide with `AI_PROVIDER=mock` or a configured provider
10. Client UAT sign-off

## CI

GitHub Actions (`.github/workflows/ci.yml`): lint/test/build api + web + admin, Playwright smoke (skips API-backed when no DB in CI).

Optional later: add a staging job with Postgres service container + full E2E including submit.

## Rollback

- Keep previous API image/build artifact
- DB migrations are forward-only; do not reset production data
- Feature flags: none in Phase 0 — roll back by redeploying previous release

## UAT script (client)

- [ ] Mobile Chrome/Safari: registry, EOI, investors submit
- [ ] Super Admin OTP login
- [ ] Dashboard KPIs update
- [ ] Filter leads by type (registry / EOI / investor)
- [ ] Change status + add note
- [ ] CSV export
- [ ] Audit page shows create/status/note events
- [ ] Privacy/terms draft pages reachable from footer
