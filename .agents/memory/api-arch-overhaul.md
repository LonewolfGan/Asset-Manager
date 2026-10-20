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
- 111 `apiError()` calls across all route files

**Temp file paths — always:**
```ts
const workDir = join(tmpdir(), "everydaytools", randomUUID());
```
Never use prefixed patterns like `` join(tmpdir(), `potrace-${id}`) ``.

**Backend routes:**
- `POST /tools/pdf-to-images` — Ghostscript ZIP
- `POST /tools/pdf-reorder` — qpdf page selection
- `POST /tools/pdf-to-html` — pdfplumber Python bridge
- `POST /tools/pdf-to-pptx` — LibreOffice headless
- `POST /convert/heic` — pillow-heif Python bridge
- `POST /convert/txt-to-docx` — docx npm
- `POST /convert/markdown-to-docx` — docx + marked npm
- `POST /convert/word-to-markdown` — mammoth + turndown npm
- `POST /extract/ocr` — Tesseract CLI

**Build externals:** `turndown` in `build.mjs` externals list (alongside mammoth, pdfjs-dist).

**Deliverables:**
- `apps/api-server/ARCHITECTURE.md` — 86-tool client/server table + route catalogue
- `apps/api-server/PHASE5_CURL_REPORT.md` — curl test results

**Bash curl gotcha:** Using `local out=$(curl ... -F "file=@...")` in a bash function breaks multipart uploads silently (returns 000). Always call curl directly without `$()` capture when uploading files in shell scripts.
