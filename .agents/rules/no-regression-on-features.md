---
trigger: always_on
description: Before/while shipping features, verify existing working behavior is not broken
---

# No regressions when implementing features

When adding or changing a feature, **protect existing functionality that already works**. A new feature is incomplete if it breaks another role, flow, page, or API that was correct before.

## Required before implementing

1. **Map blast radius** — which modules, roles, shared UI, APIs, schemas, and nav/shell layouts the change touches.
2. **Identify dependents** — search for callers of shared components, services, types, CSS classes, and routes you will edit.
3. **Preserve contracts** — do not silently rename/remove API fields, change auth gates, or alter shared component props without updating all callers.

## Required while implementing

- Prefer **narrow, local changes**; avoid drive-by rewrites of unrelated working code.
- Reuse existing patterns; do not invent a parallel path that drifts from working flows.
- Shared primitives (shell, FileInput, Select, buttons, CSS tokens) must stay backward-compatible for every role that uses them.
- If a shared change is required, update **all** affected call sites in the same change.

## Required before claiming done

- Mentally (and when feasible, actually) re-check **adjacent working flows**: other roles, onboarding steps, submit/upload, lists/filters, and navigation.
- Run relevant typecheck / lint / targeted tests for touched areas; fix anything you broke.
- In the report, note **regression risk** (what else could be affected) and what you verified.

## Forbidden

- Shipping a feature that leaves previously working screens unusable (e.g. scroll broken, buttons untappable, missing required fields).
- “Fixing” one role’s UI by changing shared layout/CSS in a way that breaks another role without checking.
- Assuming “only this page uses it” without searching the codebase.
