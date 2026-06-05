# Sender — Screen Flows (Wireframe Spec)

**Role:** Sender · **Platforms:** Web (onboard + book) · Mobile (track + approve)  
**Refs:** [useronboarding](../useronboarding.md) · [system-design](../system-design.md)

---

## Screen map

| ID | Screen | Flow |
|----|--------|------|
| SND-ONB-01 … 05 | Onboarding | FLOW 01 |
| SND-JOB-01 … 05 | Create job | FLOW 02 |
| SND-PRP-01 … 03 | Proposals & pay | FLOW 03 |
| SND-MOB-01 … 04 | Mobile ops | FLOW 04–05 |
| SND-SRG-01 | Surcharge | FLOW 05 |
| SND-TRK-01 | Tracking (web) | FLOW 04 |

---

## FLOW 01: Onboarding (Web)

`SND-ONB-01` ──► `SND-ONB-02` ──► `SND-ONB-03` ──► `SND-ONB-04` ──► `SND-ONB-05`

### Welcome · SHR-AUTH-01 / SND-ONB-01

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ 9:41            🔋   │     │ 9:41            🔋   │     │ 9:41            🔋   │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│      [Clox logo]     │     │ ←  Get started       │     │ ←  Verify code       │
│                      │     │                      │     │                      │
│  Full-load freight   │     │ Email or mobile      │     │ Sent to +61 ••• 234  │
│  made simple. Book,  │     │ [________________]   │     │ [_][_][_][_][_][_]   │
│  pay, track.         │     │                      │     │ Resend in 0:42       │
│                      │     │ [x] Terms & Privacy  │     │                      │
│ [ Create account  ]  │     │                      │     │ [    Verify     ]    │
│ [ Sign in         ]  │     │ [  Send OTP  →   ]   │     │                      │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
   Welcome                      Register / OTP send           OTP verify
```

### Account type · KYB/KYC · Payment · Active

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ ←  Account type      │     │ ←  Verify business   │     │ ←  Payment setup     │
│ ● ○ ○ ○              │     │ ● ● ○ ○              │     │ ● ● ● ○              │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ How will you ship?   │     │ ABN / ACN            │     │ ┌──────────────────┐ │
│ ┌──────────────────┐ │     │ [______________]   │     │ │ Visa •••• 4242   │ │
│ │ ● Business  KYB  │ │     │ Legal name           │     │ │ Default    ✓     │ │
│ └──────────────────┘ │     │ [______________]   │     │ └──────────────────┘ │
│ ┌──────────────────┐ │     │ Status: Verifying…   │     │                      │
│ │ ○ Individual KYC │ │     │        [Verified ✓]  │     │ [ Add payment → ]  │
│ └──────────────────┘ │     │                      │     │                      │
│ [ Continue →      ]  │     │ [ Continue →      ]  │     │ [ Finish setup  ]  │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
   SND-ONB-02                  SND-ONB-03                  SND-ONB-05 → active
```

**Steps**

1. **Welcome** — Value prop; Create account or Sign in.
2. **Register** — Email/phone, OTP (SHR-AUTH-02).
3. **Account type** — Business (KYB) or Individual (KYC).
4. **Verification** — Provider check; manual review → `sender_pending_review` if needed.
5. **Invoice profile** — Legal name, AU address, GST (SND-ONB-04, not shown).
6. **Payment** — Stripe customer + default PM → `sender_active`.

**Gated:** Booking disabled until `sender_active` + payment ready.

---

## FLOW 02: Create & publish job (Web)

`SND-JOB-01` ──► `SND-JOB-02` ──► `SND-JOB-03` ──► `SND-JOB-04` ──► `SND-JOB-05`

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ ←  New job      1/5   │     │ ←  Load details  2/5  │     │ ←  Site access  3/5  │
│ ● ○ ○ ○ ○            │     │ ● ● ○ ○ ○            │     │ ● ● ● ○ ○            │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ (•) Per-km  ( ) Hourly│     │ Weight kg [6200]    │     │ Maneuverability      │
│ Pickup  [Search___]  │     │ L×W×H cm              │     │ [Easy ▼]             │
│ Drop    [Search___]  │     │ [ ] DG  [ ] Reefer    │     │ Dock [Standard ▼]    │
│ Date [__] Time [__]  │     │ Chargeable: 6,200 kg  │     │ Clearance [4.2m]     │
│                      │     │                      │     │                      │
│ [ Next →         ]   │     │ [ Next →         ]   │     │ [ Next →         ]   │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘

┌──────────────────────┐     ┌──────────────────────┐
│ ←  Vehicle class 4/5 │     │ ←  Review & publish   │
│ ● ● ● ● ○            │     │ ● ● ● ● ●            │
├──────────────────────┤     ├──────────────────────┤
│ Min: Rigid 8t        │     │ Melbourne → Geelong  │
│ ● Rigid 8t  Perfect✓│     │ Est. from $1,400     │
│ ○ Rigid 12t Extra    │     │ Payment: (•) A pay   │
│ ⊗ Van      disabled  │     │   on accept          │
│                      │     │ [ Publish job  → ] │
│ [ Next →         ]   │     │ (B: Pay deposit first)│
└──────────────────────┘     └──────────────────────┘
```

**Steps**

1. **Lane** — Pricing mode; pickup/drop; time (hourly: up to 4 pickups).
2. **Load** — Weight, dims, DG flags; chargeable weight calc.
3. **Site suitability** — Maneuverability, dock, clearance.
4. **Vehicle class** — System min class; undersized disabled.
5. **Publish** — Model A: open for bids; Model B: deposit (SND-PAY-02) then publish.

---

## FLOW 03: Proposals & accept (Web)

`SND-PRP-01` ──► `SND-PRP-02` ──► `SND-PRP-03` ──► (payment states)

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ ←  Proposals #1042   │     │ ←  Acme Haulage        │     │  Confirm & pay       │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ 3 bids · Closes 2h   │     │ ★ 4.8 · Verified ✓   │     │        ✓             │
│ ┌──────────────────┐ │     │ Vehicle: Rigid 8t    │     │  Payment successful  │
│ │Acme · $1,770 [→]│ │     │ Driver: J. Smith      │     │  Job #1042 confirmed │
│ └──────────────────┘ │     │ ETA pickup 14:30     │     │  Ref: CLX-88421      │
│ ┌──────────────────┐ │     │ Gross: $1,770        │     │                      │
│ │Metro · $1,820   │ │     │ [ Accept & pay → ]   │     │ [ View trip →    ]   │
│ └──────────────────┘ │     │                      │     │ [ Done           ]   │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
   SND-PRP-01                  SND-PRP-02                  Success (paid)
```

### Payment states (after accept)

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│        ◌             │     │        ⚠             │     │        ✕             │
│   Processing…        │     │  Payment failed      │     │  Action required     │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ Securing $1,770      │     │ Card declined        │     │ Complete 3DS         │
│ Job #1042            │     │ Assignment on hold   │     │ [ Continue →     ]   │
│ Status [Pending]     │     │ [ Retry payment  ]   │     │                      │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
   Pending                     Failed                      requires_action
```

**Steps**

1. **Inbox** — Compare proposals; sort by price/ETA/rating.
2. **Detail** — Vehicle, driver, ETA, gross fare.
3. **Accept & pay** — Model A full fare or Model B balance; Stripe confirm.
4. **States** — Pending webhook → success, or retry / SCA.

**Gated:** Trip execution blocked until `paid_and_confirmed`.

---

## FLOW 04: Track shipment (Mobile)

`SND-MOB-01` ──► `SND-MOB-02`

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ 9:41            🔋   │     │ 9:41            🔋   │     │ 9:41            🔋   │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ Clox          [🔔]   │     │ ←  Track #1042       │     │  Activity            │
│ ┌──────────────────┐ │     │ ┌──────────────────┐ │     │ TODAY                │
│ │ ACTIVE           │ │     │ │    [  MAP     ]  │ │     │ ● Trip started 14:02 │
│ │ #1042 In transit │ │     │ │  ●───────○       │ │     │ ● At pickup 13:40    │
│ │ ETA drop 16:45   │ │     │ └──────────────────┘ │     │ YESTERDAY            │
│ │ [ Track →     ]  │ │     │ Acme · J. Smith    │     │ ○ Job published      │
│ └──────────────────┘ │     │ ETA 16:45          │     │                      │
│ Recent               │     │ [Contact carrier]  │     │ [All][In][Out] chips │
├──────────────────────┤     └──────────────────────┘     └──────────────────────┘
│ 🏠  📍  ✓  👤       │     SND-MOB-02                 SND-MOB-01 history
└──────────────────────┘
   SND-MOB-01 Home
```

**Steps**

1. **Home** — Active job card; tap to track.
2. **Track** — Map + timeline; enabled after driver starts trip.
3. **Activity** — Optional full event log (web SND-TRK-01 equivalent).

---

## FLOW 05: Approvals — surcharge & waiting (Mobile + Web)

`SND-MOB-03` / `SND-SRG-01`

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ ←  Approvals      ●1  │     │  Action required     │     │        ✓             │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ ┌──────────────────┐ │     │ Mass over declared   │     │  Surcharge paid      │
│ │ Mass surcharge   │ │     │ +420 kg              │     │  Driver can proceed  │
│ │ $180 · Job #1042│ │     │ Additional: $180     │     │  [ Done          ]   │
│ │ [Review →]       │ │     │ [View evidence]      │     │                      │
│ └──────────────────┘ │     │ [Dispute] [Pay →]  │     │                      │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
   Inbox                       Detail                       Success
```

**Steps**

1. Push/inbox when mass mismatch or waiting overage requires payment.
2. Review evidence → Pay or Dispute (ops queue).
3. Success unlocks driver **Start trip** gate.

---

## FLOW 06: Profile & account (Mobile / Web)

`SHR-PROF-01`

```
┌──────────────────────┐
│ ←  Account           │
├──────────────────────┤
│  (C)  Chidi Moyo  ✓  │
│  chidi@example.com   │
│  [ID Verified] [GST] │
├──────────────────────┤
│  Personal details  › │
│  Payment methods   › │
│  Invoices          › │
│  Notifications     › │
│  Help & support    › │
│  Sign out            │
└──────────────────────┘
```

---

## RBAC boundaries

Cannot: bid, manage fleet, run driver gates, access Ops portal.

---

## Related docs

- [README](README.md) · [driver.md](driver.md) · [transport-company.md](transport-company.md)
