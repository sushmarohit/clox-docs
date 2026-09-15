# CLOX Platform Suite — Integrated Legal & Operational Framework

**Source:** `CLOX PLATFORM SUITE.pdf` (11 pages)  
**Document reference:** CLOX-LEGAL-MFT-V2.0  
**Entity:** Achieve Global Enterprises Pty Ltd · ABN 48 626 269 387  
**Jurisdiction:** Victoria, Australia (Domestic & Global Road Freight Operations)  
**Date of execution:** 20 July 2026  
**Platform version:** Functional Specification & Architecture Blueprint v25 / Project Blueprint v2.0  
**Authorized signatory:** Mehulkumar Patel, Director  
**Classification:** Strictly Proprietary & Legally Binding — **not a substitute for legal counsel**

**Related:** [global-legal-framework.md](global-legal-framework.md) · [administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md) · [hosting-infrastructure-blueprint.md](../infrastructure/hosting-infrastructure-blueprint.md) · [app-workflows-by-all-user-roles.md](../workflows/app-workflows-by-all-user-roles.md)

---

## 1. Master Terms & Conditions (Global Platform Governance)

These Master Terms and Conditions (“Agreement”) govern architectural access, transactional logic, and multi-tenant utilization of the Clox digital freight forwarding marketplace and logistics orchestration system (“Platform”), operated by Achieve Global Enterprises Pty Ltd.

By registering an account, deploying software integrations, submitting RFPs, or executing transport workflows, all **Senders**, **Transport Companies**, **Fleet Operators**, and **Drivers** agree to the hardcoded compliance guardrails and payment conditions herein.

### 1.1 Multi-tier administrative hierarchy and commission ledger

Every transaction is subject to a structural **30% Gross Platform Fee** at initial payment settlement. The remaining **70% Net Payout** is guaranteed and routed to the performing Transportation Company.

The 30% fee is distributed across a three-tier ledger:

| Tier | Share of gross | Purpose |
|------|----------------|---------|
| **1.1.1 Super Admin (Clox HQ — Global)** | **15%** | Global DB replication, security monitoring, cross-border liability compliance, international payment processing, third-party API licensing |
| **1.1.2 Regional Master Admin (State/Province)** | **10%** | Loads originating in designated state/province; funded contingent on regional compliance audits, carrier verification gates, localized regulatory management |
| **1.1.3 Local BDE Admin (City/Suburb)** | **5%** | Loads originating in designated suburb/city; concurrent with regional layer as localized acquisition/onboarding commission |

### 1.2 Fortnightly (“4th Night”) admin payout sequence

Regional and local admin disbursements execute on a strict **fortnightly** cycle — specifically the **4th night** sequence after close of the transactional logging period.

```
Net Admin Share = Gross Admin Share − (Calculated Management Fees + Pro-Rata Regional Marketing Deductions)
```

Processing costs, platform support variables, and state marketing fees are subtracted from the gross administrative ledger. Net shares clear through **Monoova NPP & PayTo** over Australia’s New Payments Platform.

### 1.3 Third-party technology infrastructure and operating costs (AUD)

| Infrastructure Layer | Provider / System | Hardcoded Cost (AUD) | Functional Scope & Privacy Logic |
|----------------------|-------------------|----------------------|----------------------------------|
| Core Routing Engine | Valhalla Routing Cluster (Hetzner Hosted) | Zero variable usage cost | Vehicle mass limits, HV exclusions, multi-stop TSP sequences |
| Address Lookup | Google Maps Platform API | Usage-based (post-$200 monthly credit) | Restricted to front-end address autocomplete to minimize premium API overhead |
| Identity Verification | ABR Web Services API | Cost-free public authentication GUID | Real-time corporate entity status and active GST registration during onboarding |
| Participant Anonymization | Twilio Proxy Service | $1.15 per number/month + $0.01 per SMS/min | Temporary voice/SMS bridging without exposing personal data |
| Instant Settlement | Monoova NPP & PayTo API | Flat $0.20–$0.50 per transaction | Bypasses card gateways (1.75%–2.9%) with direct NPP transfers |

