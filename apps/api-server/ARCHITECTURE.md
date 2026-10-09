# EverydayTools — Architecture Decisions

> Generated: 2026-08-05  
> Purpose: Phase 1 audit (client vs server) + Phase 2 route catalogue for all tools

---

## Phase 1 — Client vs Server Decision Table (86 tools)

| # | Tool | Slug | Decision | Reason |
|---|------|------|----------|--------|
| 1 | PDF Merge | pdf-merge | **Server** | qpdf — binary required |
| 2 | PDF Split | pdf-split | **Server** | qpdf — binary required |
| 3 | PDF Compress | pdf-compress | **Server** | Ghostscript — binary required |
| 4 | PDF Protect | pdf-protect | **Server** | qpdf encryption |
| 5 | PDF Unlock | pdf-unlock | **Server** | qpdf decryption |
| 6 | PDF Rotate | pdf-rotate | **Server** | pdf-lib |
| 7 | PDF Watermark | pdf-watermark | **Server** | pdf-lib |
| 8 | PDF Page Numbers | pdf-page-numbers | **Server** | pdf-lib |
| 9 | PDF to Images | pdf-to-images | **Server** | Ghostscript — binary required |
| 10 | PDF Reorder Pages | pdf-reorder | **Server** | qpdf |
| 11 | PDF to Word | pdf-to-word | **Server** | pdfplumber Python bridge |
| 12 | PDF to Excel | pdf-to-excel | **Server** | pdfplumber Python bridge |
| 13 | PDF to Text | pdf-to-text | **Server** | pdfplumber Python bridge |
| 14 | PDF to HTML | pdf-to-html | **Server** | pdfplumber Python bridge |
| 15 | PDF to PPTX | pdf-to-pptx | **Server** | LibreOffice — binary required |
| 16 | DOCX to HTML | docx-to-html | **Server** | mammoth npm |
| 17 | DOCX to Text | docx-to-text | **Server** | mammoth npm |
| 18 | TXT to DOCX | txt-to-docx | **Server** | docx npm |
| 19 | Markdown to DOCX | markdown-to-docx | **Server** | docx + marked npm |
| 20 | Word to Markdown | word-to-markdown | **Server** | mammoth + turndown npm |
| 21 | Word to PDF | word-to-pdf | **Server** | LibreOffice — binary required |
| 22 | Markdown to PDF | markdown-to-pdf | **Server** | html-to-pdf (puppeteer/pdfkit) |
| 23 | Text to PDF | text-to-pdf | **Server** | pdf-lib npm |
| 24 | HEIC to JPG | heic-to-jpg | **Server** | pillow-heif Python bridge |
| 25 | Image Convert | image-convert | **Server** | sharp npm (SVG→raster: potrace+Inkscape) |
| 26 | Image to PDF | image-to-pdf | **Server** | sharp + pdf-lib npm |
| 27 | Image Compress | image-compress | **Server** | sharp npm |
| 28 | Image Resize | image-resize | **Server** | sharp npm |
| 29 | Image Crop | image-crop | **Server** | sharp npm |
| 30 | Flip / Rotate Image | flip-rotate | **Server** | sharp npm |
| 31 | Watermark Image | watermark-image | **Server** | sharp npm (SVG overlay) |
| 32 | Favicon Generator | favicon-generate | **Server** | sharp npm (multi-size ICO) |
| 33 | Remove Background | remove-background | **Server** | rembg Python (ONNX model) |
| 34 | OCR | ocr | **Server** | Tesseract CLI — binary required |
| 35 | PDF Metadata Read | metadata/read | **Server** | pdf-lib + piexif npm |
| 36 | PDF Metadata Write | metadata/write | **Server** | pdf-lib + piexif npm |
| 37 | Unit Converter | unit-converter | **Client** | Pure math, no I/O |
| 38 | Currency Converter | currency-converter | **Server** (rates) + **Client** (calc) | Exchange rate API fetch |
| 39 | Time Zone Converter | timezone-converter | **Client** | Intl API |
| 40 | Date Calculator | date-calculator | **Client** | Pure math |
| 41 | Age Calculator | age-calculator | **Client** | Pure math |
| 42 | BMI Calculator | bmi-calculator | **Client** | Pure math |
| 43 | Percentage Calculator | percentage-calculator | **Client** | Pure math |
| 44 | Scientific Calculator | scientific-calculator | **Client** | Pure math |
| 45 | Tip Calculator | tip-calculator | **Client** | Pure math |
| 46 | Loan Calculator | loan-calculator | **Client** | Pure math |
| 47 | Mortgage Calculator | mortgage-calculator | **Client** | Pure math |
| 48 | Tax Calculator | tax-calculator | **Client** | Pure math |
| 49 | Discount Calculator | discount-calculator | **Client** | Pure math |
| 50 | Speed Calculator | speed-calculator | **Client** | Pure math |
| 51 | Area Calculator | area-calculator | **Client** | Pure math |
| 52 | Volume Calculator | volume-calculator | **Client** | Pure math |
| 53 | Fuel Cost Calculator | fuel-cost-calculator | **Client** | Pure math |
| 54 | Electricity Cost Calc | electricity-calculator | **Client** | Pure math |
| 55 | Password Generator | password-generator | **Client** | crypto.getRandomValues() |
| 56 | UUID Generator | uuid-generator | **Client** | crypto.randomUUID() |
| 57 | Hash Generator | hash-generator | **Client** | SubtleCrypto |
| 58 | Base64 Encode/Decode | base64 | **Client** | atob / btoa |
| 59 | URL Encode/Decode | url-encode | **Client** | encodeURIComponent |
| 60 | JSON Formatter | json-formatter | **Client** | JSON.parse / JSON.stringify |
| 61 | JSON to CSV | json-to-csv | **Client** | Pure JS |
| 62 | CSV to JSON | csv-to-json | **Client** | Pure JS |
| 63 | Text Case Converter | text-case | **Client** | String methods |
| 64 | Word Counter | word-counter | **Client** | Regex split |
| 65 | Character Counter | char-counter | **Client** | .length |
| 66 | Lorem Ipsum Generator | lorem-ipsum | **Client** | Static wordlist |
| 67 | Markdown Preview | markdown-preview | **Client** | marked npm (client build) |
| 68 | Diff Checker | diff-checker | **Client** | diff library |
| 69 | Regex Tester | regex-tester | **Client** | JS RegExp |
| 70 | Text to Speech | text-to-speech | **Client** | Web Speech API |
| 71 | Text Reverse | text-reverse | **Client** | String split/reverse |
| 72 | Duplicate Line Remover | duplicate-remover | **Client** | Set() |
| 73 | Line Sorter | line-sorter | **Client** | Array.sort() |
| 74 | Whitespace Remover | whitespace-remover | **Client** | Regex replace |
| 75 | Color Converter | color-converter | **Client** | Pure math (HEX/RGB/HSL) |
| 76 | Color Palette Generator | color-palette | **Client** | Pure math |
| 77 | Gradient Generator | gradient-generator | **Client** | CSS string builder |
| 78 | CSS Minifier | css-minifier | **Client** | Regex / clean-css (client) |
| 79 | HTML Minifier | html-minifier | **Client** | html-minifier-terser (client) |
| 80 | JS Minifier | js-minifier | **Client** | terser (client) |
| 81 | Code Beautifier | code-beautifier | **Client** | prettier wasm |
| 82 | Aspect Ratio Calculator | aspect-ratio | **Client** | GCD math |
| 83 | Screen Resolution Info | screen-info | **Client** | window.screen |
| 84 | Internet Speed Test | speed-test | **Client** | fetch timing |
| 85 | QR Code Generator | qr-generator | **Client** | qrcode npm (client) |
| 86 | Barcode Generator | barcode-generator | **Client** | jsbarcode npm (client) |

