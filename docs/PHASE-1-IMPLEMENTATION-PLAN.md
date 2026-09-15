# CLOX Phase 1 — Full Milestone Implementation Plan

**Version:** 1.0  
**Date:** 2026-09-14  
**Status:** Canonical build plan for Gate 0 + M0–M12  
**Parent catalogs:** [MILESTONES.md](MILESTONES.md) · [MILESTONES-AUSTRALIA.md](MILESTONES-AUSTRALIA.md)  
**Phase 0 (done / parallel foundation):** [PRE-LAUNCH-IMPLEMENTATION-PLAN.md](PRE-LAUNCH-IMPLEMENTATION-PLAN.md)  
**Backend architecture:** [architecture/backend-architecture.md](architecture/backend-architecture.md) (modular monolith → microservices-ready)  
**Engineering rules:** [engineering/production-development-rules.md](engineering/production-development-rules.md) · `.cursor/rules/`  
**Payments:** [payments/stripe-payment-specification.md](payments/stripe-payment-specification.md)  
**Architecture:** [system-design.md](system-design.md) · [security.md](security.md)

---

## How to use this document

For **each milestone** below:

1. Complete **What to implement** before coding.  
2. Follow **How to implement** in order (dependencies matter).  
3. Tick every item in **Implementation checklist** and **Exit / QA checklist**.  
4. Do not start the next milestone until exit criteria are green (or explicitly waived with ADR).

**Delivery model:** Vertical slices after M0–M2 foundation. Each release train must be demoable.

| Train | Milestones | Demo |
|-------|------------|------|
| Alpha 1 — Trust | M0–M2 | Login, docs, state machines |
| Alpha 2 — Supply | M3–M5 | Sender + carrier + driver onboarded |
| Beta 1 — Marketplace | M6–M7 | Publish, bid, pay, assign |
| Beta 2 — Move freight | M8–M10 | Full trip + POD |
| RC / Pilot | M11–M12 | Ops + settlement + live pilot |

---

## Locked platform decisions (apply to all milestones)

| ID | Decision | Locked choice |
|----|----------|---------------|
| G0-1 | Payment model | **Model A** — 100% pay on accept (AUD) |
| G0-2 | KYB/KYC | **Manual Ops review** — **no easyAML / Trulioo** in Phase 1 |
| G0-6 | Payout rail | **Stripe Connect only** (Monoova deferred) |
| Docs upload | Malware scan | **Deferred** — mime/size/hash only; Ops reviews files manually |
| Geo / routing | Routing engine | **Valhalla** (self-hosted / OSM) for distance, TSP, HV constraints |
| Geo / dwell | Geofencing | **PostGIS** (`ST_DWithin` / enter-exit) for Phase 1; Radar optional later |
| Stack | Backend | NestJS modular monolith + Prisma + PostgreSQL |
| Stack | Web | Existing `web/` + `admin/`; expand roles |
| Stack | Mobile | Per G0-7 (record choice before M8) |
| Currency | AUD | All money fields AUD; Stripe AU |

---

## Repository targets (reuse Phase 0)

```
clox/
├── api/          # NestJS — expand modules per milestone
├── web/          # Public + sender/carrier web
├── admin/        # Ops portal (Super → State → Local)
├── mobile/       # Sender + Driver apps (create at M8)
├── docs/
└── docker/
```

**Bounded contexts to grow in `api/src/modules/`:**

`identity` · `compliance` · `jobs` · `matching` · `trips` · `payments` · `notifications` · `geolocation` · `documents` · `ops` · `settlements` · `audit`

---

# GATE 0 — Decisions before M0

**Duration:** 1–2 weeks  
**Owner:** TPM + Product + Finance + Eng lead  
**Blocks:** M0 kickoff

## What to decide

Record ADRs (or BRD addendum) for G0-1 … G0-8.

## How to implement (process)

1. Workshop with Product / Finance / Legal / Eng.  
2. Write one ADR per decision (or single Gate-0 ADR with table).  
3. Update BRD/PRD only where defaults change.  
4. Sign-off in repo `docs/adr/` (create folder if missing).

## Checklist

- [ ] **G0-1** Payment model = Model A (confirmed)
- [ ] **G0-2** KYB/KYC = **manual Ops** (easyAML/Trulioo **out of Phase 1**)
- [ ] **G0-3** Carrier approval: docs complete → Ops/State queue (no paid IDV vendor); optional later auto-heuristics only
- [ ] **G0-4** Local BDE compliance = view + escalate (no approve) unless policy flip
- [ ] **G0-5** Pilot geography = single state (recommended VIC) *or* national AU
- [ ] **G0-6** Stripe Connect only for pilot (confirmed)
- [ ] **G0-7** Mobile stack chosen (native / RN / Flutter)
- [ ] **G0-8** Tariffs = versioned DB tables; Super publishes
- [ ] Valhalla hosting plan (Hetzner/AWS) sketched
- [ ] PostGIS geofence radius default = **200 m** (legal)
- [ ] Gate 0 signed; M0 unblocked

