# CLOX Hosting & Infrastructure Blueprint

**Source:** `CLOX Hosting Infrastructure Blueprint.pdf` (3 pages)  
**Subtitle:** Production-Grade Sovereign Architecture & Scaling Economics  
**Related:** [system-design.md](../system-design.md) · [thirdparty-integration.md](../thirdparty-integration.md) · [clox-platform-suite.md](../legal/clox-platform-suite.md)

---

## 1. Executive cost-reduction & optimization strategy

To surpass legacy operations and high-cost digital marketplaces, CLOX leverages a decentralized, automated **4PL digital ecosystem**. The fundamental hosting strategy shifts from elastic, usage-billed premium third-party APIs toward a **Sovereign, High-Efficiency Infrastructure** model combining **AWS Fargate** and **Hetzner**.

By migrating structural data validations, mapping, and optimization calculations onto self-hosted environments and free public data services, CLOX structurally decouples operational processing volume from linear cost increases, dropping variable transaction costs by up to **92%** and maximizing platform margins.

---

## 2. Core hosting & computing architecture

The overarching cloud environment relies on an **AWS-centric** infrastructure complementing **Hetzner** bare-metal/cloud instances for rigorous cost control and predictable scaling.

### Hetzner + AWS Fargate (primary compute)

- **Predictable Scaling:** Flat-rate server instances rather than highly variable API call metrics, diluting structural overhead toward zero per trip as volumes grow.
- **Sovereign Routing Cluster:** Proprietary Geospatial & Routing Engine self-hosted entirely on AWS Fargate or Hetzner.

### Microservices & backend stack

| Stack | Role |
|-------|------|
| **Python (FastAPI / SQLAlchemy)** | Algorithmic spot pricing engine, dynamic fuel surcharge (FSC) indexing, programmatic safety lockout engines |
| **Node.js & Asynchronous WebSockets** | Live spatial telematics streaming; persistent two-way WebSockets for GPS without blocking DB ops at peak |

> **Engineering note:** Phase 1 modular monolith in NestJS/PostgreSQL ([system-design.md](../system-design.md)) can host the same *capabilities*; this blueprint describes target sovereign economics and optional service split (pricing/lockouts in Python, telematics via WebSockets/MQTT).

---

## 3. In-house API cost-reduction playbook

CLOX strategically isolates critical operations in-house to protect unit economics from elastic 3rd-party vendor pricing.

| Operational Axis | Legacy / High-Cost Framework | CLOX Sovereign Low-Cost Alternative |
|------------------|------------------------------|-------------------------------------|
| **Mapping & Matrix Routing** | Google Maps Distance Matrix API (often exceeds $8,000+ AUD/month at scale) | **Self-Hosted Valhalla Engine** on AWS Fargate/Hetzner with free OpenStreetMap (OSM) data. Handles heavy vehicle mass limitations, HazMat bypasses, and multi-stop optimization natively. |
| **Geofencing & Proximity Alerts** | Radar.com Pro Tier (~$600 AUD/month) | **PostgreSQL / PostGIS:** Spatial queries (`ST_Contains`, `ST_DWithin`) for geofencing, free waiting timers, and 20-minute ETA alerts at zero variable cost. |
| **Address Autocomplete** | Google Places Autocomplete API (usage-based) | **Pelias or Nominatim** self-hosted geocoding ingesting free authoritative Australian **G-NAF** (Geocoded National Address File). |
| **Real-Time Telematics** | Premium positioning layers with heavy server-side processing | **EMQX (MQTT Broker):** Offloads polygon calculation vectors to the client device. Streams compact MQTT payloads exclusively at perimeter boundaries to keep server load low. |
| **Corporate KYB Onboarding** | Paid regulatory lookups (e.g. easyAML at $1–$3 per check) for basic ABN validation | **ABR Web Services API:** Cost-free ABN checks via public authentication GUID for active status. easyAML reserved only for tier-2 DVS ID checks. |

---

## 4. Financial infrastructure & telematics guardrails

### Escrow & clearing (“Do Not Touch” zone)

While routing, mapping, and telematics are brought in-house, structural financial ledgers and clearing must remain securely outsourced to maintain **PCI-DSS** compliance and eliminate platform bad debt.

| Provider | Role |
|----------|------|
| **Stripe Connect** | Destination Charges and **100% upfront escrow** holds securely linking capital to unique Job IDs |
| **Monoova NPP & PayTo API** | Direct settlement over Australia’s New Payments Platform. Replaces 1.75%–2.9% card friction with flat **$0.20–$0.50** per automated split sequence (**15% / 10% / 5% / 70%**) |

### WebRTC communication

To eliminate variable cellular communication costs (e.g. Twilio Proxy at ~$1.15 AUD per masked number plus SMS), the architecture recommends **in-app messaging and VoIP** via **WebRTC** over the existing WebSocket layer — enforcing ecosystem retention while driving communication overhead toward zero.

---

## 5. Scaling economics & revenue reinvestment

As the platform scales across Australian corridors, revenue from the Super Admin’s **15%** global infrastructure share must be explicitly prioritized to expand self-hosted **AWS Fargate / Hetzner Valhalla** routing clusters.

Because CLOX pays for **fixed server capacity** rather than variable API hits, structural overhead per trip dilutes toward zero as transaction volumes scale — establishing a unit-economic advantage over competitors burdened by usage-billed middleware.

---

## TPM / Phase alignment notes

| Blueprint claim | Phase 1 docs | Action |
|-----------------|--------------|--------|
| Valhalla + OSM primary routing | Google Routes also specified | ADR: which engine for M6 |
| PostGIS geofencing vs Radar | Radar.com in trip flows | ADR: Radar pilot vs PostGIS |
| Python FastAPI pricing services | NestJS modular monolith | Optional later extract; not required day one |
| Monoova NPP primary settlement | Stripe Connect pilot (G0-6) | Phase 1 Stripe; Monoova later |
| WebRTC replaces Twilio | Twilio Proxy in legal suite | Phase decision |
