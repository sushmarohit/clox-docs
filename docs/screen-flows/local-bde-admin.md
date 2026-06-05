# Local BDE Admin — Screen Flows (Wireframe Spec)

**Role:** Local BDE Admin · **Platform:** Web — Ops portal (local territory)  
**Revenue:** 5% gross · **Focus:** Growth pipeline & first-line support

---

## Screen map

| ID | Screen | Flow |
|----|--------|------|
| OPS-LOC-DSH-01 | Local dashboard | FLOW 01 |
| OPS-LOC-GRW-01/02 | Growth pipeline | FLOW 02 |
| OPS-LOC-CAR-02 | Carrier support | FLOW 03 |
| OPS-LOC-DSP-01/02 | Dispute triage | FLOW 04 |

---

## FLOW 01: Local dashboard

`SHR-AUTH-01` ──► `OPS-LOC-DSH-01`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Clox Ops · Local BDE · Melbourne CBD                    🔔   Tom Park ▼     │
├────────────┬────────────────────────────────────────────────────────────────┤
│ Dashboard ●│  Today · Melbourne CBD only                                     │
│ Growth     │  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│ Carriers   │  │Prospects │ │ Onboard  │ │ Active   │                       │
│ Senders    │  │ in pipe  │ │ stuck    │ │ jobs     │                       │
│ Compliance │  │     9    │ │     3    │ │    14    │                       │
│ Jobs       │  └──────────┘ └──────────┘ └──────────┘                       │
│ Disputes   │  Tasks                                                        │
│ Revenue    │  • Northern Haul — chase insurance upload      [Open →]        │
└────────────┴──• Dispute #D-9012 — waiting charge              [Triage →]────┘
```

**Steps**

1. Login; territory badge always visible.
2. Task list drives daily work (no national KPIs).

---

## FLOW 02: Growth pipeline

`OPS-LOC-GRW-01` ──► `OPS-LOC-GRW-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Growth pipeline                      │   │ ← Northern Haul (prospect)           │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ [+ Add prospect]                     │   │ Stage: Invited → draft on web        │
│ Company        Stage      Due        │   │ Contact Mike · 0412 xxx xxx          │
│ Northern Haul  Invited    Today      │   │ [Call] [Email template]              │
│ WestSide       Lead       Wed        │   │ Notes:                               │
│ ABC Logistics  pending_docs Today    │   │ · 12 May — reminded cargo cert       │
└──────────────────────────────────────┘   │ [Add note] [Escalate to State →]     │
                                            └──────────────────────────────────────┘
```

**Steps**

1. Track prospects and onboarding stages locally.
2. Chase documents; link to carrier web signup.
3. Escalate to State when ready for compliance approval.

---

## FLOW 03: Carrier onboarding support

`OPS-LOC-CAR-01` ──► `OPS-LOC-CAR-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Carriers · local                     │   │ ← Northern Haul                      │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ Northern Haul   pending_docs  [→]  │   │ Checklist (read-only)                │
│ Metro Freight   active        [→]  │   │ [x] Register [x] KYB [ ] Cargo ins  │
└──────────────────────────────────────┘   │ [Escalate to State review]           │
                                            │ (Approve only if policy grants)      │
                                            └──────────────────────────────────────┘
```

---

## FLOW 04: First-line dispute triage

`OPS-LOC-DSP-01` ──► `OPS-LOC-DSP-02` ──► escalate

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Disputes · first-line                │   │ ← Dispute #D-9012                    │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ D-9012  Mass surcharge  [Triage →]   │   │ [ ] Contacted sender                 │
│ D-9008  Waiting         [Triage →]   │   │ [ ] Contacted carrier                │
└──────────────────────────────────────┘   │ [ ] Evidence complete                │
                                            │ [Close locally] [Escalate State →] │
                                            └──────────────────────────────────────┘
```

**Steps**

1. Gather evidence checklist.
2. Close locally if policy allows, else escalate to State Master.

---

## FLOW 05: Local revenue snapshot

`OPS-LOC-FIN-01`

```
┌──────────────────────────────────────┐
│ Local revenue · Melbourne CBD        │
├──────────────────────────────────────┤
│ Local share (5%): $3,100             │
│ Read-only · Period May               │
└──────────────────────────────────────┘
```

---

## RBAC boundaries

| Cannot | Unique to Local BDE |
|--------|---------------------|
| Provision admins, edit policy | Growth pipeline (FLOW 02) |
| National/state-wide aggregates | Prospect + outbound support UX |
| Final complex dispute ruling (default) | First-line triage only |

---

## Related docs

- [README](README.md) · [state-master-admin.md](state-master-admin.md) · [transport-company.md](transport-company.md)