---

# M0 — Foundation & engineering baseline

**Duration:** 2–3 weeks  
**Depends on:** Gate 0  
**Goal:** Runnable API + DB + CI on staging; ERD v0; ADRs filed

## What to implement

| Area | Deliverable |
|------|-------------|
| Repo | Modular Nest modules skeleton for all bounded contexts |
| Infra | Docker Postgres (+ PostGIS extension), object storage stub, queue stub, secrets via env |
| CI/CD | Lint, test, build, migrate, deploy stage |
| API | `/v1` prefix, health, OpenAPI stub, correlation IDs |
| Data | ERD v0 entities (see below) |
| Design | Shared UI tokens (CTA, cards, status pills) |
| Docs | ADR: Model A, module boundaries, outbox pattern, Valhalla+PostGIS, Stripe Connect |

### ERD v0 entities (minimum)

`User` · `AdminUser` · `AdminScope` · `Company` (Sender/Carrier) · `Vehicle` · `Driver` · `ComplianceDocument` · `Job` · `JobStop` · `Proposal` · `Assignment` · `Trip` · `PaymentEvent` · `SettlementLine` · `AuditEvent` · `PolicyVersion` · `Region` · `LocalTerritory`

## How to implement

1. Enable PostGIS on Postgres (`CREATE EXTENSION postgis`).  
2. Scaffold Nest modules with empty controllers + health.  
3. Prisma schema v0 → migrate → seed Super Admin (reuse Phase 0).  
4. Add OpenAPI (`/v1/docs` non-prod).  
5. CI pipeline: `npm ci` → lint → test → `prisma migrate deploy`.  
6. Deploy API health to stage.  
7. File ADRs under `docs/adr/`.

## Implementation checklist

- [ ] PostGIS enabled in docker + stage
- [ ] Nest modules created for identity, compliance, jobs, trips, payments, notifications, geolocation, documents, ops, settlements, audit
- [ ] Prisma ERD v0 migrated
- [ ] `GET /v1/health` returns DB up
- [ ] Correlation ID middleware
- [ ] OpenAPI stub published
- [ ] CI green on `main`
- [ ] Stage deploy of API
- [ ] Seed Super Admin works
- [ ] ADRs: G0-1…G0-8 + Valhalla/PostGIS + Stripe pattern (separate charges + transfers)
- [ ] Currency enums / money as integer cents AUD

## Exit / QA checklist

- [ ] Health check green on stage
- [ ] Finance + backend reviewed payment-related ERD fields
- [ ] No production secrets in repo
- [ ] README runbook for local docker + migrate + seed

---

# M1 — Identity, auth & RBAC

**Duration:** 3–4 weeks  
**Depends on:** M0  
**Goal:** Six roles authenticate; API enforces least privilege + scope

## What to implement

### Roles

`SUPER_ADMIN` · `STATE_MASTER` · `LOCAL_BDE` · `SENDER` · `TRANSPORT_COMPANY` · `DRIVER`

### Auth

- OTP login (email/phone) + JWT access + rotating refresh  
- Session revoke / device list  
- Step-up OTP for sensitive admin actions (policy, payouts, suspend)

### RBAC + scope

- Role permissions matrix ([screen-flows/README.md](screen-flows/README.md))  
- `AdminScope`: State Master → `Region` (AU state); Local BDE → `LocalTerritory`  
- Middleware: every Ops query filtered by scope (never trust client `state=` alone)

### APIs

- `POST /v1/auth/otp/request` · `POST /v1/auth/otp/verify`  
- `POST /v1/auth/refresh` · `POST /v1/auth/logout`  
- `POST /v1/ops/admins` (Super provisions State/Local — UI in M11)  
- Audit: login, role change, scope change

### Screens

`SHR-AUTH-01/02` · `SHR-PROF-01` (basic)

## How to implement

1. Extend `AdminRole` enum beyond `SUPER_ADMIN`.  
2. Add marketplace `User` model + role binding (or unified identity table with role discriminator).  
3. Implement OTP store (hash + expiry + attempts).  
4. JWT guards + `@Roles()` + `@RequireScope()`.  
5. Integration tests: each role denied on foreign endpoints.  
6. Seed: Super + sample State (VIC) + Local (Melbourne CBD) for QA.

## Implementation checklist

- [ ] OTP request/verify with rate limits
- [ ] Access + refresh rotation
- [ ] Session revoke
- [ ] Role guard on all `/v1` mutating routes
- [ ] AdminScope tables + seed
- [ ] Provision admin API (invite email stub OK)
- [ ] AuditEvent for auth + admin mutations
- [ ] Cross-role deny tests (≥1 test per role pair critical path)
- [ ] Security headers / CORS locked to known origins

