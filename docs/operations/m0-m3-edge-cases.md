# M0–M3 Edge Cases (Implemented)

**Scope:** Edge cases for milestones **M0–M3 as implemented** (plan v1.9). Not aspirational M4+.  
**Sources:** API modules (`auth`, `identity`, `ops`, `documents`, `compliance`, `sender`, `payments`, `jobs`), Prisma enums, admin Vite UI, existing `*.spec.ts`.  
**Related:** [PHASE-1-IMPLEMENTATION-PLAN.md](../PHASE-1-IMPLEMENTATION-PLAN.md) · [milestone-verification-ui.md](milestone-verification-ui.md) · [m0-m3-test-map.md](m0-m3-test-map.md) (automation)

**Legend**

| Tag | Meaning |
|-----|---------|
| `[TESTED]` | Covered by an in-repo unit test |
| `[NOT TESTED]` | No matching unit test found |
| `[GAP]` | Surprising / incomplete behaviour in current code |

Each case: **Case** → **Expected** → **Trigger**.

---

## M0 — Foundation

### Infra / DB

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M0-1 | Postgres down at runtime | Health `degraded` / `database: down` (HTTP 200). Routes using `ensureDatabase()` → `503 Database is unavailable` | Stop Docker Postgres; `GET /v1/health`; then OTP/request | `[TESTED]` health + admin specs |
| M0-2 | DB up, PostGIS missing | Health `database: up`, `postgis: down`, overall `ok` if DB only required | Drop PostGIS extension; hit health | `[NOT TESTED]` |
| M0-3 | Invalid env (missing `DATABASE_URL`, JWT secrets &lt; 32 chars) | Process fails at startup (`validateEnv`) | Clear/shorten secrets; start API | `[NOT TESTED]` |
| M0-4 | Reused Docker volume without PostGIS init | Init SQL only on first volume create → possible `postgis: down` | Recreate compose without wiping volume after init change | `[NOT TESTED]` |

### API surface / browser

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M0-5 | Origin not in `CORS_ORIGINS` | Browser CORS failure | Call API from unknown origin | `[NOT TESTED]` |
| M0-6 | OpenAPI gated in production | Swagger off when `NODE_ENV=production` + `ENABLE_OPENAPI=false` | Toggle env; hit `/v1/docs` | `[NOT TESTED]` |
| M0-7 | Correlation id | Response always has `x-correlation-id` (echo or new UUID) | Any request ± header | `[NOT TESTED]` |
| M0-8 | Security headers | `X-Content-Type-Options`, `X-Frame-Options: DENY`, etc. | Inspect any response | `[NOT TESTED]` |
| M0-9 | Module `_status` stubs | Public ready stubs (e.g. jobs `M3-gate`, compliance `M2`) | `GET /v1/jobs/_status` etc. | `[NOT TESTED]` |
| M0-10 | Admin UI with API down | No dedicated health widget; Super home / identity calls fail | Stop API; open admin | `[NOT TESTED]` |

---

## M1 — Identity, auth & RBAC

### OTP

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M1-1 | OTP request unknown email/phone | Generic success — no account disclosure | Unused email on `/auth/otp/request` | `[NOT TESTED]` |
| M1-2 | Neither email nor phone | `400` validation (`email or phone required`) | Empty body | `[NOT TESTED]` |
| M1-3 | Inactive admin (`active=false`) | Request looks like success; verify → `401 Invalid email or code` | Disable admin; OTP flow | `[NOT TESTED]` |
| M1-4 | Suspended / disabled user | Same as unknown for resolve | Set `User.status` SUSPENDED/DISABLED | `[NOT TESTED]` |
| M1-5 | Phone OTP for admin | Admins resolve by email only; phone → unknown | Phone-only request for admin | `[NOT TESTED]` |
| M1-6 | Same email in AdminUser + User | Admin wins | Dual rows; login | `[NOT TESTED]` |
| M1-7 | Wrong OTP | `401`; attempts++; audit fail | Wrong code | `[NOT TESTED]` |
| M1-8 | ≥5 failed attempts | `403 Too many OTP attempts. Request a new code.` | Fail verify 5+ times | `[NOT TESTED]` |
| M1-9 | Expired / already consumed OTP | `401` | Wait TTL or reuse after success | `[NOT TESTED]` |
| M1-10 | OTP throttle | Request 5/min, verify 10/min → `429` | Burst | `[NOT TESTED]` |
| M1-11 | `EXPOSE_OTP_IN_RESPONSE` | `debugCode` in response; login UI shows Dev OTP | Default local; request OTP | `[NOT TESTED]` |
| M1-12 | SMTP unset | OTP still created; non-prod logs / debug code | Clear SMTP; request | `[NOT TESTED]` |
| M1-13 | Invalid OTP format | Zod `400` (must be 4–8 digits) | Verify `abc` | `[NOT TESTED]` |

