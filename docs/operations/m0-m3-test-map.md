# Automation map — M0–M3 edge cases → tests

See full catalogue: [m0-m3-edge-cases.md](m0-m3-edge-cases.md)

| Layer | Location | Run |
|-------|----------|-----|
| Unit / schema / go-no-go | `api/src/**/*.spec.ts` | `npm run test:api` / `npm run test:edge` |
| UI smoke + i18n (no API) | `e2e/tests/smoke/` | `npm run test:e2e:smoke` |
| Functional API + UI (needs API) | `e2e/tests/api-backed/` | `npm run test:e2e:api` |

## Case → test references

### M0
| ID | Test |
|----|------|
| M0-1 | `health.controller.spec.ts`; e2e `m0-m1-auth` health |
| M0-3 | `env.validation.spec.ts` |
| M0-7/M0-8 | e2e `m0-m1-auth` correlation + security headers |
| M0-9 | e2e module `_status` stubs |

### M1
| ID | Test |
|----|------|
| M1-1/2/7/11/13/17/18/22/26/35 | e2e `m0-m1-auth.spec.ts` |
| M1-2/13 | `edge-schemas.spec.ts` OTP |
| RBAC/scope | `roles.guard.spec.ts`, `scope.service.spec.ts` |
| UI OTP + sign-out | e2e `ui-roles-wizard.spec.ts` |

### M2
| ID | Test |
|----|------|
| M2-1 | `edge-schemas.spec.ts` + e2e mime |
| M2-2/3/7/12/21/26 | e2e `m2-compliance.spec.ts` |
| Local approve deny | `compliance.service.spec.ts` |

### M3
| ID | Test |
|----|------|
| Go/no-go matrix | `sender.go-nogo.spec.ts` |
| Stripe mock | `stripe.service.spec.ts` |
| M3-1/2/6/18/21/28/29 + happy profile | e2e `m3-sender.spec.ts` |
| UI roles + onboarding content | e2e `ui-roles-wizard.spec.ts` |
| Register terms UI | e2e smoke `login-i18n-content` |

### Content / i18n
| Check | Test |
|-------|------|
| EN/HI key parity | smoke `locale files have matching keys` |
| Language switcher | smoke HI/EN switch |
| Translated strings differ | smoke Hindi ≠ English |
| Brand CLOX | smoke login content |
