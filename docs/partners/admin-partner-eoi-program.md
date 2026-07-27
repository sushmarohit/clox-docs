# Admin Partner — Expression of Interest (EOI) Program

**Canonical form:** [admin-eoi-form.md](admin-eoi-form.md) ← sourced from `clox_admin_eoi_form.pdf`  
**HTML reference:** `Pre-Launch/eoiform.html`  
**Strategy:** [pre-launch-strategy.md](pre-launch-strategy.md)  
**Related:** [administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md) · [screen-flows/state-master-admin.md](../screen-flows/state-master-admin.md) · [investor-portal-form.md](investor-portal-form.md)

---

## Program overview

CLOX recruits regional operating partners through an **Expression of Interest** before formal Master Administration Agreement execution.

> **Code Forwarding Revolution:** CLOX replaces traditional freight broker markup with automated code, isolating regional operations through multi-tier administration and programmatic escrow revenue splits.

**This program is not the Investor Portal.** Capital / equity pre-qualification is a separate funnel — see [investor-portal-form.md](investor-portal-form.md).

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

Full field-level transcription: **[admin-eoi-form.md](admin-eoi-form.md)**.

1. Desired role & territory (State Master or Local BDE + state + suburbs/city)
2. Applicant information (legal name, entity, ABN/ACN, email, phone, address)
3. Logistics network & experience (network footprint + execution strategy)
4. Revenue framework disclosure (10%/5%, Monoova NPP settlement note)
5. Declarations + signature bands (KYB, executive review, Master Admin Agreement, non-compete, NDA)

---

## Post-EOI process

1. EOI submission (web form → API)
2. KYB screening (manual in Phase 0)
3. Executive board review
4. Master Administration Agreement + non-compete execution
5. Ops provisioning (Super Admin creates State/Local accounts per [screen-flows](../screen-flows/super-admin.md))

---

## TPM notes

| Item | EOI/marketing | Engineering docs | Action |
|------|---------------|------------------|--------|
| Payout rail | Monoova NPP | Stripe Connect Phase 1 | Align partner comms with G0-6; no live Monoova in Phase 0 |
| Super Admin 15% | Not in EOI form (State/Local only) | BRD 15/10/5 split | Correct — HQ retains 15% |
| Compliance approve | State Master implied | Local BDE view+escalate default | G0-4 |
| Investor vs EOI | HTML `investorportal.html` wrongly duplicated EOI | PDF investor form is equity intake | Keep funnels separate |

**Implementation:** Phase 0 uses `POST /v1/leads/eoi` + Super Admin EOI queue. Digital form must match `clox_admin_eoi_form.pdf`.
