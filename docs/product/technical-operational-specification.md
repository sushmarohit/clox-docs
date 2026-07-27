# Technical & Operational Specification

**Sources:**

- `Technical and Operational 10 may 2026.pdf`
- `Technical and Operational Audit of the Clox .pdf` / `.docx`

**Status:** Workflow audit + developer logic reference  
**Related:** [p1-functional-specification.md](p1-functional-specification.md) · [screen-flows/README.md](../screen-flows/README.md)

---

## 1. Admin workflow

| Step | Action |
|------|--------|
| Configuration | Set minimum base fares; 30% platform commission |
| Compliance audit | Review uploads; auto-flag expiring RWC/ABN |
| Liquidated damages | Approve/deny late cancellation and detention claims |

### Revenue tiers

Same as [administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md): Super 15%, State 10%, Local 5%.

---

## 2. Sender workflow (detailed)

### Onboarding

- OTP login
- **Business:** ABN/ACN via 3rd-party API
- **Individual:** Driver licence or passport scan

### Job creation sequence

1. Pickup/drop via Google Maps
2. Mode: **Per KM** or **Hourly** (4 hr min; base rate from Super Admin)
3. Freight type: cartons / pallets / machinery / loose
4. Chargeable weight: dead kg + dimensions (L×W×H)
5. Load type checkboxes (see load types doc)
6. Pickup date/time
7. Special requirements: tailgate, forklift, refrigerated, crane, time-critical
8. System vehicle recommendation
9. Pricing: bid ≥ Super Admin floor
10. Publish → broadcast
11. Review proposals (masked carrier info): driver photo/rating, vehicle rego, ETA, insurances
12. Accept + **100% Stripe payment**
13. Track GPS (post mass-check start)
14. Receive POD + tax invoice (GST)

### Load type smart rules

| Selection | System action |
|-----------|---------------|
| Dangerous Goods | DG-approved carriers only; class + weight; manifest if > 1,000 kg |
| Oversize | Permit warning; flatbed only |
| Liquid | Spill containment check |
| Steel | Chain & restraint confirmation |
| Reefer | Temp range mandatory |
| Container | Wharf access check |

### Hourly job logic

| Rule | Implementation |
|------|----------------|
| 4-hour minimum | Auto-round billing (Award 2020) |
| Max 4 locations | Pattern A (3→1) or Pattern B (1→3) |
| Route order | TSP / shortest distance (Google Routes) |
| Fatigue | If shift > 5.25 hr → insert 15-min rest in ETA |
| Wait per stop | 30 min free pickup; 60 min free drop; detention alerts while hourly clock runs |

---

## 3. Carrier workflow

### Compliance gate (pre-access)

Upload and verify: ABN, public liability, transit insurance, RWCs, permits.

### Operations

1. Receive job broadcasts in service area
2. System blocks: undersized vehicle, licence mismatch; warns tight capacity
3. Submit proposal with **specific vehicle + driver** (customer info masked)
4. Display **net payout (70%)** only
5. Conflict handling: same truck on multiple jobs → expire others on award
6. Settlement: withdraw after **7-day clearing** post-POD (audit doc) vs **fortnightly** in BRD — **finance ADR required**

---

## 4. Driver workflow

| # | Step | Notes |
|---|------|-------|
| 1 | Job notification from carrier | |
| 2 | Login | Company credentials |
| 3 | Pre-trip checklist | NHVR gate; last rest period |
| 4 | Manual logbook | No in-app fatigue alerts (Phase 1) |
| 5 | ETA notifications | Auto to all parties |
| 6 | 15-min pre-arrival alert | |
| 7 | Arrival | Wait timer; 30 min → notify all |
| 8 | Start/finish load | |
| 9 | Mass check | Discrepancy → surcharge |
| 10 | Start trip | **Only after mass check** |
| 11 | Taking break | Pauses tracking |
| 12 | Drop alerts | 15 min before; 60 min wait charge notify |
| 13 | Unload | |
| 14 | POD | SOG + photos; geofence timestamp |

### Pre-trip checklist (NHVR-aligned)

**Wheels & tyres:** tread ≥ 1.5 mm, no cuts/bulges, secure nuts  
**Brakes & air:** service/parking hold, no leaks  
**Lights:** headlights, indicators, markers, dashboard warnings clear  
**Engine/fluids:** no leaks; oil/coolant in range  
**Cabin/safety:** windscreen, fire extinguisher, triangles (GVM > 12t), seatbelts  
**Load/couplings:** restraint, coupling engaged  

**Fail any critical item → vehicle lockout.**

### Mass discrepancy flow

1. Driver reports actual > declared + photo
2. System notifies sender with surcharge amount
3. Stripe incremental authorization
4. On success → unlock Start Trip

---

## 5. Breakdown screen flows

### Driver (Screens 1–4)

Active trip → Report Issue → Breakdown details (type, GPS, photo) → Status `Breakdown - In Progress`

### Carrier (Screens 5–6)

Alert → Management options:

- **A:** Assign replacement (internal)
- **B:** Release to marketplace (Stripe transfer reversal)
- **C:** Repair & continue (ETA vs fatigue limits)

### Sender (Screens 7–9)

Notification → Details → Approve replacement or reject (ACL refund rules)

### Admin (Screen 10)

Incident dashboard: force replacement, cancel, waive/apply penalties

### Completion (Screen 11)

Breakdown logged in company performance score

---

## 6. Developer technical logic (consolidated)

| Rule | Specification |
|------|---------------|
| Hourly minimum | Default 4-hour payment |
| Trip state machine | `SafetyCheck → Arrived_Pickup → Loading → Mass_Check → Trip_Started` |
| Tracking | Disabled until `Trip_Started` |
| Fatigue engine (audit) | 1-min increments; notify 15 min before rest — **conflicts with Phase 1 manual logbook** |
| Tax invoicing | Sender name + address required for transactions ≥ $1,000 (ATO) |
| Cubic weight | `(L×W×H cm) / 4000` |
| Timestamps | Server NTP, not device clock |

### Third-party costs (AUD)

See [administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md) §6.

---

## 7. Vehicle classes & pricing reference

Full AU market rate tables and vehicle selection flow: [vehicle-pricing-and-load-types.md](vehicle-pricing-and-load-types.md).

---

## TPM — audit findings vs Phase 1 plan

| Finding | Severity | Recommendation |
|---------|----------|----------------|
| 7-day carrier settlement vs fortnightly admin | Medium | Finance ADR; document in BRD |
| In-app fatigue engine vs manual logbook | High | Phase 1 = manual only per PRD; defer EWD |
| Light vehicles (motorbike, car) in pricing doc | Medium | BRD says FLT/FTL only — exclude from M6 vehicle enum or mark Phase 2 |
| Carrier "propose larger vehicle not allowed" vs "allowed with repricing" | Medium | Align with [Clox Freight Forwarding](vehicle-pricing-and-load-types.md) — larger allowed |
| Monoova "immediate on POD" in HTML vs fortnightly in BRD | High | Marketing vs ops truth — unify messaging |
