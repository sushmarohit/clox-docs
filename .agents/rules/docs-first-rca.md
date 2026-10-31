---
trigger: always_on
description: Docs-first RCA — no assumptions, no workarounds, ask when unclear
---

# Docs-first root cause analysis

## Before changing code

1. **Find the root cause** — diagnose the real failure (code, contract, config, data, or missing requirement). Do not treat symptoms.
2. **Read project docs first** — BRD/PRD, Phase 1 plan, ADRs, UI-UX specs, onboarding, module docs under `docs/`, plus matching code. Cite the doc path (and section when useful) when the decision comes from docs.
3. **No assumptions** — if docs and code disagree, or the requirement is ambiguous, **ask the user** before implementing. Do not invent product rules.
4. **Notice weirdness → ask** — unexpected schema, dual sources of truth, hard-coded hosts, silent fallbacks, or behavior that conflicts with docs: surface it and ask; do not silently “fix around” it.

## Forbidden

- Workarounds, band-aids, or temporary hacks presented as the fix
- Patch-only changes that leave the root cause in place
- Guessing env values, business rules, or “what product probably wants”
- Skipping docs because the code “already does something similar”

## Required approach

- Prefer the **correct, durable** approach that matches documented product/engineering intent
- Align API, UI, DB, and tests with that intent in one coherent change
- If docs are silent or conflicting, **stop and ask** with a short options summary — do not pick a workaround by default

## When reporting

- State root cause briefly
- Reference the doc(s) used (or that none exist and you asked)
- Describe the proper fix — not a patch narrative