### Sessions / JWT

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M1-14 | Bad/expired refresh | `401 Invalid refresh token` | Tamper / expire refresh | `[NOT TESTED]` |
| M1-15 | Refresh token reuse | Family revoke; `401` | Refresh once; replay old refresh | `[NOT TESTED]` |
| M1-16 | Access after logout | `[GAP]` Access JWT still works until access TTL — guard does **not** check `revokedAt` | Logout; call `/identity/me` with same access | `[NOT TESTED]` |
| M1-17 | Refresh used as Bearer access | `401` (`typ` must be access) | Wrong token type | `[NOT TESTED]` |
| M1-18 | Missing Bearer | `401 Missing bearer token` | Protected route, no header | `[NOT TESTED]` |
| M1-19 | Logout current / all / by refresh | Matching sessions revoked | `POST /auth/logout` variants | `[NOT TESTED]` |
| M1-20 | Revoke another user’s session | `401 Session not found` | Foreign session UUID | `[NOT TESTED]` |
| M1-21 | UI revoke current session | Account page: no Revoke on current session | Open Account | `[NOT TESTED]` |

### Step-up

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M1-22 | Step-up as marketplace user | `403 Step-up is for admin principals` | Sender → step-up request | `[NOT TESTED]` |
| M1-23 | Policy publish without `X-Step-Up-Token` | `403 Step-up OTP required` | Super → policy stub, no header | `[NOT TESTED]` |
| M1-24 | Wrong/expired/cross-admin step-up token | `403` invalid/expired | Swap tokens / wait &gt;5m | `[NOT TESTED]` |
| M1-25 | Step-up wrong code / many attempts | `401 Invalid or expired step-up code` | Fail verify | `[NOT TESTED]` |

### RBAC / scope / ops provision

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M1-26 | Non-Super → `/v1/admin/*` | `403 Insufficient role` | State/Local/Sender → leads | `[TESTED]` roles.guard |
| M1-27 | Non-Super UI `/leads` `/audit` | Client redirect `/`; nav hidden | Login State; deep link | `[NOT TESTED]` |
| M1-28 | Provision admin as non-Super | `403` | State → `POST /ops/admins` | `[TESTED]` via RolesGuard |
| M1-29 | LOCAL_BDE without territory | `400` territory required | Omit `territoryCode` | `[NOT TESTED]` |
| M1-30 | Unknown region/territory | `404` | Bad codes | `[NOT TESTED]` |
| M1-31 | Duplicate admin email | `409` | Provision twice | `[NOT TESTED]` |
| M1-32 | State Master foreign region | `403 Outside admin scope (region)` | VIC State → NSW | `[TESTED]` scope.service |
| M1-33 | Local foreign territory | `403 Outside admin scope (territory)` | Assert territory | `[TESTED]` scope.service |
| M1-34 | Super unrestricted | Any region OK | Super list ± filter | `[TESTED]` scope.service |
| M1-35 | `GET /identity/me` | Admin scopes / user company; unauth `401` | Six roles | `[NOT TESTED]` |
| M1-36 | Login QA hint vs seed email | `[GAP]` Hint may not match `SEED_SUPER_ADMIN_EMAIL` → verify fails | Use hint email without matching seed | `[NOT TESTED]` |

---

## M2 — Documents & compliance

