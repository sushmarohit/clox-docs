---
trigger: always_on
description: Before/while shipping features or fixes, map impact, corner cases, and loopholes so existing working behavior is not broken
---

# No regressions when implementing features or fixes

When adding or changing anything, **protect existing functionality that already works**. A feature or fix is incomplete if it breaks another role, flow, page, API, or edge path that was correct before.

## Required before implementing

1. **Map blast radius** — which modules, roles, shared UI, APIs, schemas, and nav/shell layouts the change touches.
2. **Identify dependents** — search for callers of shared components, services, types, CSS classes, and routes you will edit.
3. **Preserve contracts** — do not silently rename/remove API fields, change auth gates, or alter shared component props without updating all callers.
4. **List corner cases** — empty/null data, already-submitted states, mobile vs desktop, offline/slow network, large files, expired sessions, wrong role, partial onboarding, and “same action twice.”
5. **Hunt loopholes** — can the user bypass a gate, double-submit, upload after lock, see another company’s data, or leave UI labels that contradict backend state?

## Required while implementing

- Prefer **narrow, local changes**; avoid drive-by rewrites of unrelated working code.
- Reuse existing patterns; do not invent a parallel path that drifts from working flows.
- Shared primitives (shell, FileInput, Select, buttons, CSS tokens) must stay backward-compatible for every role that uses them.
- If a shared change is required, update **all** affected call sites in the same change.
- Fix the root path **and** the adjacent paths that share the same helper/API (e.g. every role that uploads, not only the page in the screenshot).

## Required before claiming done

- Mentally (and when feasible, actually) re-check **adjacent working flows**: other roles, onboarding steps, submit/upload, lists/filters, and navigation.
- Re-check **happy path + failure path + edge path** for the touched flow.
- Run relevant typecheck / lint / targeted tests for touched areas; fix anything you broke.
- In the report, note **regression risk** (what else could be affected), **corner cases considered**, and what you verified.

## Status / payment / lifecycle contracts (especially after exceptions / reassign)

When changing trip exceptions, reassign, payments, or assignment transitions:

1. Re-check the **happy path**: create job → bid → accept → pay → lock → trip → complete.
2. Preserve meaning of flags such as `paidAndConfirmed` across **all** post-payment states (`LOCKED` and `COMPLETED`), not only the status you are editing.
3. Do not show “pending payment” / Complete payment CTAs unless assignment is actually `PENDING`.
4. UI labels must not contradict payment (`SUCCEEDED`) or assignment lifecycle (e.g. `COMPLETED · pending payment`).
5. Verify sender, carrier, and driver views for the same job after the change.

## Forbidden

- Shipping a feature/fix that leaves previously working screens unusable (e.g. scroll broken, buttons untappable, missing required fields).
- “Fixing” one role’s UI by changing shared layout/CSS in a way that breaks another role without checking.
- Assuming “only this page uses it” without searching the codebase.
- Treating only `LOCKED` as paid when trip completion moves assignments to `COMPLETED`.
- Closing a bug for one device/role while the same root cause still exists for other call sites.
