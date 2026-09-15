# Clox Backend Architecture — Modular Monolith → Microservices-Ready

**Status:** Phase 1 canonical  
**Shape:** **One deployable (modular monolith)** designed so bounded contexts can become **microservices later** without a rewrite  
**Stack:** NestJS · Prisma · PostgreSQL (+ PostGIS) · queue workers · object storage  
**Related:** [system-design.md](../system-design.md) · [PHASE-1-IMPLEMENTATION-PLAN.md](../PHASE-1-IMPLEMENTATION-PLAN.md) · [payments/stripe-payment-specification.md](../payments/stripe-payment-specification.md) · [security.md](../security.md)

---

## 1. What you want (confirmed)

| Now (Phase 1) | Later (when needed) |
|---------------|---------------------|
| **Single NestJS app** (`api/`) | Extract hot/isolated domains into services |
| **One PostgreSQL** (schemas/modules owned by context) | Split DBs per service only after clear boundaries |
| **In-process module calls** + domain events | Same events over a bus (Kafka/SQS/NATS) |
| **One `/v1` REST API** | Keep public API; internal RPC/HTTP between services |

This is the standard **modular monolith** pattern: microservice *design*, monolith *deployment*.

---

## 2. High-level runtime (Phase 1)

```text
                    ┌─────────────────────────────────────────┐
  Web / Admin /     │              API Gateway / TLS            │
  Mobile apps  ───► │         (Nest app or reverse proxy)       │
                    └───────────────────┬─────────────────────┘
                                        │
                    ┌───────────────────▼─────────────────────┐
                    │         MODULAR MONOLITH (api/)           │
                    │  identity │ compliance │ jobs │ matching  │
                    │  trips │ payments │ geo │ docs │ ops │ …  │
                    │         + outbox domain events            │
                    └───────┬─────────────┬─────────────┬─────┘
                            │             │             │
                     PostgreSQL      Object store     Queue
                     (+PostGIS)      (docs/POD)     (workers)
                            │
              Workers in same deploy (or same repo process group):
              Stripe webhooks · settlement · expiry watchdog · geo ingest · notify
```

**Clients never call modules directly** — only `/v1/...` HTTP APIs.

---

## 3. Bounded contexts (modules) — the future service map

Each Nest **module** = one future candidate **service**. Keep ownership hard:

| Module | Owns | Sync / async | Likely extract order |
|--------|------|--------------|----------------------|
| `identity` | Users, OTP, JWT, RBAC, AdminScope | Sync | Late (shared) |
| `compliance` | Review cases, doc metadata, approve/reject | Sync + watchdog | Medium |
| `documents` | Upload URLs, hashes, blob refs | Sync | With compliance |
| `jobs` | Job, stops, publish, RFP | Sync | Medium |
| `matching` | Vehicle rules, eligibility filters | Sync | With jobs or later ML |
| `trips` | Trip SM, gates, POD refs | Sync | Medium–early if mobile load |
| `payments` | Stripe PI/Transfer, PaymentEvent | Sync + webhooks | **First extract candidate** |
| `settlements` | Ledger lines, fortnightly cycles | Async workers | With payments |
| `geolocation` | Location ingest, PostGIS geofence, dwell | Async heavy | Early if GPS volume high |
| `notifications` | Email/push abstraction | Async | Easy extract |
| `ops` | Queues, disputes, policy facades | Sync | Stays with BFF/admin longer |
| `audit` | Append-only events | Sync write | Shared or sidecar |

**Rule:** Module A must not reach into Module B’s Prisma tables casually. Prefer:

1. Public application service / facade inside the module, or  
2. Domain event (`JobCompleted`, `PaymentCaptured`) via **outbox**.

That is what makes a future split cheap.

---

## 4. Folder layout (NestJS)

```text
api/src/
├── main.ts
├── app.module.ts                 # wires modules only
├── config/
├── common/                       # guards, filters, interceptors (no domain logic)
├── modules/
│   ├── identity/
│   │   ├── identity.module.ts
│   │   ├── api/                  # controllers (HTTP adapters)
│   │   ├── application/          # use cases / services
│   │   ├── domain/               # entities, invariants (optional pure)
│   │   └── infrastructure/       # prisma repos, stripe/OTP adapters
│   ├── compliance/
│   ├── documents/
│   ├── jobs/
│   ├── matching/
│   ├── trips/
│   ├── payments/
│   ├── settlements/
│   ├── geolocation/
│   ├── notifications/
│   ├── ops/
│   └── audit/
├── workers/                      # OR modules/*/workers — same deploy
└── prisma/
    └── schema.prisma             # Phase 1 single schema; logical grouping by comments/schemas
```

