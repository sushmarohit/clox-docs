# Pre-Launch Registry (Sender & Carrier)

**Source:** `index.html`  
**Status:** Pre-launch marketing capture (no backend integration in repo)  
**Related:** [useronboarding.md](../useronboarding.md) · [admin-partner-eoi-program.md](admin-partner-eoi-program.md)

---

## Purpose

Three-step pre-launch signup for **senders** and **transport companies** before full platform onboarding (M3/M4).

**Tagline:** Freight Broker is Now Code.

---

## Flow overview

```
Step 1: Role selection
  → Sender / Corporate Shipper
  → Carrier / Transport Company

Step 2: Role-specific details

Step 3: Verification & payout infrastructure acknowledgment
  → easyAML · Stripe Connect · Monoova NPP PayTo
```

---

## Sender capture fields

| Field | Notes |
|-------|-------|
| Company legal name | Required |
| ABN | Real-time easyAML / ABR |
| Primary shipping origin | Melbourne, Sydney, Brisbane, Perth, Adelaide |
| Operational model | Local courier, heavy/multi-stop, interstate linehaul |
| Bidding preference | Per-km spot market OR hourly 4-hr min blocks |
| Monthly freight volume | Under $10k / $10–50k / $50k+ |

---

## Carrier capture fields

| Field | Notes |
|-------|-------|
| Fleet entity name | Required |
| ABN | easyAML KYB |
| Operational base state | VIC, NSW, QLD, WA, SA, TAS |
| Fleet composition | Van, 3–8T MR, HR rigid, prime mover/semi/B-double |
| Specialized capabilities | DG, OSOM, refrigerated |
| Compliance authorization | Consent to verify ABN, PL ($10M–$20M), RWC for bidding |

---

## Step 3 — infrastructure cards

User must acknowledge all three before submit:

| Service | Stated purpose |
|---------|----------------|
| easyAML Portal | Business status + driver identity verification |
| Stripe Connect Escrow | 100% upfront before dispatch |
| Monoova NPP PayTo | Real-time admin/carrier splits on POD |

---

## TPM notes

- **No API wiring** in current HTML — data not persisted; M3/M4 will replace with full onboarding flows
- Pre-launch form includes **light commercial / courier** options — conflicts with FLT positioning; filter in production onboarding
- Monoova "on POD" messaging vs fortnightly settlement — unify with [BRD](../BRD.md) before public launch
