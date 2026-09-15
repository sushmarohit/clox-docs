# Source Documents Index

**Converted:** 2026-07-27 · **Owner:** TPM  
**Purpose:** Map original PDF/Word/HTML sources to structured Markdown in `docs/`.

---

## Conversion map

| Source file | Type | Markdown output | Notes |
|-------------|------|-----------------|-------|
| `clox_about_us.pdf` | PDF | [company/clox-about-us.md](../company/clox-about-us.md) | Pre-launch marketing profile |
| `clox_global_legal_framework.pdf` | PDF | [legal/global-legal-framework.md](../legal/global-legal-framework.md) | Legal framework v2.0 (July 2026) |
| `Administrative hirerachy.pdf` | PDF | [operations/administrative-hierarchy-revenue-flow.md](../operations/administrative-hierarchy-revenue-flow.md) | Same content as Consolidated doc |
| `Consolidated Administrative Hierarchy & Revenue Flow.pdf` | PDF | *(duplicate — see above)* | Identical to Administrative hierarchy |
| `For day hourly basis (minimum 4 hours) must create.pdf` | PDF | [operations/hourly-run-sheet-spec.md](../operations/hourly-run-sheet-spec.md) | Run sheet PDF spec |
| `P1 Functional Specification & System Architecture.pdf` | PDF | [product/p1-functional-specification.md](../product/p1-functional-specification.md) | Primary functional/architecture spec |
| `Technical and Operational 10 may 2026.pdf` | PDF | [product/technical-operational-specification.md](../product/technical-operational-specification.md) | Merged with audit doc |
| `Technical and Operational Audit of the Clox .pdf` / `.docx` | PDF/DOCX | [product/technical-operational-specification.md](../product/technical-operational-specification.md) | Workflow audit + screen flows |
| `UI base plan.pdf` | PDF | [product/ui-base-plan.md](../product/ui-base-plan.md) | Role-based UI plan |
| `Response for UI & AI.pdf` | PDF | [product/ai-strategy-clarification.md](../product/ai-strategy-clarification.md) | UI-first + internal logic stance |
| `AI tool for Clox.pdf` | PDF | [product/ai-strategy-clarification.md](../product/ai-strategy-clarification.md) | AI ecosystem overview |
| `Clox Freight Forwarding.pdf` / `.docx` | PDF/DOCX | [product/vehicle-pricing-and-load-types.md](../product/vehicle-pricing-and-load-types.md) | Pricing, load types, breakdown flows |
| `Work and rest requirements.pdf` | PDF | [compliance/nhvr-work-rest-reference.md](../compliance/nhvr-work-rest-reference.md) | NHVR reference (Phase 2 input) |
| `Reference - Similar Australian portal.docx` | DOCX | [reference/australian-competitor-portals.md](../reference/australian-competitor-portals.md) | Competitor links |
| `investorportal.html` / `eoiform.html` | HTML | [partners/admin-partner-eoi-program.md](../partners/admin-partner-eoi-program.md) | **Caution:** `investorportal.html` currently clones Admin EOI — not the investor PDF |
| `index.html` | HTML | [partners/pre-launch-registry.md](../partners/pre-launch-registry.md) | Sender/carrier pre-launch signup |
| `clox_admin_eoi_form.pdf` | PDF | [partners/admin-eoi-form.md](../partners/admin-eoi-form.md) | **Canonical** Admin Partner EOI (2 pages) |
| `clox_investor_portal_form.pdf` | PDF | [partners/investor-portal-form.md](../partners/investor-portal-form.md) | **Canonical** Investor Portal equity form (2 pages) |
| `App Workflows by All User Roles.pdf` | PDF | [workflows/app-workflows-by-all-user-roles.md](../workflows/app-workflows-by-all-user-roles.md) | Full role workflows (18 pages) |
| `CLOX Hosting Infrastructure Blueprint.pdf` | PDF | [infrastructure/hosting-infrastructure-blueprint.md](../infrastructure/hosting-infrastructure-blueprint.md) | Sovereign hosting / cost playbook |
| `CLOX PLATFORM SUITE.pdf` | PDF | [legal/clox-platform-suite.md](../legal/clox-platform-suite.md) | Full legal suite v2.0 (11 pages) |
| `Clox Run Sheet.pdf` | PDF | [operations/clox-run-sheet.md](../operations/clox-run-sheet.md) | Hourly run sheet PDF spec |
| `Driver sick call.pdf` | PDF | [operations/driver-sick-call.md](../operations/driver-sick-call.md) | Automated unavailability control loop |
| `Fatigue - Work and rest requirements-1.pdf` | PDF | [compliance/fatigue-work-and-rest-requirements.md](../compliance/fatigue-work-and-rest-requirements.md) | Full NHVR work/rest tables |
| `Hourly Job related.pdf` | PDF | [product/hourly-job-related.md](../product/hourly-job-related.md) | UI-first + hourly 4-hr logic |
| `Vehicle Type Average Pricing.pdf` | PDF | [product/vehicle-type-average-pricing.md](../product/vehicle-type-average-pricing.md) | Pricing, selection flow, load types (28 pages) |

**Pre-Launch strategy (three funnels):** [partners/pre-launch-strategy.md](../partners/pre-launch-strategy.md)

**Payments (Phase 1 Stripe canonical):** [payments/stripe-payment-specification.md](../payments/stripe-payment-specification.md)

**Phase 1 full implementation (Gate 0 + M0–M12 what/how/checklists):** [PHASE-1-IMPLEMENTATION-PLAN.md](../PHASE-1-IMPLEMENTATION-PLAN.md)

**Production engineering rules:** [engineering/production-development-rules.md](../engineering/production-development-rules.md) · Cursor: `.cursor/rules/`

---

## TPM consolidated analysis

Cross-document gaps, conflicts, and decisions: **[TPM-DOCUMENT-ANALYSIS.md](../TPM-DOCUMENT-ANALYSIS.md)**

---

## Relationship to existing docs

These sources extend (and in some cases supersede) the original planning set:

- [BRD.md](../BRD.md) · [PRD.md](../PRD.md) · [system-design.md](../system-design.md)
- [MILESTONES.md](../MILESTONES.md) · [screen-flows/README.md](../screen-flows/README.md)

When conflicts arise, resolve via Gate 0 ADR and update BRD/PRD accordingly.
