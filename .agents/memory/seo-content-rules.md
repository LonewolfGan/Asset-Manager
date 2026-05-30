---
name: SEO content rules
description: Rules for writing about/FAQ content in tools-seo-data.ts — what the user has banned
---

## Banned phrases in about / FAQ content

The user has explicitly asked to NEVER include the following in any SEO entry (about or FAQ):

- "runs locally in your browser"
- "entirely in your browser"
- "files never leave your device"
- "never uploaded to any server"
- Any FAQ asking "Is the conversion done in my browser?" or equivalent
- Any about paragraph whose sole point is "this tool processes files locally"

**Why:** The user considers this repetitive marketing boilerplate ("bullshit de local") that adds no value to the user reading the page. It was being generated in every single entry as a second paragraph in `about` and as a 3rd FAQ item.

**How to apply:** When writing or generating SEO entries:
- `about` field: write only format-specific context (what the format is, why you'd convert from/to it). One paragraph is fine.
- FAQs: cover "why convert", "quality/loss", "free?", format-specific questions. Skip privacy/local processing FAQ entirely.
- If a jargon-cleaner script is run on tools-seo-data.ts, add "locally in your browser" and "files never leave" to its removal list.
