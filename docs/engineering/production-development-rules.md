# Production Development Rules — Clox

**Status:** Canonical engineering standard  
**Applies to:** `api/` · `web/` · `admin/` · future `mobile/`  
**Cursor rules (always / glob-scoped):** `.cursor/rules/*.mdc`  
**Architecture:** [backend-architecture.md](../architecture/backend-architecture.md)

This document is the full rulebook. Cursor loads concise `.mdc` excerpts automatically; use this file for the complete standard.

---

## Technology Stack

### Frontend

| App | Stack |
|-----|--------|
| `web/` | **Next.js** · React · TypeScript · Zustand · TanStack React Query · Axios · Tailwind · react-i18next |
| `admin/` | **Vite** · React · TypeScript · Zustand · TanStack React Query · Axios · Tailwind |

### Backend

* **NestJS** · TypeScript · REST `/v1` · **PostgreSQL** · **Prisma ORM**
* Shape: **modular monolith** (modules ready to extract as microservices later)

### Also Phase 1

* Stripe Connect · Valhalla · PostGIS · object storage · SMTP/push as specified in Phase 1 plan

---

# 1. Core Engineering Principles

Always write code as if the application will be maintained by a large engineering team.

* Keep code simple, readable, predictable and maintainable.
* Prefer clarity over cleverness.
* Follow SOLID principles where applicable.
* Follow DRY, but do not over-engineer.
* Prefer composition over inheritance.
* Avoid premature abstractions.
* Do not duplicate business logic.
* Keep functions small and focused.
* Each module should have a clear responsibility.
* Separate business logic from UI logic.
* Separate API communication from components.
* Separate database logic from business logic.
* Never put everything into a single file.
* Avoid deeply nested conditions.
* Avoid magic numbers and magic strings.
* Use constants/enums/configuration for repeated values.
* Never introduce unnecessary dependencies.
* Before adding a new abstraction, check whether an existing utility/service/component can be reused.

---

# 2. TypeScript Rules

* Avoid `any`. Do not use `any` just to fix TypeScript errors.
* Prefer proper interfaces/types. Use `unknown` when genuinely unknown.
* Never use `@ts-ignore` unless absolutely unavoidable; if required, comment why.
* Prefer type-safe parameters and return values.
* Use discriminated unions when appropriate.
* Avoid excessive type assertions (`as`).
* Keep shared types centralized.
* API request and response types must be explicitly defined.

```ts
// BAD
const user: any = response.data;

// GOOD
const user: UserResponse = response.data;
```

---

# 3. Naming Conventions

### Variables — camelCase

Meaningful names (`userProfile`, `verificationStatus`). Avoid `usr`, `data1`, `temp`, `x` unless tiny scope.

### Functions — verbs

`getUserById()`, `createUser()`, `validateUser()`, `handleSubmit()`. Avoid vague `process()`, `doSomething()`.

### Booleans

`isActive`, `isLoading`, `hasPermission`, `canEdit`, `shouldRefresh`.

### Components — PascalCase

`UserProfile`, `CreateUserModal`.

### Hooks — `use*`

`useAuth()`, `useUsers()`.

### Services

`UserService`, `AuthService` (or `user.service.ts` Nest style).

### Constants — UPPER_SNAKE for true globals

`MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`. Do not uppercase every variable.

---

# 4. File Naming

| Kind | Example |
|------|---------|
| Components | `UserProfile.tsx` |
| Hooks | `useAuth.ts` |
| Services | `user.service.ts` |
| Utils | `date.util.ts` |
| Types | `user.types.ts` |
| Constants | `app.constants.ts` |

Avoid: `helper.ts`, `common.ts`, `misc.ts`, `stuff.ts` without a clear purpose.

---

# 5. Project Architecture

Prefer feature/domain-oriented layout.

### Frontend (illustrative)

```text
src/
├── app/                    # Next.js app router (web)
├── components/ui|shared/
├── features/<domain>/
│   ├── components|hooks|services|types|schemas/
├── hooks|lib|stores|services|types|constants|utils/
```

### Backend

```text
api/src/
├── modules/<domain>/
│   ├── controllers|services|dto|guards|...
│   └── <domain>.module.ts
├── common|config|prisma|workers/
└── main.ts
```