## Exit / QA checklist

- [ ] All six roles can log in (test users)
- [ ] State user cannot read other-state fixtures
- [ ] Local user cannot access Super policy routes
- [ ] Unauthenticated requests get 401
- [ ] FR-1 partial (OTP) satisfied

---

# M2 — Compliance & document platform

**Duration:** 4–5 weeks  
**Depends on:** M1  
**Goal:** Shared docs + KYB/KYC + state machines + expiry watchdog + review queue API

## What to implement

| Component | Detail |
|-----------|--------|
| Documents | Signed upload URLs, **mime/size checks**, content **hash** + metadata (**no malware scanner** in Phase 1) |
| Identity / KYB-KYC | **Manual Ops review** of uploaded docs + profile fields; optional **ABR** ABN active check (free GUID) — **no easyAML/Trulioo** |
| Sender SM | `sender_draft` → … → `sender_active` ([useronboarding.md](useronboarding.md)) |
| Carrier SM | Through `approved_bid_eligible` ([transportcompanyonboarding.md](transportcompanyonboarding.md)) |
| Watchdog | Cron: RWC/insurance/ABN expiry → suspend |
| Ops queue API | Filter by type, status, region — used by M11 UI |

### AU document types (Phase 1) — collected for **manual** verification

| Party | Uploads / fields Ops reviews |
|-------|------------------------------|
| Sender business | ABN/ACN, entity details, supporting docs as required |
| Sender individual | Government ID images (+ selfie if policy asks) |
| Carrier | ABN, PL $10–20M cert, cargo insurance, RWC per vehicle, permits (DG) |

### Manual verification flow (Phase 1)

1. User submits profile + uploads → state `pending_verification` / `pending_review`.  
2. Case appears on Ops compliance queue (Super / State Master per scope).  
3. Ops **Approve** / **Request info** / **Reject** (audit logged).  
4. Only after Approve (+ Stripe payment ready for senders, Connect + fleet for carriers) → active / bid-eligible.  
5. Local BDE: view + escalate only (G0-4) — does not final-approve compliance.

## How to implement

1. `documents` module: create upload intent → client PUT → confirm → store object + hash (skip virus scan).  
2. `compliance` module: create review cases; **no** paid IDV webhooks.  
3. Optional: ABR ABN lookup to assist Ops (display active/inactive; not auto-approve).  
4. State transitions only via server service methods (no client-set status).  
5. Compliance queue: `GET /v1/ops/compliance/cases` + approve/reject APIs.  
6. Expiry worker every hour.

## Implementation checklist

- [ ] Signed URL upload pipeline
- [ ] Document metadata + content hash (mime/size validation)
- [ ] **No** easyAML/Trulioo integration
- [ ] **No** malware scan integration
- [ ] Optional ABR ABN lookup (assist Ops only)
- [ ] Sender state machine persisted (pending → Ops decision)
- [ ] Carrier state machine persisted (pending → Ops decision)
- [ ] Expiry watchdog job
- [ ] Compliance review queue API (scoped) + Approve / Request info / Reject
- [ ] Audit on every Ops decision
- [ ] G0-3: Phase 1 default = **manual queue** for carriers (no paid-vendor auto path)

## Exit / QA checklist

- [ ] Carrier cannot reach bid-eligible without mandatory docs **and Ops approve**
- [ ] Sender cannot reach active without Ops verification (+ payment in M3)
- [ ] Expired RWC suspends vehicle / company per policy
- [ ] Ops can list pending cases filtered by VIC-only scope
- [ ] FR-1 compliance gate (carrier) ready for M4

---

# M3 — Sender onboarding (Web)

**Duration:** 3 weeks  
**Depends on:** M2  
**Goal:** Business & individual senders → `sender_active`

## What to implement

### Screens (`SND-ONB-01` … `05`)

Welcome → OTP → account type → **upload ID / business docs** → invoice profile → wait for **Ops approve** → Stripe Customer + PaymentMethod → `sender_active`

### Backend

- Sender register + document submit APIs  
- Invoice profile validation  
- Compliance case for Ops (manual KYB/KYC)  
- Stripe Customer + SetupIntent ([stripe-payment-specification.md](payments/stripe-payment-specification.md) §6.1)  
- States: `sender_pending_verification` / `sender_pending_review` until Ops approve

## How to implement

1. Web wizard routes gated by sender state.  
2. Branch Business vs Individual — collect fields + uploads only.  
3. Submit → Ops queue (no third-party IDV call).  
4. On Ops approve → payment setup screen.  
5. Confirm PM → `sender_active`.  
6. E2E: draft → Ops approve → active.

