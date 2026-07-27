# Admin Partner — Expression of Interest (EOI) Program

**Sources:** `investorportal.html` · `eoiform.html`  
**Program:** Administrative & Revenue Partner — Australian Road Freight Network  
**Related:** [administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md) · [screen-flows/state-master-admin.md](../screen-flows/state-master-admin.md)

---

## Program overview

CLOX recruits regional operating partners through an **Expression of Interest** before formal Master Administration Agreement execution.

> **Code Forwarding Revolution:** CLOX replaces traditional freight broker markup with automated code, isolating regional operations through multi-tier administration and programmatic escrow revenue splits.

---

## Eligible roles

### State Master Admin (Regional Tier)

- **Revenue share:** 10% of gross fare
- **Settlement:** Fortnightly (4th night)
- **Mandate:** Regional compliance auditing; carrier verification (ABN, insurance, RWC); legislative alignment; corridor management

### Local BDE Admin / BDM (Local Tier)

- **Revenue share:** 5% of gross fare
- **Settlement:** Fortnightly (4th night)
- **Mandate:** Regional sales; shipper/carrier onboarding pipelines; lane density; local relationships

---

## EOI form sections

### 1. Desired role & territory

- Role selection (State Master or Local BDE)
- Target state/region (required)
- Target suburbs/city (required)

### 2. Applicant information

- Full legal name
- Company entity name
- ABN (required) · ACN (if applicable)
- Primary email · phone
- Corporate address

### 3. Logistics network & experience

- Existing network / industry footprint in AU logistics
- Target execution strategy (shipper acquisition, fleet onboarding, etc.)

### 4. Revenue framework (disclosed to applicants)

| Tier | Share | Cycle | Mandate summary |
|------|-------|-------|-----------------|
| State Master | 10% gross | Fortnightly | Compliance, RWC/ABN lockouts, disputes |
| Local BDE | 5% gross | Fortnightly | Acquisition, carrier onboarding, lane velocity |

**Settlement note (EOI copy):** Admin distributions over rolling 14-day cycle via **Monoova NPP splits**, net of platform management fees and marketing cost recovery.

### 5. Declarations

Applicant confirms:

- Information is true and current
- EOI does **not** guarantee admission
- Final selection requires KYB, executive review, Master Administration Agreement, non-compete
- Bound by active NDA

---

## Post-EOI process (implied)

1. EOI submission (web form)
2. KYB screening
3. Executive board review
4. Master Administration Agreement + non-compete execution
5. Ops provisioning (Super Admin creates State/Local accounts per [screen-flows](../screen-flows/super-admin.md))

---

## TPM notes

| Item | EOI/marketing | Engineering docs | Action |
|------|---------------|------------------|--------|
| Payout rail | Monoova NPP | Stripe Connect Phase 1 | Align partner comms with G0-6 |
| Super Admin 15% | Not in EOI form (State/Local only) | BRD 15/10/5 split | Correct — HQ retains 15% |
| Compliance approve | State Master implied | Local BDE view+escalate default | G0-4 |

**Implementation:** EOI forms are static HTML today — backend intake API + CRM/ops queue needed for production (not in M0–M12 unless pre-launch priority).