Do not create empty folders for architecture theater. Align with [backend-architecture.md](../architecture/backend-architecture.md).

---

# 6–11. React / Zustand / React Query / Axios / API layer

* Prefer Server Components in Next.js; `"use client"` only when required.
* Components: render, interaction, UI state, hooks — not large API/business/DB logic.
* **Zustand** = client/global UI state. **React Query** = server state. Do not duplicate.
* Centralize query keys; invalidate only affected queries.
* Centralized Axios `apiClient` + interceptors; API calls in services.
* Flow: `Component → Hook → Service → Axios → Backend`.

---

# 12. API Response Standards

```json
{ "success": true, "data": {}, "message": "User fetched successfully" }
```

```json
{
  "success": true,
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

```json
{ "success": false, "message": "User not found", "code": "USER_NOT_FOUND" }
```

Do not expose stack traces, SQL, or secrets.

---

# 13–14. NestJS & DTOs

* Modular architecture; thin controllers; fat services.
* Every external input has a validated DTO (body, query, params, files).
* Never trust client input.

---

# 15–19. Database

* PostgreSQL is critical: PK/FK/unique/NOT NULL/indexes/transactions.
* Enforce integrity in DB, not only in app.
* Naming: DB `snake_case`, TS `camelCase`.
* Every schema change = Prisma migration; no manual prod DDL; no destructive data ops without approval.
* Transactions for multi-step writes; pagination; avoid N+1; index real query patterns.
* Clox: money in **integer cents AUD**; prefer UUIDs.

---

# 20–21. Security & Auth

* No hardcoded secrets; no committed `.env`; no logging tokens/passwords.
* AuthN and AuthZ enforced **server-side**. Frontend checks are UX only.
* Prefer `@Roles()` / scope guards (Super / State / Local territory).

---

# 22–24. Errors, logging, config

* No empty `catch`. Consistent HTTP errors + structured logs.
* Env-based config; validate at startup; fail fast.
* Separate development / test / staging / production.

---

# 25–32. Validation, UI quality, performance, a11y

* Validate at UI → API → business → DB.
* Loading / empty / error states; pagination for large lists.
* Accessible, responsive UI.
* Measure before micro-optimizing.

---

# 33–39. Types, business logic, utils, testing

* Centralize API types; backend owns critical business rules.
* Utils pure/small; no domain logic in generic utils.
* Split giant files when responsibility blurs.
* Comments explain **why**, not what.
* Test critical auth, rules, APIs, edge cases; meaningful tests over vanity coverage.

---

# 40–45. Git, deps, APIs

* Focused conventional commits; never commit secrets/`node_modules`.
* Justify new dependencies.
* REST nouns + correct status codes; prefer backward-compatible API changes.

---

# 46–50. Review mindset & final goal

Before done, verify architecture layers, TypeScript, FE/BE/DB/security/UX.

Goal: readable, maintainable, reusable, type-safe, testable, secure, performant, production-ready code.

> If another senior developer joins in six months, will they understand why this exists?

---

# 51. Cursor Execution Workflow

1. **Understand** — read, search, identify reuse and affected layers.  
2. **Plan** — files, API/DB, edge cases (proportional).  
3. **Implement** — smallest clean solution; existing patterns first.  
4. **Validate** — tsc/lint/tests/contracts/migrations/states (only claim what you ran).  
5. **Review** — duplication, complexity, security, breakage.  
6. **Report** — implemented / files / API / DB / validation / notes.

**Rules:** Inspect before modifying · Search before creating · Reuse before duplicating · Plan before implementing · Validate after · Review before finishing · No unrelated refactors · No hiding errors · Never claim unfinished work.

---

## Related

| Doc | Purpose |
|-----|---------|
| `.cursor/rules/*.mdc` | Auto-applied Cursor rules |
| [PHASE-1-IMPLEMENTATION-PLAN.md](../PHASE-1-IMPLEMENTATION-PLAN.md) | Milestone build plan |
| [backend-architecture.md](../architecture/backend-architecture.md) | Modular monolith design |
| [stripe-payment-specification.md](../payments/stripe-payment-specification.md) | Payments |
