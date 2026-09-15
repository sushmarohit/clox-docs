# Hourly Job Related — UI, AI Clarification & Developer Logic

**Source:** `Hourly Job related.pdf` (2 pages)  
**Related:** [app-workflows-by-all-user-roles.md](../workflows/app-workflows-by-all-user-roles.md) · [clox-run-sheet.md](../operations/clox-run-sheet.md) · [ai-strategy-clarification.md](ai-strategy-clarification.md) · [fatigue-work-and-rest-requirements.md](../compliance/fatigue-work-and-rest-requirements.md)

---

## Purpose

Technical clarification preserving **Safety-First** logic while addressing cost and multi-stop sequencing concerns. Suitable reply framing for product/engineering teams.

---

## Part 1 — Response regarding UI & AI

### 1. UI-first approach

> Confirmed. We will finalize all UI/UX screens for the Sender, Transport Company, Driver, and Admin tiers first. This will allow us to lock in the exact user journey and “Safety Gates” before the backend logic is built.

### 2. Clarification on AI vs internal logic

What Clox blueprints call “AI” is primarily a **Proprietary Auto-Logic Decision Engine**. Build in-house (to save cost) for:

| Capability | Approach |
|------------|----------|
| **Vehicle Recommendations** | Internal code: higher of Dead vs Volumetric weight `(L × W × H / 4,000)` |
| **Asset Allocation & Conflict Handling** | Internal logic to expire duplicate/overlapping bids |
| **Base Rate Validation** | Internal DB checks against Super Admin price floors |

Use third-party APIs only for essential infrastructure too complex to build in-house, e.g.:

- **Stripe** — escrow  
- **Valhalla + PostGIS** — routing / geofencing (per Phase 1 ADR)  

**Phase 1:** government ID / business KYB checks are **manual Ops review** (no easyAML).

---

## Part 2 — Clarification on the “Hourly Job” (4-Hour Min)

For local hourly work, the platform acts as a **“dedicated driver for hire.”**

### Workflow rules

| Rule | Detail |
|------|--------|
| **4-Hour Rule** | Senders billed minimum **4 hours**, even if task takes 1 hour. Compliance with **Road Transport and Distribution Award 2020**. |
| **Stop Limit** | Up to **four (4) locations total** per hourly booking. |
| **Pattern A (Multi-Pickup)** | 3 Pickups → 1 Final Drop-off |
| **Pattern B (Multi-Drop)** | 1 Pickup → 3 Separate Drop-offs |

### Developer logic requirements

1. **Stop Sequencing:** Basic **TSP** (Traveling Salesman Problem) to sequence ≤4 points efficiently.
2. **Fatigue Logic:** If auto-route planning predicts total shift (including loading/unloading) **> 5.25 hours**, insert mandatory **15-minute unpaid rest break** into ETA and notify sender.
3. **Wait Time Integration:** “30-minute free pickup” and “60-minute free drop-off” still apply per stop. Delay at Stop 2 of 4: hourly clock continues, but Detention/Waiting Charge alerts must still fire.

---

## Summary table for developer logic

| Feature | Requirement | Internal Logic or API? |
|---------|-------------|------------------------|
| Stop Count | Max 4 locations (including start/end) | Internal Logic |
| Minimum Pay | Auto-round any local job to **4.0 hours** | Internal Logic |
| Route Order | Auto-sequence by shortest distance | Internal Logic (via Google Routes) |
| Safety Gate | Block “Start Trip” until Mass Check at Stop 1 | Internal Logic |
| Fatigue Alert | Notify users if driving exceeds **5.5 hours** | Internal Logic (NHVR Standard) |

---

## Direct instruction to developer

> The hourly booking is designed for a dedicated truck “for the day.” The user might pick up from 3 warehouses and drop at 1, or pick up from 1 and drop at 3 stores. The system just needs to ensure the driver doesn’t exceed legal hours and that we bill the 4-hour minimum.
