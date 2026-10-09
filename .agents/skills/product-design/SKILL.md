---
name: product-design
description: >-
  Single entry point for product design and user-facing product implementation.
  Use whenever work changes what a user sees, understands, chooses, or does:
  shaping requirements and flows; building or redesigning pages and components;
  reviewing URLs, screenshots, diffs, or agent findings; improving product copy,
  information architecture, component choice, design system compliance, hierarchy,
  layout, interaction, accessibility, responsive behavior, and loading, empty, error,
  permission, billing, or destructive states. Trigger on design, UX, UI, usability,
  flow, onboarding, settings, dashboard, build, improve, fix, audit, review, polish,
  simplify, or production-ready requests. Also use when backend behavior changes a
  user-visible outcome. Not for backend-only work with no user-visible effect,
  tests with no shipped UI impact, telemetry-only work, documentation, or marketing content.
---

# Product Design Protocol

Make the interface correct for the user, the product, and system rules. Working code is not enough: choose the right interaction, make scope and consequences clear, cover reality beyond the happy path, and verify the rendered result.

## Operating Contract
- **Start with the job, not the pixels.** Identify who is acting, what they are trying to accomplish, the product object involved, and what the system will change.
- **Define the outcome before the output.** Establish the current user problem, desired behavior, success signal, and non-goals before choosing a surface or component.
- **Use evidence, not taste.** Trace decisions to product behavior, canonical repository guidance, an accepted design decision, or a verified adjacent pattern.
- **Separate facts from decisions.** Mark assumptions and unresolved product choices explicitly; do not hide them inside implementation details.
- **Treat shipped code as evidence, not automatic precedent.** It proves what exists, not why it is correct. Check it against current components, product behavior, and explicit guidance.
- **Choose the smallest coherent intervention.** Consider better defaults, behavior, or reuse before adding UI. Do not solve one job by creating unrelated settings or abstractions.
- **Decide before decorating.** Resolve information architecture, component semantics, interaction, and state behavior before styling or rewriting copy.
- **Design every reachable state.** Include only states the product can actually enter, but do not stop at the populated success case.
- **Verify the real surface.** Source inspection establishes behavior; a rendered interface establishes visual and interaction quality. Never claim visual verification from code alone.
- **Keep one user-facing entry point.** Invoke `product-design`; route internally to the canonical sources below.

## Request Modes
Resolve the mode from the user's verb and artifact before acting.

| Mode | Typical request | Required behavior |
| --- | --- | --- |
| **Shape** | "Design this flow", "How should this work?", feature brief without settled UI | Frame the problem and evidence, compare material alternatives, then define the flow, states, acceptance criteria, risks, and open decisions. Do not edit unless asked. |
| **Implement** | "Build", "fix", "improve", "make compliant", or "run product-design on everything" | Resolve material product decisions, then implement the smallest coherent end-to-end change within scope. Do not absorb unrelated review findings. |
| **Review** | "Audit", "critique", "what's wrong?", code review | Inspect source and rendered evidence, then report prioritized findings. Do not edit unless asked. |
| **Copy** | "Fix the copy", "rewrite these errors" | Edit user-facing language, accessible names, and directly required JSX only. Report structural blockers without silently broadening scope. |
| **Harden** | "Polish", "production-ready", "handle edge cases" | Preserve the settled product direction while fixing state, resilience, responsive, accessibility, and finish defects. |

When intent is ambiguous, use the narrowest mode supported by the verb.

## Decision Authority
Resolve conflicts in this order:
1. The user's explicit goal and constraints.
2. Verified user/product evidence and system truth.
3. Repository-canonical guidance: `AGENTS.md`, design system rules, and routed skills (`anti-ui-slop`, `emil-design-eng`).
4. Accepted product/design decisions and exemplars with stable evidence.
5. Verified adjacent shipped patterns in the same product area.
6. General interface heuristics.

## Workflow
### 1. Set scope and mode
Name the target surface and request mode in the work plan or review notes.
### 2. Load product context
Before proposing UI, read `AGENTS.md`, supplied briefs/designs, and product logic (mutations, permissions, validation, errors, side effects).
### 3. Model the product decision
Read `references/product-judgment.md` and write a compact internal brief covering: user, job, current behavior, desired outcome, success signal, non-goals, object, scope, action, consequence, reversibility, permissions, and open decisions.
### 4. Map the surface and states
Inventory entry points, visible regions, overlays, transitions, exits, and return paths. Map reachable states: loading, empty, sparse, populated, validation, error, permission, disabled, optimistic, stale, destructive, responsive.
### 5. Load routed references
- Product/flow decision: `references/product-judgment.md`
- Visual/layout quality: `references/interface-quality.md`
- Copy & CTA rules: `references/copy.md`
- State resilience & errors: `references/resilience.md`
- Animation & polish: `.agents/skills/emil-design-eng/SKILL.md`
- Clean UI & component selection: `.agents/skills/anti-ui-slop/SKILL.md`
### 6. Decide, then implement
For each non-mechanical change: what problem does this solve, why is this component appropriate, what consequence must the interface communicate, what evidence supports the decision, and what is the smallest coherent change?
### 7. Verify
Confirm primary job, run lint checks, inspect viewports, test reachable states, check keyboard/focus order, and verify responsiveness.

## Product Design Standards
- Make the user's primary task and primary action unmistakable.
- Preserve the user's mental model and current context unless changing it solves a verified problem.
- Name the exact object, scope, and consequence of important actions.
- Use navigation components for navigation and action components for actions.
- Choose surface persistence to match importance.
- Prefer inline disclosure before adding a modal.
- Expose advanced controls when needed without making default path carry complexity.
- Prefer strong defaults and direct behavior over adding configuration.
- Use semantic internal React / Shadcn components before custom HTML or raw styling.
- Use hierarchy, spacing, and alignment before adding border containers.
- Preserve user input through validation and recoverable errors.
- Keep loading control labels stable; use component busy affordance.
- Make destructive actions proportional to impact and provide undo when supported.
- Destructive CTAs follow `Verb + Noun` (e.g., "Delete Workspace", never "Confirm" or "OK").
- Recommend Radio buttons when a Select has 2-3 static options.

## Review Output Format
Lead with findings, ordered by user impact:
- **P0**: blocks primary task, severe accessibility failure, unrecoverable user harm.
- **P1**: likely task failure, misleading consequence, missing critical state, major responsive/accessibility defect.
- **P2**: meaningful friction, inconsistency, weak hierarchy, recoverability issue.
- **P3**: minor craft or consistency improvement.
For each finding include: location, verification status, canonical source, user consequence, and smallest concrete fix.
