# Security Baseline - Clox Platform

## Security Objectives
- Protect financial transactions, identity data, and shipment operations.
- Enforce least privilege by role and business function.
- Provide immutable traceability for legal and dispute contexts.

## Identity and Access
- OTP-based authentication with optional step-up verification for sensitive actions.
- Role-based access control (RBAC) for Super Admin, State Admin, Local Admin, Sender, Carrier, Driver.
- Session controls:
  - short-lived access tokens
  - refresh token rotation
  - device/session revocation support

## Data Protection
- Encryption in transit (TLS 1.2+).
- Encryption at rest for databases and object storage.
- Sensitive PII/document data access restricted by policy and purpose.
- Signed URL and time-limited access for document/media retrieval.

## API and Application Security
- Input validation and schema enforcement on all public endpoints.
- Idempotency requirements for payment and assignment-critical endpoints.
- Rate limiting and abuse protection per role and endpoint category.
- Secure file upload pipeline with mime/type checks and malware scanning.

## Payment and Financial Security
- Use PCI-compliant provider boundaries (no raw card handling in Clox services).
- Strict payment state machine to prevent duplicate charges/payout drift.
- Reconciliation jobs and anomaly detection for charge/transfer mismatches.

## Operational Security
- Centralized audit logs for onboarding, assignment, payouts, overrides, and policy changes.
- Secrets management via vault; no secrets in code or client apps.
- Environment isolation across dev/stage/prod with separate credentials.
- Key and credential rotation policy with incident response runbook.

## Mobile and Device Controls
- Secure storage for tokens and sensitive app state.
- App integrity checks and TLS certificate pinning strategy (where feasible).
- Upload metadata validation (GPS/time consistency checks for POD evidence).

## Compliance and Governance
- Data retention and deletion policy for KYC/KYB and POD artifacts.
- Access logging and export support for legal audits.
- Jurisdiction-aware privacy and data processing disclosures.

## Security Monitoring
- Threat detection for suspicious login, payment fraud, and admin misuse.
- Alerting for high-risk actions:
  - payout destination changes
  - repeated failed verification
  - unusual surcharge patterns

## Phase Recommendations
- Phase 1: RBAC, audit logging, secure uploads, payment state controls, basic fraud monitoring.
- Phase 2: advanced anomaly detection, risk scoring, adaptive authentication controls.
