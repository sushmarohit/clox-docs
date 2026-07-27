# CLOX Pre-Launch → Platform — Full Implementation Plan

**Version:** 1.1  
**Date:** 2026-07-27  
**Status:** Approved for execution (updated for investor PDF + simple npm layout)  
**Stack:** React · Zustand · Tailwind · PWA · i18n (en first, ru later) · NestJS · PostgreSQL · **npm** (no monorepo)

**Related:** [partners/pre-launch-strategy.md](partners/pre-launch-strategy.md) · [partners/admin-eoi-form.md](partners/admin-eoi-form.md) · [partners/investor-portal-form.md](partners/investor-portal-form.md) · [partners/pre-launch-registry.md](partners/pre-launch-registry.md) · [TPM-DOCUMENT-ANALYSIS.md](TPM-DOCUMENT-ANALYSIS.md) · [MILESTONES.md](MILESTONES.md)

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
| Public **Admin Partner EOI** (State/Local BDE) — from `clox_admin_eoi_form.pdf` | Full M3/M4 onboarding wizards |
| Public **Investor Portal** — from `clox_investor_portal_form.pdf` | Auto investor accreditation checks |
| `POST` lead APIs + validation (registry, eoi, investor) | Jobs, bids, trips, POD |
| Super Admin portal: dashboard, registry / EOI / investor queues, notes, export | State/Local BDE portal |
| Auth: Super Admin OTP/session | Carrier/sender product login |
| Audit log for admin actions | Fleet+, settlements |

### Success criteria (Phase 0)

- [ ] Registry + Admin EOI + Investor submit to `api.clox.com.au/v1/leads/*` with validation
- [ ] Super Admin sees all submissions (3 queues), filters, status pipeline, notes
- [ ] CSV export; email alert on new registry / EOI / investor (configurable)
- [ ] Mobile-first PWA; English first (Russian after UI stable)
- [ ] Deploy: `clox.com.au` (public) · `dev.clox.com.au` (admin) · `api.clox.com.au` (API)
- [ ] OpenAPI published; E2E smoke tests green

---

## 2. Repository structure (simple apps — npm)

```
clox/
├── api/                     # NestJS + Prisma (npm)
├── web/                     # Public React PWA — registry, EOI, investors
├── admin/                   # Super Admin React PWA
├── docs/
├── Pre-Launch/              # Legacy static HTML (reference; investor HTML is wrong vs PDF)
├── docker/                  # Postgres Compose
├── img/                     # Brand assets
├── package.json             # Convenience scripts only (npm --prefix …)
└── README.md
```

**Package manager:** npm (each app has its own `package.json` / lockfile)  
**Node:** 20 LTS  
**Strategy detail:** [partners/pre-launch-strategy.md](partners/pre-launch-strategy.md)
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
api/src/
├── main.ts
├── app.module.ts
├── config/                  # env validation (Zod)
├── common/                  # filters, guards, pipes
├── modules/
│   ├── health/
│   ├── auth/                # admin OTP + JWT
│   ├── leads/               # registry + admin EOI + investor
│   ├── admin/               # dashboard, list, notes, export, audit
│   ├── audit/
│   └── notifications/       # Gmail SMTP alerts + OTP
├── shared/types.ts          # local Zod DTOs (duplicated in web/admin as needed)
└── prisma/
```

**Future modules (stubs only — no implementation in Phase 0):** `compliance`, `jobs`, `payments`, `trips`, `geolocation`.

### 4.2 API surface — Phase 0

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/health` | — | Health check |
| POST | `/v1/leads/registry` | Public + rate limit | Sender/carrier pre-launch |
| POST | `/v1/leads/eoi` | Public + rate limit | Admin partner EOI (`clox_admin_eoi_form.pdf`) |
| POST | `/v1/leads/investor` | Public + rate limit | Investor portal (`clox_investor_portal_form.pdf`) |
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
  INVESTOR
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

### 4.6 Admin EOI payload (alignment with `clox_admin_eoi_form.pdf`)

`role`, `targetState`, `targetTerritory`, `fullLegalName`, `companyName`, `abn`, `acn`, `email`, `phone`, `corporateAddress`, `networkExperience`, `executionStrategy`, `declarationAccepted`  
(+ digital signature equivalent: typed name / accepted-at timestamp)

Full field map: [partners/admin-eoi-form.md](partners/admin-eoi-form.md)

### 4.7 Investor payload (alignment with `clox_investor_portal_form.pdf`)

`fullNameOrEntity`, `contactPersonName?`, `email`, `phone`, `abn?`, `acn?`, `residence`, `investorClassifications[]`, `capitalAllocation`, `ecosystemFocus`, `strategicNotes`, `declarationAccepted`