---

## 2. Transport Company (Carrier) Agreement & Compliance Gate

Aligned with **NHVR** and **Chain of Responsibility (CoR)**.

### 2.1 Mandatory “Compliance Gate” onboarding

A carrier is **barred** from viewing, bidding, interacting with, or accepting jobs until their complete corporate and asset profile has been **manually reviewed and unlocked by an authorized Regional Master Admin**.

Required uploads / gates:

| Requirement | Detail |
|-------------|--------|
| ABN/ACN | Real-time ABR Web Services; must return **active** status matching legal entity name |
| Public Liability | Certificate of currency; minimum **$10,000,000–$20,000,000 AUD** |
| Transit/Cargo Insurance | Covers transit damage, environmental spills, structural cargo loss |
| RWC per vehicle | Expiration pulled into **Maintenance Watchdog** |

### 2.2 Basic Mode vs Fleet+ SaaS

#### 2.2.1 Basic Mode (free marketplace)

- Job board displays only **Net Payout (70%)**; gross sender price concealed.
- **Asset Allocation Gate:** Cannot submit proposal without assigning specific verified vehicle (VIN) and qualified driver to that time slot.
- **Smart Conflict Handling:** On award, competing bids with overlapping asset/driver (`toverlap ≥ 1 min`) → status `Expired`; push notifications prevent double-booking.

#### 2.2.4 Fleet+ SaaS (Starter / Growth / Enterprise)

Unlocks Cost & Profit Engine:

```
ProfitTrip = Net Payout (70%) − [Fuel Cost + Driver Wages + Tolls + (Maintenance Rate × Distance)]
```

Enterprise tier additionally subtracts daily depreciation from purchase price and target residual lifecycle value.

### 2.3 Maintenance Watchdog lockout

Background cron jobs match odometer metrics (e.g. J1939 CAN-bus) against maintenance intervals and RWC expiration.

When interval exceeded or RWC expired:

```
Vehicle Status → MAINTENANCE [System Lockout Activated]
```

Vehicle blocked from bidding/dispatch until updated certification approved. Alerts if profit margin **< 15%** or idle time **> 40%**.

---

## 3. Shipper (Sender) Agreement & Routing Workflow

Platform is an algorithmic **RFP** engine — not a traditional asset-owning broker.

### 3.1 Job selection modes & award integration

| Mode | Structure |
|------|-----------|
| **Interstate / Regional (Per KM)** | Fixed pricing vs optimized distance; **1 pickup + 1 drop** |
| **Local (Hourly)** | Dedicated vehicle/driver on “Day Basis”; mandatory **4-hour minimum** (Road Transport and Distribution Award 2020) regardless of shorter physical duration |

### 3.2 Hourly multi-pickup & multi-drop

| Pattern | Structure |
|---------|-----------|
| **A — Multi-Pickup** | Max **3** pickups → **1** final drop |
| **B — Multi-Drop** | **1** pickup → max **3** drops |

### 3.3 Auto-route planning & driver fatigue gate

Multi-stop sequencing via localized **TSP** on **Valhalla Routing Cluster**. Before RFP broadcast, system checks planned duration (distance, congestion, loading/unloading offsets).

**NHVR Driver Fatigue Gate:** If planned journey **> 5.25 hours**, platform automatically inserts an unpaid, **non-deletable 15-minute rest break** into ETA. Senders cannot remove/override.

### 3.4 Load specifications and smart safety rules

Senders must input dead weight (kg) and dimensions (L × W × H in meters).

| Load Type | Trigger / Inputs | Hardcoded System Rules |
|-----------|------------------|------------------------|
| Dangerous Goods (DG) | Class 1–9 & absolute weight (kg) | Broadcast only to DG-licensed carriers/assets; mandatory digital manifest upload if weight **> 1,000 kg** |
| Oversize / Over-dimension | Length > 13.6 m OR Width > 2.5 m | Permit warning; bids restricted to flatbed/tray |
| Liquid / Bulk | Drums, IBCs, tanker | Spill containment confirmation before proposal |
| Steel / Heavy Metals | Coils, rebar, plates | Chains & NHVR-compliant restraints confirmation |
| Temperature Controlled | Frozen, chilled, pharma | Reefer only; continuous temperature range log mandatory |

