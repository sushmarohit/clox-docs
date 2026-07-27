# UI Base Plan

**Source:** `UI base plan.pdf`  
**Design principles:** Safety-first architecture; high-contrast for drivers; logic gates lock features until compliance met  
**Related:** [screen-flows/README.md](../screen-flows/README.md) · [ui-base-plan source alignment](../sources/README.md)

---

## Design tokens (from screen-flows + UI plan)

| Token | Spec |
|-------|------|
| Primary CTA | Full-width, bottom-fixed (mobile) |
| Status colors | Green = verified/safe; Yellow = warning/expiring; Red = locked/failed |
| Progress | Step dots on multi-step flows |
| Mobile nav | Home · Track · Approvals · Account |
| Timestamps | **Server NTP** — never device clock for POD/arrival |

---

## 1. Sender UI

**Objective:** Guided RFP creation from complex freight specs.

| Screen | Content |
|--------|---------|
| Onboarding entry | Business vs Individual toggle; ABN or ID camera scan |
| Quick-Post (1/3) | Per KM vs Hourly; multi-pickup widget (max 4); calendar scheduling |
| Load & site (2/3) | Load type checkboxes; DG manifest if > 1,000 kg; maneuverability + dock dropdowns |
| Budget & proposals (3/3) | Budget floor validation; side-by-side proposal cards (driver, vehicle, ETA) |
| Active tracking | Live map (post mass-check only); 30-min wait countdown |

### Hardcoded rules

- **4,000 divisor** on dimension input screen
- Undersized vehicles disabled; overload = red/blocked

---

## 2. Transport company UI

**Objective:** Fleet utilization + net profit visibility.

| Screen | Content |
|--------|---------|
| Compliance vault | ABN, PL, transit, RWC badges — dashboard **locked** if any red |
| Smart job board | **Net 70%** per card; filters by class, region, permits |
| RFP submission | Bidding disabled until truck + driver selected; site suitability prominent |
| Fleet+ analytics | Profit per vehicle; maintenance watchdog distance-to-service |
| Financial wallet | Pending vs available; withdraw (7 days post-POD per audit doc) |

---

## 3. Driver UI (mobile-first)

**Objective:** Hands-free operation; strict safety gates.

| Screen | Content |
|--------|---------|
| Shift / task view | Pickup ETA; site access instructions |
| Gate A — Pre-trip | Interactive checklist; fitness declaration (7+ hr rest) |
| Pickup + Gate B | Mass form; Report Discrepancy; **START TRIP greyed until mass submitted** |
| Transit | Large ETA; navigation toggle; Taking Break |
| POD | SOG pad; mandatory offload photo |

---

## 4. Admin UI (Super / State / Local)

| Tier | Key screens |
|------|-------------|
| Super Admin | Global pricing configurator; commission/marketing fee sliders; national compliance |
| State Master | Regional compliance audit; RWC/insurance expiry alerts |
| Local BDE | Onboarding leaderboard; net commission tracker (4th night cycle) |

---

## 5. Consolidated UX logic rules

| Rule | Implementation |
|------|----------------|
| 4,000 volumetric | Hardcoded on sender load screen |
| Color semantics | Green/Yellow/Red as above |
| Gated actions | Payment, trip start, bidding — server state only |
| DG manifest | File picker when DG + weight > 1,000 kg |

---

## TPM — UI delivery sequence

Per [Response for UI & AI](ai-strategy-clarification.md):

1. **Finalize all role UI/UX first** (Sender, Carrier, Driver, Admin)
2. Lock safety gate placements in wireframes
3. Then implement backend against frozen journeys

Maps to milestones: design tokens in **M0**; role flows in **M3–M11** per [screen-flow checklist](../MILESTONES.md#6-screen-flow-coverage-checklist).