## Implementation checklist

- [ ] SND-ONB flows wired end-to-end
- [ ] Business ABN + docs upload path
- [ ] Individual ID upload path
- [ ] Invoice + GST fields
- [ ] Ops approve required before payment/active
- [ ] Stripe Customer + default PM
- [ ] Reject / request-info UX
- [ ] Go/no-go table ([useronboarding](useronboarding.md) §1) — KYB/KYC = Ops verified

## Exit / QA checklist

- [ ] New sender reaches `sender_active` only after Ops + payment
- [ ] Booking flag true only when go/no-go passes
- [ ] Unapproved sender cannot create jobs
- [ ] No card PAN in DB/logs

---

# M4 — Transport company onboarding (Web)

**Duration:** 4–5 weeks  
**Depends on:** M2 (parallel with M3)  
**Goal:** Carrier → `approved_bid_eligible`

## What to implement

### Screens (`TCO-ONB-01` … `08`)

Register → legal entity → compliance docs upload → **Stripe Connect** → vehicles → drivers → capabilities/regions → submit → **Ops/State manual unlock**

### Backend

- Connect Account + Account Link  
- Fleet CRUD (tare, GVM/GCM, RWC)  
- Driver invite minimum  
- **Manual** compliance unlock (State Master / Super) — no easyAML  
- Suspension on expiry (FLOW 05)

## How to implement

1. Wizard state machine mirrors carrier SM.  
2. Stripe Connect Express onboarding; poll/webhook `account.updated`.  
3. Require ≥1 vehicle + ≥1 driver before submit (product rule).  
4. Submit → `pending_review` compliance case.  
5. State/Super **Approve** → `approved_bid_eligible` (Local BDE escalate only).  
6. Bid APIs return 403 if not eligible.

## Implementation checklist

- [ ] 8-step wizard UI
- [ ] PL + cargo + RWC (+ permits) uploads — Ops reviews manually
- [ ] Optional ABR ABN assist (not auto-approve)
- [ ] Stripe Connect onboarding complete → `payouts_enabled`
- [ ] Vehicle + driver minimum
- [ ] Capabilities (DG, reefer, etc.) + service regions
- [ ] Ops/State manual approve path (default Phase 1)
- [ ] Suspension on insurance/RWC expiry
- [ ] Net payout display rules stub (70% — enforced M6/M7)

## Exit / QA checklist

- [ ] E2E: register → docs → Connect → fleet → **Ops approve** → bid-eligible
- [ ] Non-eligible carrier gets 403 on bid
- [ ] Connect account fails block eligibility
- [ ] FR-1 carrier gate satisfied

---

# M5 — Driver onboarding (Web invite)

**Duration:** 2 weeks  
**Depends on:** M4  
**Goal:** Invited driver → `driver_active`

## What to implement

### Screens (`DRV-WEB-01` … `05`)

Invite → OTP → password → licence + NHVR acknowledgement → active

### Rules

- One primary transport company  
- Licence class must match vehicle class on assignment (validated M6/M7)  
- App login allowed; trip APIs “not assigned” until M8

## How to implement

1. Carrier creates invite → email/SMS link with token.  
2. Driver accepts → profile incomplete → submit licence.  
3. Company or policy auto-approve → `driver_active`.  
4. Store licence class/number/expiry.

## Implementation checklist

- [ ] Invite create + resend
- [ ] Token expiry + single use
- [ ] Licence fields + document photo optional
- [ ] NHVR / safety policy acknowledgement copy
- [ ] Company linkage enforced
- [ ] Suspend on licence expiry job

## Exit / QA checklist

- [ ] Driver assignable when licence matches vehicle rules
- [ ] Orphan driver (no company) cannot be assigned
- [ ] Mobile auth works (placeholder home until M8)

---

# M6 — Jobs, matching & marketplace (pre-payment)

**Duration:** 5–6 weeks  
**Depends on:** M3 + M4 (+ M5 for driver on bid)  
**Goal:** Publish job → eligible carriers bid; accept returns payment-required until M7

## What to implement

### Job wizard (`SND-JOB-01` … `05`)

- Mode: **Per KM** (1 pickup + 1 drop) or **Hourly** (max 4 stops; Pattern A/B)
- Load type checkboxes + smart rules  
- Site access mandatory (maneuverability + facility + disclaimer)  
- **Receiver contact (mandatory):** legal **name** + **email** on each drop (or job-level for single-drop). Phone optional.  
  - Phase 1: receiver is **not** a logged-in role; email used for delivery notifications + POD receipt  
- Dead weight + dimensions → chargeable = `max(dead, L×W×Hcm/4000)`  
- Calendar pickup time  
- Vehicle recommendation (rules): disable undersized; allow larger  

