# App Workflows by All User Roles

**Source:** `App Workflows by All User Roles.pdf` (18 pages)  
**Related:** [PRD.md](../PRD.md) · [BRD.md](../BRD.md) · [screen-flows/README.md](../screen-flows/README.md) · [hourly-job-related.md](../product/hourly-job-related.md) · [clox-run-sheet.md](../operations/clox-run-sheet.md) · [vehicle-type-average-pricing.md](../product/vehicle-type-average-pricing.md)

---

## A. Admin Workflow

### Global administrative hierarchy & revenue distribution

Clox operates under a three-tier “Command and Control” revenue-sharing model. Commissions are calculated based on the job’s **Origin City/Region**.

| Role Name | Tier | Revenue Share | Core Global Responsibility |
|-----------|------|---------------|----------------------------|
| Super Admin (Clox HQ) | Global/National | **15%** of Gross | Infrastructure governance, global pricing standards, and 3rd party API costs |
| Regional Master Admin | State/Province | **10%** of Gross | Regional compliance, legislative adherence (NHVR/FMCSA), and Master Admin support |
| Local BDE Admin | City/Suburb | **5%** of Gross | Local Business Development, carrier/sender onboarding, and relationship management |

### Admin operational duties

1. **Configuration:** Set minimum base fares and platform commission rates (**30%**).
2. **Compliance Audit:** Review uploaded documents. Automated system flags RWCs and ABNs nearing expiration.
3. **Liquidated Damages:** Review and approve/deny claims for late cancellations or substantial detention.

---

## B. Sender (Customer) Workflow: Business vs. Individual

1. **Onboarding:** Register via OTP login.
   - **Business Branch:** Mandatory ABN/ACN entry; verified via 3rd-party API.
   - **Individual Branch:** Mandatory Driver’s License or Passport scan; verified via 3rd-party API.
2. **Request Creation:** Input pickup/drop locations using the Google Maps Platform.
3. **Job Selection:** Choose **Per KM** (Interstate) or **Hourly** (Local — mandatory minimum **4 hours**). Base rate set by Super Admin.
4. **Multi-Pickup/Dropoff (Hourly Only):** Senders can add up to **four (4)** pickups/locations. The system optimises the route and checks driving time against fatigue-break thresholds.

### Clarification on the “Hourly Job” (4-Hour Min)

For local hourly work, the platform acts as a **“dedicated driver for hire.”**

| Rule | Detail |
|------|--------|
| **4-Hour Rule** | Senders are billed a minimum of 4 hours, even if the task takes 1 hour. Compliance with the Road Transport and Distribution Award 2020. |
| **Stop Limit** | Up to **four (4) locations total** per hourly booking. |
| **Pattern A (Multi-Pickup)** | 3 Pickups → 1 Final Drop-off. |
| **Pattern B (Multi-Drop)** | 1 Pickup → 3 Separate Drop-offs. |

#### Developer logic requirements

1. **Stop Sequencing:** Basic TSP (Travelling Salesman Problem) to sequence up to 4 points efficiently.
2. **Fatigue Logic:** If auto-route planning predicts total shift (including loading/unloading) will exceed **5.25 hours**, insert a mandatory **15-minute unpaid rest break** into the ETA and notify the sender.
3. **Wait Time Integration:** “30-minute free pickup” and “60-minute free drop-off” rules still apply per stop. If a driver is delayed at Stop 2 of 4, the hourly clock continues, but Detention/Waiting Charge alerts must still trigger.

#### Summary table for developer logic

| Feature | Requirement | Internal Logic or API? |
|---------|-------------|------------------------|
| Stop Count | Max 4 locations (including start/end) | Internal Logic |
| Minimum Pay | Auto-round any local job to 4.0 hours | Internal Logic |
| Route Order | Auto-sequence by shortest distance | Internal Logic (via Google Routes) |
| Safety Gate | Block “Start Trip” until Mass Check at Stop 1 | Internal Logic |
| Fatigue Alert | Notify users if driving exceeds 5.5 hours | Internal Logic (NHVR Standard) |

