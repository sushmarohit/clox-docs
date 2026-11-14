---
trigger: always_on
description: Before new code, prefer existing shared helpers; extract generic choke-points when the same flow repeats
---

# Reuse before write

## Before writing any new code

1. **Search first** — look for an existing helper, hook, API client, component, util, or pattern that already does this (or most of it). Prefer extending it over copying.
2. **Ask “can this be shared?”** — if the same flow will (or already does) appear in more than one page/role/module, put it in one shared place and call that place from every site.
3. **Prefer one choke-point** — cross-cutting concerns (upload, auth headers, money format, status labels, error mapping) must not be re-implemented per page. One function/module owns the behavior; callers stay thin.
4. **Make it generic, not clever** — shared APIs should take clear inputs (ids, `File`, doc type) and return typed results. Avoid page-specific branching inside the shared helper unless every caller needs it.
5. **Do not invent a parallel path** — if a shared helper exists, use it. Do not add a second compress/upload/format/validate path “just for this screen.”

## When the same logic already exists in 2+ places

- Extract (or extend) a shared helper in the same change.
- Migrate call sites to the shared API so future work cannot skip it.
- Keep behavior identical unless the task explicitly changes it.

## Concrete example (document upload)

```text
❌ BAD — each onboarding page: resolve MIME → createIntent → put → confirm (easy to forget mobile compress)
✅ GOOD — uploadAndConfirmDocument() in admin/src/lib/api/compliance.ts
         (prepare/compress → intent → PUT → confirm); every role calls this
```

## Checklist (every feature / fix)

- [ ] Searched for existing util / API / component before adding new files
- [ ] If logic repeats across roles/pages → shared helper (or extended existing one)
- [ ] No duplicate parallel implementation left behind
- [ ] Call sites updated in the same change