**Summary:** 36 server-side tools, 50 client-side tools

---

## Phase 2 — Complete API Route Catalogue

All routes are prefixed with `/api`. Implemented in `artifacts/api-server/src/routes/`.

### Conventions
- **Error format:** `{ error: true, code: string, message: string, details?: string }`
- **Temp dirs:** `join(tmpdir(), "everydaytools", uuid)`
- **Rate limits:** heavy=10/min (binary tools), medium=20/min (Python bridge), default=60/min
- **MIME guard:** all uploads validated before processing
- **Env vars:** `LIBREOFFICE_PATH`, `GHOSTSCRIPT_PATH`, `PYTHON_PATH`, `TESSERACT_PATH`

### Health

| Method | Path | Input | Output | Lib | Status |
|--------|------|-------|--------|-----|--------|
| GET | `/healthz` | — | `{ status: "ok" }` | — | ✅ |
| GET | `/rates` | — | `{ rates: { [currency]: number } }` | Exchange rate API | ✅ |

### PDF Tools (`/api/tools/`)

| Method | Path | Input | Output | Lib | Status |
|--------|------|-------|--------|-----|--------|
| POST | `/tools/pdf-merge` | `files[]` (multipart, PDF) | `application/pdf` | qpdf | ✅ |
| POST | `/tools/pdf-split` | `file` (PDF) | `application/zip` (one PDF per page) | qpdf | ✅ |
| POST | `/tools/pdf-compress` | `file` (PDF), `level` (screen\|ebook\|printer\|prepress) | `application/pdf` | Ghostscript | ✅ |
| POST | `/tools/pdf-protect` | `file` (PDF), `userPassword?`, `ownerPassword?` | `application/pdf` | qpdf | ✅ |
| POST | `/tools/pdf-unlock` | `file` (PDF), `password?` | `application/pdf` | qpdf | ✅ |
| POST | `/tools/pdf-rotate` | `file` (PDF), `rotation` (90\|180\|270) | `application/pdf` | pdf-lib | ✅ |
| POST | `/tools/pdf-watermark` | `file` (PDF), `text`, `opacity?`, `fontSize?` | `application/pdf` | pdf-lib | ✅ |
| POST | `/tools/pdf-page-numbers` | `file` (PDF), `position` | `application/pdf` | pdf-lib | ✅ |
| POST | `/tools/pdf-to-images` | `file` (PDF), `format?` (jpeg\|png), `dpi?` | `application/zip` | Ghostscript | ✅ **NEW** |
| POST | `/tools/pdf-reorder` | `file` (PDF), `pages` (comma-separated 1-based) | `application/pdf` | qpdf | ✅ **NEW** |
| POST | `/tools/pdf-to-html` | `file` (PDF, max 50 MB) | `text/html` | pdfplumber Python | ✅ **NEW** |
| POST | `/tools/pdf-to-pptx` | `file` (PDF, max 50 MB) | `application/zip` (PPTX) | LibreOffice | ✅ **NEW** (Oracle VM) |
| POST | `/tools/word-to-pdf` | `file` (DOCX/DOC, max 50 MB) | `application/pdf` | LibreOffice | ✅ |
| POST | `/tools/markdown-to-pdf` | `file` (MD), `body?` (text) | `application/pdf` | html-to-pdf | ✅ |
| POST | `/tools/image-compress` | `file` (image), `quality?` (1–100) | same MIME as input | sharp | ✅ |
| POST | `/tools/image-resize` | `file` (image), `width?`, `height?`, `percentage?` | same MIME | sharp | ✅ |
| POST | `/tools/image-crop` | `file` (image), `left`, `top`, `width`, `height` | same MIME | sharp | ✅ |
| POST | `/tools/flip-rotate` | `file` (image), `rotation?` (90\|180\|270), `flipH?`, `flipV?` | same MIME | sharp | ✅ |
| POST | `/tools/watermark-image` | `file` (image), `text`, `opacity?`, `position?` | same MIME | sharp | ✅ |
| POST | `/tools/favicon-generate` | `file` (image) | `application/zip` (multi-size ICO+PNG) | sharp | ✅ |

