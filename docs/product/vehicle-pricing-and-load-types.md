# Vehicle Pricing, Selection Flow & Load Types

**Full transcription:** [vehicle-type-average-pricing.md](vehicle-type-average-pricing.md) ← from `Vehicle Type Average Pricing.pdf`  
**Source:** `Clox Freight Forwarding.pdf` / `.docx` / `Vehicle Type Average Pricing.pdf`  
**Currency:** AUD (ex-GST) · Metro & regional averages  
**Related:** [BRD.md](../BRD.md) · [PRD.md](../PRD.md) FR-3 · [technical-operational-specification.md](technical-operational-specification.md) · [app-workflows-by-all-user-roles.md](../workflows/app-workflows-by-all-user-roles.md)

---

## Purpose

Industry-standard AU pricing ranges for vehicle selection, instant estimates, and carrier validation — **guidance, not fixed quotes**. Prices vary by city, fuel, demand, and site access.

---

## 1. Vehicle pricing reference (hourly / per-km)

### Light vehicles (local/express)

| Vehicle | Payload | Per hour | Per km | Notes |
|---------|---------|----------|--------|-------|
| Motorbike/scooter | ≤ 30 kg | $45–70 | $1.20–1.80 | Documents, urgent parcels |
| Car/sedan | 100–200 kg | $50–80 | $1.40–2.00 | ~0.5 m³ |
| Ute (single cab) | 800–1,000 kg | $70–100 | $2.00–3.00 | Tray ~2.4×1.8 m |
| Ute (dual cab) | 700–900 kg | — | — | Site deliveries |

### Vans

| Vehicle | Payload | Per hour | Per km | Pallets |
|---------|---------|----------|--------|---------|
| Small van (SWB) | 800–1,000 kg | $75–95 | $2.20–3.00 | 1 |
| Medium van (MWB) | 1,000–1,200 kg | $85–110 | $2.50–3.50 | 2 |
| Large van (LWB hi-roof) | 1,200–1,500 kg | $95–130 | $2.80–4.00 | 3–4 |

### Small–medium trucks (FLT)

| Vehicle | Payload | Per hour | Per km | Pallets |
|---------|---------|----------|--------|---------|
| 1–2 tonne | 1,000–2,000 kg | $110–150 | $3.50–4.80 | 4–6 |
| 3 tonne | 3,000 kg | $120–170 | $4.00–5.50 | 6–8 |
| 4–6 tonne | 4,000–6,000 kg | $140–200 | $4.50–6.50 | 10–12 |
| 8–10 tonne | 8,000–10,000 kg | $170–240 | $5.50–8.00 | 14–16 |

### Rigid & specialised

| Vehicle | Per hour | Per km | Notes |
|---------|----------|--------|-------|
| Rigid 12–14 pallet | $180–260 | $6.50–9.00 | FMCG, warehouses |
| Tailgate add-on | +$10–25/hr or +$0.30–0.60/km | | No-forklift sites |
| Refrigerated | $200–300 | $7.00–10.00 | Cold chain |
| Flatbed/tray | $160–240 | $6.00–9.00 | Steel, machinery |
| Crane truck (Hiab) | $220–350 | $7.50–12.00 | 1–8 t lift |

### Heavy / linehaul (full load)

| Vehicle | Payload | Per km (long haul) | Per hour (metro) |
|---------|---------|-------------------|------------------|
| Semi-trailer | 22–24 t | $4.00–5.00 | $220–260 |
| B-double | 34–38 t | $5.50–6.50 | $320–380 |
| Road train | up to 120 t | $7.00–10.00+ | Permits required |

### Containers

~28 t payload · $240–300/hr · $4.50–6.00/km · 33 m³

### Smart add-ons

| Add-on | Rate |
|--------|------|
| Waiting time | $80–120/hr |
| After-hours | +15–30% |
| Weekend/public holiday | +25–50% |
| Tolls | Pass-through |
| Minimum charge | 4–6 hours |

---

## 2. App filter dimensions (recommended)

- Vehicle type
- Max weight (kg)
- Pallet count
- Volume (m³)
- Special features (tailgate, reefer, crane)
- Licence class (MR, HR, HC, MC)
- Metro / regional / interstate

---

## 3. Sender vs carrier selection flow

### Sender (requirements owner)

```
Step 1: Shipment details (locations, freight type, weight, dims, pallets, special reqs)
Step 2: System recommends minimum vehicle class (undersized disabled)
Step 3: Optional preferred vehicle type OR "any suitable"
Step 4: See price ranges, ETA, fit indicator (perfect / extra / blocked)
```

**Sender selects requirements — not a specific truck or driver.**

### Carrier (confirmation & liability)

```
Step 5: View job requirements + mandatory features
Step 6: Propose with actual fleet vehicle + driver + licence match
Step 7: System validates size, licence, features
Step 8: Sender accepts → vehicle + driver locked
```

### Validation rules

| Action | Result |
|--------|--------|
| Propose larger vehicle | **Allowed** (price adjusts) |
| Propose smaller vehicle | **Blocked** |
| Same truck on overlapping jobs | Others **auto-expire** on award |

### Liability split

- **Carrier:** Provides confirmed driver and vehicle
- **Sender:** Correct freight details, locations, date/time

---

## 4. Exception handling

### Vehicle breakdown

- Request substitution (≥ original capacity)
- Sender notified instantly
- Penalty per hour on base rate (policy TBD)

### Freight mismatch at pickup

- Carrier may reject or request upgrade in-app
- Evidence: photos + timestamps

---

## 5. Load types (customer selection)

### UI checkboxes

- General Freight
- Dangerous Goods
- Liquid / Bulk Liquid
- Oversize / Over-dimension
- Steel / Metal
- Temperature Controlled
- Machinery / Heavy
- Vehicles / Plant
- Containers
- Timber / Building Materials
- High-Value / Sensitive
- Waste / Recycling

### Smart auto-logic

| If selected | System action |
|-------------|---------------|
| Dangerous Goods | DG-approved carriers only |
| Oversize | Permit warning + flatbed only |
| Liquid | Spill containment check |
| Steel | Chain & restraint confirmation |
| Reefer | Temp range mandatory |
| Container | Wharf access check |

### Legal protection text

> Incorrect load type selection may result in job rejection or additional charges.

---

## 6. Breakdown screen flows

See [technical-operational-specification.md](technical-operational-specification.md) §5 for full driver/carrier/sender/admin screen sequence (Screens 1–11).

---

## TPM — scope note

Source doc includes **light vehicles** (motorbike, car, courier vans). [BRD](../BRD.md) positions Clox as **full-load (FLT/FTL)** marketplace.

**Recommendation:** Phase 1 vehicle enum = **3T+ rigid and above** unless product explicitly expands to FLV. Use pricing table for Super Admin tariff seed data only.
