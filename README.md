# CLOX — simple layout

Three separate apps. Each uses **npm** on its own. No pnpm. No shared packages. No Turborepo.

```
clox/
  api/      NestJS + Prisma   → http://localhost:3000
  web/      Next.js public    → http://localhost:5173  (pre-launch only)
  admin/    Vite app         → http://localhost:5174  (all logged-in roles → app.clox.com.au)
  e2e/      Playwright smoke
  docker/   Local Postgres + PostGIS
  docs/
  Pre-Launch/   old static HTML (reference)
```

**Phase 1 plan:** [docs/PHASE-1-IMPLEMENTATION-PLAN.md](docs/PHASE-1-IMPLEMENTATION-PLAN.md)  
**Gate 0 ADR:** [docs/adr/G0-gate-0-phase1-decisions.md](docs/adr/G0-gate-0-phase1-decisions.md)  
**Module boundaries:** [docs/architecture/module-boundaries.md](docs/architecture/module-boundaries.md)

## Setup

```bash
# 1) Database (Docker Desktop must be running) — PostGIS image
npm run docker:up

# 2) API
cd api
cp ../.env.example .env   # if needed
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev

# 3) Public site (new terminal)
cd web
npm install
npm run dev

# 4) Admin / app (new terminal)
cd admin
npm install
npm run dev
```

Or from repo root:

```bash
npm run dev:api
npm run dev:web
npm run dev:admin
```

Seed Super Admin email: `abc@example.com` (override via `SEED_SUPER_ADMIN_EMAIL`).  
Seed also enables **VIC** region (pilot) + Melbourne Metro territory.

### Useful URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000/v1/health | API + DB + PostGIS health |
| http://localhost:3000/v1/docs | OpenAPI (Swagger) |
| http://localhost:5173 | Public pre-launch site |
| http://localhost:5174 | Logged-in Vite app (admin console today) |

### CI / stage

- **CI (thin):** lint + typecheck + unit tests + app builds on PR (see `.github/workflows/ci.yml`). No mandatory auto-deploy.
- **Stage:** manual — [docs/operations/manual-stage-deploy.md](docs/operations/manual-stage-deploy.md)

### Smoke

```bash
# with API + DB up
node scripts/smoke-local.mjs
npm run test:e2e
```

### Go-live (pre-launch)

See [docs/GO-LIVE-RUNBOOK.md](docs/GO-LIVE-RUNBOOK.md) for DNS/TLS, env, UAT checklist.