### Convert (`/api/convert/`)

| Method | Path | Input | Output | Lib | Status |
|--------|------|-------|--------|-----|--------|
| POST | `/convert/pdf-to-text` | `file` (PDF, max 50 MB) | `{ text: string }` | pdfplumber Python | ✅ |
| POST | `/convert/pdf-to-word` | `file` (PDF, max 50 MB) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | pdfplumber + docx | ✅ |
| POST | `/convert/pdf-to-excel` | `file` (PDF, max 50 MB) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | pdfplumber + xlsx | ✅ |
| POST | `/convert/docx-to-html` | `file` (DOCX, max 50 MB) | `text/html` | mammoth | ✅ |
| POST | `/convert/docx-to-text` | `file` (DOCX, max 50 MB) | `{ text: string }` | mammoth | ✅ |
| POST | `/convert/text-to-pdf` | `file?` (TXT) or `text` body (JSON) | `application/pdf` | pdf-lib | ✅ |
| POST | `/convert/image` | `file` (image), `format` (MIME), `width?`, `height?`, `quality?` | target format | sharp / potrace | ✅ |
| POST | `/convert/image-to-pdf` | `file` (image, max 50 MB) | `application/pdf` | sharp + pdf-lib | ✅ |
| POST | `/convert/heic` | `file` (HEIC/HEIF, max 50 MB), `format?` (jpeg\|png), `quality?` | image/jpeg or image/png | pillow-heif Python | ✅ **NEW** |
| POST | `/convert/txt-to-docx` | `file` (TXT, max 10 MB) | `application/vnd.openxmlformats…` | docx npm | ✅ **NEW** |
| POST | `/convert/markdown-to-docx` | `file` (MD, max 10 MB) | `application/vnd.openxmlformats…` | docx + marked npm | ✅ **NEW** |
| POST | `/convert/word-to-markdown` | `file` (DOCX/DOC, max 30 MB) | `text/markdown` | mammoth + turndown npm | ✅ **NEW** |

