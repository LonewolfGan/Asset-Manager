---
name: Security hardening
description: Production security implementation — DOMPurify, CSP headers, /security page, multer CVE fix, utilities.
---

## What was implemented

- **DOMPurify** (`dompurify@^3.4.7`) installed in `artifacts/everydaytools`
- **`src/utils/sanitize.ts`** — `sanitizeHTML()`, `sanitizeText()`, `sanitizeFilename()`, `isValidURL()`
- **`src/utils/rate-limit.ts`** — `RateLimiter` class + exported `toolRateLimiter` (20 req / 60s)
- **`src/utils/cleanup.ts`** — `trackObjectURL`, `revokeObjectURL`, `revokeAllObjectURLs`, `clearArrayBuffer`; auto-revokes on `beforeunload`
- **`vercel.json`** at `artifacts/everydaytools/vercel.json` — full CSP (`script-src 'self' 'wasm-unsafe-eval' https://plausible.io`), HSTS max-age=63072000 preload, X-Frame-Options DENY, COOP/CORP same-origin, Permissions-Policy, Referrer-Policy; asset cache-control; SPA rewrite rule
- **`public/.well-known/security.txt`** — RFC 9116 contact file
- **`src/pages/security.tsx`** + route `/security` in App.tsx — public disclosure page
- **`src/components/Footer.tsx`** — Security link added to bottom nav (bilingual: "Security" / "Sécurité")
- **`threat_model.md`** (project root) — STRIDE threat model covering XSS via file content, info disclosure, DoS, dep vulns, misconfig
- **`.gitignore`** — hardened with `.env*`, `*.pem`, `*.key`, `secrets/`, `.vercel`
- **multer** upgraded from 1.4.5-lts.2 → **2.1.1** in `artifacts/api-server` (fixes CVE-2025-48997)

## DOMPurify sanitization call sites

All HTML from user file content sanitized before DOM insertion:
- `word-to-html.tsx` — `dangerouslySetInnerHTML` preview
- `excel-to-pdf.tsx` — off-screen PDF rendering container
- `html-to-pdf.tsx` — off-screen PDF rendering container
- `markdown-to-pdf.tsx` — temporary text-extraction div
- `word-to-pdf.tsx` — off-screen container + pagination clone

**Why:** SAST scanner flagged 6 HIGH innerHTML XSS findings across these files; file content can contain crafted HTML from malicious DOCX/HTML/XLSX files.

## CSP connect-src

Uses `open.er-api.com` (NOT `api.exchangerate.host`) for currency rates. Always keep this correct when updating CSP.

## Remaining non-actionable SAST findings

- `insecure-document-method` HIGH findings still appear in SAST scans because the scanner analyzes compiled dist artifacts in addition to source. Source is now fully sanitized.
- `generic-api-key` false positives from minified variable names (`pastK`, `presentK`) in compiled output — these are unit converter UI strings, not real keys.
