# Transport Company — Screen Flows (Wireframe Spec)

**Role:** Transport Company (Carrier) · **Platform:** Web  
**Refs:** [transportcompanyonboarding](../transportcompanyonboarding.md)

---

## Screen map

| ID | Screen | Flow |
|----|--------|------|
| TCO-ONB-01 … 08 | Onboarding wizard | FLOW 01 |
| TCO-MKT / BID | Marketplace & bid | FLOW 02 |
| TCO-ASN | Post-award | FLOW 03 |
| TCO-FLT / DRV | Fleet & drivers | FLOW 04 |

---

## FLOW 01: Onboarding (Web)

`TCO-ONB-01` ──► … ──► `TCO-ONB-08` ──► `approved_bid_eligible`

```
┌────────────────────────────┐   ┌────────────────────────────┐   ┌────────────────────────────┐
│ Clox Carrier    Step 1/8   │   │ Clox Carrier    Step 3/8   │   │ Clox Carrier    Step 8/8   │
├────────────────────────────┤   ├────────────────────────────┤   ├────────────────────────────┤
│ ● ○ ○ ○ ○ ○ ○ ○            │   │ ● ● ● ○ ○ ○ ○            │   │ ● ● ● ● ● ● ● ○            │
│ Register                   │   │ Compliance documents       │   │ Review & submit            │
│ Email [______________]     │   │ PL Insurance  [Upload] ✓   │   │ ✓ KYB  ✓ Docs  ✓ Payout    │
│ Mobile[______________]     │   │ Cargo Ins     [Upload] ✓   │   │ ✓ Fleet (3) ✓ Drivers (2)  │
│ [x] Terms                  │   │ RWC (fleet step)           │   │                            │
│ [ Send OTP →           ]   │   │ [ Continue →           ]   │   │ [ Submit for activation →] │
└────────────────────────────┘   └────────────────────────────┘   └────────────────────────────┘
   TCO-ONB-01                      TCO-ONB-03                      TCO-ONB-08

┌────────────────────────────┐   ┌────────────────────────────┐
│        ◌ Verifying         │   │        ✓ Bid eligible      │
├────────────────────────────┤   ├────────────────────────────┤
│ Ops reviewing your account │   │ Welcome to marketplace     │
│ Status [Pending]           │   │ [ Go to marketplace →  ]   │
│ Est. 1–2 business days     │   │                            │
└────────────────────────────┘   └────────────────────────────┘
   pending_review                  approved_bid_eligible
```

**Steps**

1. Register + OTP → `draft`
2. Legal entity + KYB → `pending_compliance_docs`
3. Upload insurance, RWC, permits
4. Stripe Connect payout → `pending_fleet_readiness`
5. Register vehicles + invite drivers + capabilities
6. Submit → auto or Ops approval → `approved_bid_eligible`

---

## FLOW 02: Marketplace & bid (Web)

`TCO-DSH-01` ──► `TCO-MKT-01` ──► `TCO-MKT-02` ──► `TCO-BID-01` ──► `TCO-BID-02`

```
┌────────────────────────────┐   ┌────────────────────────────┐   ┌────────────────────────────┐
│ Dashboard │ Market │ Bids ▼│   │ ← Job #1042                │   │ ← Submit proposal          │
├────────────────────────────┤   ├────────────────────────────┤   ├────────────────────────────┤
│ Open jobs (12)             │   │ Melbourne → Geelong        │   │ Vehicle  [Rigid 8t   ▼]    │
│ ┌────────────────────────┐ │   │ 8t pallet · Per-km         │   │ Driver   [J. Smith   ▼]    │
│ │#1042 · Closes 4h [Bid]│ │   │ Closes in 4h 15m           │   │ ETA      [Today 14:30]     │
│ └────────────────────────┘ │   │ [ Submit bid →         ]   │   │ Est. net payout $1,240     │
│ ┌────────────────────────┐ │   │                            │   │ [ Submit bid →         ]   │
│ │#1039 · Hourly 4 stops  │ │   │                            │   │                            │
│ └────────────────────────┘ │   │                            │   │                            │
└────────────────────────────┘   └────────────────────────────┘   └────────────────────────────┘
   TCO-MKT-01                      TCO-MKT-02                      TCO-BID-01

┌────────────────────────────┐   ┌────────────────────────────┐
│ My proposals               │   │        ✓ Accepted          │
├────────────────────────────┤   ├────────────────────────────┤
│ #1042 Accepted      ●      │   │ Assignment locked          │
│ #1038 Not selected         │   │ Vehicle + driver reserved  │
│ #1035 Expired (conflict)   │   │ [ View assignment →    ]   │
└────────────────────────────┘   └────────────────────────────┘
   TCO-BID-02                      Won proposal
```

**Steps**

1. Dashboard / marketplace list (gated: bid eligible).
2. Job detail → bid composer (vehicle + driver + ETA).
3. Track proposal status; conflicts auto-expire other bids.

---

## FLOW 03: Assignment monitor (Web)

`TCO-ASN-01` ──► `TCO-ASN-02`

```
┌────────────────────────────┐   ┌────────────────────────────┐
│ ← Assignment #1042         │   │ Trip timeline              │
├────────────────────────────┤   ├────────────────────────────┤
│ Status: In transit           │   │ ✓ Safety  ✓ Mass  ✓ Started│
│ Driver: John Smith           │   │ ⚠ Breakdown reported 14:22 │
│ Vehicle: ABC123              │   │ [ View exception ]         │
│ [ Contact driver ]           │   │ Live map (read-only)       │
└────────────────────────────┘   └────────────────────────────┘
```

**Steps**

1. Active assignments list.
2. Read-only trip timeline; handle breakdown notifications.

---

## FLOW 04: Fleet & drivers (Web)

`TCO-FLT-01` ──► `TCO-FLT-02` · `TCO-DRV-01` ──► `TCO-DRV-02`

```
┌────────────────────────────┐   ┌────────────────────────────┐
│ Fleet                      │   │ ← Add vehicle              │
├────────────────────────────┤   ├────────────────────────────┤
│ ABC123  Rigid 8t    Active │   │ Rego [ABC123]              │
│ XYZ789  Rigid 12t   Active │   │ Class [Rigid 8t ▼]         │
│ [ + Add vehicle ]          │   │ RWC expiry [________]      │
│                            │   │ [ Save ]                   │
│ Drivers                    │   └────────────────────────────┘
│ J. Smith  Active           │
│ [ + Invite driver ]        │
└────────────────────────────┘
```

---

## FLOW 05: Compliance & suspension (Web)

`TCO-DOC-01`

```
┌────────────────────────────┐   ┌────────────────────────────┐
│ Documents                  │   │        ⚠ Suspended         │
├────────────────────────────┤   ├────────────────────────────┤
│ PL Insurance    ✓  2027    │   │ Cargo insurance expired    │
│ Cargo           ⚠  7 days  │   │ Bidding disabled           │
│ [ Upload renewal ]         │   │ [ Upload & revalidate →]   │
└────────────────────────────┘   └────────────────────────────┘
```

---

## RBAC boundaries

Cannot: create sender jobs, accept proposals, run driver gates, Ops portal.

---

## Related docs

- [README](README.md) · [driver.md](driver.md) · [sender.md](sender.md)
