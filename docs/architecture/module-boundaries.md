# Module boundaries (Phase 1)

Canonical architecture: [backend-architecture.md](../architecture/backend-architecture.md).

## Ownership (write owner per table)

| Module | Owns (tables / concerns) |
|--------|--------------------------|
| `identity` | `User`, `AdminUser`, `AdminScope`, OTP/JWT sessions (auth migrates here over M1) |
| `compliance` | Review cases over `ComplianceDocument` status |
| `documents` | Upload URLs, hashes, `storageKey` / blob refs |
| `jobs` | `Job`, `JobStop`, publish / RFP |
| `matching` | Eligibility / vehicle rules (reads jobs + fleet) |
| `trips` | `Trip` state machine, POD refs |
| `payments` | `PaymentEvent`, Stripe PI / Transfer orchestration |
| `settlements` | `SettlementLine` accruals / cycles |
| `geolocation` | Location ingest, PostGIS geofence (Valhalla client) |
| `notifications` | Email / push abstraction |
| `ops` | Queues, disputes, `PolicyVersion` facades |
| `audit` | `AuditEvent` append-only |

Phase 0 `leads` / `admin` remain until identity/ops absorb them.

## Rules

1. No cross-module writes to another module’s tables — use facades or domain events.
2. Money fields are **integer cents AUD**; always store ex / GST / inc where charged.
3. Scope filters (`AdminScope` → `Region` / `LocalTerritory`) are enforced **server-side**.
4. Clients call only `/v1/...` — never modules directly.
