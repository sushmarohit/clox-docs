# User Onboarding - Clox Web-First (Phase 1)

## Channel policy (agreed direction)

- **Onboarding / signup / verification:** Web only for all customer-facing roles (Phase 1).
- **Sender and Driver apps:** Login and operational flows only; no full KYC/KYB repeat in app unless you add Phase 2 lite flows.

Related: [Transport company onboarding](transportcompanyonboarding.md) | [Transport company sequence (auto + Ops)](transportcompanyonboarding-sequence.md)

---

## 1) Sender (Customer) onboarding

### Paths

- **Business sender:** ABN/ACN + KYB.
- **Individual sender:** Government ID + KYC (and liveness where provider requires).

### State machine

```mermaid
stateDiagram-v2
    [*] --> sender_draft
    sender_draft --> sender_pending_verification: Submit profile + KYB_or_KYC
    sender_pending_verification --> sender_pending_payment: Verified
    sender_pending_verification --> sender_pending_review: Fail_or_manual_review
    sender_pending_review --> sender_pending_payment: Ops_approve_or_user_resubmit
    sender_pending_review --> sender_rejected: Reject_terminal
    sender_pending_payment --> sender_active: Stripe_customer_payment_ready
    sender_active --> sender_suspended: Fraud_expiry_policy_breach
    sender_suspended --> sender_active: Remediation_ok
    sender_rejected --> [*]
```

### Step-by-step

1. **Registration** — Email/phone, OTP, credential setup, Terms & Privacy.
2. **Account type** — Business vs Individual branch.
3. **Verification (Phase 1 — manual)**
   - Business: entity details + ABN/ACN (+ supporting uploads) → Ops compliance queue.
   - Individual: government ID upload → Ops compliance queue.
   - Optional: ABR free ABN status shown to Ops (not auto-approve).
   - **No easyAML/Trulioo in Phase 1.**
   - Ops Approve → continue; Request info / Reject as needed.
4. **Invoice profile** — Legal name, AU address, GST flags for invoicing compliance (business rules ≥ threshold per product policy).
5. **Payment prerequisites** — Stripe customer + default payment method as required before first booking.
6. **Activation** — `sender_active` → can create jobs / accept proposals per product rules.

### Go/no-go checklist (booking enabled)

| Check | Sender business | Sender individual |
|-------|-----------------|-------------------|
| KYB / KYC | Ops verified (manual) | Ops verified (manual) |
| Invoice fields | complete | complete |
| Payment | ready | ready |
| Account state | active | active |

---

## 2) Driver onboarding

Drivers are anchored to a **Transport Company**. Phase 1 assumes **carrier-initiated** setup on web/admin; driver uses app **after** credentials exist.

### State machine

```mermaid
stateDiagram-v2
    [*] --> driver_invited
    driver_invited --> driver_profile_incomplete: Accept_invite OTP_first_login_web
    driver_profile_incomplete --> driver_compliance_pending: Submit_license_credentials
    driver_compliance_pending --> driver_active: Company_or_policy_approves
    driver_compliance_pending --> driver_blocked: Credential_reject_terminal
    driver_active --> driver_suspended: Licence_expiry_or_company_revoke
    driver_suspended --> driver_active: Renewal_or_reinstated
    driver_blocked --> [*]
```

### Step-by-step

1. **Create / invite** — Transport company adds driver (email or phone); system sends invite.
2. **First access (web)** — OTP, password, accept policies and safety acknowledgement (NHVR-related copy per legal).
3. **Credentials** — Licence class, licence number, expiry, optional endorsements; document photo if policy requires.
4. **Linkage** — Driver bound to exactly one primary company context for assignment (unless you later allow multi-fleet apps).
5. **Activation** — `driver_active` → eligible for allocation on bids that pass vehicle + licence validation.
6. **App only** — Install driver app → login → trip execution (safety checklist, mass check, POD).

### Fatigue (Phase 1)

- Manual work diary offline; optional **Taking Break** in app affects ETA visibility only, not HVNL adjudication unless you introduce EWD/Fatigue Phase 2.

### Go/no-go checklist (can be assigned to trip)

- Linked to `approved_bid_eligible` company (or stricter internal policy).
- Licence not expired; licence class matches vehicle class per job rules.
- Driver account `driver_active`.

---

## 3) Transport company (carriers)

Full flow: [transportcompanyonboarding.md](transportcompanyonboarding.md)

---

## 4) Admin roles (Super / State / Local BDE)

- **Not** public self-service onboarding unless you define it later.
- **Provisioning:** internal account creation, invite, RBAC assignment, audit training.
- **Operations:** compliance review queues align with auto vs Ops paths in transport and sender flows.

---

## Suggested API surface (illustrative)

- `POST /v1/sender/register`, `POST /v1/sender/verify/kyc|kyb`, `POST /v1/sender/payment/setup`
- `POST /v1/drivers/invite`, `POST /v1/drivers/accept-invite`, `POST /v1/drivers/profile/submit`
- All subject to your auth and privacy model; idempotency on payment and verification callbacks.

---

## Phase 2 options (optional)

- In-app **lite** sender onboarding for individuals (documents still web if heavy).
- Driver self-registration with company join code.
- Stronger licence/RWC sync from fleet module.