Optional later: PostgreSQL **schemas** per context (`identity`, `jobs`, …) inside one database — soft isolation before true DB split.

---

## 5. Communication patterns

### Inside the monolith (Phase 1)

| Pattern | Use when |
|---------|----------|
| Direct application-service call | Same request, strong consistency (accept bid + create PI orchestration in payments from jobs) |
| **Outbox → queue → worker** | Stripe webhooks, emails, settlement, expiry, geo processing |
| Domain events | `ProposalAccepted`, `TripStarted`, `TripCompleted`, `ComplianceApproved` |

### After extract (future)

| Pattern | Use when |
|---------|----------|
| Sync HTTP/gRPC | Rare; prefer events |
| Event bus | Cross-service facts |
| API composition / BFF | Mobile needs aggregated reads |

**Do not** start with “everything is a microservice message.” Money, assignment, and trip gates stay **transactional** in one place until extract is forced.

---

## 6. Data rules (split-ready)

1. **One write owner per table** (e.g. only `payments` writes `PaymentEvent`).  
2. Other modules read via API/query service or **projected read models** updated by events.  
3. **No distributed transactions** across future services — use saga/outbox (e.g. trip complete → settlement worker).  
4. IDs are UUIDs everywhere (safe across services).  
5. Money in **integer cents AUD**.

---

## 7. Sync API vs workers

| Must be synchronous (request path) | Async (queue workers) |
|------------------------------------|------------------------|
| Auth, RBAC | Stripe webhook processing |
| Accept proposal + create PaymentIntent | Settlement Transfers |
| Trip gate transitions | Doc expiry suspend |
| Ops approve/reject | Notification fan-out |
| Job publish validation | Geofence evaluation / dwell tick |

Workers run **in the same repo/deploy** initially (`workers/` or Nest microservice process sharing modules). Later, deploy workers independently without changing module code.

---

## 8. External systems (Phase 1)

| System | Owner module | Notes |
|--------|--------------|-------|
| Stripe Connect | `payments` / `settlements` | Required |
| Valhalla | `jobs` / `matching` | Routing / TSP |
| PostGIS | `geolocation` | Geofence / dwell |
| ABR (optional) | `compliance` | Free ABN assist for Ops |
| Object storage | `documents` | Docs + POD |
| SMTP / push | `notifications` | Alerts |

**Not in Phase 1 modules as live integrations:** easyAML, malware scan, Monoova, Radar (PostGIS replaces Radar for now).

---

## 9. When to split into microservices

Extract a module only when **at least two** are true:

- Independent scaling (e.g. GPS ingest floods the API)  
- Independent release cadence / team ownership  
- Clear failure isolation (payments outages must not take down job browse)  
- Operational pain of monolith deploy is worse than distributed complexity  

**Typical first extracts for Clox:**

1. `payments` + settlement workers  
2. `geolocation` ingest  
3. `notifications`  
4. Fleet+ analytics (Phase 2)

Keep `identity` shared (or as an auth service) last.

---

## 10. Extract playbook (future)

1. Freeze module public interface (application services + events).  
2. Move module to `services/payments/` (or new repo).  
3. Replace in-process calls with HTTP/events.  
4. Move owned tables to dedicated DB (or schema first).  
5. Deploy separately; leave monolith as BFF/orchestrator initially.  
6. Delete dead code from monolith.

If modules were clean, this is a **move**, not a rewrite.

---

## 11. Phase 1 non-negotiables (checklist)

- [ ] One Nest deployable for product API  
- [ ] Nest modules = bounded contexts listed above  
- [ ] No cross-module table writes  
- [ ] Outbox (or equivalent) for domain events  
- [ ] Stripe/webhooks/settlement as workers  
- [ ] `/v1` versioned REST + OpenAPI  
- [ ] UUID + AUD cents conventions  
- [ ] ADR: “Modular monolith; microservices deferred”  

---

## 12. Document control

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-09-14 | Modular monolith + future extract map aligned to product Phase 1 |