Full field map: [partners/investor-portal-form.md](partners/investor-portal-form.md)

---

## 5. Frontend architecture (React)

### 5.1 Apps

#### `web/` (mobile-first public PWA)

| Route | Page | Source of truth |
|-------|------|-----------------|
| `/` | Landing | clox_about_us positioning |
| `/registry` | 3-step sender/carrier flow | `Pre-Launch/index.html` (+ email/phone) |
| `/partner/eoi` | Admin partner EOI | **`clox_admin_eoi_form.pdf`** |
| `/investors` | Investor portal | **`clox_investor_portal_form.pdf`** |
| `/privacy`, `/terms` | Legal stubs | Client-provided text later |

#### `admin/` (Super Admin)

| Route | Page |
|-------|------|
| `/login` | OTP login |
| `/` | Pre-launch dashboard (KPIs across registry / EOI / investor) |
| `/leads/registry` | Sender + carrier table |
| `/leads/eoi` | Admin partner EOI table |
| `/leads/investors` | Investor pre-qualification table |
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

### 5.3 Design system

- CSS variables: `--navy`, `--orange` (from Pre-Launch)
- Tailwind tokens in `web/` and `admin/`
- Shared patterns: step indicator, status badges, tables (desktop) / cards (mobile)
- Typography: Segoe / system-ui stack

### 5.4 Zustand stores

| Store | Responsibility |
|-------|----------------|
| `useAuthStore` | Admin JWT, user, login/logout |
| `useRegistryWizardStore` | Step 1–3, userType, draft (sessionStorage persist) |
| `useEoiFormStore` | Optional draft persist |
| `useInvestorFormStore` | Optional draft persist |
| `useLocaleStore` | `en` \| `ru`, sync with i18n + `localStorage` |

**Note:** Server data lives in TanStack Query, not Zustand.

### 5.5 i18n (en first, ru later)

```
web/src/locales/en/…
admin/src/locales/en/…
```

- Namespaces: `common`, `registry`, `eoi`, `investor`, `admin`
- English ships first; Russian after UI stable (D6)
- `Accept-Language` / form locale stored on `Lead.locale`
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
| 1 | Build `web` registry to parity with `index.html` (+ email/phone) |
| 2 | Build Admin EOI from **`clox_admin_eoi_form.pdf`** (not only HTML) |
| 3 | Build Investor Portal from **`clox_investor_portal_form.pdf`** — **do not** reuse EOI HTML |
| 4 | Replace / retire wrong `investorportal.html` content (it currently clones Admin EOI) |
| 5 | Wire APIs; remove fake `setTimeout` submit |
| 6 | Point `clox.com.au` to `web` build; keep `Pre-Launch/` as reference |

---

## 9. Implementation phases & timeline

**Assumption:** lean team — **~6–8 weeks** to Phase 0 prod (adjusted for simple npm apps).

### Sprint 0 — Foundation (Week 1)

| Task | Owner |
|------|-------|
| Simple apps: `api/`, `web/`, `admin/` with npm | All |
| NestJS skeleton, health, config, Prisma, Docker Compose (Postgres) | BE |
| React apps scaffold, Tailwind, CLOX theme | FE |
| Local Zod/types in each app as needed | BE + FE |
| CI: lint, test, build on PR | DevOps |

**Exit:** `npm run dev` works in each of `api`, `web`, `admin` locally.
### Sprint 1 — Leads API (Week 2)

| Task | Owner |
|------|-------|
| Prisma models: Lead, LeadNote, LeadEvent, AdminUser (+ `INVESTOR` type) | BE |
| `POST /v1/leads/registry`, `/eoi`, `/investor` | BE |
| Validation, rate limit, audit on create | BE |
| OpenAPI + integration tests | BE |
| i18n setup English skeleton | FE |

**Exit:** Postman/curl can create registry, EOI, and investor leads; DB persisted.

### Sprint 2 — Public web (Week 3)

| Task | Owner |
|------|-------|
| Registry 3-step wizard (mobile-first) | FE |
| Admin EOI page (PDF-accurate) | FE |
| Investor portal page (PDF-accurate) | FE |
| TanStack Query mutations → API | FE |
| PWA manifest + SW (public) | FE |

**Exit:** All three public forms submit to real API in dev.
### Sprint 3 — Admin auth + leads UI (Week 4)

| Task | Owner |
|------|-------|
| Admin OTP auth flow | BE + FE |
| Dashboard stats endpoint (registry + EOI + investor KPIs) | BE |
| Admin: login, dashboard, registry / EOI / investor lists | FE |
| Lead detail + notes + status PATCH | BE + FE |
| Mobile-responsive admin tables/cards | FE |

