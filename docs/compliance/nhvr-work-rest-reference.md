# NHVR Work & Rest Requirements — Reference

**Source:** `Work and rest requirements.pdf` (NHVR regulatory reference)  
**Applies to:** Phase 1 planning guardrails; full automation deferred to Phase 2  
**Related:** [BRD.md](../BRD.md) · [ai-strategy-clarification.md](../product/ai-strategy-clarification.md)

---

## Context for Clox

Drivers of fatigue-regulated heavy vehicles must comply with maximum work and minimum rest limits under HVNL. Chain of Responsibility (CoR) parties must take reasonable steps to prevent breaches.

**Phase 1 Clox approach:** Manual work diary; optional "Taking Break" for ETA only; planning-time fatigue insert at **5.25 hours** for hourly route estimates — **not** authoritative AFM/EWD automation.

---

## Standard hours (solo drivers — no fatigue accreditation)

| Period | Max work | Min rest |
|--------|----------|----------|
| 5½ hours | 5¼ hours work | 15 continuous minutes rest |
| 8 hours | 7½ hours work | 30 min rest (15-min blocks) |
| 11 hours | 10 hours work | 60 min rest (15-min blocks) |
| 24 hours | 12 hours work | 7 continuous hours stationary rest* |
| 7 days | 72 hours work | 24 continuous hours stationary rest |
| 14 days | 144 hours work | 2× night rest breaks (consecutive days) |

\*Stationary rest = out of vehicle or approved sleeper berth while stationary.

**Night rest:** 7 continuous hours between 10pm–8am (driver base timezone) OR 24 continuous hours stationary rest.

---

## Clox mapping (Phase 1)

| Clox feature | NHVR reference |
|--------------|----------------|
| 15-min rest insert at 5.25 hr planned duration | Aligns with 5½ hr / 5¼ hr work + 15 min rest (standard hours) |
| Manual logbook in driver app | Standard hours compliance — driver responsibility |
| No in-app fatigue enforcement | Per PRD non-goals (AFM automation out of scope) |
| Hourly run sheet break log | Evidence for payroll/compliance audit trail |

---

## BFM / AFM (Phase 2)

- **BFM:** Up to 14 hours work in 24 hours (accredited operators)
- **AFM:** Tailored work/rest under HVNL
- **EWD API:** Referenced in legal framework for optional carrier integration

---

## Regulatory links (from source)

- Regulatory Advice — Fitness to drive: Fatigue
- Managing fatigue under Daylight Saving Time
- Daily work and rest hours planner (Standard hours PDF)
- Swapping between BFM and Standard Hours fact sheet

---

## TPM recommendation

| Phase | Fatigue capability |
|-------|-------------------|
| Phase 1 (M8) | Manual logbook; break button; planning ETA insert only |
| Phase 2 | EWD API integration; optional BFM operator profiles |
| Phase 3+ | AFM automation (explicit PRD non-goal today) |

Do **not** implement audit-doc "fatigue engine with 1-minute increments and 15-min broadcast" in Phase 1 without legal sign-off — conflicts with manual logbook policy.
