---
trigger: glob
globs: web/src/shared/types.ts,api/src/shared/types.ts,web/src/components/*-form.tsx,api/src/modules/leads/**,api/src/modules/notifications/**
description: Public lead/registry form QA gates — validation, submit UX, email
---

# Public form QA gates (registry / EOI / investor)

Prevent recurrence of pre-launch registration defects. Apply on any change to public lead forms, Zod schemas, or lead notification mail.

## Validation (client + server must match)

- **Organization / legal names**: whitelist letters, digits, spaces, and business punctuation (`.'&-()/`). Reject symbol-only junk (e.g. `!@#$%^&*()_+`).
- **Person names**: letters + spaces / apostrophes / hyphens / periods only.
- **Phone (AU)**: allow only `+`, digits, spaces, `()`, `-`. Never strip letters to “fix” input — reject letters. Digits must match `61…` or `0…` patterns.
- Keep **web** and **api** Zod rules in parity; add regression cases in `api/src/shared/edge-schemas.spec.ts` for every new rule.

## Submit UX

- Disable **Submit** while `mutation.isPending` (loader required).
- Disable **Back / Details** and other navigation that mutates wizard state while pending.
- Guard `onSubmit` with an early `if (isPending) return` (do not rely on button disabled alone).
- Server: within 24h, same email + lead type (+ ABN when present) must return the existing lead (idempotent) — no second insert, no second confirmation email.
- Prefer idempotent / duplicate-safe server behavior for retries after timeout; never assume the first timed-out request failed.

## Confirmation email

- Registry success path must attempt `notifyLeadSubmitted` (async; must not block HTTP success incorrectly).
- SMTP optional in local/dev → mail may be skipped; document that QA needs `SMTP_*` configured to assert delivery.
- Temporary / disposable inboxes (e.g. Yopmail) are valid SMTP recipients if deliverable; do not treat “no mail in temp inbox” as a product bug without checking server logs for `SMTP not configured` or send failures.
- Do not block registration solely because the domain is temporary unless product explicitly requires disposable-email blocking.

## Definition of done for form changes

- [ ] Client + API schemas updated together
- [ ] Negative regression tests for the exact bad payloads QA found
- [ ] Submit + secondary actions locked while pending
- [ ] Timeout / network error copy warns user not to double-submit blindly