### Extract (`/api/extract/`)

| Method | Path | Input | Output | Lib | Status |
|--------|------|-------|--------|-----|--------|
| POST | `/extract/ocr` | `file` (image, max 20 MB), `lang?` (default: eng) | `{ text: string, lang: string }` | Tesseract CLI | ✅ **NEW** (503 when binary absent) |

### Background Removal (`/api/remove-background`)

| Method | Path | Input | Output | Lib | Status |
|--------|------|-------|--------|-----|--------|
| POST | `/remove-background` | `file` (image, max 20 MB) | `image/png` (RGBA transparent) | rembg ONNX Python | ✅ (Oracle VM / onnxruntime) |

### Metadata (`/api/metadata/`)

| Method | Path | Input | Output | Lib | Status |
|--------|------|-------|--------|-----|--------|
| POST | `/metadata/read` | `file` (JPEG or PDF, max 20 MB) | `{ exif?: {…}, pdf?: {…} }` | pdf-lib + piexif | ✅ |
| POST | `/metadata/write` | `file` (JPEG or PDF), `title?`, `author?`, `subject?`, `keywords?` | modified file (same MIME) | pdf-lib + piexif | ✅ |

### Text Utilities (`/api/text/`)

| Method | Path | Input | Output | Lib | Status |
|--------|------|-------|--------|-----|--------|
| POST | `/text/invisible-chars` | `{ text: string }` (JSON body) | `{ cleaned: string, count: number }` | Regex | ✅ |

---

## Phase 3 — Architectural Standards Checklist

| Standard | Status |
|----------|--------|
| Temp paths: `join(tmpdir(), "everydaytools", uuid)` | ✅ Applied to all routes |
| Uniform error format: `{ error: true, code, message, details? }` | ✅ `apiError()` helper + applied across all routes |
| MIME validation on all uploads | ✅ `guardImage`, `guardMetadata`, per-route checks |
| Binary timeout (120s heavy, 30s medium) | ✅ `execFileAsync(..., { timeout: 120_000 })` |
| CORS via `FRONTEND_URL` env var | ✅ `cors({ origin: process.env.FRONTEND_URL })` in index.ts |
| Rate limiting | ✅ `heavy/medium/defaultRateLimit` middleware |
| Env vars: `LIBREOFFICE_PATH`, `GHOSTSCRIPT_PATH`, `PYTHON_PATH` | ✅ `BIN` object in `lib/binaries.ts` |
| `VITE_API_URL` on frontend | ✅ `apiBase.ts` + all new tool pages |
| Standalone build: `pnpm build && node dist/index.mjs` | ✅ esbuild via `build.mjs` |

---

## Binary Dependency Map

| Binary | Env var | Replit | Oracle VM |
|--------|---------|--------|-----------|
| Ghostscript | `GHOSTSCRIPT_PATH` | ✅ installed | ✅ |
| qpdf | — (auto) | ✅ installed | ✅ |
| LibreOffice | `LIBREOFFICE_PATH` | ❌ not available | ✅ |
| Tesseract | `TESSERACT_PATH` | ❌ not available | ✅ |
| Python 3 + pdfplumber | `PYTHON_PATH` | ✅ installed | ✅ |
| Python 3 + rembg | `PYTHON_PATH` | ❌ onnxruntime blocked | ✅ |
| Python 3 + pillow-heif | `PYTHON_PATH` | ✅ installed | ✅ |
