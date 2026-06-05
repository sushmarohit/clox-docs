# Driver — Screen Flows (Wireframe Spec)

**Role:** Driver · **Platforms:** Web (invite/profile) · Mobile (execution)  
**Refs:** [useronboarding](../useronboarding.md) · [system-design](../system-design.md) §2.7

---

## Screen map

| ID | Screen | Flow |
|----|--------|------|
| DRV-WEB-01 … 05 | Web setup | FLOW 01 |
| DRV-MOB-01 … 13 | Mobile execution | FLOW 02–06 |

---

## FLOW 01: Invite & profile (Web)

`DRV-WEB-01` ──► `DRV-WEB-02` ──► `DRV-WEB-03` ──► `DRV-WEB-04` ──► `DRV-WEB-05`

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│      [Clox logo]     │     │ 9:41            🔋   │     │ ←  Driver licence     │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ You're invited by    │     │ ←  Set password      │     │ Licence class [HR ▼] │
│ Acme Haulage         │     │ OTP [_][_][_][_][_][_]│     │ Number [__________]  │
│ mike@example.com     │     │ New password [____]  │     │ Expiry [dd/mm/yyyy]  │
│                      │     │ Confirm      [____]  │     │ [ Upload photo   ]   │
│ [ Accept invite → ]  │     │ [ Continue →     ]   │     │                      │
└──────────────────────┘     └──────────────────────┘     │ [ Submit →       ]   │
   DRV-WEB-01                  DRV-WEB-02                  └──────────────────────┘

┌──────────────────────┐     ┌──────────────────────┐
│ ←  Safety & policy   │     │  You're ready        │
├──────────────────────┤     ├──────────────────────┤
│ [x] NHVR acknowledgement│  │        ✓             │
│ [x] Company policies │     │  driver_active         │
│ [ ] Fatigue guidance │     │  Download Driver app   │
│ [ Acknowledge →  ]   │     │  [ App Store ] [Play]  │
└──────────────────────┘     └──────────────────────┘
   DRV-WEB-04                  DRV-WEB-05
```

**Steps**

1. Accept carrier invite link.
2. OTP + set password.
3. Licence class, number, expiry, photo.
4. Safety/policy acknowledgement.
5. Prompt app install → mobile login only when `driver_active`.

---

## FLOW 02: Today & open trip (Mobile)

`DRV-MOB-01` ──► `DRV-MOB-02`

```
┌──────────────────────┐     ┌──────────────────────┐
│ 9:41            🔋   │     │ ←  Job #1042         │
├──────────────────────┤     ├──────────────────────┤
│ Today                │     │ Melbourne → Geelong  │
│ ┌──────────────────┐ │     │ Pickup 14:00         │
│ │ ACTIVE           │ │     │ Acme Haulage         │
│ │ #1042            │ │     │ Vehicle ABC123       │
│ │ Pickup 14:00     │ │     │ ┌──────────────────┐ │
│ │ [ Open trip →]   │ │     │ │ Pre-trip checklist│ │
│ └──────────────────┘ │     │ │ Mass check        │ │
│ UPCOMING (none)      │     │ │ Start trip        │ │
├──────────────────────┤     │ └──────────────────┘ │
│ 🏠  📋  👤          │     │ [ Start pre-trip →]  │
└──────────────────────┘     └──────────────────────┘
   DRV-MOB-01                  DRV-MOB-02
```

**Steps**

1. **Today** — Active assignment from carrier bid award.
2. **Trip overview** — Lane, contacts, gate checklist status.

---

## FLOW 03: Pre-trip gates (Mobile)

`DRV-MOB-03` ──► `DRV-MOB-04` ──► `DRV-MOB-05` ──► `DRV-MOB-06`

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ ←  Safety check      │     │  At pickup           │     │ ←  Mass check        │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ [x] Tyres & lights   │     │        📍            │     │ Declared   6,200 kg  │
│ [x] Restraints       │     │ Geofence detected    │     │ Actual [6200] kg     │
│ [x] Fit for duty     │     │ Wait timer started   │     │ [x] Restraints OK    │
│ [ Submit →       ]   │     │ [ Confirm arrival]   │     │ [ Submit →       ]   │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘

┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  Ready to start      │     │        ⚠             │     │  START TRIP          │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ ✓ Safety ✓ Mass      │     │ Awaiting sender      │     │ ✓ All gates passed   │
│ ✓ Payment            │     │ surcharge $180       │     │                      │
│ [ START TRIP    ]    │     │ Start disabled       │     │ [ START TRIP    ]    │
│ (enabled)            │     │ [Notify sent]        │     │ → in_transit         │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
   DRV-MOB-06 OK              Blocked (surcharge)          Trip started
```

**Steps**

1. **Safety checklist** — Required affirmations.
2. **Arrival** — Geofence or manual confirm; wait timer.
3. **Mass check** — If actual > declared → block + sender approval flow.
4. **Start trip** — Server validates payment + gates; tracking on for sender.

---

## FLOW 04: In transit & breakdown (Mobile)

`DRV-MOB-07` ──► `DRV-MOB-10` (exception)

```
┌──────────────────────┐     ┌──────────────────────┐
│ Job #1042 · Transit  │     │ ←  Report breakdown  │
├──────────────────────┤     ├──────────────────────┤
│ [Loading][Transit][Drop]│  │ Type [Mechanical ▼]  │
│                      │     │ GPS auto-captured    │
│ [ Taking break ]     │     │ Notes [____________] │
│ [ Report breakdown ] │     │ [ Submit →       ]   │
└──────────────────────┘     └──────────────────────┘
   DRV-MOB-07                  DRV-MOB-10 → carrier notified
```

**Steps**

1. Status chips: loading → in transit → at drop.
2. Optional break (ETA visibility only, Phase 1).
3. Breakdown → replace/repair/cancel per ops policy.

---

## FLOW 05: POD capture (Mobile)

`DRV-MOB-08` ──► `DRV-MOB-09` ──► (success)

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  At dropoff          │     │ ←  Proof of delivery │     │        ✓             │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ 📍 Geofence drop     │     │ Receiver [________]  │     │  POD submitted       │
│ [ Unloading done →]  │     │ ┌────────────────┐   │     │  Trip completed      │
│                      │     │ │  Sign here     │   │     │  Ref CLX-POD-991     │
│                      │     │ └────────────────┘   │     │  [ Done          ]   │
│                      │     │ Photos [+][+][ ]     │     │                      │
│                      │     │ [ Submit POD →   ]   │     │                      │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
```

**Steps**

1. Drop geofence / unload signal.
2. SOG + photos; server timestamp + GPS metadata.
3. Success → billing/settlement enqueue.

---

## FLOW 06: History & profile (Mobile)

`DRV-MOB-12` · `DRV-MOB-13`

```
┌──────────────────────┐
│ ←  Account           │
├──────────────────────┤
│ (J) John Smith    ✓  │
│ Acme Haulage         │
│ HR licence · exp 2027│
├──────────────────────┤
│ Trip history       › │
│ Notifications      › │
│ Help               › │
│ Sign out             │
└──────────────────────┘
```

---

## RBAC boundaries

Cannot: create jobs, bid, pay, access Ops. Start trip server-gated only.

---

## Related docs

- [README](README.md) · [sender.md](sender.md) · [transport-company.md](transport-company.md)