**Exit:** Super Admin can review and update all three lead types end-to-end.

### Sprint 4 — Polish & enterprise hardening (Week 5)

| Task | Owner |
|------|-------|
| CSV export (all queues) | BE + FE |
| Email on new registry / EOI / investor | BE |
| Activity/audit log UI | FE |
| Duplicate ABN detection (warning) | BE |
| E2E: Playwright (registry + EOI + investor → admin) | QA |
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
| D5 | Partner forms | **Updated 2026-07-27** | **Two routes:** `/partner/eoi` (Admin EOI PDF) **and** `/investors` (Investor PDF). Do **not** merge. |
| D6 | Russian copy | **Confirmed** | **After English UI is stable** |
| D7 | easyAML / KYB | **Confirmed** | **No auto integration in Phase 0** — manual review from Super Admin |
| D8 | Email notifications | **Confirmed** | **Required** — notify Super Admin on new registry, EOI, **and investor** |
| D9 | Seed Super Admin | **Confirmed** | `abc@example.com` in seed file (replace before prod) |
| D10 | Email provider | **Confirmed** | **Gmail SMTP** (app password / Workspace) |
| D11 | Cloud vendor | Pending | AWS/Azure/GCP — DNS/hosting TBD; domains confirmed |
| D12 | Investor portal | **Confirmed from PDF** | Separate lead type `INVESTOR`; optional CC `invest@clox.com.au` |

### easyAML / KYB (Phase 0 behaviour)

- Public forms: **no** live easyAML/ABR API calls.
- Step 3 “infrastructure acknowledgment” cards remain **informational only** (UX unchanged).
- Super Admin manually marks lead/EOI: e.g. `kyb_pending` → `qualified` / `rejected` with internal notes.
- easyAML integration deferred to **M2 Compliance** when full onboarding ships.

### Email (Phase 0)

| Event | Recipient | Channel |
|-------|-----------|---------|
| New registry (sender/carrier) | Super Admin(s) | Transactional email |
| New Admin EOI | Super Admin(s) | Transactional email |
| New Investor lead | Super Admin(s) (+ optional `invest@clox.com.au`) | Transactional email |
| Admin OTP login | Requesting admin email | Transactional email |

Super Admin recipient list: seed from `AdminUser` table + optional `NOTIFY_EMAIL` env override.

**Gmail SMTP (Phase 0):** `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, app-specific password or Workspace SMTP relay. Env vars in `.env.example` — never commit credentials. Suitable for low-volume pre-launch; plan migration before high traffic.

### Privacy & Terms (go-live requirement)

| Item | Phase 0 approach |
|------|------------------|
| Privacy Policy | Required before public launch — page at `/legal/privacy` |
| Terms of Service | Required — page at `/legal/terms` |
| Registry / EOI / Investor consent | Checkbox linking to Privacy + Terms + form-specific declaration |
| Entity | Achieve Global Enterprises Pty Ltd · ABN 48 626 269 387 (per legal framework doc) |

**Input needed from client:** approved legal text **or** permission to ship **placeholder pages** marked “draft — legal review pending” until counsel signs off. Engineering can wire routes + checkboxes either way; **we do not publish real PII collection without a privacy policy link.**

**Minimum privacy policy topics (AU):** who collects data, what fields (email, phone, ABN, company details), purpose (pre-launch interest list), retention, contact email, how to request access/deletion, no sale to third parties (unless stated).

---

## 14. Definition of done — Phase 0

- [ ] All Phase 0 API endpoints documented in OpenAPI
- [ ] Public registry + Admin EOI + Investor work on mobile Chrome/Safari; PWA installable
- [ ] English complete for user-facing strings (ru later)
- [ ] Super Admin: dashboard, three queues, detail, notes, status, export
- [ ] Audit trail for admin actions
- [ ] Deployed to client domains with TLS
- [ ] No secrets in git; env documented in `.env.example`
- [ ] Playwright E2E green in CI
- [ ] Client UAT sign-off

---

## 15. Immediate next steps

1. Keep **simple npm apps** (`api` / `web` / `admin`) — no monorepo regression
2. Add `INVESTOR` lead type + `POST /v1/leads/investor`
3. Rebuild public Investor page from **`clox_investor_portal_form.pdf`**
4. Align Admin EOI page to **`clox_admin_eoi_form.pdf`** (signature/declaration parity)
5. Extend Super Admin with Investor queue + dashboard KPIs
6. Continue admin OTP UI + remaining Phase 0 polish

---

**Plan updated v1.1 — Pre-Launch strategy now treats Admin EOI and Investor Portal as separate funnels.**