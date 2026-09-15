# CLOX Global Legal Framework — Summary

**Full platform suite transcription:** [clox-platform-suite.md](clox-platform-suite.md) ← from `CLOX PLATFORM SUITE.pdf` (CLOX-LEGAL-MFT-V2.0)  
**Source:** `clox_global_legal_framework.pdf` / `CLOX PLATFORM SUITE.pdf` (CLOX-LEGAL-MFT-V2.0)  
**Entity:** Achieve Global Enterprises Pty Ltd · ABN 48 626 269 387  
**Jurisdiction:** Victoria, Australia  
**Date:** 20 July 2026  
**Classification:** Proprietary & legally binding — **not a substitute for legal counsel**

**Related:** [BRD.md](../BRD.md) · [clox-platform-suite.md](clox-platform-suite.md) · [administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md) · [hosting-infrastructure-blueprint.md](../infrastructure/hosting-infrastructure-blueprint.md)

---

## 1. Master terms — platform governance

All Senders, Transport Companies, Fleet Operators, and Drivers agree to hardcoded compliance guardrails and payment conditions by using the platform.

### 1.1 Revenue split (30% platform fee)

| Tier | Share of gross fare | Responsibility |
|------|---------------------|----------------|
| Super Admin (HQ) | 15% | Global infra, security, payment processing, API costs |
| Regional Master Admin (state/province) | 10% | Regional compliance, carrier verification, local regulation |
| Local BDE Admin (city/suburb) | 5% | Local acquisition, onboarding, relationship management |
| Transport Company | 70% net | Trip execution payout |

Commission attribution is based on **origin city/region** of the load.

### 1.2 Fortnightly admin payout ("4th night")

- Rolling **14-day** calculation cycle
- Disbursement on **4th night** (fortnightly)
- Formula: `Net Admin Share = Gross Admin Share − (Management Fees + Pro-Rata Regional Marketing Deductions)`
- Execution via **Monoova NPP/PayTo** (per legal doc)

### 1.3 Infrastructure cost table (legal doc)

| Layer | Provider | Cost model (AUD) | Scope |
|-------|----------|------------------|-------|
| Routing | Valhalla (Hetzner) | Zero variable | Mass limits, HV exclusions, TSP multi-stop |
| Address lookup | Google Maps | Usage-based (post-$200 credit) | Autocomplete only |
| Identity | ABR Web Services | Free (GUID) | ABN/ACN active status |
| Comms masking | Twilio Proxy | ~$1.15/number/mo + usage | Participant anonymization |
| Settlement | Monoova NPP/PayTo | $0.20–$0.50/tx | Bypass card interchange for payouts |

---

## 2. Transport company agreement

### 2.1 Compliance gate (mandatory before bidding)

Carriers cannot view, bid, or accept jobs until Regional Master Admin unlocks profile.

Required uploads:

- ABN/ACN (ABR real-time verification)
- Public liability insurance: **$10M–$20M** minimum
- Transit/cargo insurance
- RWC per vehicle (expiry → Maintenance Watchdog)

### 2.2 Operating modes

**Basic Mode (free):**

- Job board shows **net payout (70%)** only; gross sender price hidden
- Asset allocation gate: must assign specific vehicle + driver per bid
- Smart conflict handling: overlapping bids on same asset → expire on award

**Fleet+ SaaS (Starter / Growth / Enterprise):**

- Profit engine: `Profit = Net Payout − (Fuel + Wages + Tolls + Maintenance×Distance)`
- Enterprise: asset depreciation in profit calc
- Maintenance Watchdog: auto `MAINTENANCE` lockout on service interval or RWC expiry
- Alerts: profit margin < 15% or idle time > 40%

---

## 3. Shipper (sender) agreement

### 3.1 Pricing modes

| Mode | Structure | Stops |
|------|-----------|-------|
| Per KM (interstate/regional) | Fixed distance pricing | 1 pickup + 1 drop |
| Hourly (local) | Day-basis dedicated vehicle | **4-hour minimum** (Road Transport Award 2020) |

### 3.2 Hourly multi-stop patterns

- **Pattern A:** Up to 3 pickups → 1 final drop
- **Pattern B:** 1 pickup → up to 3 drops
- Max **4 locations** total per hourly booking

### 3.3 Fatigue gate (planning)

If planned duration > **5.25 hours**, system inserts mandatory **15-minute unpaid rest break** into ETA (NHVR-aligned). Sender cannot remove.

### 3.4 Load type auto-rules

| Load type | System action |
|-----------|---------------|
| DG | DG-licensed carriers only; manifest upload if weight > 1,000 kg |
| Oversize | Permit warning; flatbed/tray only |
| Liquid/bulk | Spill containment confirmation |
| Steel/metal | Chain & restraint confirmation |
| Temperature controlled | Reefer + temp range mandatory |
| Containers | Port/wharf access verification |

### 3.5 Site access (mandatory)

- Maneuverability: Tight Street / Standard Industrial / Wide Yard
- Facility: Raised Dock (48–52") / Ground Level / Forklift Required
- Legal disclaimer checkbox required before publish

---

## 4. Driver agreement — safety gates

### Gate A — Pre-trip checklist

Failed safety-critical items → `Vehicle LOCKED`, shift blocked, maintenance work order created.

### Mass verification

`Operating Weight = Tare + Payload` — if exceeds GVM/NHVR limits → hard lockout until corrected.

### Fatigue (hybrid)

- **EWD API** (if carrier enabled): verify remaining hours
- **Manual logbook** (Phase 1 default): no in-app fatigue alerts; **Taking Break** pauses GPS/ETA

### Odometer audit

If `|Manual Odometer − GPS Distance| > 10%` → flag run sheet, route to Super Admin, suspend invoice.

### POD sequence

Receiver name → Sign-on-Glass → mandatory goods photo → tamper-proof PDF with server timestamp.

---

## 5. Privacy & data governance

- **Geofencing:** 200 m radius; arrival timestamps locked for billing
- **Break/shift end:** GPS stream paused
- **Twilio Proxy:** temp numbers for active trip only; torn down on complete

---

## 6. Exception recovery

### Breakdown protocol

1. Driver reports → status `Breakdown - In Progress`
2. Sender notified; escrow moved to neutral holding
3. **Option A:** Internal asset swap (EWD check, sender approve)
4. **Option B:** Market release / cancel → Stripe reversal or Monoova refund per ACL

Breakdowns logged against **Company Performance Score** (affects future bid visibility).

---

## TPM — conflicts with Phase 1 engineering docs

| Topic | Legal doc | Phase 1 docs ([MILESTONES](../MILESTONES.md)) | Action |
|-------|-----------|-----------------------------------------------|--------|
| Payout rail | Monoova NPP primary | Stripe Connect pilot (G0-6) | ADR: Phase 1 Stripe; Monoova M12+ |
| Routing engine | Valhalla self-hosted | Google Routes | ADR: which engine for M6 |
| Carrier approval | Regional Admin manual unlock | Auto + Ops hybrid | Align with G0-3 |
| Fleet+ profit engine | Described as available | Phase 2 per PRD | Keep out of M0–M12 scope |
| EWD integration | Optional API | Manual logbook Phase 1 | Consistent — defer EWD |

**Legal review required** before production terms of service mirror this document verbatim.