### Documents

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M2-1 | Bad MIME / &gt;10MB on intent | `400 Unsupported mime` / `File exceeds 10MB` | `image/gif` or size &gt;10MB | `[NOT TESTED]` |
| M2-2 | Upload for other company | User: `403 Not a member`. Admins may bypass membership | Sender + carrier companyId | `[NOT TESTED]` |
| M2-3 | Unknown companyId | `404 Company not found` | Random UUID | `[NOT TESTED]` |
| M2-4 | PUT without multipart `file` | `400 Missing file upload` | Empty PUT | `[NOT TESTED]` |
| M2-5 | PUT when not `UPLOAD_PENDING` | `400 Document is not awaiting upload` | Double upload | `[NOT TESTED]` |
| M2-6 | MIME / size ≠ intent | `400` Content-Type or size mismatch | Declare PDF, send JPEG | `[NOT TESTED]` |
| M2-7 | Confirm wrong `contentHash` | `400 contentHash mismatch` | Wrong sha256 | `[NOT TESTED]` |
| M2-8 | Confirm before upload | `400 Document must be uploaded before confirm` | Confirm while pending | `[NOT TESTED]` |
| M2-9 | Storage key path escape | `400 Invalid storage key` | Crafted key escaping `STORAGE_LOCAL_DIR` | `[NOT TESTED]` |
| M2-10 | Multer hard 10MB | Rejected before service | Multipart &gt;10MB | `[NOT TESTED]` |
| M2-11 | No malware scan | Allowed mime/size accepted by design | Arbitrary PDF bytes | N/A |

### Compliance submit / decisions

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M2-12 | Wrong caseType for company | `400` sender≠CARRIER_KYB / carrier must CARRIER_KYB | Mismatched submit | `[NOT TESTED]` |
| M2-13 | Docs not UPLOADED / wrong company | `400 All documents must exist…` | Pending/foreign ids | `[NOT TESTED]` |
| M2-14 | Carrier missing PL/cargo or ABN | `400` missing docs / ABN required | Incomplete carrier submit | `[NOT TESTED]` |
| M2-15 | Sender KYB no ABN extract & no ABN | `400` | Submit without either | `[NOT TESTED]` |
| M2-16 | Sender KYC no GOVERNMENT_ID | `400` | Submit without ID | `[NOT TESTED]` |
| M2-17 | Second open case via `/compliance/submit` | `400` already open (**blocks INFO_REQUESTED** — no reopen) | Submit twice | `[NOT TESTED]` |
| M2-18 | Approve non-actionable case | `400 Case is not actionable` | Approve twice | `[NOT TESTED]` |
| M2-19 | Reject / request-info / escalate after terminal | `[GAP]` No terminal-status guard — can overwrite APPROVED/REJECTED | Approve then reject | `[NOT TESTED]` |
| M2-20 | Approve sender vs carrier | Sender → `PENDING_PAYMENT`; carrier → `BID_ELIGIBLE` | Super/State approve | `[NOT TESTED]` |
| M2-21 | Local approve/reject/request-info | `403` (controller + service G0-4) | Local API or hidden UI | `[TESTED]` compliance.service |
| M2-22 | Super/State escalate | `403` Local-only escalate | Super → escalate | `[NOT TESTED]` |
| M2-23 | Case with no region (non-Super) | `403 Case has no region — Super only` | Company without homeRegion | `[NOT TESTED]` |
| M2-24 | List with empty region scope | Empty list | Admin JWT with no regions | `[NOT TESTED]` |
| M2-25 | Filter foreign regionCode | `403` scope | VIC State `?regionCode=NSW` | `[TESTED]` via ScopeService |

### ABR / expiry watchdog

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M2-26 | ABR without `ABR_GUID` | Assist stub `configured: false` — never auto-approve | Case detail / `GET /compliance/abr` | `[TESTED]` Abr stub |
| M2-27 | Invalid ABN query | Zod `400` | `abn=123` | `[NOT TESTED]` |
| M2-28 | ABR network/parse fail | Soft fail — verify manually | Bad GUID / block network | `[NOT TESTED]` |
| M2-29 | Watchdog expires vehicle RWC | Doc `EXPIRED`; vehicle `SUSPENDED` | Past `expiresAt` RWC | `[NOT TESTED]` |
| M2-30 | Watchdog expires company PL/cargo/RWC | BID_ELIGIBLE/ACTIVE → `SUSPENDED` + audit | Expired company docs | `[NOT TESTED]` |
| M2-31 | `COMPLIANCE_WATCHDOG_MS=0` | Watchdog off | Env + restart | `[NOT TESTED]` |
| M2-32 | Watchdog while DB down | Returns zeros; no throw | DB down on tick | `[NOT TESTED]` |

