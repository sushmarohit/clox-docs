# Clox Run Sheet — Developer Specification

**Source:** `Clox Run Sheet.pdf` (2 pages)  
**Also covered in:** `App Workflows by All User Roles.pdf` § Run Sheet  
**Applies to:** Hourly local jobs (minimum **4 hours**, max **4 stops**)  
**Related:** [hourly-job-related.md](../product/hourly-job-related.md) · [app-workflows-by-all-user-roles.md](../workflows/app-workflows-by-all-user-roles.md) · [hourly-run-sheet-spec.md](hourly-run-sheet-spec.md)

---

## Purpose

To support professional execution of hourly local jobs, the **Clox Run Sheet** is the **legal record of truth** for billing, payroll, and NHVR compliance. For hourly bookings (minimum 4 hours), the system must generate a **downloadable PDF** that captures the driver’s exact movements across the allowed maximum of **four stops**.

**PDF engine:** PDFKit, Puppeteer, or equivalent.

---

## 1. Data requirements (developer specification)

The PDF generator must pull the following from the trip state machine:

### Header data

- Driver Name  
- Transport Company Name + ABN  
- Vehicle Registration (Rego)  
- Date  
- Job ID  

### Trip summary

- Total Duration (billed as **4.0 hours minimum**)  
- Total Distance (first pickup → final drop-off)  
- Site Access Assessment details provided by the sender  

### Odometer logic

- Manual input required at the **start of Stop 1**  
- Manual input required at the **conclusion of the final stop**  

---

## 2. Template structure (PDF layout)

| Stop # | Stop Type | Address (example) | Arrival Time | Departure Time | Dwell/Wait Time | Odometer Reading |
|--------|-----------|-------------------|--------------|----------------|-----------------|------------------|
| 1 | Pickup | 123 Warehouse St, VIC | 08:00 AM | 08:45 AM | 45 mins | **[Manual Input]** |
| 2 | Pickup | 45 Distribution Rd, VIC | 09:15 AM | 09:40 AM | 25 mins | N/A (GPS Sync) |
| 3 | Drop-off | 88 Retail Blvd, VIC | 10:20 AM | 11:15 AM | 55 mins | N/A (GPS Sync) |
| 4 | Drop-off | 10 Final Way, VIC | 11:45 AM | 12:30 PM | 45 mins | **[Final Input]** |

### Mandatory fatigue & break log section

- **Break 1:** Start: \| End: \| Duration: [Mins] \| Location:  
- **Total Work Time:** [HH:MM]  
- **Total Rest Time:** [HH:MM]  

### Signatures

- **Driver Signature:** ____________________ (Digital Capture)  
- **Final Receiver Name:** ____________________ (Sign-on-Glass)  

---

## 3. Integrated hourly flow & PDF generation logic

For hourly “Day Basis” work, the app flow must follow this strict sequence:

### 1. Shift Start (Driver App)

- Complete Pre-Trip Checklist  
- Manual Input: starting Odometer reading  

### 2. Pickup 1 (Stop 1)

- Arrival triggered by **Radar.com** geofence (recorded as Arrival Time)  
- **Mass Check Gate:** Driver verifies load weight; “Start Trip” unlocks only after submit  
- Driver taps “Start Load” and “Finish Load” (Departure Time)  

### 3. Subsequent Stops (2, 3, and 4)

- App auto-captures arrival/departure via geofence  
- If driver triggers a **Break**, live tracking pauses for the sender; time logged in Break Log  

### 4. Final Stop Completion

- Receiver performs Sign-on-Glass (SOG)  
- Manual Input: final Odometer reading  

### 5. PDF Trigger

- On **“Mark Job Complete”**, system bundles timestamps, odometer readings, and SOG photos into the **Clox Official Run Sheet PDF**  
- **Distribution:** Automatically emailed to:
  - **Sender** — attachment to Tax Invoice  
  - **Transport Company** — for records  

---

## 4. Critical business rules

### The 4-Hour Floor

If `Final Arrival Time − Stop 1 Arrival Time < 4 hours`, the PDF summary must explicitly state:

> Total Time: [Actual], Billed Time: 4.0 Hours (Minimum Engagement).

### Odometer verification

Cross-reference manual odometer input against GPS-calculated distance. If discrepancy **> 10%**, flag for **Super Admin** review.

### Wait time calculation

- Dwell at Stop 1 calculated from arrival  
- Notifications to Sender at **30 minutes**  
- If total time at a stop exceeds **60 minutes**, flag on run sheet in **RED** for potential detention billing  

---

## Direct instruction to developer

> I want the run sheet to look as professional as a Tier-1 carrier. It must be a clean PDF that the transport company can use for their tax and the sender can use for their audit. Every stop must have a timestamp and every hourly job must have start/end odometer readings.
