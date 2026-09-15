# ADR — Gate 0 Phase 1 Decisions (Locked)

**Status:** Accepted  
**Date:** 2026-09-15  
**Owners:** Product · TPM · Engineering · Finance (GST split base acknowledged)  
**Applies to:** Phase 1 (M0–M12) · Australia  
**Related:** [PHASE-1-IMPLEMENTATION-PLAN.md](../PHASE-1-IMPLEMENTATION-PLAN.md) · [MILESTONES.md](../MILESTONES.md) · [stripe-payment-specification.md](../payments/stripe-payment-specification.md)

---

## Context

Gate 0 decisions must be locked before / with M0 so engineering does not rework payments, geography, mobile, or compliance unlock paths.

---

## Decision table (canonical)

| ID | Topic | Locked choice |
|----|--------|---------------|
| **G0-1** | Payment model | **Model A** — 100% pay on proposal accept (AUD via Stripe). No deposit at publish. |
| **G0-2** | KYB/KYC | **Manual Ops review** only. **No easyAML / Trulioo** in Phase 1. Optional free ABR ABN assist for Ops. |
| **G0-3** | Carrier unlock | **Always manual** — State Master (in-state) or Super. No auto-approve without IDV vendor. |
| **G0-4** | Local BDE compliance | **View + comment + escalate** only. No approve. |
| **G0-5** | Pilot geography | **Victoria (VIC) pilot** first. Hard `enabled_states = [VIC]`. Expand to other AU states later via config — same codebase. National day-one not required. |
| **G0-6** | Payout rail | **Stripe Connect only**. Monoova deferred. |
| **G0-7** | Mobile | **Flutter** — developed by **separate mobile team**. Web team owns `/v1` API contracts + stage integration. Build apps for M8+ (Sender track/approve, Driver execution). |
| **G0-8** | Tariffs | **Versioned DB policy tables**; Super Admin publishes. AUD. |

### Additional locks (same Gate 0 package)

| ID | Topic | Locked choice |
|----|--------|---------------|
| **G0-9** | Frontend apps | **Next.js `web/`** = public pre-launch only (unchanged). **One Vite app** (expand `admin/` → product app) = all logged-in roles: Super, State, Local, Sender, Carrier, Driver web. Prod host: **`app.clox.com.au`**. |
| **G0-10** | Stripe charge pattern | **Separate charges + transfers** (platform charges sender → ledger → Transfer carrier/admins). Not destination-charge-primary. |
| **G0-11** | GST | PaymentIntent = **total inc-GST** cents. Persist `amount_ex_gst`, `gst_amount`, `amount_inc_gst`, rate. Display consistent inc-GST (or ex+GST=total). **Revenue splits (70/15/10/5) apply to gross sender fare charged (inc-GST total)** unless Finance amends in writing. |
| **G0-12** | Vehicle floor | **Full-load only.** Phase 1 marketplace minimum **Ute / 1–2T and above**. **Exclude** motorbike, car/hatchback, satchel courier classes from bid/publish enums. |
| **G0-13** | Sender verification approvers | **Super** (all) + **State Master** (sender’s state). **Local BDE** = view / escalate only. |
| **G0-14** | Routing / geofence | **Valhalla** (routing/TSP) + **PostGIS** (geofence/dwell). Radar deferred. |
| **G0-15** | Doc malware scan | **Deferred.** Mime/size/hash + Ops visual review. |
| **G0-16** | Fleet+ subscriptions | **Out of Phase 1.** Basic marketplace free; job fee 30%. Starter/Growth/Enterprise billing = Phase 2. |
| **G0-17** | Receiver | Mandatory **name + email** on job. Email notifications. POD = driver-device SOG. Not a logged-in role in Phase 1. |
| **G0-18** | Vacant State/Local | Platform operable with **Super only**. Vacant 10%/5% → **HQ holding**. |

---

## VIC pilot rules (G0-5 detail)

- Marketplace publish/broadcast only if `origin_state ∈ enabled_states` (initial: **VIC**).
- Prefer VIC→VIC for early pilot; interstate drop from VIC origin is optional product flag later.
- Seed one VIC State Master seat (may be vacant initially — Super covers) + Local territories as partners join.
- Expansion = enable next state in config + staff State/Local — not a rewrite.

---

## Consequences

- M0 may start with this ADR as signed Gate 0.
- Flutter team must receive OpenAPI + trip/POD contracts before M8.
- Marketing must not promise national coverage, Fleet+ SaaS, Monoova, or easyAML in Phase 1 pilot messaging.
- Finance confirms G0-11 split base (inc-GST gross) or files an addendum.

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Product / Founder | _accepted via project direction 2026-09-15_ | 2026-09-15 |
| Engineering / TPM | Locked in repo | 2026-09-15 |
| Finance (GST split base) | Confirm or amend G0-11 | _pending written confirm_ |
