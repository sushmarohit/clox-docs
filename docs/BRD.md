# Business Requirements Document (BRD) - Clox Freight Forwarding

Technical architecture overview: [system-design.md](system-design.md)

## Document Purpose
Define the business objectives, operating model, regulatory constraints, and scope boundaries for Clox's Australia-first full-load freight marketplace.

## Business Objectives
- Launch a compliant digital freight marketplace for full-load transport (not parcel/courier).
- Improve shipment booking speed and transparency for senders and carriers.
- Reduce disputes through auditable workflows, automated validations, and digital POD.
- Enable sustainable platform economics with a 30% platform fee and structured regional revenue sharing.
- Build a scalable baseline for advanced fleet optimization and AI-assisted decisioning.

## Product Positioning
- Full Load Transport (FLT/FTL) platform: one sender, one dedicated vehicle, one job.
- Australia-focused with architecture that supports future multi-country rollout.
- Role-based experience:
  - Super Admin (HQ)
  - State Master Admin
  - Local BDE Admin
  - Sender
  - Transport Company
  - Driver

## Core Business Rules
- Minimum engagement: hourly local jobs bill minimum 4 hours.
- Chargeable weight: max(dead weight, volumetric weight), where volumetric = `(L x W x H in cm) / 4000`.
- Mass lockout: trip start blocked if vehicle capacity constraints are exceeded.
- Sender pays 100% upfront (subject to pricing and surcharge rules).
- Carrier receives net payout (target 70%) after clearing period and settlement checks.
- If vehicle/driver assignment conflicts occur, only overlapping bids are auto-expired after award.

## Revenue and Settlement Model
- Gross fare split:
  - Carrier share: ~70%
  - Platform share: 30%
- Platform 30% split:
  - Super Admin HQ: 15% of gross
  - State Master Admin: 10% of gross
  - Local BDE Admin: 5% of gross
- State/Local payouts run on fortnightly (14-day) cycle ("4th night" operating phrase).
- If no regional admin exists, regional share defaults to HQ or holding policy (configurable).
- **Phase 1 payment rail:** Stripe Connect — see [payments/stripe-payment-specification.md](payments/stripe-payment-specification.md).

## Regulatory and Compliance Requirements
- KYB/KYC verification for onboarding.
- Carrier compliance gate before marketplace access:
  - ABN/ACN
  - Public liability insurance
  - Transit/cargo insurance
  - RWC and relevant permits
- Dangerous Goods (DG) jobs require appropriate carrier approvals and documentation.
- Driver fatigue in Phase 1: manual work diary operational model, with system-aware scheduling guardrails where configured.

## In-Scope (Phase 1)
- OTP onboarding and verification workflows.
- Single pickup + single drop for per-km jobs.
- Up to 4 pickup stops for hourly local jobs.
- Vehicle recommendation and eligibility validations.
- Bid/proposal workflow, assignment lock, trip lifecycle tracking.
- Breakdown and discrepancy handling with financial adjustment flow.
- Geofence-based arrival and dwell timer for waiting charges.
- Digital POD (Sign-on-Glass + evidence photos + immutable server timestamps).

## Out-of-Scope (Phase 1)
- Full AFM fatigue automation.
- Deep Fleet+ profitability analytics engine.
- Advanced AI training-driven dispatch optimization.
- Passenger (bus/coach) transport-specific regulation support.

## Success Metrics
- Booking-to-award cycle time.
- Job completion rate.
- Dispute rate and resolution time.
- On-time pickup and delivery.
- Compliance rejection rate reduction.
- Gross margin consistency and settlement accuracy.

## Risks and Mitigations
- Regulatory misinterpretation risk -> policy tables + legal review checkpoints.
- Pricing inconsistency risk -> central tariff/version control.
- Payment reversal complexity -> explicit states and fallback flows.
- Fraud and misuse risk -> KYC/KYB + Stripe Radar + audit logs.
- Multi-party dispute risk -> immutable event and evidence timeline.

## Stakeholder Sign-off Areas
- Commercial model and commissions.
- Legal/compliance rulebook.
- Operations and dispute policy.
- Engineering scope by phase.
- Go-live acceptance KPIs.
