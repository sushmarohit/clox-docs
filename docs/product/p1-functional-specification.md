# P1 Functional Specification & System Architecture

**Source:** `P1 Functional Specification & System Architecture.pdf`  
**Status:** Primary functional/architecture blueprint (supersedes scattered workflow PDFs where conflicts exist)  
**Related:** [system-design.md](../system-design.md) · [PRD.md](../PRD.md) · [global-legal-framework.md](../legal/global-legal-framework.md)

---

## Executive summary

Clox is a **compliance-first freight marketplace** operating under a **three-tier admin hierarchy** with automated revenue distribution. Senders publish **RFPs** (not direct truck booking); compliant carriers bid; senders pay 100% upfront; drivers execute **safety-gated** trips with geofence billing and digital POD.

**Platform operator:** Achieve Global Enterprises Pty Ltd (Victoria, AU).

---

## Part I — Admin hierarchy & money

### Commission model

| Recipient | % of gross fare |
|-----------|-----------------|
| Super Admin (HQ) | 15% |
| State Master Admin | 10% |
| Local BDE Admin | 5% |
| Transport company (net) | 70% |

- Attribution: **origin state/city** of load
- Admin payout: rolling **14 days**, disbursed **4th night** (fortnightly)
- Deductions: management fees + marketing costs before net admin transfer
- Rail (per P1/legal): **Monoova NPP/Osko**

---

## Part II — Identity & compliance gate

### Multi-tenant isolation

Architecture supports regional data isolation (GDPR, Privacy Act) with worldwide deployment capability.

### Sender onboarding paths

| Path | Verification |
|------|--------------|
| Business | ABN/ACN → easyAML/Trulioo → ABR active status |
| Individual | Photo ID → DVS cross-reference |

### Carrier compliance gate

**No bid/access until Regional Admin unlocks.**

Required:

1. ABN/ACN (real-time)
2. Public liability $10M–$20M
3. Transit/cargo insurance
4. RWC per vehicle → Maintenance Watchdog expiry tracking

---

## Part III — Sender RFP workflow

### Job modes

| Mode | Pricing | Stops |
|------|---------|-------|
| Per KM | Interstate/regional fixed | 1 pickup + 1 drop |
| Hourly | 4-hour minimum (Award 2020) | Multi-stop patterns below |

### Hourly multi-stop

- **Pattern A:** Max 3 pickups → 1 drop
- **Pattern B:** 1 pickup → max 3 drops

### Route & fatigue

- Auto-sequence via **TSP** (Google Routes API in P1; Valhalla in legal doc)
- If planned duration **> 5.25 hours** → insert **15-min unpaid rest** in ETA (NHVR)
- Sender cannot override rest break

### Load types & auto-rules

See [vehicle-pricing-and-load-types.md](vehicle-pricing-and-load-types.md) for full matrix.

### Site access (mandatory before publish)

- Maneuverability: Tight / Standard / Wide
- Facility: Raised dock / Ground / Forklift required
- Legal disclaimer checkbox

---

## Part IV — Carrier: Basic vs Fleet+

### Basic Mode

- Net payout (70%) display only
- Asset allocation gate on every bid
- Smart conflict: overlapping vehicle bids expire on award

### Fleet+ SaaS

| Feature | Detail |
|---------|--------|
| Profit formula | `Net − (Fuel + Wages + Tolls + Maint×Distance)` |
| Enterprise depreciation | Daily asset depreciation in profit calc |
| Watchdogs | Margin < 15% or idle > 40% flagged |
| Maintenance lockout | `MAINTENANCE` status blocks bidding |

---

## Part V — Driver safety sequence

```
Pre-trip checklist (Gate A)
  → Fail any critical item → vehicle LOCKED

Arrival at pickup (geofence)
  → 30-min free wait timer

Mass check (Gate B)
  → Discrepancy → surcharge workflow → block Start Trip

Start Trip (server-gated)
  → Tracking enabled for sender

Transit → Drop geofence → POD (SOG + photos + server timestamp)
```

### Fatigue (Phase 1)

- Manual paper logbook
- **Taking Break** pauses GPS/ETA (no HVNL adjudication in-app)
- Optional EWD API query (carrier-enabled, Phase 2)

### Odometer fraud check

`|Manual − GPS| > 10%` → Super Admin flag, invoice hold

---

## Part VI — Breakdown & recovery

1. Driver → Report Issue → `Breakdown - In Progress`
2. Escrow to neutral holding
3. Carrier: **Replace asset** (sender approve) OR **Release/cancel** (Stripe reversal)
4. Performance score impact on carrier ranking

---

## Part VII — Technical infrastructure (P1 cost table)

| Provider | Est. AUD cost |
|----------|---------------|
| Stripe Connect | $2/acc/mo + 2.9% + 30¢ |
| easyAML/Trulioo | $1–$3/verification |
| Radar.com | ~$600/mo Pro |
| Twilio Proxy | ~$1.15/number/mo |
| Monoova | $0.50–$1.50/payout |
| Google Maps | Usage-based |

**Note:** Legal framework also specifies **Valhalla** on Hetzner for routing (zero variable) — **architecture decision required** (G0 ADR).

---

## Part VIII — API reference (illustrative)

| Endpoint | Purpose |
|----------|---------|
| `POST /v1/fleet/register` | Vehicle onboarding (Basic + Fleet+ fields) |
| `POST /v1/jobs` | Create/publish RFP |
| `POST /v1/jobs/:id/accept` | Accept proposal + payment |
| `POST /v1/trips/:id/safety-check` | Gate A |
| `POST /v1/trips/:id/mass-check` | Gate B |
| `POST /v1/trips/:id/start` | Server-gated start |
| `POST /v1/trips/:id/pod` | POD multipart upload |
| `POST /internal/stripe/webhook` | Payment events |
| `POST /internal/radar/webhook` | Geofence events |

---

## TPM — alignment with existing repo docs

| Area | P1 spec | Existing docs | Resolution |
|------|---------|---------------|------------|
| Payment model | 100% on accept | Model A in system-design | Aligned |
| Routing | Google Routes + TSP | Google in thirdparty-integration | ADR for Valhalla |
| Payouts | Monoova primary | Stripe Connect Phase 1 pilot | Defer Monoova to M12+ |
| Fleet+ | Detailed in P1 | Phase 2 in PRD | Keep out of M0–M12 |
| Hourly stops | 4 locations, 2 patterns | Up to 4 pickups in BRD | Align BRD to Pattern A/B |
| Carrier unlock | Regional Admin manual | Auto + Ops hybrid | G0-3 decision |

---

## Open items from P1 (engineering spikes)

- [ ] Full relational schema (system-design §3-C TODO)
- [ ] REST API conventions catalog (§3-D TODO)
- [ ] Valhalla vs Google Routes for TSP
- [ ] Monoova vs Stripe Connect settlement sequencing
- [ ] EWD API integration scope