### UI

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M2-33 | Role-gated nav | Ops-only compliance; marketplace QA upload; deep-link redirects | Cross-role URLs | `[NOT TESTED]` |
| M2-34 | Local UI Approve hidden | Escalate only; API still enforces | Login Local; open case | `[NOT TESTED]` |
| M2-35 | QA upload company fallback | `[GAP]` Falls back to seed UUIDs if `me.company` missing | User without companyId | `[NOT TESTED]` |

---

## M3 — Sender onboarding + mock Stripe + booking gate

### Register / profile / wizard

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M3-1 | Duplicate register email | `409 Email already registered` | Register twice | `[NOT TESTED]` |
| M3-2 | Terms not accepted | Zod `400`; UI disables submit | `acceptedTerms: false` | `[NOT TESTED]` |
| M3-3 | Invalid register fields | `400` (name/email/phone) | Bad body | `[NOT TESTED]` |
| M3-4 | Register throttle | 5/min → `429` | Burst | `[NOT TESTED]` |
| M3-5 | VIC region missing at register | Company `homeRegionId: null` → later Ops may be Super-only | Register without region seed | `[NOT TESTED]` |
| M3-6 | Non-sender → sender APIs | `403` RolesGuard / Sender principal | Carrier → `/sender/onboarding` | `[NOT TESTED]` |
| M3-7 | Sender without company | `404 Sender company not found` | Orphan user | `[NOT TESTED]` |
| M3-8 | Profile edit outside DRAFT/INFO_REQUESTED | `400` | Edit while PENDING_REVIEW/ACTIVE | `[NOT TESTED]` |
| M3-9 | Business without ABN | Zod `ABN is required for business senders` | BUSINESS + empty ABN | `[NOT TESTED]` |
| M3-10 | Bad ABN / postcode / region | Zod `400` or `404 Unknown region` | `homeRegionCode=ZZ` | `[NOT TESTED]` |
| M3-11 | Submit without account type / invoice | `400` | Skip profile; submit | `[NOT TESTED]` |
| M3-12 | Resubmit after INFO_REQUESTED (sender API) | Reopens case → OPEN; company PENDING_REVIEW | Ops request-info → sender resubmit | `[NOT TESTED]` |
| M3-13 | Resubmit while OPEN/ESCALATED | `400 An open compliance case already exists` | Double submit | `[NOT TESTED]` |
| M3-14 | Company SUSPENDED | API `step: suspended`; `[GAP]` UI has no suspended panel | Watchdog suspend; open wizard | `[NOT TESTED]` |
| M3-15 | Rejected application | UI shows reject + decision note | Ops reject; open wizard | `[NOT TESTED]` |
| M3-16 | Non-sender deep link `/sender/onboarding` | Navigate `/` | Super deep link | `[NOT TESTED]` |
| M3-17 | Login as sender while already authed | Redirect to `/sender/onboarding` (not home) | Visit `/login` as sender | `[NOT TESTED]` |

### Payment / Stripe

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M3-18 | Setup before Ops approve | `400 Payment setup available only after Ops approve` | DRAFT → setup | `[NOT TESTED]` |
| M3-19 | Confirm without setup | `400 Call payment setup first` | Confirm w/o customer | `[NOT TESTED]` |
| M3-20 | Confirm when not PENDING_PAYMENT | `400 Company must be PENDING_PAYMENT to activate` | Confirm ACTIVE/DRAFT | `[NOT TESTED]` |
| M3-21 | Mock mode (no key / `STRIPE_MOCK`) | Fake `cus_mock_*` / `seti_mock_*`; omit PM → `pm_mock_default`; no PAN | Default local payment step | `[NOT TESTED]` |
| M3-22 | Live Stripe without paymentMethodId | `400 paymentMethodId is required when Stripe is live` | Real key; confirm omit PM | `[NOT TESTED]` |
| M3-23 | Live Stripe bad secret | Stripe SDK error bubbles | Invalid `STRIPE_SECRET_KEY` | `[NOT TESTED]` |
| M3-24 | Setup with incomplete invoice after approve | `400 Invoice profile incomplete` | Clear invoice in DB; setup | `[NOT TESTED]` |
| M3-25 | Confirm success | ACTIVE + `paymentReady` + audits; `canBook` if invoice OK | Full happy path | Partial `[TESTED]` gate only |
| M3-26 | UI Confirm before SetupIntent | Error surfaced (`Call payment setup first`) | Click Confirm first | `[NOT TESTED]` |
| M3-27 | Live Stripe UI path | `[GAP]` UI still confirms without Payment Element / PM id | Disable mock; use UI | `[NOT TESTED]` |

