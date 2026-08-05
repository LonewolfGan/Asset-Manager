---
name: API architecture overhaul
description: Standards applied to api-server routes — error format, temp paths, error helper, new routes, build externals, deliverables
---

## Rules applied (all must stay consistent going forward)

**Error format — every route must use `apiError()`:**
```ts
import { apiError } from "../lib/errors.js";
apiError(res, 400, "NO_FILE", "No file uploaded");
// produces: { error: true, code: "NO_FILE", message: "No file uploaded" }
```
- 0 old-format `res.status(X).json({ error: "string" })` remain
- 111 `apiError()` calls across all route files

**Temp file paths — always:**
```ts
const workDir = join(tmpdir(), "everydaytools", randomUUID());
```
Never use prefixed patterns like `` join(tmpdir(), `potrace-${id}`) ``.

**New routes added:**
- `POST /tools/pdf-to-images` — Ghostscript ZIP
- `POST /tools/pdf-reorder` — qpdf page selection
- `POST /tools/pdf-to-html` — pdfplumber Python bridge
- `POST /tools/pdf-to-pptx` — LibreOffice (Oracle VM only)
- `POST /convert/heic` — pillow-heif Python bridge
- `POST /convert/txt-to-docx` — docx npm
- `POST /convert/markdown-to-docx` — docx + marked npm
- `POST /convert/word-to-markdown` — mammoth + turndown npm
- `POST /extract/ocr` — Tesseract CLI (Oracle VM only)

**Build externals:** `turndown` added to `build.mjs` externals list (alongside mammoth, pdfjs-dist).

**Why:** The spec required uniform error format for frontend error handling, namespaced temp dirs to avoid cross-request collisions, and the build externals to avoid bundling CJS-only packages.

**Deliverables written:**
- `artifacts/api-server/ARCHITECTURE.md` — Phase 1 (86-tool client/server table) + Phase 2 (44-route catalogue)
- `artifacts/api-server/PHASE5_CURL_REPORT.md` — Phase 5 curl test results (35/38 pass, 2 expected 503/500 on Replit)

**Phase 5 result summary:**
- 35 routes pass curl tests with correct HTTP codes
- 2 routes return expected errors (Tesseract/rembg not on Replit — Oracle VM only)
- 1 route fails (pdf-to-pptx LibreOffice sandbox restriction on Replit)
- pdfplumber installed via `python3 -m pip install pdfplumber`

**Bash curl gotcha:** Using `local out=$(curl ... -F "file=@...")` in a bash function breaks multipart uploads silently (returns 000). Always call curl directly without `$()` capture when uploading files in shell scripts.
