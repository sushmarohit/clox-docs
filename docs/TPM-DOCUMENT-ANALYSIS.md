# TPM Document Analysis — Consolidated Review

**Author:** TPM review  
**Date:** 2026-07-27  
**Scope:** All PDF, Word, and HTML source documents added to repo  
**Status:** Analysis complete — **decisions required before M0**

---

## 1. Executive summary

The newly added documents significantly **expand** the original `docs/` set (BRD, PRD, milestones, screen flows). Together they form a **near-complete Phase 1 blueprint** with strong business, legal, operational, and UX coverage.

| Dimension | Assessment |
|-----------|------------|
| Business model | **Clear** — 70/30 split, 15/10/5 admin tiers, origin-based attribution |
| Compliance & safety | **Strong** — gates, load rules, NHVR references, legal framework |
| UX / workflows | **Strong** — UI plan + screen flows + breakdown sequences |
| Engineering | **Partial** — P1 spec rich; schema/API still TODO |
| Implementation | **None** — still docs + static HTML only |

**Critical path unchanged:** M0 → M1 → M2 → M4 → M6 → M7 → M8 → M10 → M12.

---

## 2. Document corpus map

See [sources/README.md](sources/README.md) for full conversion index.

**Net-new capability areas** not fully covered in original docs:

1. **Hourly run sheet PDF** — legal billing artifact ([hourly-run-sheet-spec.md](operations/hourly-run-sheet-spec.md))
2. **Fleet+ profit engine** — Phase 2 but detailed in P1/legal ([p1-functional-specification.md](product/p1-functional-specification.md))
3. **Global legal framework** — binding terms v2.0 ([legal/global-legal-framework.md](legal/global-legal-framework.md))
4. **Vehicle pricing tables** — Super Admin tariff seed data ([vehicle-pricing-and-load-types.md](product/vehicle-pricing-and-load-types.md))
5. **Pre-launch capture** — three funnels: registry, Admin EOI, Investor Portal ([partners/pre-launch-strategy.md](partners/pre-launch-strategy.md))
6. **Canonical partner PDFs** — Admin EOI + Investor forms ([admin-eoi-form.md](partners/admin-eoi-form.md), [investor-portal-form.md](partners/investor-portal-form.md))

---

## 3. Cross-document conflicts (must resolve)

| # | Topic | Document A | Document B | Recommended resolution |
|---|-------|------------|------------|------------------------|
| C1 | **Payout rail** | Legal + EOI + HTML: Monoova NPP on/near POD | MILESTONES G0-6: Stripe Connect pilot | **ADR:** Stripe Connect Phase 1; Monoova M12+ for admin splits |
| C2 | **Routing engine** | Legal/P1: Valhalla (zero cost) | thirdparty-integration: Google Routes | **ADR:** Google for M6 pilot; evaluate Valhalla for cost at scale |
| C3 | **Vehicle scope** | Freight Forwarding doc: motorbike → road train | BRD: FLT/FTL full-load only | **ADR:** Phase 1 enum = 3T+ rigid minimum; exclude courier tier |
| C4 | **Larger vehicle on bid** | Audit doc: "not allowed" | Freight Forwarding: allowed with repricing | **Allow larger** — matches PRD FR-3 |
| C5 | **Carrier settlement timing** | Audit: 7 days post-POD withdraw | BRD: fortnightly admin cycle | Both can coexist — **carrier T+7, admin T+14**; document in BRD |
| C6 | **Fatigue engine** | Audit: 1-min EWD + 15-min broadcast | PRD/BRD: manual logbook Phase 1 | **Manual only** M8; planning insert at 5.25 hr only |
| C7 | **Hourly stop patterns** | Original BRD: "up to 4 pickups" | P1/legal: Pattern A (3→1) or B (1→3), max 4 locations | **Update BRD** to Pattern A/B model |
| C8 | **Carrier unlock** | Legal: Regional Admin manual | transportcompanyonboarding-sequence: auto + Ops hybrid | **Hybrid** per G0-3 (already recommended) |
| C9 | **Admin payout messaging** | HTML: "splits on POD" | BRD: fortnightly 4th night | **Fix marketing copy** — accrual on complete, payout fortnightly |
| C10 | **Investor vs EOI** | `investorportal.html` = Admin EOI clone | `clox_investor_portal_form.pdf` = equity / Corporations Act form | **Treat as separate funnels**; rebuild `/investors` from PDF; do not merge with Admin EOI |

---

## 4. Gaps requiring spikes (add to M0/M1)

| Gap | Source callout | Owner | Blocks |
|-----|----------------|-------|--------|
| Relational schema v1 | P1, system-design TODO | Backend | M0 ERD |
| REST API catalog | P1, system-design TODO | Backend | M1 contracts |
| Run sheet PDF service | Hourly run sheet doc | Backend | M10 extension |
| Tariff seed tables | Vehicle pricing doc | Product + Super policy UI | M6 pricing |
| EOI / investor / pre-launch API | Partner PDFs + HTML | Web + backend | Pre-pilot GTM |
| Valhalla hosting | Legal framework | DevOps | M6 routing cost model |
| Liquidated damages policy | Technical ops docs | Legal + Finance | M11 disputes |