### Routing (Valhalla)

- Distance / duration matrix  
- TSP sequence for ≤4 stops  
- If planned duration **> 5.25 h** → insert unpaid **15 min** rest in ETA (non-removable)  
- Hourly floor: bill **4.0 hours** minimum  

### Marketplace

- Broadcast to eligible carriers (class, permits, region, bid-eligible)  
- Proposal: vehicle + driver + ETA; UI shows **net 70%** to carrier  
- Overlap conflict expiry logic (execute fully on award in M7)  
- DG → DG carriers only; etc.

### Policy / tariffs

- Versioned `PolicyVersion` tables; Super edits in M11; M6 reads active version  
- Bid cannot be below Super minimum base  

## How to implement

1. Job + JobStop models; validate patterns A/B.  
2. Integrate Valhalla client (docker service locally).  
3. Matching service filters carriers.  
4. Proposal CRUD with resource locks soft-check.  
5. Accept endpoint stub: `402/409 payment_required` until M7 wires PI.  
6. Sender proposal review masks carrier company per policy.

## Implementation checklist

- [ ] Per-km job create/publish
- [ ] Hourly multi-stop (≤4) Pattern A & B
- [ ] Site access + legal disclaimer gate
- [ ] **Receiver name + email required** (block publish without valid email)
- [ ] Load types + smart rules
- [ ] Volumetric / chargeable weight
- [ ] Valhalla route + TSP + fatigue insert
- [ ] 4-hour minimum display/estimate
- [ ] Vehicle recommendation + block undersize
- [ ] Carrier job board (net 70%)
- [ ] Proposal submit with vehicle+driver
- [ ] DG / oversize / reefer filters
- [ ] Min base fare validation
- [ ] Accept stub for M7

## Exit / QA checklist

- [ ] Undersize blocked in UI **and** API
- [ ] DG job hidden from non-DG carriers
- [ ] Hourly cannot exceed 4 stops
- [ ] Fatigue break appears when duration > 5.25 h
- [ ] FR-2, FR-3, FR-4 (partial) demoed on stage

---

# M7 — Payments & assignment lock (Model A)

**Duration:** 4–5 weeks  
**Depends on:** M6  
**Canonical spec:** [payments/stripe-payment-specification.md](payments/stripe-payment-specification.md)  
**Goal:** Accept → PaymentIntent full fare → `paid_and_confirmed` → assignment locked

## What to implement

| Piece | Detail |
|-------|--------|
| Accept API | Transaction: accept proposal, expire conflicts, create Assignment, create PaymentIntent |
| Stripe | PaymentIntent (gross AUD); SCA; webhooks idempotent |
| States | `assigned_pending_payment` → `paid_and_confirmed` / `payment_failed` |
| UX | Sender pending / failed / requires_action (`SND-PRP`) |
| Carrier | Assignment monitor `TCO-ASN` |
| Ledger stub | Accrual rows prepared (post on complete in M10/M12) |

## How to implement

1. Implement payments module per stripe spec (separate charges + transfers).  
2. Webhook endpoint signature verify + `stripe_event_id` unique.  
3. Only webhook success marks paid (not client callback alone).  
4. On accept: expire overlapping proposals same vehicle/driver.  
5. Block all trip-start routes until paid.  
6. Idempotency key = `accept:{jobId}:{proposalId}`.

## Implementation checklist

- [ ] Accept creates PI exactly once (idempotent)
- [ ] Webhook `payment_intent.succeeded` → paid
- [ ] Failed / requires_action UX
- [ ] Conflict expiry + carrier notify
- [ ] Assignment active only when paid
- [ ] PaymentEvent rows written
- [ ] No trip start without paid
- [ ] Stripe test-mode E2E in CI (or recorded fixtures)
- [ ] Refund stub API for cancel (full path M10/M12)

## Exit / QA checklist

- [ ] Happy path accept → charge → assignment active
- [ ] Failed payment leaves recoverable state
- [ ] Double-click accept does not double-charge
- [ ] FR-4 complete; BRD 100% upfront satisfied

---

# M8 — Trip execution (Driver + Sender mobile)

**Duration:** 5–6 weeks  
**Depends on:** M7 + G0-7 mobile stack  
**Goal:** Safety → mass OK → Start Trip; sender tracking after start

## What to implement

### Driver app (`DRV-MOB-01` … `06`)

- Today / trip overview  
- Pre-trip checklist (NHVR walk-around; fail → vehicle LOCKED)  
- Maneuverability preview from sender site access  
- Mass check submit  
- Start Trip **server-gated**: paid + safety + mass OK  
- Taking Break (pauses ETA/telemetry visibility; Phase 1 no legal fatigue alerts)

### Sender app (`SND-MOB-01/02`)

