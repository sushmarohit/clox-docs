# State Master Admin — Screen Flows (Wireframe Spec)

**Role:** State Master Admin · **Platform:** Web — Ops portal (state-scoped)  
**Revenue:** 10% gross · **Territory:** Assigned state(s) only

---

## Screen map

| ID | Screen | Flow |
|----|--------|------|
| OPS-STA-DSH-01 | Regional dashboard | FLOW 01 |
| OPS-STA-CMP-01/02 | Compliance (state) | FLOW 02 |
| OPS-STA-DSP-01/02 | Disputes | FLOW 03 |
| OPS-STA-TEAM-01 | Local BDE team | FLOW 04 |

---

## FLOW 01: Login & regional dashboard

`SHR-AUTH-01` ──► `OPS-STA-DSH-01`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Clox Ops · State Master · VIC                         🔔   Jane Lee ▼       │
├────────────┬────────────────────────────────────────────────────────────────┤
│ Dashboard ●│  Victoria (VIC) only — not national                             │
│ Compliance │  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│ Users      │  │ Carriers │ │ Jobs     │ │ State    │                       │
│ Jobs       │  │ active   │ │ in prog  │ │ revenue  │                       │
│ Disputes   │  │    48    │ │    31    │ │ $12.4k   │                       │
│ Finance    │  └──────────┘ └──────────┘ └──────────┘                       │
│ Team       │  Compliance (VIC)                                            │
│ Audit      │  Metro Freight — docs exception              [Review →]       │
└────────────┴────────────────────────────────────────────────────────────────┘
```

**Steps**

1. Login; all widgets filtered to **VIC** (example).
2. No Policy / System / Super admin nav items.

---

## FLOW 02: State compliance review

`OPS-STA-CMP-01` ──► `OPS-STA-CMP-02` ──► outcomes

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Compliance queue · VIC               │   │ ← Review: Metro Freight              │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ Metro Freight    docs      [Review]  │   │ (Same detail layout as Super)        │
│ Northern Haul    KYB       [Review]  │   │ [Escalate to HQ]  if override needed │
│ Filter: [Type ▼] [Status ▼]          │   │ [Request info] [Reject] [Approve →]  │
└──────────────────────────────────────┘   └──────────────────────────────────────┘
```

**Steps**

1. State-filtered queue only.
2. Approve/reject in-state; escalate KYB override to Super.

---

## FLOW 03: Dispute — resolve or escalate

`OPS-STA-DSP-01` ──► `OPS-STA-DSP-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Disputes · VIC                       │   │ ← Dispute #D-8841 · VIC            │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ D-8841  Waiting  [Open →]            │   │ Ruling: Sender / Carrier / Split     │
│ D-8800  Mass     [Open →]            │   │ [Assign Local BDE] [Escalate Super]  │
└──────────────────────────────────────┘   │ [Resolve →]                          │
                                            └──────────────────────────────────────┘
```

**Steps**

1. State-level final ruling (default).
2. Escalate to Super for cross-state or policy exceptions.
3. Assign back to Local BDE for evidence gathering.

---

## FLOW 04: Local BDE team

`OPS-STA-TEAM-01` ──► `OPS-STA-TEAM-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Local BDE · VIC                      │   │ ← Tom Park · Geelong                 │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ Name         Territory    SLA        │   │ Open tasks: 8 · Overdue: 2           │
│ Jane Lee     Melbourne    ✓          │   │ Onboarding pipeline: 5 prospects     │
│ Tom Park     Geelong      ⚠          │   │ [Add note] [Reassign territory]      │
└──────────────────────────────────────┘   └──────────────────────────────────────┘
```

---

## FLOW 05: Regional finance (read)

`OPS-STA-FIN-01`

```
┌──────────────────────────────────────┐
│ State revenue · VIC · Period May     │
├──────────────────────────────────────┤
│ State share (10%): $12,400           │
│ Jobs completed: 186                  │
│ [View settlement snapshot]           │
└──────────────────────────────────────┘
```

---

## RBAC boundaries

| Cannot | Can vs Local BDE |
|--------|------------------|
| Edit global policy/tariffs | Final dispute at state level |
| Create Super Admin | Full state compliance approve |
| National unfiltered dashboard | Manage Local BDE performance |

---

## Related docs

- [README](README.md) · [super-admin.md](super-admin.md) · [local-bde-admin.md](local-bde-admin.md)
