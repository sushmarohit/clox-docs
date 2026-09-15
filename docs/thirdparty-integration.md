# Third-Party Integration Specification - Clox

## Integration Principles
- Keep legal/compliance-critical decisions deterministic and auditable.
- Use third parties for verification, payments, geospatial intelligence, and communication.
- Maintain provider abstraction to reduce vendor lock-in risk.
- Persist integration request/response references for reconciliation and support.

## Integration Inventory

### 1) Stripe Connect
**Canonical spec:** [payments/stripe-payment-specification.md](payments/stripe-payment-specification.md)

**Purpose**
- Upfront payment capture from senders.
- Conditional surcharge/incremental authorization flows.
- Transfer and reversal handling in reassignment scenarios.

**Core Flows**
- Job acceptance -> collect 100% sender charge.
- Discrepancy/waiting overage -> additional charge path.
- Carrier/admin settlement support via transfer events.
- Reversal/adjustment events for breakdown reassignment (policy controlled).

**Key Integration Objects**
- Customer, PaymentIntent, Charge, Transfer, TransferReversal, BalanceTransaction.

**Failure Handling**
- Payment pending/failed/requires_action states.
- Retry policy with idempotency keys.
- Manual ops review queue for unresolved payment state transitions.

---

### 2) easyAML / Trulioo (deferred — not Phase 1)

**Phase 1 decision:** KYB/KYC is **manual Ops review** of uploaded documents. Do **not** integrate easyAML/Trulioo until a later phase.

**Purpose (future)**
- KYC/KYB verification for individuals and businesses.
- Document verification and anti-fraud checks.

**Core Flows (future)**
- Sender onboarding (business/individual branches).
- Carrier company onboarding and periodic re-verification.

**Data Considerations**
- Store verification status, reference IDs, and expiry metadata.
- Avoid storing excess PII; use tokenized/provider IDs when feasible.

**Phase 1 substitute**
- Upload docs → compliance queue → Super/State Approve / Request info / Reject.
- Optional free **ABR** ABN status check to assist Ops (not auto-approve).
- No malware/virus scanning — mime/type/size + hash + Ops visual review.

---

### 3) Radar.com
**Purpose**
- Geofence entry/exit detection for arrivals and dwell-time automation.
- ETA enhancements and location event quality.

**Core Flows**
- 200m policy-defined geofence around pickup/drop.
- Arrival timestamp starts wait timer.
- Exit timestamp finalizes dwell calculations.

**Operational Notes**
- Server-side event ingestion and reconciliation.
- Handle GPS drift with threshold/anti-bounce logic.

---

### 4) Google Maps Platform (Routes/Geocoding)
**Purpose**
- Address normalization, route sequencing, ETA foundation.
- Multi-stop optimization for hourly jobs.

**Core Flows**
- Validate pickup/drop addresses.
- Route sequencing (up to 4 pickups in hourly mode).
- Distance/time estimates feeding quote guidance.

---

### 5) Twilio Proxy (Optional/Policy-Based)
**Purpose**
- Number masking between participants.

**Core Flows**
- Dynamic masked communication channels per active job.
- Expire masking sessions post job lifecycle.

---

### 6) Monoova (AU NPP/Osko Payout Rail)
**Purpose**
- Low-cost AU payout rails for carrier/admin settlements.

**When to Use**
- High-volume B2B payout disbursement where percentage-based payout rails are less economical.

**Coexistence with Stripe**
- Stripe handles collection and upstream payment events.
- Monoova can handle outbound payout settlement subject to reconciliation controls.

## Cross-Provider Technical Requirements
- Idempotency: required on all payment and state-changing calls.
- Observability: capture request ID, provider response code, latency, and retry count.
- Reconciliation: daily mismatch scan for payment, payout, and status drift.
- Secrets management: provider credentials stored in secure vault with rotation policy.
- Rate limits: client backoff and circuit breaker strategy per provider.

## Compliance and Legal Controls
- Explicit consent and privacy disclosures for IDV and location tracking.
- Data retention policy for KYC artifacts and POD evidence.
- Jurisdiction-aware invoice and tax requirements (AU-first).

## Phase Guidance
- Phase 1: **Stripe Connect**, optional **ABR** (ABN assist), **Valhalla** + **PostGIS** (routing/geo). KYB/KYC = **manual Ops**. No easyAML/Trulioo. No malware scan. Twilio optional.
- Phase 2+: easyAML/Trulioo (or equivalent), malware scanning, Monoova expansion, deeper multi-rail payout orchestration.
