# Administrative Hierarchy & Revenue Flow

**Source:** `Administrative hirerachy.pdf` · `Consolidated Administrative Hierarchy & Revenue Flow.pdf` (identical)  
**Last updated in source:** 28 April 2026  
**Related:** [BRD.md](../BRD.md) · [global-legal-framework.md](../legal/global-legal-framework.md) · [screen-flows/README.md](../screen-flows/README.md)

---

## 1. Tiered revenue distribution

Revenue splits trigger **automatically on job completion**, attributed by **origin city** of the load.

| Position | Level | Revenue share | Payout cycle | Core responsibility |
|----------|-------|---------------|--------------|---------------------|
| Super Admin (HQ) | Global | **15%** of gross | Continuous | Platform governance, global pricing, API costs, technical support |
| State Master Admin | Regional | **10%** of gross | Fortnightly (4th night) | Regional compliance audit, legislative oversight, sub-admin support |
| Local BDE Admin | Local | **5%** of gross | Fortnightly (4th night) | Sales, local carrier/sender onboarding, relationship management |

**Carrier net:** 70% of gross fare.

### Net admin settlement

Before fortnightly transfer via Monoova:

```
Net Admin Payout = Gross Admin Share − Management Fees − Marketing Costs
```

---

## 2. Sender workflow (RFP model)

1. **Onboarding** — OTP; Business (KYB) or Individual (KYC) via easyAML
2. **Request creation** — Google Maps locations; Per KM or Hourly (4 hr min)
3. **Multi-pickup (hourly only)** — Up to 4 pickup locations; auto-route + NHVR fatigue check (15-min break within 5.5 hr window)
4. **Site access assessment** — Maneuverability, dock profile, clearance (mandatory)
5. **Proposal review** — Driver rating, vehicle rego/RWC, transit insurance
6. **Payment** — 100% upfront via Stripe Connect

---

## 3. Carrier modes

### Basic Mode (free marketplace)

- Compliance gate: ABN, insurances, RWCs verified before access
- Job board shows **net payout (70%)** only
- Must allocate specific vehicle + driver to bid
- Wait-time notifications at pickup/drop

### Fleet+ SaaS (subscription)

| Tier | Capability |
|------|------------|
| Free trial | 14 days |
| Starter / Growth / Enterprise | Profit engine, smart dispatch, maintenance watchdog |

**Profit per vehicle engine (Phase 2):**

- **AC1:** Aggregate completed job fares (70%), fuel logs, driver payroll, variable costs
- **AC2:** Trip-level profit formula (fuel + wages + tolls + maintenance)
- **AC3:** Enterprise — daily depreciation from purchase price / residual
- **AC4:** Flag vehicles with margin < 15% or idle > 40%
- **AC5:** Auto `MAINTENANCE` status if odometer exceeds service interval or RWC expires

---

## 4. Driver safety sequence

| Step | Gate | Detail |
|------|------|--------|
| Gate A | Pre-trip | NHVR checklist (tyres, brakes, lights, fluids) |
| — | Maneuverability preview | Sender site assessment shown before arrival |
| Arrival | Geofence | Radar.com; 30-min free waiting timer |
| Gate B | Mass check | Weight + restraint; discrepancy → Stripe surcharge |
| Start trip | Server lock | Enabled only after mass check; tracking live to sender |
| Fatigue | Manual logbook | No in-app alerts (Phase 1) |
| POD | SOG + photos | Server-locked timestamps |

---

## 5. Fleet registration API (reference)

`POST /v1/fleet/register`

| Field | Type | Tier |
|-------|------|------|
| registration_number | String | Basic |
| vehicle_class | Enum | Basic |
| gvm_gcm_kg | Integer | Basic |
| rwc_expiry_date | Date | Basic |
| cost_per_km_fixed | Decimal | Fleet+ |
| service_interval_km | Integer | Fleet+ |
| fuel_type | Enum | Fleet+ |

---

## 6. Third-party cost estimates (AUD)

| Provider | Function | Est. cost |
|----------|----------|-----------|
| Stripe Connect | Upfront holds, SaaS billing | $2/acc/mo + 2.9% + 30¢/tx |
| easyAML / Trulioo | KYB/KYC | $1–$3/check |
| Radar.com | Geofencing, ETA | Pro ~$600/mo (10k users) |
| Twilio Proxy | Number masking | ~$1.15/number/mo + usage |
| Monoova | NPP admin/carrier payouts | $0.50–$1.50/payout |
| Google Maps | Routing, address validation | Usage-based |

---

## 7. Critical global business rules

1. **4-hour minimum** for local hourly jobs
2. **Chargeable weight:** `max(dead, volumetric)` where volumetric = `(L×W×H cm) / 4000`
3. **Mass lockout:** Block start trip if tare + payload > GVM
4. **Transfer reversal:** Breakdown reassignment triggers Stripe transfer reversal to fund replacement carrier
