---
name: System deps & Python bridge
description: Installed system tools (LibreOffice, ghostscript, potrace, qpdf) and Python packages (pdfplumber, pikepdf); patterns for calling them from Node.js.
---

## Installed system dependencies (confirmed working)

| Tool | Version | Purpose |
|------|---------|---------|
| LibreOffice (`soffice`) | 24.8.7.2 | DOCX/XLSX/PPTX→PDF, PPTX→PNG slides |
| Ghostscript (`gs`) | 10.05.1 | PDF recompression quality presets |
| potrace | 1.16 | Bitmap→SVG vectorization (PNG→SVG tool) |
| qpdf | 11.10.1 | AES-256 PDF encryption |
| pdfplumber (Python) | 0.11.10 | Table detection + paragraph extraction from PDF |
| pikepdf (Python) | 10.9.1 | Python PDF manipulation (available if needed) |

## Key files

- `artifacts/api-server/src/lib/libreoffice.ts` — `convertWithLibreOffice()` and `convertPptxToImages()` helpers; each call gets unique workDir + profileDir under /tmp to avoid concurrent conflicts.
- `artifacts/api-server/src/python/pdf_extract.py` — pdfplumber extractor: `--mode word` outputs `{pages:[{paragraphs:[{text,heading,table_row}]}]}`; `--mode excel` outputs `{tables:[{page,rows,is_table}]}`.
- `artifacts/api-server/src/routes/convert.ts` — `callPdfExtract()` Node.js helper writes PDF to tmp, calls `python3 pdf_extract.py`, parses JSON stdout.
- `artifacts/api-server/src/routes/document-tools.ts` — all document conversion routes using LibreOffice.
- `artifacts/api-server/src/routes/pdf-tools.ts` — pdf-compress (ghostscript), pdf-protect (qpdf AES-256).

## LibreOffice concurrent safety

**Why:** soffice uses a single shared profile dir by default — concurrent calls corrupt it.

**How to apply:** Always pass `--env:UserInstallation=file:///tmp/lo-profile-<uuid>` AND use a unique `--outdir /tmp/lo-work-<uuid>`. Clean up both dirs in `finally`.

## PPTX→PNG slide naming

LibreOffice names slide images: `input.png` (slide 1), `input1.png` (slide 2), `input2.png` (slide 3), …

Sort with: `s === 'input.png' ? 0 : parseInt(s.replace('input','').replace('.png',''))`.

## Potrace PNG→SVG pipeline

1. Sharp resize to max 2000×2000 (potrace is O(pixels))
2. Sharp grayscale + raw buffer
3. Build P4 PBM (binary format): dark pixel (<128) → 1 in PBM
4. Write .pbm, call `potrace --svg --turdsize 4 --alphamax 1`
5. Return output .svg

## qpdf permission flags (256-bit)

```
qpdf --encrypt userPw ownerPw 256 \
  --print=full|none  --extract=y|n \
  --modify-other=y|n --annotate=y|n --form=y|n --assemble=y|n \
  -- input.pdf output.pdf
```

## Ghostscript quality presets

| level | gs flag |
|-------|---------|
| screen | `/screen` (72 dpi) |
| ebook | `/ebook` (150 dpi, default) |
| printer | `/printer` (300 dpi) |
| prepress | `/prepress` (300 dpi + ICC) |

## Python script path resolution in ESM

```typescript
const __dirname = dirname(fileURLToPath(import.meta.url));
const PDF_EXTRACT_PY = join(__dirname, '../python/pdf_extract.py');
```

Works with tsx (source path preserved via source maps).
