# Admin Partner EOI Form (Canonical)

**Source:** `clox_admin_eoi_form.pdf` (2 pages, CLOX Proprietary & Confidential)  
**Program:** Administrative & Revenue Partner Program — Australian Road Freight Network  
**Status:** Canonical client form for Phase 0 partner intake  
**Related:** [admin-partner-eoi-program.md](admin-partner-eoi-program.md) · [pre-launch-strategy.md](pre-launch-strategy.md) · [administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md)

**HTML reference (content-aligned):** `Pre-Launch/eoiform.html`  
**Note:** `Pre-Launch/investorportal.html` currently duplicates this EOI form and is **not** the investor equity form — see [investor-portal-form.md](investor-portal-form.md).

---

## Form title

**EXPRESSION OF INTEREST (EOI) FORM**  
Administrative & Revenue Partner Program — Australian Road Freight Network

---

## Intro copy (verbatim intent)

> Join the Code Forwarding Revolution: CLOX shifts the high-markup traditional freight broker paradigm into fully automated code. We isolate regional operations through a multi-tier administration framework, incentivizing active ecosystem partners with direct automated gross revenue splits managed natively via programmatic escrow settlements.

---

## 1. Desired platform role & target territory

### Role options (select one)

| Role | Revenue share | Mandate |
|------|---------------|---------|
| **State Master Admin (Regional Tier)** | 10% Gross Platform Fee Split | Regional compliance auditing; carrier verification safety nets (ABN, Insurances, RWCs); legislative alignment; regional transport corridor management |
| **Local BDE Admin / Business Development Manager (Local Tier)** | 5% Gross Platform Fee Split | Regional sales generation; local shipper/carrier onboarding acquisition pipelines; lane density development; local relationship management |

### Territory fields

| Field | Required |
|-------|----------|
| Target State / Region | Yes |
| Target Suburbs / City | Yes |

---

## 2. Applicant primary information

| Field | Required |
|-------|----------|
| Full Legal Name | Yes |
| Company Entity Name | Yes |
| Australian Business Number (ABN) | Yes |
| ACN (if applicable) | No |
| Primary Email Address | Yes |
| Contact Phone Number | Yes |
| Corporate Address | Yes |

---

## 3. Logistics network & professional experience

| Field | Prompt | Required |
|-------|--------|----------|
| Network / experience | Briefly outline your existing network, industry footprint, or experience within the Australian logistics ecosystem | Yes |
| Execution strategy | Specify your target execution strategy (e.g., local shipper acquisition channels, corporate sender procurement networks, fleet onboarding resources) | Yes |

---

## 4. Administrative & revenue framework overview (disclosed)

| Tier position | Revenue share | Settlement cycle | Core administrative mandate |
|---------------|---------------|------------------|-----------------------------|
| State Master Admin | 10% Gross Fare | Fortnightly (4th Night) | Regional compliance audits; verify heavy vehicle RWC & ABN safety lockouts; dispute management intervention |
| Local BDE Admin (BDM) | 5% Gross Fare | Fortnightly (4th Night) | Customer liquidity acquisition; onboard regional carrier owner-operators; accelerate lane velocity |

**Settlement note (form copy):**

> As per the CLOX Settlement Logic, all administrative distributions are automatically generated over a rolling 14-day cycle and distributed via Monoova NPP splits, net of standardized platform management fees and corporate marketing cost recovery allocations.

**Engineering note:** Phase 0 stores this as disclosed marketing/legal copy only. Live Monoova splits are **out of scope** for Pre-Launch; Super Admin reviews EOIs manually.

---

## 5. Partnership declarations & signature bands

### Declaration (must accept)

By executing this Expression of Interest (EOI), the applicant confirms that:

1. All information provided is true, accurate, and current.
2. Submission does **not** guarantee admission into the CLOX administrative network.
3. Final selection is contingent upon:
   - strict KYB screening
   - manual executive board review
   - execution of the formal CLOX Master Administration Agreement
   - non-compete frameworks
4. All discussions and proprietary operational disclosures remain bound by the active CLOX Non-Disclosure Agreement (NDA).

### Signature block (PDF / print)

| Field |
|-------|
| Authorized Applicant Signature |
| Printed Full Name & Title |
| Date of Execution (DD/MM/YYYY) |
| Entity Name / Company Seal |

**Digital Phase 0 equivalent:** typed full name + checkbox acceptance of declaration (and Privacy/Terms links). Wet-ink seal optional for offline PDF workflow.

---

## Post-submission process

1. EOI captured via `POST /v1/leads/eoi` (web) or email/PDF intake
2. Super Admin notified (email)
3. Manual KYB review in admin portal
4. Executive board review
5. Master Administration Agreement + non-compete
6. Super Admin provisions State/Local accounts (later milestones)

---

## Field → API mapping (Phase 0)

| Form field | API / Lead column |
|------------|-------------------|
| Role | `type` = `EOI_STATE_MASTER` \| `EOI_LOCAL_BDE` |
| Target State / Region | `state` |
| Target Suburbs / City | `territory` |
| Full Legal Name | `payload.fullLegalName` |
| Company Entity Name | `companyName` |
| ABN / ACN | `abn` / `acn` |
| Email / Phone | `email` / `phone` |
| Corporate Address | `payload.corporateAddress` |
| Network experience | `payload.networkExperience` |
| Execution strategy | `payload.executionStrategy` |
| Declaration | `payload.declarationAccepted` = true |
| Full form snapshot | `payload` JSON |