### 3.5 Site access and maneuverability (mandatory)

1. **Maneuverability:** exactly one of Tight Street / Standard Industrial / Wide Yard  
2. **Facility:** exactly one of Raised Loading Dock (48–52") / Ground Level / Forklift Required  

Mandatory disclaimer checkbox before publish:

> Incorrect load type selection, dimension variance, or inaccurate site access profile selection may result in immediate job rejection by the arriving carrier, the execution of automated futile travel fees, or additional driver waiting charges calculated under standard platform rates.

---

## 4. Driver Agreement & Safety-First Sequence

Hardcoded safety gates protect platform, carriers, and users under CoR / Australian transport law.

### 4.1 Gate A — Pre-trip safety walk-around

Mandatory inspection before shift/dispatch. If safety-critical fail (e.g. tread &lt; 1.5 mm, soft brakes, active fluid/engine leaks):

```
Vehicle Status → LOCKED  |  Shift Initialization → BLOCKED
```

Maintenance work order generated for Transport Company; driver app locked against trip initiation. On pass → Maneuverability Preview (turning circle / dock config).

### 4.2 Mass verification logic

```
Calculated Operating Weight = Vehicle Tare Weight + Declared Cargo Payload
```

If exceeds GVM or NHVR axle tolerances → hard lockout; tracking/route/status frozen until weight corrected or cargo legally offloaded.

### 4.3 Fatigue verification and break protocols (hybrid)

| Mode | Behaviour |
|------|-----------|
| **EWD API** (if carrier-enabled) | Query linked EWD for remaining hours under Standard or BFM |
| **Manual paper logbook** | No automated in-app fatigue alerts during transit. **“Taking Break”** pauses GPS telemetry and updates sender ETA |

### 4.4 Odometer discrepancy audits & POD

If:

```
| Manual Odometer Distance − GPS Distance | > 10%
```

→ undeletable **Odometer Discrepancy Flag** on run sheet; route to Super Admin for fraud investigation and invoice suspension.

**POD sequence** (within destination geofence):

1. Receiver legal name (text)
2. Sign-on-Glass (SOG)
3. Mandatory high-resolution photo of offloaded goods

Bundled into cryptographically secure PDF with server-locked, tamper-proof timestamp metadata.

---

## 5. Privacy Policy & Data Governance Framework

Multi-tenant isolation limits exposure while maintaining operational integrity.

### 5.1 Location tracking and edge geofencing

- Continuous background location (iOS CoreLocation / Android Location API)
- **Geofence:** arrival logged when vehicle enters **200-meter** radius; timestamps locked for billing disputes
- **Telemetry anonymization:** GPS paused on “Taking Break” or shift end

### 5.2 Participant communication anonymization (Twilio Proxy)

Temporary virtual numbers mapped for active transit only. On trip **Complete**, proxy torn down; participant communication severed.

---

## 6. Operational Policies & Exception Recovery Flows

### 6.1 Heavy vehicle breakdown sequence

Driver initiates Breakdown Protocol → synchronized across tiers:

1. Asset status → `Breakdown - In Progress`; shipment lifecycle frozen  
2. Sender push notification of mechanical delay  
3. Escrow capital moved to **neutral holding pool**

**Carrier resolution options:**

| Option | Flow |
|--------|------|
| **A — Internal Asset Swap** | New vehicle + compliant driver from same fleet; EWD hours check; sender sees new photo/rating/rego/ETA; must **Approve** or **Cancel** |
| **B — Market Release & Refund** | Job re-released or cancelled; Stripe Transfer Reversal / Monoova Escrow Refund of 100% to sender per ACL major-failure / cancellation rules |

### 6.2 Performance logging and corporate auditing

Every breakdown, mechanical lock, and unauthorized cancellation logs as a negative metric on the carrier’s permanent **Company Performance Score** (Super Admin dashboard), weighting future proposal visibility on the RFP distribution engine.
