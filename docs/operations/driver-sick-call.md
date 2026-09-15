# Driver Sick Call / Unavailability — Automated Exception Loop

**Source:** `Driver sick call.pdf` (2 pages)  
**Related:** [app-workflows-by-all-user-roles.md](../workflows/app-workflows-by-all-user-roles.md) (breakdown flows) · [clox-platform-suite.md](../legal/clox-platform-suite.md) §6 · [system-design.md](../system-design.md)

---

## Goal

Achieve a fully automated exception management system for Clox by transitioning from manual dispatcher intervention to a **“Control Loop”** architecture. The system detects, evaluates, and resolves driver unavailability **without human input** whenever possible.

---

## 1. The Automated Exception Loop

### Step A — In-App “Exception” Trigger

When a driver reports they are unavailable, they must use a structured **Status Update** / **Breakdown** menu in the driver app — not informal text messages.

System-readable **reason codes** examples:

- Vehicle Issue  
- Personal Emergency  
- Not Starting Shift  

### Step B — Automatic “Force-Offline” & Audit

Upon selecting **Unavailable**, the system must immediately toggle the driver to **Inactive**. This prevents further job assignment until the driver completes a **Re-verification** / **Ready for Duty** check.

### Step C — Intelligent Re-Optimization

Trigger a re-optimization algorithm that searches for the next best-matched driver based on:

| Criterion | Detail |
|-----------|--------|
| **Proximity** | GPS location relative to pickup |
| **Capacity / Skills** | Vehicle type and service requirements |
| **Availability** | Current shift status and remaining hours |

### Step D — Automated Stakeholder Updates

| Stakeholder | Message / action |
|-------------|------------------|
| **Customer (Sender)** | Auto-notify: driver status updated; new driver automatically assigned to keep delivery on track |
| **Carrier Admin** | Summary notification on fleet portal for internal performance review |

---

## 2. Required Platform Features

| Feature | Functionality |
|---------|---------------|
| **Reason Codes** | Categorizes why a driver is unavailable (analytics) |
| **Constraint-Based Logic** | Re-assignment respects vehicle capacity and timing |
| **Webhook / API Triggers** | Pushes updates to customer portals and mobile notifications |
| **Performance Scoring** | Tracks cancellation rates against Reliability Thresholds |

---

## 3. Carrier Liability Logic

Because Clox works with third-party carriers, automation should reflect business agreements:

1. **Immediate Re-assignment (Intra-fleet):** Attempt re-assign within the **same carrier’s fleet** first.
2. **Marketplace Escalation (Inter-fleet):** If no driver from the original carrier accepts the rescue within a defined threshold (e.g. **5 minutes**), open the job to the wider Clox marketplace.
3. **Financial Adjustment:** Smart contracts re-allocate the service fee to the new driver/carrier while **maintaining the original customer price**.

---

## Recommendation for Clox

To stay “hands-off,” avoid a standing **decision-pending** state for staff.

- Always attempt **automated resolution first**.  
- Only if re-assignment fails (e.g. no drivers in radius) generate a high-priority **Dispatch Intervention** alert.  

Routine unavailability is handled in real time; the team only manages truly complex scenarios — preserving customer experience.
