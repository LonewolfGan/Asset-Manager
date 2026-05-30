# Threat Model

## Project Overview

EverydayTools Hub is a client-side multi-tool utility web app built with React + Vite, deployed via Vercel. It provides file conversion, image processing, AI background removal, metadata cleaning, password generation, currency conversion, and unit/tip calculators. All file processing runs entirely in the browser — no user data is uploaded to any server. There is no user authentication, no database, and no server-side file handling. The only server component is a minimal Express API (port 8080) used as a currency rate proxy.

**Tech stack:** React 19, TypeScript, Vite, Tailwind CSS, wouter, pnpm workspaces, deployed on Vercel/Replit.

**Users:** Anonymous public users performing file conversion and utility tasks.

## Assets

- **User files in memory** — Files processed in the browser exist only in memory (ArrayBuffer / Blob). They are never transmitted to a server. The privacy guarantee is that no file data reaches external infrastructure.
- **Generated output files** — Converted/processed files are made available as Object URLs for download and immediately revoked after use.
- **LocalStorage data** — Only UI preferences (theme, locale) and a currency rate cache (1-hour TTL). No sensitive or PII data is ever written to localStorage.
- **Plausible analytics data** — Cookieless, aggregated page-view data. No personal identifiers. Hosted by Plausible (EU).
- **VITE_* environment variables** — Public-safe config (Plausible domain, AdSense publisher ID). No secrets are bundled into the client.
- **API server** — Minimal Express proxy for currency rates from open.er-api.com. No authentication, no stored data.

## Trust Boundaries

- **Browser / Vercel CDN** — All client code is delivered from Vercel. The integrity of delivered code depends on Vercel infrastructure and the correctness of CSP headers preventing injection by intermediaries.
- **User file / DOM boundary** — Files supplied by the user are parsed and their content may be rendered in the DOM (e.g., DOCX→HTML preview). This is the primary XSS surface: user-controlled file content must be sanitized before DOM insertion.
- **Browser / open.er-api.com** — The currency converter fetches live rates from open.er-api.com. This is an unauthenticated third-party endpoint; rate data is untrusted and must be validated before use.
- **Browser / Plausible** — Analytics events are sent to Plausible. CSP connect-src restricts this to the known Plausible domain.
- **Dev / Production** — The Vite dev server is not production. Security headers are enforced via vercel.json at the CDN edge, not in the dev server.

## Scan Anchors

- **Highest-risk code areas:** `artifacts/everydaytools/src/pages/word-to-html.tsx` (dangerouslySetInnerHTML on DOCX output), `artifacts/everydaytools/src/pages/{excel-to-pdf,html-to-pdf,markdown-to-pdf,word-to-pdf}.tsx` (innerHTML for PDF rendering containers)
- **Production entry points:** `artifacts/everydaytools/src/` (Vite frontend), `artifacts/api-server/src/` (Express API)
- **Security utilities:** `artifacts/everydaytools/src/utils/sanitize.ts`, `src/utils/rate-limit.ts`, `src/utils/cleanup.ts`
- **Security headers:** `artifacts/everydaytools/vercel.json`
- **All surfaces are public/unauthenticated** — there is no authenticated or admin surface

## Threat Categories

### Tampering (XSS via file content)

The dominant risk for this app. Users upload DOCX, HTML, Markdown, or Excel files whose content is parsed and rendered in the DOM. A malicious file could contain crafted HTML/JavaScript that executes in the user's browser if inserted without sanitization.

**What could go wrong:** A DOCX file with `<script>alert(1)</script>` embedded in its HTML representation could execute in the word-to-html preview pane, or in an off-screen container used for PDF rendering.

**Guarantees required:**
- All HTML derived from user file content MUST be sanitized with DOMPurify before any DOM insertion (`innerHTML`, `dangerouslySetInnerHTML`, or equivalent).
- Off-screen containers used for PDF rendering (html-to-pdf, excel-to-pdf, markdown-to-pdf, word-to-pdf) MUST also sanitize content before `innerHTML` assignment, even if not visible to the user.
- The CSP `script-src 'self'` directive provides defence-in-depth by blocking inline script execution even if sanitization is bypassed.

### Information Disclosure

**What could go wrong:** File content could be inadvertently sent to a server (analytics, error tracker, or third-party API) if not carefully isolated.

**Guarantees required:**
- File content (ArrayBuffers, Blobs, Object URLs) MUST NOT be passed to any analytics call, error message, or API request.
- Error tracking (if added) MUST scrub file references before transmission.
- Object URLs MUST be revoked promptly after use to prevent memory retention and unintended re-access.
- `localStorage` MUST NOT store file content, filenames, or any PII. Only theme, locale, and currency rate cache are permitted.

### Denial of Service (browser resource exhaustion)

**What could go wrong:** A malicious actor or automated tool uploads an extremely large file, a zip bomb, or a high-pixel-count image, causing the user's browser tab to run out of memory or hang.

**Guarantees required:**
- File size MUST be validated against per-type limits before processing begins (PDF ≤50MB, image ≤20MB, document ≤30MB, text ≤5MB).
- Image pixel dimensions MUST be checked before Canvas operations (max 10,000×10,000 px).
- Decompressed sizes for ZIP-based formats MUST be checked for bomb ratios (>100:1 or >500MB).
- A client-side rate limiter MUST prevent more than 20 operations per 60 seconds per tool session.

### Dependency Vulnerabilities

**What could go wrong:** A compromised or vulnerable npm package (e.g., multer CVE-2025-48997, or a supply-chain attack on a client-side library) could introduce XSS or remote code execution.

**Guarantees required:**
- `pnpm audit` MUST report zero HIGH or CRITICAL vulnerabilities before any production deployment.
- The multer dependency in `artifacts/api-server` MUST be updated to a non-vulnerable version.
- Dependencies MUST be audited on every update cycle.

### Security Misconfiguration

**What could go wrong:** Missing or weak HTTP security headers allow clickjacking (missing X-Frame-Options), MIME sniffing attacks (missing X-Content-Type-Options), or CSP bypass (overly permissive script-src).

**Guarantees required:**
- `vercel.json` MUST enforce: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` with preload, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `Cross-Origin-Resource-Policy`.
- CSP `script-src` MUST NOT include `'unsafe-eval'` or `'unsafe-inline'`. WASM requires `'wasm-unsafe-eval'` only.
- The CSP `connect-src` MUST be restricted to `'self'`, Plausible, and open.er-api.com — not `*`.

### Repudiation (no audit surface needed)

This app has no user accounts, no transactions, and no mutating operations on server data. There is nothing to audit. This threat category does not apply.

### Spoofing / Elevation of Privilege

There is no authentication, no session management, and no server-side access control. All routes are public and all processing is client-side. These categories do not apply unless authentication is added in a future version.