### Booking gate (jobs stub)

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| M3-28 | Job create not ready | `403` `SENDER_NOT_BOOKING_READY` + go/no-go | Incomplete sender → `POST /v1/jobs` | `[TESTED]` canBook=false |
| M3-29 | Job create when canBook | `[GAP]` No Job row — `{ code: JOBS_M6_PENDING }` | Seed ACTIVE sender → POST jobs | `[NOT TESTED]` |
| M3-30 | Non-sender POST jobs | `403 Insufficient role` | Carrier token | `[TESTED]` RolesGuard |
| M3-31 | PENDING_PAYMENT only | `opsApproved` true, `canBook` false until ACTIVE+payment | Approve; skip payment; eligibility | `[TESTED]` incomplete path |

### Go / no-go matrix (sender)

| Ops / status | Invoice complete | paymentReady | canBook |
|--------------|------------------|--------------|---------|
| DRAFT / PENDING_REVIEW / INFO_REQUESTED / REJECTED / SUSPENDED | any | any | **false** |
| PENDING_PAYMENT | yes | no | **false** (`opsApproved` true) |
| ACTIVE | no | yes | **false** |
| ACTIVE | yes | yes | **true** |

---

## Cross-cutting

| # | Case | Expected | Trigger | Tests |
|---|------|----------|---------|-------|
| X-1 | Zod validation failures | `400` problem+json `Validation failed` | Malformed bodies | `[NOT TESTED]` |
| X-2 | DB disconnected after boot | `503` on `ensureDatabase()` services | Stop Postgres mid-session | Partial `[TESTED]` |
| X-3 | Audit on mutations | AuditEvent rows (best-effort) | Auth/compliance/sender actions | `[NOT TESTED]` |
| X-4 | Seed personas | Sender `…0001` ACTIVE+invoice+payment (canBook); Carrier `…0002` ACTIVE | `prisma db seed` | N/A |

---

## Notable gaps (implemented quirks)

1. **Access JWT survives logout** until access TTL expires.  
2. **`reject` / `requestInfo` / `escalate` lack terminal-status guards** (unlike `approve`).  
3. **Generic `/compliance/submit` cannot reopen INFO_REQUESTED**; **`/sender/verification/submit` can**.  
4. **Suspended sender wizard step has no UI panel**.  
5. **QA upload may fall back to seed company UUIDs**.  
6. **Job create never persists a Job** even when eligible (`JOBS_M6_PENDING`).  
7. **Live Stripe confirm UI does not collect a PaymentMethod id**.

---

## Unit test map (current)

| Spec | Covers |
|------|--------|
| `health.controller.spec.ts` | DB down / PostGIS up health |
| `roles.guard.spec.ts` | Super-only deny State/Local/Sender |
| `scope.service.spec.ts` | Region/territory allow/deny; Super open |
| `compliance.service.spec.ts` | Local cannot approve; ABR unconfigured; hash helper |
| `sender.service.spec.ts` | `canBook=false`; Forbidden code smoke |
| `admin.service.spec.ts` | DB down; Super leads (Phase 0) |
| `crypto.spec.ts` | OTP hashing helpers |

No API-backed e2e for OTP rotation, upload pipeline, full compliance SM, or Stripe mock in CI (Playwright smoke excludes API-backed).

---

## How to use

1. Manual QA: walk **Trigger** column against [milestone-verification-ui.md](milestone-verification-ui.md).  
2. Before M4: prefer closing `[GAP]` items or filing ADRs if deferred.  
3. Expand automated coverage from `[NOT TESTED]` high-risk rows (auth reuse, compliance terminal states, booking gate true path).