- Home + track map/timeline **only after** `Trip_Started`  
- Push: assigned, trip started  

### Server trip SM

`SafetyCheck → Arrived_at_Pickup → Loading → Mass_Check_Submitted → Trip_Started → …`  
(Authoritative on server; clients never trust local flags)

## How to implement

1. Create `mobile/` apps per G0-7.  
2. Trip module state machine with transition table.  
3. Pre-trip fail → maintenance work order + lock.  
4. Mass ≤ declared → unlock start; > declared → leave to M9 surcharge path (or block with stub).  
5. Live location ingest (MQTT/WebSocket or periodic POST) after start.  
6. Push via FCM/APNs abstraction.

## Implementation checklist

- [ ] Driver today + trip detail
- [ ] Pre-trip checklist + fail lockout
- [ ] Site access preview
- [ ] Mass check API
- [ ] Start trip server gate
- [ ] Tracking visible to sender only after start
- [ ] Taking Break pauses sender ETA stream
- [ ] Push notifications basic
- [ ] Offline start trip **rejected** (online-only)

## Exit / QA checklist

- [ ] E2E: paid → safety → mass OK → start → sender map live
- [ ] Client cannot force start without server 200
- [ ] FR-5 core satisfied (geo/POD later)

---

# M9 — Geofencing, dwell & surcharges

**Duration:** 4 weeks  
**Depends on:** M8  
**Goal:** Arrival/dwell automation; waiting + mass surcharges bill sender

## What to implement

### Geofencing (PostGIS Phase 1)

- 200 m radius around each stop  
- Enter → `arrival_*_at`, start wait timer  
- Anti-bounce (debounce / min dwell)  
- Optional Valhalla ETA refresh; geofence itself is PostGIS

### Waiting

- Free window: pickup **30 min** / drop **60 min** (policy tables)  
- Overage → waiting charge PaymentIntent  
- Notify sender; approvals inbox `SND-SRG`

### Mass discrepancy

- Driver report actual weight + photo  
- Surcharge PI; **Start Trip blocked** until paid or Ops waive/dispute  

### Carrier

- Read-only exception visibility `TCO-ASN-02`

## How to implement

1. Store stop geography as `geography(Point)`.  
2. Location updates → worker evaluates `ST_DWithin`.  
3. Wait timer service + policy lookup.  
4. Reuse payments surcharge flow from stripe spec.  
5. Sender approvals list web + mobile.

## Implementation checklist

- [ ] PostGIS geofence enter/exit for pickup/drop
- [ ] 200 m default configurable
- [ ] Anti-bounce logic
- [ ] Free wait windows from policy
- [ ] Waiting overage PaymentEvent + PI
- [ ] Mass discrepancy flow + block start
- [ ] Sender approve/pay surcharge UX
- [ ] Carrier exception read-only
- [ ] Run sheet dwell fields populated (prep M10)

## Exit / QA checklist

- [ ] Deterministic PaymentEvent for overage wait
- [ ] Mass mismatch blocks start until paid/waived
- [ ] FR-6 + FR-7 discrepancy path satisfied
- [ ] No charge if within free window

---

# M10 — POD, breakdown, run sheet & invoicing

**Duration:** 3–4 weeks  
**Depends on:** M8 (parallelizable late with M9)  
**Goal:** Completed trip with immutable POD; breakdown path; invoice + hourly run sheet

## What to implement

### POD (`DRV-MOB-08/09`)

- Receiver name + SOG + goods photos  
- Server timestamp + GPS metadata  
- Tamper-evident object storage (hash)  

### Receiver notifications (email — Phase 1)

Sender must supply **receiver email** at job create. System emails receiver (no login account):

| Event | Email |
|-------|--------|
| Trip assigned / paid (or policy: when en route) | Delivery expected — job ref, sender, ETA window, drop address |
| ~15–30 min before drop (if ETA available) | Driver approaching |
| POD completed | Delivered + POD PDF / link |

Phone/SMS is **out of Phase 1** unless explicitly added later. Magic-link POD is optional later; Phase 1 POD remains **driver-device SOG**.

### Completion

- Trip → `completed`  
- Tax invoice PDF payload (ATO: name/address if ≥ $1,000)  
- Hourly: **Clox Run Sheet PDF** ([clox-run-sheet.md](operations/clox-run-sheet.md))  
  - Header, stops table, break log, odometer start/end  
  - 4-hour floor wording  
  - >10% odo vs GPS → Super flag  

### Breakdown (`DRV-MOB-10` + carrier/sender/admin screens)

- Report issue → `Breakdown - In Progress`  
- Carrier: replace / repair / cancel-market  
- Sender approve replacement  
- Stripe refund / TransferReversal hooks ([stripe-payment-specification.md](payments/stripe-payment-specification.md) §6.7)  
- Company Performance Score decrement  

