# Product Requirements Document (PRD) - Clox Freight Forwarding

Technical architecture and end-to-end flow: [system-design.md](system-design.md)

## Product Vision
Deliver a compliance-first freight marketplace connecting senders and transport companies for full-load transport, with transparent pricing, controlled assignment, and auditable trip execution.

## Users and Roles
- Super Admin (global governance and pricing controls)
- State Master Admin (regional oversight)
- Local BDE Admin (local growth/support)
- Sender (book and pay for transport)
- Transport Company (bid, assign, execute)
- Driver (execute trip and collect proof)

Role-based screen flows (navigation, journeys, wireframes): [screen-flows/README.md](screen-flows/README.md)

## Problem Statement
Current freight booking and dispatch processes are fragmented, manual, and dispute-prone. Clox must digitize booking, compliance checks, assignment, and trip evidence while preserving legal and operational controls.

## Goals
- Reduce under-booking and wrong-vehicle incidents.
- Improve assignment reliability and carrier accountability.
- Automate billing triggers for waiting and discrepancy scenarios.
- Provide trusted trip evidence for dispute reduction.

## Non-Goals (Phase 1)
- End-to-end AFM automation.
- Full predictive profit optimization.
- Cross-border regulatory support.

## Functional Requirements

### FR-1 Onboarding and Verification
- OTP registration for all users.
- Sender branches:
  - Business: ABN/ACN verification
  - Individual: government ID verification
- Carrier compliance gate before bid eligibility.

### FR-2 Job Creation (Sender)
- Enter pickup/drop points and load details.
- Select pricing mode:
  - Hourly (local, 4-hour minimum)
  - Per-km (regional/interstate)
- Load type selection and special requirements.
- Site suitability form:
  - Maneuverability
  - Dock profile
  - Clearance constraints

### FR-3 Vehicle Recommendation and Eligibility
- System computes minimum vehicle class from declared load.
- Disable undersized options.
- Allow larger class subject to policy and repricing.
- Show fit indicators (perfect fit, extra space, overload risk).

### FR-4 Bidding and Award
- Job is broadcast to eligible carriers.
- Carrier proposes vehicle + driver + ETA + net payout visibility.
- Sender accepts one proposal; assignment lock applied.
- Conflicting overlapping bids for same assigned resources auto-expire.

### FR-5 Trip Execution and State Machine
- Required state progression:
  - Safety check
  - Arrival
  - Loading
  - Mass check submitted
  - Trip started
  - Delivery and POD
- Trip start blocked until mandatory gate checks pass.

### FR-6 Geofencing and Dwell
- Geofence-based arrival/departure capture.
- Free waiting window by policy (pickup/drop configurable).
- Overage waiting triggers automated charge workflow.

### FR-7 Discrepancy and Breakdown Handling
- Driver can report mass discrepancy and breakdown.
- For discrepancy, trigger surcharge approval/payment workflow.
- For breakdown, provide replacement/repair/cancel paths.
- If reassignment occurs, financial transfer adjustments follow payment policy.

### FR-8 Proof of Delivery and Invoicing
- Capture receiver SOG and photo evidence.
- Attach server-side timestamp and GPS metadata.
- Auto-generate POD and tax invoice payload.

## Non-Functional Requirements
- Availability target: 99.9% monthly (Phase 1 target, excluding planned maintenance).
- Auditability: all key actions immutable and traceable.
- Security: encryption in transit and at rest for sensitive data.
- Performance: major user actions under acceptable SLA bands (to be finalized per environment).

## Data Requirements
- Core entities: User, Company, Vehicle, Driver, Job, Proposal, Assignment, Trip, Incident, PaymentEvent, PODEvidence, ComplianceDocument.
- Policy versioning for tariffs, rules, and legal text.

## Phase Plan
- Phase 1:
  - Core marketplace, compliance gate, assignment workflow, trip evidence, geofence waiting logic.
- Phase 2:
  - Fleet+ advanced analytics, profit engine, advanced optimization, expanded AI decisioning.

Program milestones (delivery sequencing, exit criteria, FR traceability): [MILESTONES.md](MILESTONES.md) · Australia-only summary: [MILESTONES-AUSTRALIA.md](MILESTONES-AUSTRALIA.md)

## Acceptance Criteria (High-Level)
- Only compliant carriers can bid.
- Sender cannot finalize an undersized vehicle selection.
- Overlapping resource conflicts are resolved automatically.
- Waiting and discrepancy flows produce deterministic charge states.
- POD includes signed evidence with immutable metadata.