5. **Site Access & Maneuverability Assessment (Mandatory):**
   - **Maneuverability:** Tight Street, Standard Industrial, or Wide Yard.
   - **Facility Specs:** Raised Loading Dock (48–52"), Ground Level, or Forklift Required.

6. **Special Load Adders (Public)**

| Feature | App Rate |
|---------|----------|
| Tailgate | +$20–$30/hr OR +$0.60/km |
| Refrigerated | +25–35% |
| Crane (Hiab) | $280–$350/hr (4-hr min) |
| After-hours | +20–30% |
| Weekend / PH | +30–50% |

7. **Chargeable Weight Input:** Mandatory dead weight (kg) and dimensions (L × W × H).

8. **Choose load type** (simple checkboxes) — see load types section below.

9. **Pickup date and time** on calendars.

10. **Pricing / bid:** Submit a bid. Bid amount cannot be lower than the minimum base price set by Super Admin.

11. **Post** the proposal job broadcast online.

12. **Proposal Review:** Review from transport company side. Display (masking transport company info):
    - Driver: profile photo, rating, years of experience
    - Vehicle: type and registration
    - Operational: ETA to pickup
    - Insurances and certificates

13. **100% Upfront Payment:** Accept proposal and pay 100% via Stripe Connect.

14. **Active Monitoring:** Real-time GPS tracking on integrated map.

15. **Finalisation:** Automatically receive digital POD and Tax Invoice including GST upon trip completion.

---

### Load types (customer selection)

#### General Freight

- Cartons, palletised goods, retail stock, FMCG, general merchandise  
- No special handling required

#### Dangerous Goods

- Flammable liquids/solids, corrosives, toxics, aerosols, batteries (lithium, industrial), gas cylinders, chemicals  
- **Requires:** DG-licensed carrier; correct placards & paperwork  
- If DG: must select **Class** and weight; if weight **> 1,000 kg**, must upload DG Document

#### Liquid / Bulk Liquid

- Drums, IBCs, tanker loads, oils, paints, food-grade liquids  
- May require spill containment; food-grade certification

#### Oversize / Over-dimension

- Long steel, pipes, beams, structural steel, precast concrete, large equipment  
- May require flatbed/extendable trailer, permits, pilot/escort vehicles

#### Steel / Metal

- Steel coils, plates, rebar, aluminium, metal sheets  
- Requires chains & restraints; NHVR load restraint compliance

#### Temperature Controlled

- Chilled, frozen, perishable food, pharmaceuticals  
- Requires refrigerated vehicle

#### Machinery / Heavy & Vehicles / Plant

- Machinery, engines, industrial/mining equipment (weight-critical; higher-capacity vehicles)  
- Forklifts, excavators, skid steers, cars, tractors, agricultural equipment  
- Often requires ramps or low loader

#### Containers (Port / Wharf)

- 20ft, 40ft, empty, reefer  
- Wharf access & time slots apply

#### Timber / Building Materials

- Timber packs, plywood, gyprock, bricks, roofing materials

#### High-Value / Sensitive

- Electronics, medical equipment, fragile machinery, controlled goods  
- May require insurance confirmation

#### Waste / Recycling

- Industrial/construction waste, recyclables  
- EPA compliance may apply

### Recommended app UI — “What are you transporting?”

- ☐ General Freight  
- ☐ Dangerous Goods  
- ☐ Liquid / Bulk Liquid  
- ☐ Oversized / Over-dimensioned  
- ☐ Steel / Metal  
- ☐ Temperature Controlled  
- ☐ Machinery / Heavy  
- ☐ Vehicles / Plant  
- ☐ Containers  
- ☐ Timber / Building Materials  
- ☐ High-Value / Sensitive  
- ☐ Waste / Recycling  

### Smart rules (auto-logic)

| If customer selects | System action |
|---------------------|---------------|
| Dangerous Goods | Only DG-approved carriers |
| Oversize | Permit warning + flatbed only |
| Liquid | Spill containment check |
| Steel | Chain & restraint confirmation |
| Reefer | Temp range mandatory |
| Container | Wharf access check |

### Legal protection text (use this)

> Incorrect load type selection may result in job rejection or additional charges.

---

## C. Transportation Company Workflow: Basic vs. Fleet Management

Access is locked behind a mandatory **compliance gate**.

### A. Basic Mode

1. **Pre-Registration Compliance Gate:** Mandatory upload of ABN/ACN, Public Liability, and Transit/Cargo insurance — verified via 3rd-party API.
2. **Fleet Registration:** Add vehicles with tare weight, GVM/GCM, and upload Roadworthy Certificates (RWC) — verified via 3rd-party API.
3. Upload all compliance documents, insurances, and permits.
4. **Receive Jobs Broadcast:** Real-time notifications for new freight requests in the carrier’s service area.
5. **Proposal Acceptance and Submission** (masking customer info):
   - Assign a specific verified vehicle and driver to the load.
   - App displays **Net Payout (70%)** to the carrier, not the gross fare.
6. **Total Balance:** up to date.
7. **Settlement:** Withdraw 70% payout after the **7-day clearing period**.

### B. Fleet Management Mode (Fleet+ SaaS Subscription)

#### Subscription & setup

1. Compliance Gate: ABN, Public Liability ($10M–$20M), Transit Insurance, RWCs.
2. **Fleet+ Tiers:** Free Trial (14 days), Starter, Growth, or Enterprise.
3. **Vehicle Profiles:** Fuel type, service schedule, custom Cost Profile ($/km or $/hr).

#### Smart dispatching & analytics

- Job board auto-filters by vehicle class and specialised permits (e.g. DG).
- **Smart Allocation:** Suggest closest, most profitable, or least idle vehicle for accepted RFP.
- **Profit Dashboard:** Fleet utilisation % and revenue per truck.

#### “Profit per Vehicle” engine — acceptance criteria

| AC | Requirement |
|----|-------------|
| **AC1** | Aggregate: Completed Job Fares (70% Net), Fuel Log Entries (Manual/API), Driver Payroll (Shift time vs Grade rate), Variable Costs (Tolls/Maintenance) |
| **AC2** | Trip-level profit calculation formula |
| **AC3** | Enterprise: subtract daily Asset Depreciation from purchase price and target residual |
| **AC4** | Flag vehicles with Profit Margin **< 15%** or Idle Time **> 40%** |
| **AC5** | Maintenance Watchdog: auto-status vehicle to `MAINTENANCE` and block bidding if odometer exceeds service interval or RWC expires |
| **AC6** | Auto-generating run-sheet for multi pickup/dropoff for all users |

---

## D. Driver Workflow

Received a notification of a job sent by a transport company.

1. **Authentication:** Secure login via company-provided credentials.
2. **Pre-Trip Checklist:** Mandatory NHVR safety gate (tyres, brakes, lights, fluids, and “Last Rest Period” entry). See **#A** below.
3. **Maneuverability Preview:** Site Access Assessment (turning circle / dock height) from sender before arrival.
4. **Manual Logbook:** Driver manages rest breaks via paper diary; **no in-app fatigue alerts** in this version.
5. **Auto Pre Alert:** ETA notification **15 minutes** before reaching destination.
6. **Arrive:** Auto notification to all users (*start time calculation based on fleet loading/offloading window set by Super Admin*). Waiting charge notifications **30 minutes** after arrival.
7. **Start Loading/Unloading:** Auto notification to all users.
8. **Pickup Mass Check:** Inspect load; secure with straps/chains. Tap “Report Discrepancy” if exceeds declaration → automated surcharge to sender (including collecting required documents).
9. **Start Trip:** Enabled **ONLY** after Mass Check submitted.
10. **Transit Lock:** Tracking goes live to all users after Start Trip.
11. **Taking a Break:** Notification to all users.
12. **Auto Pre Alert:** 15 minutes before destination; waiting charge notifications **60 minutes** after start of waiting at drop.
13. **Start unloading/Loading:** Auto notification to all users.
14. **POD Capture:** Geofence triggers arrival timestamp. Receiver SOG + mandatory documents + goods photos (server-locked timestamps).

---

## Truck Breakdown — Consolidated App Screen Flow

### Driver App

| Screen | Content |
|--------|---------|
| 1 Active Trip | Map, ETA, ⚠️ Report Issue |
| 2 Report Issue | Radio: Truck Breakdown, Accident, Traffic, Other |
| 3 Details | Dropdown (Engine, Tyre, etc.), GPS, Odometer, mandatory photo |
| 4 Status | `Breakdown – In Progress`; mandatory Photo/GPS |

### Transport Company

| Screen | Content |
|--------|---------|
| 5 Alert | Instant dashboard: Trip ID + Vehicle Rego |
| 6 Management | **A** Assign Replacement (internal) · **B** Release to Marketplace (Stripe Transfer Reversal) · **C** Repair & Continue (ETA vs fatigue limits) |

### Sender App

| Screen | Content |
|--------|---------|
| 7 Notification | Push of delay |
| 8 Details | Location/status; if replaced: new driver pic, rating, vehicle, rego, ETA. Approve or Cancel (ACL refund rules) |
| 9 Outcome | Approve / reject / refund if delay exceeds ACL “Major Failure” thresholds |

### Admin & completion

| Screen | Content |
|--------|---------|
| 10 Admin Monitoring | High-level view of all incidents |
| 11 Final Trip Completion | Breakdown recorded in Company Performance Score |

---

## #A. Essential Pre-Trip Checklist

### Wheels & Tyres

- Tread depth: minimum **1.5 mm** across entire tread
- No deep cuts, bulges, exposed cords, or mismatched sizes
- Missing/loose wheel nuts; rim movement (rust streaks / fretting dust)

### Brakes & Air Systems

- Service and parking brakes hold securely
- Audible air leaks; pressure builds in normal timeframes
- Hoses, lines, couplings intact

### Lights & Electrical

- Headlights (high/low), indicators, hazards, brake lights
- Clearance, number plate lights, reflectors clean/functional
- Warning lights extinguish after start-up

### Engine & Fluid Levels

- Fresh oil/fuel/coolant/hydraulic leaks under vehicle
- Oil and coolant in range
- Excessive smoke, noise, or exhaust leaks

### Cabin & Safety Equipment

- Clean windscreen/mirrors; no view-impairing cracks
- Fire extinguisher (in-date, secure) and **three warning triangles** (mandatory for GVM over **12 tonnes**)
- Seatbelts functional

### Load & Couplings

- Load stable, distributed, secured with straps/chains
- Turntable or pin engaged and locked

---

## Mass Discrepancy Flow

1. Driver arrives; weight higher than declared.
2. Tap “Report Discrepancy”; enter actual weight + photo evidence.
3. Notify Sender: additional charge of $X required.
4. Stripe Incremental Authorisation.
5. On payment success → “Start Trip” unlocked.

---

## Essential Technical Logic for Developers

1. **Labour Compliance:** Hourly engine defaults to **4-hour minimum** (Road Transport and Distribution Award 2020).
2. **State Machine:** `SafetyCheck → Arrived_at_Pickup → Loading → Mass_Check_Submitted → Trip_Started`. Live tracking disabled until `Trip_Started`.
3. **Fatigue Engine:** In-house EWD must record time in **1-minute increments**; broadcast **15 minutes** before a legal rest break is required.  
   > **TPM note:** Driver section above states Phase-1 manual logbook with no in-app fatigue alerts — align with Gate 0 / Phase plan before implementing EWD automation.
4. **Taxation:** Auto-invoicing must include Sender Name and Address for any transaction **≥ $1,000** (ATO compliance).
5. **Cubic Formula:** Chargeable Weight = `(L × W × H in cm) / 4,000`.

### Consolidated 3rd-party costs (AUD)

| Provider | Cost |
|----------|------|
| Stripe Connect | $2.00/acc/mo + 2.9% + 30¢ per transaction |
| easyAML (KYB/KYC) | $1.00–$3.00 per verification |
| Radar.com (Geofencing) | Free tier; Pro ≈ $600/mo (up to 10k users) |
| Twilio Proxy | ≈ $1.15/local number/mo + usage |
| Monoova (NPP/Osko) | ≈ $0.50–$1.50 per payout |

---

## Run sheet (summary)

Full developer specification: [clox-run-sheet.md](../operations/clox-run-sheet.md).

Key points from this PDF:

- PDF generator (PDFKit / Puppeteer) pulls header, trip summary, odometer from trip state machine.
- Max **4 stops**; start/end odometer manual; intermediate GPS sync.
- Fatigue & break log + digital signatures.
- **4-hour floor** on billed time; **>10%** odometer vs GPS → Super Admin flag; wait >60 min flagged RED for detention.
