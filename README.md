# CLOX — simple layout

Three separate apps. Each uses **npm** on its own. No pnpm. No shared packages. No Turborepo.

```
clox/
  api/      NestJS + Prisma   → http://localhost:3000
  web/      Public React      → http://localhost:5173
  admin/    Super Admin React→ http://localhost:5174
  e2e/      Playwright smoke
  docker/   Postgres
  docs/
  Pre-Launch/   old static HTML (reference)
```

## Setup

```bash
# 1) Database (Docker Desktop must be running)
npm run docker:up

# 2) API
cd api
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev

# 3) Public site (new terminal)
cd web
npm install
npm run dev

# 4) Admin (new terminal)
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

Copy `api/.env` from `.env.example` if needed. Seed Super Admin email: `abc@example.com`.

### Useful URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000/v1/health | API + DB health |
| http://localhost:3000/v1/docs | OpenAPI (Swagger) |
| http://localhost:5173 | Public pre-launch site |
| http://localhost:5174 | Super Admin |

### Smoke

```bash
# with API + DB up
node scripts/smoke-local.mjs
npm run test:e2e
```

### Go-live

See [docs/GO-LIVE-RUNBOOK.md](docs/GO-LIVE-RUNBOOK.md) for DNS/TLS, env, UAT checklist.
