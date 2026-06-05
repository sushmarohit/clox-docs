# Super Admin — Screen Flows (Wireframe Spec)

**Role:** Super Admin (HQ) · **Platform:** Web — Ops portal (national)  
**Revenue:** 15% gross platform share · **Refs:** [PRD](../PRD.md) · [BRD](../BRD.md)

---

## Screen map

| ID | Screen | Flow |
|----|--------|------|
| OPS-SUP-DSH-01 | National dashboard | FLOW 01 |
| OPS-SUP-CMP-01/02 | Compliance | FLOW 02 |
| OPS-SUP-DSP-01/02 | Disputes | FLOW 03 |
| OPS-SUP-POL-01/02 | Policy | FLOW 04 |
| OPS-SUP-ADM-01/02 | Admin provisioning | FLOW 05 |
| OPS-SUP-FIN-01 | Settlements | FLOW 06 |

---

## FLOW 01: Login & national dashboard

`SHR-AUTH-01` ──► `SHR-AUTH-02` ──► `OPS-SUP-DSH-01`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Clox Ops · Super Admin                              🔔 3   Admin ▼  Sign out │
├────────────┬────────────────────────────────────────────────────────────────┤
│ Dashboard ●│  National overview · All regions                                │
│ Compliance │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ Users      │  │ Active   │ │ Pending  │ │ Open     │ │ Settle-  │            │
│ Jobs       │  │ trips    │ │ review   │ │ disputes │ │ ment due │            │
│ Disputes   │  │   142    │ │    23    │ │     7    │ │  Fri     │            │
│ Finance    │  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│ Policy  ★  │  Priority queue                                              │
│ Admins  ★  │  ┌────────────────────────────────────────────────────────────┐ │
│ Audit      │  │ Acme Haulage · final activation · VIC      [Review →]   │ │
│ System  ★  │  │ Sender XYZ · manual KYC · NSW                [Review →]   │ │
└────────────┴──└────────────────────────────────────────────────────────────┘ │
                OPS-SUP-DSH-01
```

**Steps**

1. Internal login (OTP; step-up for sensitive actions).
2. National KPIs and compliance queue shortcuts.
3. Sidebar ★ = Super-only sections.

---

## FLOW 02: Compliance review

`OPS-SUP-CMP-01` ──► `OPS-SUP-CMP-02` ──► (outcomes)

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ ← Review: Acme Haulage               │   │         ✓ Approved                   │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ VIC · pending_review                 │   │ approved_bid_eligible                │
│ ┌─ KYB ────────┐ ┌─ Documents ────┐ │   │ Carrier notified                     │
│ │ Verified ✓   │ │ PL Ins    ✓    │ │   │ [ Next in queue → ]                  │
│ │ [Override]   │ │ Cargo     ✓    │ │   └──────────────────────────────────────┘
│ └──────────────┘ │ RWC       ⚠    │ │
│ ┌─ Payout ─────┐ └────────────────┘ │   ┌──────────────────────────────────────┐
│ │ Stripe ✓     │ Fleet: 3 · Drv: 2  │   │         ✕ Rejected                   │
│ └──────────────┘                     │   ├──────────────────────────────────────┤
│ Notes [________________________]     │   │ Reason logged · terminal state       │
├──────────────────────────────────────┤   └──────────────────────────────────────┘
│ [Request info] [Reject] [Approve →]  │
└──────────────────────────────────────┘
   OPS-SUP-CMP-02
```

**Steps**

1. Filter queue (all regions, all types).
2. Review KYB, docs, payout, fleet gates.
3. Approve → bid eligible · Reject · Request info.

---

## FLOW 03: Dispute adjudication

`OPS-SUP-DSP-01` ──► `OPS-SUP-DSP-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Disputes · National                  │   │ ← Dispute #D-8841                    │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ [Open][Closed][Escalated]            │   │ Waiting charge · $240 · Job #1042    │
│ D-8841  Waiting   VIC    [Open →]    │   │ Timeline · geofence · POD · chat     │
│ D-8802  Mass      NSW    [Open →]    │   │ Rule: ( ) Sender ( ) Carrier ( ) Split│
└──────────────────────────────────────┘   │ [Resolve] [Adjust payout]            │
   OPS-SUP-DSP-01                          └──────────────────────────────────────┘
                                              OPS-SUP-DSP-02
```

**Steps**

1. Triage national disputes (final authority).
2. Ruling + optional financial adjustment.

---

## FLOW 04: Policy & tariff publish (Super only)

`OPS-SUP-POL-01` ──► `OPS-SUP-POL-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Policy & tariffs                     │   │ ← Edit · Hourly local v2.3           │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ Hourly local      v2.2  Active       │   │ Effective [2026-06-01]               │
│ Per-km regional   v1.8  Active       │   │ Min hours [4] · Wait pickup [30m]    │
│ Waiting rules     v1.1  Active       │   │ Change summary [________________]    │
│ [ + New version ]                    │   │ [Save draft]    [Publish version →]  │
└──────────────────────────────────────┘   └──────────────────────────────────────┘
```

---

## FLOW 05: Provision admin users

`OPS-SUP-ADM-01` ──► `OPS-SUP-ADM-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Admin management                     │   │ ← New admin                          │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ Name            Role        Region   │   │ Name [________________]              │
│ Jane Lee        State       VIC      │   │ Email [_______________]              │
│ Tom Park        Local BDE   Melbourne│   │ Role ( ) State  ( ) Local BDE        │
│ [ + Provision admin ]                │   │ State [VIC ▼]  Territory [____]      │
└──────────────────────────────────────┘   │ [Cancel]           [Send invite →]   │
                                            └──────────────────────────────────────┘
```

---

## FLOW 06: Finance & settlements

`OPS-SUP-FIN-01` ──► `OPS-SUP-FIN-02`

```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ Finance · Fortnightly cycle          │   │ Reconciliation                       │
├──────────────────────────────────────┤   ├──────────────────────────────────────┤
│ Gross split: HQ 15% · State 10% ·    │   │ ⚠ 3 mismatches Stripe vs ledger      │
│ Local 5%                             │   │ [Run reconcile] [Export]             │
│ Period ending 14 May    [Process →]  │   └──────────────────────────────────────┘
│ Carrier payouts · Admin shares       │
└──────────────────────────────────────┘
```

---

## FLOW 07: Suspend / reactivate org

`OPS-SUP-USR-02`

```
┌──────────────────────────────────────┐
│ Acme Haulage · approved_bid_eligible   │
├──────────────────────────────────────┤
│ [Suspend] [Audit log] [Jobs]         │
│ Reason [Policy breach ▼]             │
│ Note (required) [________________]   │
│ [Confirm suspend]                    │
└──────────────────────────────────────┘
```

---

## RBAC boundaries (Super only)

| Can | Cannot |
|-----|--------|
| National data, policy edit, provision Super/State/Local | Act as driver (safety/POD) |
| Final disputes, global override | Create marketplace jobs without audit |

---

## Related docs

- [README](README.md) · [state-master-admin.md](state-master-admin.md) · [transportcompanyonboarding-sequence.md](../transportcompanyonboarding-sequence.md)