### Driver sick / unavailable ([driver-sick-call.md](operations/driver-sick-call.md))

- Reason codes → force Inactive → intra-fleet reassign → marketplace escalate

## How to implement

1. POD upload + PDF assemble (Puppeteer/PDFKit).  
2. Run sheet only for hourly jobs.  
3. Breakdown state machine + notifications.  
4. Wire financial adjustments to payments module.  
5. Email POD + invoice to sender; run sheet to carrier.

## Implementation checklist

- [ ] SOG + photos + immutable metadata
- [ ] Receiver email notifications (assigned/en-route/POD) using job contact email
- [ ] Trip completed transition
- [ ] Tax invoice generation
- [ ] Hourly run sheet PDF + email
- [ ] Odometer start/end capture
- [ ] Odo vs GPS >10% flag
- [ ] Breakdown driver → carrier → sender → admin flows
- [ ] Refund / reversal paths
- [ ] Sick-call force-offline + reassign stub/full
- [ ] Performance score logging

## Exit / QA checklist

- [ ] E2E publish → bid → pay → trip → POD → completed
- [ ] POD not editable after finalize
- [ ] FR-7 breakdown + FR-8 complete
- [ ] Run sheet shows billed 4.0 h when actual &lt; 4 h

---

# M11 — Ops portal (Super / State / Local BDE)

**Duration:** 5–6 weeks (UI can start after M2; finish after M7/M10)  
**Depends on:** M2 APIs; money views need M7; disputes need M10  
**Goal:** Three-tier ops governance

## What to implement

### Super (`OPS-SUP` 01–07)

National dashboard · compliance all regions · disputes final · policy/tariff publish · provision admins · settlements view · suspend org

### State Master (`OPS-STA` 01–05)

State dashboard · state compliance approve/reject · disputes resolve/escalate · Local BDE team · state revenue snapshot (10%)

### Local BDE (`OPS-LOC` 01–05)

Territory dashboard · growth pipeline · carrier support (view/escalate) · first-line dispute triage · local revenue (5%)  
**G0-4:** no compliance approve by default

### Cross-cutting

- Scope badges always visible  
- Audit every approve/reject/override  
- RBAC tests for cross-territory denial  

## How to implement

1. Expand `admin/` app: role-based nav (hide Super-only ★).  
2. Reuse compliance queue APIs with scope filters.  
3. Dispute module with escalation Local → State → Super.  
4. Policy editor: draft → publish new `PolicyVersion`.  
5. Provision State/Local with Region/Territory assignment.  
6. Growth CRM (`Prospect`) for Local only.  
7. Revenue widgets read `SettlementLine` accruals (payout execution M12).

## Implementation checklist

- [ ] Super national dashboard
- [ ] Super compliance + KYB override
- [ ] Super disputes final + financial adjust hooks
- [ ] Super policy/tariff version publish
- [ ] Super provision State/Local
- [ ] Super suspend/reactivate org
- [ ] State scoped dashboard + compliance approve
- [ ] State disputes + assign Local
- [ ] State Local team performance
- [ ] Local dashboard + tasks
- [ ] Local growth pipeline
- [ ] Local dispute triage only
- [ ] Local cannot approve compliance (G0-4)
- [ ] Scope enforcement integration tests
- [ ] Audit trail UI

## Exit / QA checklist

- [ ] State cannot edit national tariffs
- [ ] State cannot see other states’ cases
- [ ] Local cannot open national aggregates
- [ ] Compliance approve writes audit + state change
- [ ] Escalation path Local → State → Super works
- [ ] Revenue labels 15/10/5 correct (accrual)

---

# M12 — Settlement, reconciliation & pilot go-live

**Duration:** 4–5 weeks  
**Depends on:** M7 + M10 + M11  
**Goal:** Fortnightly settlement, reconcile Stripe, pilot live

## What to implement

| Workstream | Detail |
|------------|--------|
| Settlement scheduler | On complete: ledger 70/15/10/5; vacant → HQ |
| Carrier Transfer | After **7-day** clearing via Stripe Transfer |
| Admin cycle | Fortnightly 4th night; net after fees/marketing |
| Reconciliation | Daily Stripe vs `PaymentEvent` / transfers |
| Notifications | Email/push for money + trip events |
| Security | [security.md](security.md) Phase 1 checklist |
| Observability | Payment anomaly alerts; uptime target 99.9% |
| Pilot playbook | Support, dispute SLA, legal copy, KPIs |

### Pilot bar

- Geography per G0-5  
- ≥ **3** AU carriers  
- ≥ **10** completed trips with POD  
- One full fortnightly settlement cycle signed by Finance  

## How to implement