---

## 5. FR traceability — new requirements

| New requirement | Source | Suggested milestone |
|-----------------|--------|---------------------|
| Hourly run sheet PDF | Run sheet spec | **M10.1** (or M10 exit criteria) |
| Pattern A/B multi-stop hourly | P1, Response UI | **M6** |
| Odometer fraud flag (>10%) | Legal, run sheet | **M8/M10** |
| Load type smart rules (12 types) | Freight Forwarding | **M6** |
| Breakdown 11-screen flow | Freight Forwarding, audit | **M10** |
| Server NTP timestamps | UI plan, legal | **M8** POD |
| ATO invoice ≥$1k name/address | Audit doc | **M10** invoicing |
| Company performance score | Legal breakdown § | **M11** ops |

---

## 6. Third-party stack — reconciled view

### Phase 1 (pilot) — recommended

| Service | Use |
|---------|-----|
| Stripe Connect | AU | Required | Sender charge + carrier payout |
| ABR Web Services | AU | Optional assist | Free ABN active-status for Ops |
| easyAML / Trulioo | — | **Out of Phase 1** | Manual Ops KYB/KYC instead |
| Radar.com | Geofence + dwell |
| Google Maps/Routes | Address + routing + TSP input |
| ABR Web Services | ABN validation (free) |
| Twilio Proxy | Optional — Phase 2 per milestones |

### Phase 2+ — deferred

| Service | Use |
|---------|-----|
| Monoova NPP | Admin/carrier split payouts at scale |
| Valhalla self-hosted | Routing cost optimization |
| EWD API | Fatigue verification |
| Fleet+ analytics | Profit engine |

---

## 7. UI delivery recommendation

Per [ai-strategy-clarification.md](product/ai-strategy-clarification.md):

1. **Freeze wireframes** for all six roles (screen-flows + UI base plan)
2. **Sign off safety gates** (mass check, compliance vault, payment states)
3. **Then** start M1/M6 backend against OpenAPI contracts

Screen-flow docs (~35 flows) and UI base plan are **aligned** — low UX conflict risk.

---

## 8. Legal & compliance readiness

[global-legal-framework.md](legal/global-legal-framework.md) (July 2026) is comprehensive but **must not ship as user-facing ToS without lawyer review**.

High-risk clauses for counsel:

- Automated futile travel fees
- Breakdown refund / ACL major failure thresholds
- Non-compete in admin EOI
- Chain of Responsibility liability allocation
- Monoova vs Stripe escrow language

---

## 9. Recommended immediate actions

### Gate 0 (before M0) — add items

| ID | Decision |
|----|----------|
| G0-9 | Vehicle class minimum for Phase 1 (recommend 3T+ rigid) |
| G0-10 | Routing: Google vs Valhalla for M6 |
| G0-11 | Run sheet PDF in M10 scope? (recommend yes for hourly) |
| G0-12 | Marketing payout messaging alignment |

### Documentation hygiene

- [ ] Update [BRD.md](BRD.md) hourly stop section to Pattern A/B
- [ ] Update [thirdparty-integration.md](thirdparty-integration.md) with Valhalla/Monoova phasing
- [ ] Add run sheet to [MILESTONES.md](MILESTONES.md) M10 exit criteria
- [ ] Link [sources/README.md](sources/README.md) from main docs index

### Engineering

- [ ] No code until G0 ADRs signed (per existing MILESTONES plan)
- [ ] ERD v0 should include: RunSheet, LoadTypePolicy, PerformanceScore entities

---

## 10. Maturity scorecard (updated)

| Area | Before new docs | After new docs |
|------|-----------------|----------------|
| Business requirements | Strong | **Very strong** |
| Legal/commercial | Weak | **Strong** (needs counsel) |
| Technical architecture | Strong overview | **Strong** (P1 + conflicts noted) |
| UX specification | Strong | **Very strong** |
| Pricing/tariffs | Missing | **Draft ranges** (need Super Admin tables) |
| Compliance (NHVR) | Mentioned | **Referenced** (Phase 2 automation) |
| GTM / partners | Missing | **Registry + Admin EOI + Investor Portal defined** |
| Implementation | None | None |

---

## 11. Conclusion

The document set is **sufficient to begin M0** once Gate 0 conflicts (C1–C9) are recorded as ADRs. The longest pole remains **compliance + payments + mobile trip execution** — unchanged from [MILESTONES.md](MILESTONES.md).

**Pilot readiness estimate:** Unchanged — ~9–12 months for small squad from M0 kickoff, assuming Gate 0 closed in 2 weeks and no Fleet+/Monoova scope creep into Phase 1.

---

## Related links

- [MILESTONES.md](MILESTONES.md) · [MILESTONES-AUSTRALIA.md](MILESTONES-AUSTRALIA.md)
- [sources/README.md](sources/README.md)
- [PRD.md](PRD.md) · [BRD.md](BRD.md) · [system-design.md](system-design.md)
