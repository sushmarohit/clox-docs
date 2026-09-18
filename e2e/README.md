# E2E / automation (M0–M3)

Playwright suites for CLOX Phase 1. Maps to [../docs/operations/m0-m3-edge-cases.md](../docs/operations/m0-m3-edge-cases.md).

## Suites

| Tag | Folder | Needs | CI |
|-----|--------|-------|-----|
| Smoke | `tests/smoke/` | Admin Vite on `:5174` | Yes (`--grep-invert API-backed`) |
| API-backed | `tests/api-backed/` | API `:3001` + Postgres + seed + Admin | Local / manual |

Also: API Jest unit/edge specs under `api/src/**/*.spec.ts` (always in CI).

## Commands

```bash
# from repo root
npm --prefix e2e ci

# Local Windows uses installed Google Chrome by default (no playwright install needed).
# CI: npx playwright install --with-deps chromium
# Optional: PW_CHANNEL=chromium  or  PW_CHANNEL=msedge

# smoke only
npm run test:e2e:smoke

# full API-backed (API + admin + DB running)
npm run docker:up
npm run db:migrate && npm run db:seed
npm run dev:api   # :3001
npm run dev:admin # :5174
npm run test:e2e:api
```

Env overrides: `ADMIN_BASE_URL`, `API_BASE_URL`, `SEED_*_EMAIL`, `PW_CHANNEL`.

## Coverage types

- Functional / negative API edge cases (auth, docs, compliance, sender, jobs gate)
- UI role gating + OTP login + sender onboarding content
- Multi-lingual EN/HI key parity + language switcher
- Content assertions (brand, register, Dev OTP)
