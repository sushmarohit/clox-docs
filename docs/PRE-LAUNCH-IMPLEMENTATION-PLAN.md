# CLOX Pre-Launch → Platform — Full Implementation Plan

**Version:** 1.0  
**Date:** 2026-07-27  
**Status:** Approved for execution  
**Stack:** React · Zustand · shadcn/ui · Tailwind · PWA · i18n (en, ru) · NestJS · PostgreSQL

**Related:** [TPM-DOCUMENT-ANALYSIS.md](TPM-DOCUMENT-ANALYSIS.md) · [MILESTONES.md](MILESTONES.md) · [partners/pre-launch-registry.md](partners/pre-launch-registry.md) · [partners/admin-partner-eoi-program.md](partners/admin-partner-eoi-program.md)

---

## 0. Readiness confirmation

**Yes — ready to implement** against this plan.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| FE | React 18+ · Vite · TypeScript · Zustand · shadcn/ui · Tailwind · react-i18next | Mobile-first PWA; design tokens match Pre-Launch (#1A2F4C / #F26E22); component library scales to M11 ops portal |
| BE | NestJS · TypeScript · Prisma (or TypeORM) · PostgreSQL · class-validator | Modular monolith per [system-design.md](system-design.md); bounded contexts as Nest modules |
| Infra | `api.clox.com.au` · `dev.clox.com.au` · `clox.com.au` | Single API from day one; pre-launch on marketing domain |

This plan ships **Pre-Launch (Phase 0)** first, on foundations that **M0–M12 reuse without rework**.

---

## 1. Goals & scope

### Phase 0 — Pre-Launch (this implementation)

| In scope | Out of scope |
|----------|--------------|
| Public registry (sender/carrier) — migrate from static HTML | Live Stripe / easyAML / Monoova |
| Public EOI (State/Local BDE partner) | Full M3/M4 onboarding wizards |
| `POST` lead APIs + validation | Jobs, bids, trips, POD |
| Super Admin portal: dashboard, leads, EOI, notes, export | State/Local BDE portal |
| Auth: Super Admin OTP/session | Carrier/sender product login |
| Audit log for admin actions | Fleet+, settlements |

### Success criteria (Phase 0)

- [ ] Registry + EOI submit to `api.clox.com.au/v1/leads/*` with validation
- [ ] Super Admin sees all submissions, filters, status pipeline, notes
- [ ] CSV export; email alert on new EOI (configurable)
- [ ] Mobile-first PWA; en + ru on all public + admin surfaces
- [ ] Deploy: `clox.com.au` (public) · `dev.clox.com.au` (admin) · `api.clox.com.au` (API)
- [ ] OpenAPI published; E2E smoke tests green

---

## 2. Repository structure (monorepo)

```
clox/
├── apps/
│   ├── web-public/          # React PWA — registry, EOI, marketing shell
│   ├── web-admin/           # React PWA — Super Admin pre-launch portal
│   └── api/                 # NestJS modular monolith
├── packages/
│   ├── shared-types/        # DTOs, enums, Zod schemas (FE + BE)
│   ├── shared-i18n/         # en.json, ru.json keys (optional split)
│   └── ui/                  # shadcn wrappers, CLOX tokens, shared components
├── docs/
├── Pre-Launch/              # Legacy static (deprecate after web-public parity)
├── docker/
├── .github/workflows/
├── package.json             # pnpm workspaces
├── pnpm-workspace.yaml
└── turbo.json               # optional: Turborepo
```

**Package manager:** pnpm workspaces  
**Node:** 20 LTS

---

## 3. Domain & environment map

| Environment | Public web | Admin web | API |
|-------------|------------|-----------|-----|
| Local | `localhost:5173` | `localhost:5174` | `localhost:3000` |
| Dev | `clox.com.au` or `www` (static/CDN) | `dev.clox.com.au` | `api.clox.com.au` |
| Staging | same pattern | `staging-admin.clox.com.au` | `staging-api.clox.com.au` |
| Prod | `clox.com.au` | `admin.clox.com.au` | `api.clox.com.au` |

**CORS:** Public + admin origins whitelisted per env.

---

## 4. Backend architecture (NestJS)

### 4.1 Module layout (bounded contexts)

```
apps/api/src/
├── main.ts
├── app.module.ts
├── config/                  # env validation (Joi/Zod)
├── common/
│   ├── filters/
│   ├── interceptors/        # logging, correlation-id
│   ├── guards/
│   └── decorators/
├── modules/
│   ├── health/
│   ├── auth/                # Phase 0: admin OTP + JWT
│   ├── users/               # AdminUser entity
│   ├── leads/               # Registry + EOI (Phase 0 core)
│   ├── audit/               # AuditEvent
│   ├── notifications/       # email on new EOI
│   └── i18n/                # Accept-Language for API messages (optional)
└── prisma/ or database/
```

**Future modules (stubs only — no implementation in Phase 0):** `compliance`, `jobs`, `payments`, `trips`, `geolocation`.

### 4.2 API surface — Phase 0

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/health` | — | Health check |
| POST | `/v1/leads/registry` | Public + rate limit | Sender/carrier pre-launch |
| POST | `/v1/leads/eoi` | Public + rate limit | Partner EOI |
| POST | `/v1/auth/otp/request` | — | Admin email OTP |
| POST | `/v1/auth/otp/verify` | — | Returns access + refresh JWT |
| POST | `/v1/auth/refresh` | Refresh token | Rotate session |
| GET | `/v1/admin/leads` | Super Admin | Paginated, filters |
| GET | `/v1/admin/leads/:id` | Super Admin | Detail + events |
| PATCH | `/v1/admin/leads/:id` | Super Admin | Status, assignee, priority |
| POST | `/v1/admin/leads/:id/notes` | Super Admin | Internal note |
| GET | `/v1/admin/leads/export` | Super Admin | CSV |
| GET | `/v1/admin/dashboard/stats` | Super Admin | KPI aggregates |
| GET | `/v1/admin/audit` | Super Admin | Activity log |

**OpenAPI:** `/v1/docs` (Swagger) — dev/staging only or auth-gated in prod.

### 4.3 Data model (PostgreSQL)

```prisma
// Illustrative — implement in Prisma schema

enum LeadType {
  REGISTRY_SENDER
  REGISTRY_CARRIER
  EOI_STATE_MASTER
  EOI_LOCAL_BDE
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  INVITED
  ONBOARDED
  REJECTED
  DUPLICATE
  // EOI-specific (or separate enum)
  UNDER_REVIEW
  KYB_PENDING
  EXECUTIVE_REVIEW
  APPROVED
  AGREEMENT_SENT
  PROVISIONED
}

model Lead {
  id            String    @id @default(uuid())
  type          LeadType
  status        LeadStatus @default(NEW)
  email         String
  phone         String?
  companyName   String?
  abn           String?
  acn           String?
  state         String?
  territory     String?    // suburb/city
  payload       Json       // full form snapshot
  priority      Boolean    @default(false)
  assigneeId    String?
  assignee      AdminUser? @relation(...)
  source        String?    // utm_source, referrer
  ipHash        String?
  locale        String?    // en | ru
  promotedUserId String?   // future M3/M4 link
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  @@index([type, status, createdAt])
  @@index([abn])
  @@index([email])
}

model LeadNote {
  id        String   @id @default(uuid())
  leadId    String
  lead      Lead     @relation(...)
  authorId  String
  body      String
  createdAt DateTime @default(now())
}

model LeadEvent {
  id        String   @id @default(uuid())
  leadId    String?
  actorId   String?
  action    String   // lead.created, status_changed, ...
  metadata  Json?
  createdAt DateTime @default(now())
}

model AdminUser {
  id        String   @id @default(uuid())
  email     String   @unique
  role      String   @default("SUPER_ADMIN") // RBAC ready
  name      String?
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

### 4.4 Enterprise BE patterns

| Concern | Implementation |
|---------|----------------|
| Validation | `class-validator` + DTOs; shared Zod in `packages/shared-types` |
| Auth | JWT access (15m) + refresh (7d); httpOnly cookie option for admin |
| RBAC | `@Roles('SUPER_ADMIN')` guard — extend for State/Local later |
| Rate limiting | `@nestjs/throttler` on public POST (e.g. 10/min/IP) |
| Idempotency | `Idempotency-Key` header on lead POST (optional Phase 0) |
| Logging | Pino structured JSON; correlation ID per request |
| Errors | RFC 7807 Problem Details |
| Migrations | Prisma migrate; never manual DDL in prod |
| Secrets | env vars + vault at deploy; no secrets in repo |
| Tests | Unit (services), integration (supertest + test DB), e2e smoke |

### 4.5 Registry payload (DTO alignment with `index.html`)

**Sender:** `userType`, `companyLegalName`, `abn`, `shippingOrigin`, `operationalModels[]`, `biddingType`, `monthlyVolume`, `infraAcknowledged[]`, `email`, `phone`

**Carrier:** `userType`, `fleetEntityName`, `abn`, `depotState`, `fleetComposition[]`, `capabilities[]`, `complianceAuthorized`, `email`, `phone`

### 4.6 EOI payload (alignment with `eoiform.html`)

`role`, `targetState`, `targetTerritory`, `fullLegalName`, `companyName`, `abn`, `acn`, `email`, `phone`, `corporateAddress`, `networkExperience`, `executionStrategy`, `declarationAccepted`

---

## 5. Frontend architecture (React)

### 5.1 Apps

#### `apps/web-public` (mobile-first PWA)

| Route | Page | Source |
|-------|------|--------|
| `/` | Landing / redirect | clox_about_us positioning |
| `/registry` | 3-step sender/carrier flow | `Pre-Launch/index.html` |
| `/partner/eoi` | Admin partner EOI | `eoiform.html` |
| `/legal/privacy` | Privacy (stub) | Compliance |
| `/legal/terms` | Terms (stub) | Compliance |

#### `apps/web-admin` (Super Admin)

| Route | Page |
|-------|------|
| `/login` | OTP login |
| `/` | Pre-launch dashboard (KPIs) |
| `/leads/registry` | Sender + carrier table |
| `/leads/eoi` | Partner EOI table |
| `/leads/:id` | Detail + notes + timeline |
| `/activity` | Audit log |
| `/settings` | Export, notifications (minimal) |

### 5.2 Tech stack detail

| Area | Choice |
|------|--------|
| Build | Vite |
| Routing | React Router v6 |
| State | Zustand (auth store, UI prefs, form wizard step) |
| Server state | TanStack Query (API cache, mutations) |
| Forms | react-hook-form + zod resolver |
| UI | shadcn/ui + Tailwind |
| Icons | lucide-react |
| i18n | react-i18next; namespaces: `common`, `registry`, `eoi`, `admin` |
| PWA | vite-plugin-pwa; manifest, icons, offline shell for public app |
| Responsive | Tailwind breakpoints; bottom-fixed CTAs on mobile per screen-flows |

### 5.3 Design system (`packages/ui`)

- CSS variables: `--navy`, `--orange` (from Pre-Launch)
- shadcn theme customized to CLOX brand
- Shared: `AppShell`, `StepIndicator`, `StatusBadge`, `LeadStatusPill`, `DataTable`, `MobileCardList` (table on desktop, cards on mobile)
- Typography: system-ui / Segoe stack

### 5.4 Zustand stores

| Store | Responsibility |
|-------|----------------|
| `useAuthStore` | Admin JWT, user, login/logout |
| `useRegistryWizardStore` | Step 1–3, userType, draft (sessionStorage persist) |
| `useEoiFormStore` | Optional draft persist |
| `useLocaleStore` | `en` \| `ru`, sync with i18n + `localStorage` |

**Note:** Server data lives in TanStack Query, not Zustand.

### 5.5 i18n (en + ru)

```
packages/shared-i18n/
  locales/
    en/
      common.json
      registry.json
      eoi.json
      admin.json
    ru/
      (same structure)
```

- Language switcher in header (public + admin)
- `Accept-Language` sent to API on submit → stored on `Lead.locale`
- RTL not required for ru; test Cyrillic line-height / font fallbacks

### 5.6 PWA requirements

| Item | Public app | Admin app |
|------|------------|-----------|
| manifest.json | Yes | Yes |
| Service worker | Cache static assets; network-first API | Network-first only |
| Install prompt | Yes (mobile) | Optional |
| Icons | 192, 512 | Same brand |
| Offline | “You’re offline” page | Login requires network |

### 5.7 Responsive patterns

- **Mobile-first:** single column, full-width CTAs, step dots
- **Tablet:** same with wider cards
- **Desktop admin:** sidebar nav + data tables with filters
- **Touch:** min 44px tap targets; no `user-scalable=no`

---

## 6. Security (Phase 0)

| Item | Approach |
|------|----------|
| Public forms | Honeypot field, throttling, optional Turnstile/reCAPTCHA |
| Admin | OTP to allowlisted emails only (seed Super Admin) |
| Transport | TLS everywhere |
| PII | Encrypt at rest (DB); minimal retention policy documented |
| CORS | Strict origin list |
| CSP | Headers on static hosting |
| Audit | All admin mutations → `LeadEvent` |

---

## 7. Notifications

| Trigger | Channel |
|---------|---------|
| New EOI | Email to ops distribution list |
| New registry (optional) | Digest daily |
| Status change | In-app only (Phase 0) |

Provider: SendGrid / AWS SES / Resend — env-configured.

---

## 8. Migration from `Pre-Launch/` static HTML

| Step | Action |
|------|--------|
| 1 | Build `web-public` to pixel-parity with existing HTML (content unchanged) |
| 2 | Add `email` + `phone` to registry (product gap) |
| 3 | Wire API; remove fake `setTimeout` submit |
| 4 | Point `clox.com.au` to `web-public` build |
| 5 | Archive `Pre-Launch/` or keep as reference only |

---

## 9. Implementation phases & timeline

**Assumption:** 2 FE + 2 BE engineers, 0.5 DevOps, 0.25 QA — **~6–8 weeks** to Phase 0 prod.

### Sprint 0 — Foundation (Week 1)

| Task | Owner |
|------|-------|
| Monorepo bootstrap (pnpm, turbo, ESLint, Prettier, TS strict) | All |
| NestJS skeleton, health, config, Prisma, Docker Compose (Postgres) | BE |
| React apps scaffold, Tailwind, shadcn init, CLOX theme | FE |
| `packages/shared-types` — Lead enums, DTOs, Zod schemas | BE + FE |
| CI: lint, test, build on PR | DevOps |

**Exit:** `pnpm dev` runs API + both web apps locally.

### Sprint 1 — Leads API (Week 2)

| Task | Owner |
|------|-------|
| Prisma models: Lead, LeadNote, LeadEvent, AdminUser | BE |
| `POST /v1/leads/registry`, `POST /v1/leads/eoi` | BE |
| Validation, rate limit, audit on create | BE |
| OpenAPI + integration tests | BE |
| i18n setup en/ru skeleton | FE |

**Exit:** Postman/curl can create leads; DB persisted.

### Sprint 2 — Public web (Week 3)

| Task | Owner |
|------|-------|
| Registry 3-step wizard (mobile-first) | FE |
| EOI form page | FE |
| TanStack Query mutations → API | FE |
| Language switcher en/ru | FE |
| PWA manifest + SW (public) | FE |

**Exit:** Public forms submit to real API in dev.

### Sprint 3 — Admin auth + leads UI (Week 4)

| Task | Owner |
|------|-------|
| Admin OTP auth flow | BE + FE |
| Dashboard stats endpoint | BE |
| Admin: login, dashboard, registry list, EOI list | FE |
| Lead detail + notes + status PATCH | BE + FE |
| Mobile-responsive admin tables/cards | FE |

**Exit:** Super Admin can review and update leads end-to-end.

### Sprint 4 — Polish & enterprise hardening (Week 5)

| Task | Owner |
|------|-------|
| CSV export | BE + FE |
| Email on new EOI | BE |
| Activity/audit log UI | FE |
| Duplicate ABN detection (warning) | BE |
| E2E: Playwright (registry submit → admin sees lead) | QA |
| Error boundaries, loading states, empty states | FE |

**Exit:** Demo-ready on staging.

### Sprint 5 — Deploy & UAT (Week 6)

| Task | Owner |
|------|-------|
| `api.clox.com.au`, `dev.clox.com.au`, `clox.com.au` DNS + TLS | DevOps |
| GitHub Actions deploy pipelines | DevOps |
| Seed Super Admin users | BE |
| UAT with client; fix P1 bugs | All |
| Privacy/terms placeholders | FE |

**Exit:** Phase 0 live.

### Optional Sprint 6 — Buffer (Week 7–8)

- Performance (Lighthouse PWA ≥ 90 mobile)
- Russian copy review by native speaker
- Analytics (Plausible/GA4)
- Sentry frontend + backend

---

## 10. Bridge to full platform (no rework)

| Phase 0 artifact | Reuse in M1–M12 |
|------------------|-----------------|
| `apps/api` NestJS monolith | Add modules: compliance, jobs, payments, trips |
| `auth` module | Extend RBAC: State, Local, Sender, Carrier, Driver |
| `Lead.promotedUserId` | M3/M4 onboarding promotes lead → User |
| `web-admin` | Grows into M11 ops portal (add sidebar items) |
| `packages/ui` | Sender/carrier/driver apps share components |
| `api.clox.com.au/v1` | Same host; new resource paths |
| Audit module | Full ops compliance trail |

**Do not** create separate CRM or second API for pre-launch.

---

## 11. Testing strategy

| Level | Tool | Coverage target |
|-------|------|-----------------|
| Unit BE | Jest | Services, validators ≥ 80% |
| Integration BE | Supertest + testcontainers Postgres | All Phase 0 endpoints |
| Unit FE | Vitest + RTL | Form validation, stores |
| E2E | Playwright | Registry + EOI + admin flow |
| Contract | OpenAPI snapshot | FE types generated (`openapi-typescript`) |

---

## 12. Observability

| Item | Tool |
|------|------|
| Logs | Pino → CloudWatch / Datadog |
| APM | Optional: Sentry Performance |
| Uptime | Health check monitor on `/v1/health` |
| Metrics | Request count, lead submissions/day (Prometheus later) |

---

## 13. Decisions log (client confirmed 2026-07-27)

| ID | Decision | Status | Value |
|----|----------|--------|-------|
| D1 | ORM | Default | Prisma |
| D2 | Domains | **Confirmed** | `clox.com.au` (public) · `dev.clox.com.au` (admin web) · `api.clox.com.au` (API) |
| D3 | Admin auth | Default | Email OTP (JWT session) |
| D4 | Registry contact fields | Default | Add email + phone |
| D5 | EOI pages | Default | Single `/partner/eoi` route |
| D6 | Russian copy | Pending | Client review after en ship |
| D7 | easyAML / KYB | **Confirmed** | **No auto integration in Phase 0** — manual review from Super Admin |
| D8 | Email notifications | **Confirmed** | **Required** — notify Super Admin on new submissions (EOI + registry) |
| D9 | Seed Super Admin | **Confirmed** | `abc@example.com` in seed file (replace before prod) |
| D10 | Email provider | Pending | SES / SendGrid / Resend — pick before Sprint 4 |
| D11 | Cloud vendor | Pending | AWS/Azure/GCP — DNS/hosting TBD; domains confirmed |

### easyAML / KYB (Phase 0 behaviour)

- Public forms: **no** live easyAML/ABR API calls.
- Step 3 “infrastructure acknowledgment” cards remain **informational only** (UX unchanged).
- Super Admin manually marks lead/EOI: e.g. `kyb_pending` → `qualified` / `rejected` with internal notes.
- easyAML integration deferred to **M2 Compliance** when full onboarding ships.

### Email (Phase 0)

| Event | Recipient | Channel |
|-------|-----------|---------|
| New registry (sender/carrier) | Super Admin(s) | Transactional email |
| New EOI | Super Admin(s) | Transactional email |
| Admin OTP login | Requesting admin email | Transactional email |

Super Admin recipient list: seed from `AdminUser` table + optional `NOTIFY_EMAIL` env override.

**Gmail SMTP (Phase 0):** `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, app-specific password or Workspace SMTP relay. Env vars in `.env.example` — never commit credentials. Suitable for low-volume pre-launch; plan migration before high traffic.

### Privacy & Terms (go-live requirement)

| Item | Phase 0 approach |
|------|------------------|
| Privacy Policy | Required before public launch — page at `/legal/privacy` |
| Terms of Service | Required — page at `/legal/terms` |
| Registry/EOI consent | Checkbox linking to both + data collection notice |
| Entity | Achieve Global Enterprises Pty Ltd · ABN 48 626 269 387 (per legal framework doc) |

**Input needed from client:** approved legal text **or** permission to ship **placeholder pages** marked “draft — legal review pending” until counsel signs off. Engineering can wire routes + checkboxes either way; **we do not publish real PII collection without a privacy policy link.**

**Minimum privacy policy topics (AU):** who collects data, what fields (email, phone, ABN, company details), purpose (pre-launch interest list), retention, contact email, how to request access/deletion, no sale to third parties (unless stated).

---

## 14. Definition of done — Phase 0

- [ ] All Phase 0 API endpoints documented in OpenAPI
- [ ] Public registry + EOI work on mobile Chrome/Safari; PWA installable
- [ ] en + ru complete for user-facing strings
- [ ] Super Admin: dashboard, lists, detail, notes, status, export
- [ ] Audit trail for admin actions
- [ ] Deployed to client domains with TLS
- [ ] No secrets in git; env documented in `.env.example`
- [ ] Playwright E2E green in CI
- [ ] Client UAT sign-off

---

## 15. Immediate next steps (when coding starts)

1. Run **Sprint 0** monorepo bootstrap (Day 1–2)
2. ~~Lock Gate 0 decisions~~ — see §13 (client inputs received 2026-07-27)
3. Implement **Lead** schema + `POST /v1/leads/*` (Day 3–5)
4. Parallel: **web-public** registry wizard + **web-admin** shell on `dev.clox.com.au`
5. `notifications` module: email to Super Admin on lead create (provider env in Sprint 4)

---

**Plan complete. Ready to begin Sprint 0 on your go.**
