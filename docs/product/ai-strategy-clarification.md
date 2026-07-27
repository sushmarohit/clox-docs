# AI Strategy & Clarification

**Sources:**

- `AI tool for Clox.pdf`
- `Response for UI & AI.pdf`

**Related:** [ai-integration.md](../ai-integration.md) · [p1-functional-specification.md](p1-functional-specification.md)

---

## Executive decision (confirmed)

> **UI first.** Finalize all UI/UX screens for Sender, Transport Company, Driver, and Admin tiers before building backend logic. Lock exact user journeys and safety gates in wireframes first.

---

## What "AI" means in Clox

Clox does **not** rely on a single standalone AI product. Intelligence is embedded in matching algorithms plus selected third-party services.

### Build in-house (Proprietary Auto-Logic Decision Engine)

| Capability | Logic |
|------------|-------|
| Vehicle recommendation | `max(dead weight, L×W×H/4000)`; disable undersized classes |
| Capacity indicators | Traffic-light: perfect fit / extra space / overload risk |
| Conflict handling | Expire overlapping bids when one job awarded |
| Base rate validation | Compare bid to Super Admin price floors |
| Hourly minimum | Auto-round to 4.0 hours |
| Stop sequencing | TSP via routing API (shortest path) |
| Fatigue planning alert | If duration > 5.25 hr → insert 15-min rest in ETA |

**Principle:** No AI override of safety lockouts (mass, licensing, DG eligibility).

### Use third-party APIs (essential infrastructure)

| Provider | AI/ML capability |
|----------|------------------|
| **Radar.com** | Traffic-aware geofencing; isochrone ETA; automated dwell billing |
| **easyAML / Trulioo** | Biometric IDV, liveness, OCR on ABN/licence docs |
| **Stripe Radar** | Fraud detection; Smart Disputes evidence compilation |
| **Google Routes** | Route optimization input to TSP (or Valhalla per legal doc) |

### Phase 2 — Fleet+ Profit Engine

- Aggregate fuel logs, wages, maintenance, net fares
- Real-time profitability score per vehicle
- ML-assisted dispatch ranking (profit/idle/proximity) — **not Phase 1**

---

## Hourly job — developer logic summary

| Feature | Requirement | Implementation |
|---------|-------------|----------------|
| Stop count | Max 4 locations | Internal logic |
| Minimum pay | 4.0 hours | Internal logic |
| Route order | Shortest distance | Internal + Google/Valhalla Routes |
| Safety gate | Block Start Trip until mass check at Stop 1 | Internal logic |
| Fatigue alert | Notify if driving exceeds 5.5 hr context | Internal logic (planning ETA only in Phase 1) |

### Stop patterns

- **Pattern A:** 3 pickups → 1 drop
- **Pattern B:** 1 pickup → 3 drops

### Wait time + hourly clock

- 30 min free pickup / 60 min free drop **per stop** still applies
- Hourly billing clock continues during dwell
- Detention/waiting charge alerts still fire to sender

---

## Alignment with [ai-integration.md](../ai-integration.md)

| ai-integration.md | These sources | Status |
|-------------------|---------------|--------|
| Rules first, ML assists | Auto-Logic engine explicit | Aligned |
| No AI on safety gates | Confirmed in Response doc | Aligned |
| Phase 2 Fleet+ / dispatch ML | Fleet+ in AI tool doc | Phase 2 |

---

## Cost control rationale

Building vehicle recommendation, conflict expiry, and rate floors **in-house** avoids per-call ML API costs at pilot scale. Reserve paid AI/ML for identity verification, geofence intelligence, and payment fraud where build-vs-buy is impractical.
