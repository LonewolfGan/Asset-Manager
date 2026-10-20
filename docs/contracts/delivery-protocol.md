# Delivery Protocol Contract — Engineering & Review Standards

---

## 1. The Fundamental Single Tool Lock

1. **One Tool at a Time**: Never modify multiple tools or pages concurrently. Work is strictly locked to the current tool until verified and explicitly approved.
2. **Skill Consultation**: Before touching any tool UI, the agent must review relevant skills in `.agents/skills/`.
3. **Zero Functional Regression**: Existing business logic, TypeScript schemas, and API contracts must be preserved.

---

## 2. Mandatory 5-Step Execution Protocol

```
┌─────────────────────────────────────────────────────────────┐
│ 1. AUDIT & DIAGNOSTIC (redesign-existing-projects)          │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CADRAGE VISUEL & RESEARCH (design-system-contract)       │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. FINITIONS & MICRO-INTERACTIONS (emil-design-eng)         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. IMPLÉMENTATION TDD COMPLÈTE (full-output, shadcn)        │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. VALIDATION VISUELLE & REVUE SUBAGENT (code-reviewer)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Strict Mechanical Invariants

1. **TDD RED-GREEN Discipline**: Write or update a failing test (RED) before implementing or modifying any production code (GREEN).
2. **Anti-Monolith Invariant (< 300 Lines)**: Every single source file must strictly contain fewer than 300 lines of code. Split complex components into cohesive satellite subcomponents, hooks, or style modules.
3. **Full Output Enforcement**: Banned patterns: `// ...`, `// rest of code`, `// TODO: implement`. Output complete, fully compilable code.
4. **SubAgent Review Gate**: When multiple files are touched in a session, delegate an independent review to `code-reviewer` before concluding.
5. **Codebase Sanitation**: Ensure zero zombie files, zero temporary dumps, zero Replit configs via `pnpm run clean:codebase`.
