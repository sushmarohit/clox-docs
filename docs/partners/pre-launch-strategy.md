# Pre-Launch Strategy (Phase 0)

**Version:** 1.1 · **Updated:** 2026-07-27  
**Status:** Active — aligned to client PDFs  
**Canonical forms:** [admin-eoi-form.md](admin-eoi-form.md) · [investor-portal-form.md](investor-portal-form.md) · [pre-launch-registry.md](pre-launch-registry.md)  
**Implementation plan:** [PRE-LAUNCH-IMPLEMENTATION-PLAN.md](../PRE-LAUNCH-IMPLEMENTATION-PLAN.md)

---

## 1. Goal

Ship a **public capture surface + Super Admin review console** before the full marketplace, without throwaway architecture.

Pre-Launch answers three GTM questions:

1. Who wants to **ship or haul** on CLOX? → Registry  
2. Who wants to **operate a territory** (State Master / Local BDE)? → Admin EOI  
3. Who wants to **invest capital / strategic equity**? → Investor Portal  

All three write into the **same API and PostgreSQL** that later becomes M0–M12.

---

## 2. Three public funnels (do not merge)

| Funnel | Canonical source | Public route | Lead type(s) | Admin queue |
|--------|------------------|--------------|--------------|-------------|
| **Sender / Carrier registry** | `Pre-Launch/index.html` + product gap email/phone | `/registry` | `REGISTRY_SENDER`, `REGISTRY_CARRIER` | Registry leads |
| **Admin partner EOI** | `clox_admin_eoi_form.pdf` | `/partner/eoi` | `EOI_STATE_MASTER`, `EOI_LOCAL_BDE` | EOI queue |
| **Investor portal** | `clox_investor_portal_form.pdf` | `/investors` | `INVESTOR` | Investor queue |

### Critical correction (2026-07-27)

Earlier HTML/`docs` treated `investorportal.html` and `eoiform.html` as the same Admin EOI program and planned a **single** `/partner/eoi` route.

The official PDFs show they are **different products**:

- Admin EOI = operating partners (10%/5% splits, KYB, Master Admin Agreement)
- Investor Portal = equity pre-qualification (Corporations Act 2001, capital bands, `invest@clox.com.au`)

`Pre-Launch/investorportal.html` today is a **content clone of the Admin EOI** and is **wrong** relative to `clox_investor_portal_form.pdf`. Digital rebuild must use the investor PDF, not the EOI HTML.

---

## 3. Domain map

| Host | Serves |
|------|--------|
| `clox.com.au` | Public PWA — landing, registry, partner EOI, investors, legal |
| `dev.clox.com.au` | Super Admin PWA — login, dashboards, queues |
| `api.clox.com.au` | NestJS API `/v1/*` |

Local: `web` :5173 · `admin` :5174 · `api` :3000

---

## 4. Repo layout (simple — no monorepo)

```
clox/
  api/          # NestJS + Prisma (npm)
  web/          # Public React (npm)
  admin/        # Super Admin React (npm)
  docker/       # Postgres
  docs/
  Pre-Launch/   # Legacy static HTML — reference only after parity
  img/          # Brand assets
```

Package manager: **npm** per app. No pnpm workspaces, no shared packages, no Turborepo.

---

## 5. What Super Admin does in Phase 0

| Capability | Registry | Admin EOI | Investor |
|------------|----------|-----------|----------|
| List / filter / search | Yes | Yes | Yes |
| Detail + payload snapshot | Yes | Yes | Yes |
| Status + notes + audit | Yes | Yes | Yes |
| Manual KYB | Yes | Yes (required path) | N/A (accreditation review offline) |
| CSV export | Yes | Yes | Yes |
| Email on submit | Yes | Yes | Yes (+ optional `invest@` CC) |
| Provision State/Local users | No (later) | After agreement only | Never from this form |

KYB: **manual only** in Phase 0 (no easyAML auto-check).

---

## 6. API surface (Phase 0)

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/v1/leads/registry` | Public + throttle + honeypot |
| `POST` | `/v1/leads/eoi` | Public + throttle + honeypot |
| `POST` | `/v1/leads/investor` | Public + throttle + honeypot |
| `POST` | `/v1/auth/otp/*`, `/v1/auth/refresh` | Admin |
| `GET/PATCH/POST` | `/v1/admin/leads…`, `/v1/admin/dashboard/stats`, `/v1/admin/audit` | Super Admin JWT |

---

## 7. Content & legal rules

1. **No content drift** from client PDFs for EOI and Investor forms (field labels, role copy, declaration text).  
2. Registry keeps Pre-Launch HTML intent; **add email + phone**.  
3. Privacy Policy + Terms links/checkboxes required before public PII collection.  
4. Investor form must reference NDA + Corporations Act purpose — do not reuse Admin EOI declaration text.  
5. Marketing payout copy may say Monoova; engineering Phase 0 does not integrate Monoova/Stripe.

---

## 8. Delivery sequence (strategy view)

1. **Foundation** — `api` + Postgres + health + auth OTP  
2. **Capture APIs** — registry + EOI + investor  
3. **Public web** — three forms + legal stubs + brand assets  
4. **Admin portal** — OTP login, KPIs, three queues, detail/notes/export  
5. **Notify + harden** — Gmail SMTP alerts, rate limits, CSV, E2E  
6. **Deploy** — `clox.com.au` / `dev.clox.com.au` / `api.clox.com.au`

---

## 9. Explicit non-goals (Phase 0)

- Live marketplace (jobs, bids, trips, POD)
- Stripe / easyAML / Monoova live rails
- State Master / Local BDE product portals
- Auto-verification of sophisticated/professional investor status
- Auto-provisioning of admin accounts from EOI or investor leads

---

## 10. Source-of-truth priority

| Topic | Prefer |
|-------|--------|
| Admin EOI fields & copy | `clox_admin_eoi_form.pdf` → [admin-eoi-form.md](admin-eoi-form.md) |
| Investor fields & copy | `clox_investor_portal_form.pdf` → [investor-portal-form.md](investor-portal-form.md) |
| Registry UX | `Pre-Launch/index.html` → [pre-launch-registry.md](pre-launch-registry.md) |
| Stack / domains / KYB / email | Client decisions in plan §13 |
| HTML under `Pre-Launch/` | Reference only; fix investor HTML drift against PDF |
