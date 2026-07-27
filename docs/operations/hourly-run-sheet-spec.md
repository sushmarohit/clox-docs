# Hourly Run Sheet — Developer Specification

**Source:** `For day hourly basis (minimum 4 hours) must create.pdf`  
**Applies to:** Hourly local jobs (minimum 4 hours, max 4 stops)  
**Related:** [PRD.md](../PRD.md) FR-6 · [driver screen flows](../screen-flows/driver.md) · [technical-operational-specification.md](../product/technical-operational-specification.md)

---

## Purpose

The **Clox Run Sheet** is the legal record of truth for billing, payroll, and NHVR compliance. For hourly bookings, the system must generate a **downloadable PDF** capturing exact driver movements across up to four stops.

**PDF engine:** PDFKit, Puppeteer, or equivalent.

---

## 1. Data requirements

Pull from trip state machine:

### Header

- Driver name
- Transport company name + ABN
- Vehicle registration (rego)
- Date
- Job ID

### Trip summary

- Total duration (billed minimum **4.0 hours**)
- Total distance (first pickup → final drop)
- Site access assessment (from sender)

### Odometer

- **Manual input required** at Stop 1 start and final stop completion
- Cross-check against GPS distance (see rules below)

---

## 2. PDF template structure

| Stop # | Stop type | Address | Arrival | Departure | Dwell/wait | Odometer |
|--------|-----------|---------|---------|-----------|------------|----------|
| 1 | Pickup | … | 08:00 | 08:45 | 45 min | Manual input |
| 2 | Pickup | … | 09:15 | 09:40 | 25 min | GPS sync |
| 3 | Drop-off | … | 10:20 | 11:15 | 55 min | GPS sync |
| 4 | Drop-off | … | 11:45 | 12:30 | 45 min | Final manual input |

### Fatigue & break log (mandatory section)

- Break 1: Start | End | Duration | Location
- Total work time
- Total rest time

### Signatures

- Driver signature (digital capture)
- Final receiver name (Sign-on-Glass)

---

## 3. App flow → run sheet population

```
Shift Start
  → Pre-trip checklist
  → Enter starting odometer

Stop 1 (Pickup)
  → Geofence arrival (Radar)
  → Mass check gate (blocks Start Trip until submitted)
  → Start Load / Finish Load (departure)

Stops 2–4
  → Auto arrival/departure via geofence
  → Break events → Break Log section; pause sender tracking

Final stop
  → Sign-on-Glass
  → Final odometer input

Mark Job Complete
  → Generate Clox Official Run Sheet PDF
  → Email to Sender (with tax invoice) + Transport Company
```

---

## 4. Business rules

### 4-hour floor

If `Final Arrival − Stop 1 Arrival < 4 hours`, PDF must state:

> Total Time: [Actual], **Billed Time: 4.0 Hours (Minimum Engagement)**

### Odometer verification

If `|Manual Odometer Distance − GPS Distance| > 10%` → flag for **Super Admin review**.

### Wait time on run sheet

- Dwell at Stop 1 from geofence arrival
- Sender notified at **30 minutes**
- Dwell **> 60 minutes** at any stop → highlight **RED** on run sheet (detention billing signal)

---

## 5. Acceptance criteria (M10 extension)

- [ ] PDF generated on hourly trip complete
- [ ] All stops have server timestamps
- [ ] 4-hour minimum displayed when applicable
- [ ] Odometer discrepancy flag routes to ops queue
- [ ] Distribution: sender invoice attachment + carrier record copy

---

## TPM note

Run sheet is **not** in original MILESTONES M10 exit criteria — recommend adding as **M10.1** or explicit M9/M10 deliverable for hourly jobs only.
