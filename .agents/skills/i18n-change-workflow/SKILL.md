---
name: i18n-change-workflow
description: Reusable i18n workflow for coding agents. Verifies locale completeness, hardcoded text, placeholders, pluralization, fallback behavior, formatting, translation consistency, and localization-related UI regressions.
---

# i18n Change Workflow

Act as the i18n/l10n specialist layer for the active task.

This skill adds localization-specific constraints and verification. It does not replace the repository's normal implementation, audit, Git, or approval workflow. Follow the active workflow's mutation boundary: during implementation or remediation, apply the required i18n changes; during a read-only audit or review, use these criteria without modifying repository state.

## 1. Inspect the existing i18n system first

Before changing localized behavior:

- read applicable `AGENTS.md` and project documentation;
- identify the current i18n library or project-native mechanism;
- identify supported locales, source/default locale, locale resource locations, fallback behavior, and locale-selection/persistence logic;
- inspect nearby existing keys and call sites before choosing new key names or structures;
- identify project-specific rules for translations, formatting, generated resources, or validation.

Prefer the existing project architecture. Do not introduce a new i18n library, resource format, or parallel translation mechanism unless the task requires it and the repository has no suitable existing mechanism.

Do not treat one framework convention as universal. Follow the repository's actual conventions.

## 2. Classify text before localizing it

Determine whether each changed string is actually user-facing.

Typical localization candidates include:

- visible UI labels, buttons, headings, menus, dialogs, empty states, validation messages, and user-visible errors;
- accessibility labels and descriptions;
- notifications and user-facing system messages;
- placeholders, helper text, onboarding copy, and tooltips;
- user-visible content generated from application-owned templates.

Do not automatically localize:

- identifiers, translation keys, API names, URLs, paths, commands, SQL, regexes, or protocol values;
- developer-only logs, diagnostics, stack traces, and test fixture text;
- brand names, product names, codes, or terms that project rules intentionally preserve;
- externally supplied runtime content unless the task explicitly covers it.

When classification is ambiguous and affects product meaning, preserve the current behavior and surface the ambiguity rather than guessing.

## 3. Preserve the project's key and resource model

For new or changed user-facing text:

- use the project's translation mechanism instead of introducing hardcoded display text when localization is expected;
- follow the existing key naming and namespacing convention;
- prefer stable semantic keys over keys derived from full display sentences unless the project intentionally uses source-text keys;
- update every supported locale required by project rules or the current task;
- preserve unrelated locale entries and target-only data unless deletion is explicitly intended;
- do not silently rename or delete existing keys merely for stylistic consistency.

Treat the project's declared source/default locale as canonical only if the repository actually uses that model.

Missing translations must follow the project's established fallback policy. Do not invent a new fallback policy silently.

## 4. Preserve interpolation, pluralization, and message structure

Translation structure is part of the contract.

- Preserve the same required placeholders/arguments across locale variants.
- Do not translate placeholder names, format tokens, markup, or control syntax.
- Use the project's plural/select/ICU mechanism when grammar depends on count, gender, case, or other locale-sensitive variation.
- Avoid assembling sentences from separately translated fragments when word order or grammar can vary by language.
- Avoid string concatenation that assumes English word order or spacing.
- Preserve intentional markup, escaping, and line-break semantics.

If a source message changes its arguments or message structure, verify every affected locale rather than updating only the visible source text.

## 5. Keep locale-sensitive values locale-aware

When the changed UI contains locale-sensitive values, use the project's existing locale-aware formatting facilities for relevant:

- dates and times;
- numbers and percentages;
- currencies;
- units;
- relative time;
- list formatting;
- plural categories.

Do not hardcode separators, decimal conventions, date ordering, currency placement, or English-only plural assumptions when locale-aware behavior is expected.

## 6. Protect locale selection and fallback behavior

When the task touches locale switching, initialization, persistence, or fallback:

- preserve the project's supported-locale list and normalization rules;
- verify default-locale behavior;
- verify persistence if the project stores the user's language choice;
- verify unsupported or missing locales degrade through the intended fallback path;
- avoid mixed-language UI caused by missing keys or stale cached locale data;
- ensure lazy-loaded locale resources are awaited or synchronized correctly when applicable.

Do not change locale-detection precedence without an explicit requirement.

## 7. Translation quality

When generating or editing translations:

- preserve meaning, intent, tone, and product terminology rather than translating mechanically word-for-word;
- use surrounding UI context to resolve ambiguous short labels;
- preserve approved product names, technical terms, and glossary decisions;
- keep placeholders and markup intact;
- avoid adding claims, meaning, politeness level, or functionality not present in the source;
- flag uncertain, culturally sensitive, legal, safety-critical, or brand-sensitive wording for human confirmation instead of pretending certainty.

If the repository contains a glossary, terminology file, translation memory, or established translations, prefer that evidence over a newly generated alternative.

Read `references/i18n-review-checklist.md` when doing a broad locale addition, translation review, or release-oriented localization change.

## 8. Check UI and layout risk

Localized text can change layout even when the translation is correct.

For affected UI, consider when relevant:

- longer labels and multi-line wrapping;
- narrow mobile widths and responsive layouts;
- CJK line breaking and glyph coverage;
- text truncation and ellipsis;
- buttons, tabs, badges, dialogs, tables, and fixed-width containers;
- font fallback;
- accessibility labels;
- right-to-left direction, mirroring, and logical CSS/layout properties when an RTL locale is in scope.

Do not add RTL-specific work when no RTL locale is supported or requested, but do not ignore it when an RTL locale is part of the task.

Use visual or UI verification when the changed text can plausibly affect layout. A successful locale-file check alone does not prove the UI is correct.

## 9. Verify with project-native checks

Use the repository's existing i18n validators, tests, linters, builds, and UI checks first.

Verify the relevant subset of:

- locale-key completeness/parity;
- missing or blank translations;
- placeholder/argument parity;
- plural/select structure;
- fallback behavior;
- locale switching and persistence;
- locale-aware formatting;
- absence of newly introduced hardcoded user-facing strings in the changed scope;
- build/type/lint/test health;
- layout behavior for affected screens.

For plain JSON locale catalogs, `scripts/check_json_locales.py` may be used as an additional deterministic check. It checks duplicate JSON keys, key parity, value types, blank strings, and common brace-style named placeholder/ICU argument parity. Placeholder detection is intentionally narrow and heuristic; confirm reported mismatches against the project's actual message syntax. It is not a semantic translation review and does not replace project-native tooling.

Do not claim repository-wide i18n completeness from a narrow file or static check.

## 10. Completion criteria

An i18n change is complete only when, for the requested scope:

- the intended user-facing strings use the project's localization mechanism;
- required locale resources are updated;
- placeholders and message structure remain compatible;
- relevant formatting/fallback/switching behavior is preserved;
- project-native verification passes, or limitations are explicitly reported;
- plausible layout regressions have been checked when the UI is affected;
- unresolved translation or product-language ambiguity is reported rather than guessed.

Keep the final report concise. State what locale behavior changed, which locales/resources were touched, what validation actually ran, and any remaining translation or UI limitations.