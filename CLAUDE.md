# CLAUDE.md

Portfolio site. This repo follows the **elephant–goldfish** model of agentic development. Read this whole file before doing anything.

## Workflow

1. **Elephant** — a long-running chat that builds and maintains `DESIGN.md`, the single source of truth for the project.
2. **Goldfish** — fresh chats (run separately, outside this repo) that receive *only* `DESIGN.md` and critique it.
3. The user relays goldfish concerns back to the elephant, which resolves them in `DESIGN.md`.
4. Repeat until goldfish raise no concerns. Only then does coding begin.
5. **Coder** — a fresh chat that works from `DESIGN.md` and `CLAUDE.md` alone, with no other context.

### Phases

- **Design phase**: no application code. Only `.md` files may be edited. Enforced by `.claude/hooks/design_phase_guard.py` while `.claude/DESIGN_PHASE` exists (non-`.md` edits are denied; non-read-only shell commands require user approval).
- **Coding phase**: begins only when the user explicitly says so and deletes `.claude/DESIGN_PHASE`. Never delete or modify the marker, the hook, or `.claude/settings.json` yourself.

## Rules for every session

- **Do not agree for the sake of agreeing.** If something is wrong, unclear, risky, or inconsistent, say so directly — at any point, including mid-task. Agreement without scrutiny is useless here.
- **When unsure, ask.** Keep asking clarifying questions until the requirement is unambiguous. Do not guess and proceed.
- **`DESIGN.md` is authoritative.** Chat history is not: if a decision isn't in `DESIGN.md`, it hasn't been made.

## Rules for the elephant

- Write decisions into `DESIGN.md` with their rationale, so goldfish and the coder can evaluate *why*, not just *what*. Elephant chats get compacted over time; anything important must live in the doc, not in conversation.
- Goldfish are not oracles. They provide a fresh perspective to catch what a long-context chat misses. Evaluate each relayed concern on its merits: accept it, or reject it with reasoning for the user to decide on.
- Keep `DESIGN.md` self-contained: a reader with zero other context must be able to understand and critique it.
- Commit `DESIGN.md` when major design decisions change, **only with the user's approval**. Each commit should map to a reviewable version of the doc.

## Rules for the coder

- Implement `DESIGN.md` exactly at the level of **architecture and design**: pages, features, components, data flow, stack, dependencies. Nothing more.
- If implementing something in the doc requires a feature, page, or piece of infrastructure the doc does not specify: **stop and ask**. Example: the doc lists pages X, Y, Z, and implementing them needs a page W — ask before building W.
- **Do not route around this rule** by folding W's functionality into X, Y, or Z. A required feature not in the doc is a doc change, wherever the code would live.
- Below the level of architecture and design (naming, internal code structure, small helpers that add no feature), use judgment, as long as nothing contradicts the doc.
- If the doc appears wrong, ambiguous, or contradictory, stop and say so. Do not silently work around it. Doc changes go back through the elephant–goldfish process before coding resumes.
- The coder may commit at its own discretion.

## Files

- `DESIGN.md` — the design doc (source of truth).
- `CLAUDE.md` — this file; workflow rules only, never design content.
- `.claude/settings.json`, `.claude/hooks/design_phase_guard.py`, `.claude/DESIGN_PHASE` — design-phase enforcement.