1. Settlement worker + cycle entity.  
2. Stripe Transfer batch with idempotency.  
3. Reconcile cron + Super finance mismatch UI.  
4. Runbooks: payment failure, webhook delay, compliance suspension ([GO-LIVE-RUNBOOK.md](GO-LIVE-RUNBOOK.md) extend).  
5. Instrument BRD success metrics.  
6. Prod config: Stripe live keys, Valhalla prod, PostGIS backups.  
7. Go/no-go meeting checklist below.

## Implementation checklist

- [ ] Ledger written on every completed job
- [ ] Carrier Transfer after clearing
- [ ] Admin fortnightly disbursement job
- [ ] Vacant territory → HQ holding
- [ ] Daily reconcile report
- [ ] Notification fan-out for key events
- [ ] Security Phase 1 checklist signed
- [ ] Alerting on payout destination change + surcharge spikes
- [ ] Pilot carriers onboarded
- [ ] KPI dashboard (booking-to-award, completion, dispute rate, on-time)
- [ ] Finance sign-off on one cycle
- [ ] Runbooks published

## Exit / QA checklist (program DoD)

- [ ] All PRD acceptance criteria evidenced on stage/prod-like
- [ ] Pilot KPIs measuring
- [ ] Screen-flow coverage matrix (§ below) green or waived
- [ ] No P0 payment/security bugs open
- [ ] Legal ToS/Privacy for marketplace live (not only pre-launch)
- [ ] Rollback plan documented

---

## Screen-flow coverage checklist (program)

| Role | Flows | Milestone | Done |
|------|-------|-----------|:----:|
| Shared auth/notif/profile | SHR-* | M1, M12 | [ ] |
| Sender web onboarding | SND-ONB | M3 | [ ] |
| Sender job + proposals | SND-JOB, SND-PRP | M6, M7 | [ ] |
| Sender mobile | SND-MOB, SND-SRG | M8, M9 | [ ] |
| Transport Co. onboarding | TCO-ONB | M4 | [ ] |
| Transport Co. market/assign | TCO-MKT, TCO-BID, TCO-ASN | M6, M7, M9 | [ ] |
| Driver web | DRV-WEB | M5 | [ ] |
| Driver mobile | DRV-MOB | M8–M10 | [ ] |
| Super Admin | OPS-SUP | M11 | [ ] |
| State Master | OPS-STA | M11 | [ ] |
| Local BDE | OPS-LOC | M11 | [ ] |

---

## FR → milestone checklist

| FR | Milestone | Done |
|----|-----------|:----:|
| FR-1 Onboarding & verification | M2–M5 | [ ] |
| FR-2 Job creation | M6 | [ ] |
| FR-3 Vehicle recommendation | M6 | [ ] |
| FR-4 Bidding & award | M6–M7 | [ ] |
| FR-5 Trip execution | M8–M9 | [ ] |
| FR-6 Geofencing & dwell | M9 | [ ] |
| FR-7 Discrepancy & breakdown | M9–M10 | [ ] |
| FR-8 POD & invoicing | M10 | [ ] |

---

## Explicitly out of Phase 1 (do not pull into checklists)

- **easyAML / Trulioo** (or any paid KYB/KYC vendor) — manual Ops instead  
- **Malware / virus scanning** on uploads — mime/size/hash + Ops review only  
- Payment Model B (deposit at publish)  
- Monoova NPP primary payouts  
- Fleet+ profit engine / AC1–AC6 full SaaS  
- AFM / authoritative EWD automation  
- Cross-border / multi-currency  
- Twilio Proxy / WebRTC (optional later)  
- ML dispatch beyond rules  

---

## Related documents

| Doc | Use |
|-----|-----|
| [PRE-LAUNCH-IMPLEMENTATION-PLAN.md](PRE-LAUNCH-IMPLEMENTATION-PLAN.md) | Phase 0 leads / Super console |
| [MILESTONES.md](MILESTONES.md) | Program catalog & risks |
| [payments/stripe-payment-specification.md](payments/stripe-payment-specification.md) | Money rail detail |
| [infrastructure/hosting-infrastructure-blueprint.md](infrastructure/hosting-infrastructure-blueprint.md) | Valhalla / PostGIS economics |
| [workflows/app-workflows-by-all-user-roles.md](workflows/app-workflows-by-all-user-roles.md) | Role workflows |
| [operations/clox-run-sheet.md](operations/clox-run-sheet.md) | Hourly PDF |
| [screen-flows/README.md](screen-flows/README.md) | UI IDs |

---

## Document control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-09-14 | Full Gate 0 + M0–M12 what/how/checklists; Stripe + Valhalla/PostGIS locked |
| 1.1 | 2026-09-14 | Phase 1: manual KYB/KYC (no easyAML); no malware scan |
| 1.2 | 2026-09-15 | Receiver: mandatory email on job; email notifications; driver-device POD |
