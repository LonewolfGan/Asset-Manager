# State-of-the-Art & Technical Architecture Research: PDF to Image Engine (Tool #8)

> **Document ID:** `RESEARCH-PDF-TO-IMAGE-2026-10`  
> **Status:** Finalized / Ready for Implementation  
> **Author:** EverydayTools Engineering Team  
> **Target Tool:** Tool #8 (`pdf-to-image`)  
> **Date:** October 2026  

---

## 1. Executive Summary & Problem Diagnosis

### 1.1 The Baseline Problem
Currently, `pdf-to-image` operates primarily with client-side canvas rendering (`apps/everydaytools/src/lib/pdf-to-image-logic.ts`) using `pdfjs-dist`. This setup has several critical limitations:
1. **Memory Exhaustion on Large Documents:** Rendering a 50-page PDF at 300 DPI in browser memory allocates multiple gigabytes of RGBA canvas buffers, frequently causing browser tab crashes (`OOM`).
2. **Main Thread Freezing:** Heavy rasterization on the main JavaScript thread locks user interactions and animations.
3. **Format Rigidity:** Only basic PNG/JPEG formats are supported without quality or compression tuning.
4. **Architectural Inconsistency:** The frontend utilizes custom hooks (`usePdfToImageWorkflow`) rather than the standardized `useToolWorkflow` and `ToolEngineContract`.
5. **Missing Unified Server Route:** No robust, isolated backend endpoint exists under `ProcessPool` to handle heavy batch conversions safely with automated cleanup.

### 1.2 Target Mission
Transform Tool #8 into a hybrid, enterprise-grade **PDF to Image Converter**:
- Support user-selected formats: **PNG** (lossless), **JPEG** (photo-optimized), and **WebP** (modern high-compression).
- Configurable DPI resolutions: **72 DPI** (screen/draft), **150 DPI** (standard web/email), and **300 DPI** (print-ready high-fidelity).
- Single-page PDFs return directly as the requested image format (`image/png`, `image/jpeg`, `image/webp`).
- Multi-page PDFs return a clean, compressed ZIP archive containing sequentially named image files (`page_001.png`, `page_002.png`, etc.).
- Ephemeral workspace isolation under `/tmp/everydaytools/<uuid>` with automatic purge.
- Awwwards 4-scene UI connected via `useToolWorkflow` with interactive pagination preview and continuum navigation.

---

## 2. Empirical Benchmark & Comparative Analysis

We conducted empirical benchmarks on a 3-page vector/text PDF directly on our Ubuntu 24.04 ARM64 production environment.

| Engine | DPI | Latency (3 Pages) | Total Output Size | Memory Footprint | Evaluation |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **PyMuPDF 2.0 (C-bindings)** | **150** | **164.30 ms** | 117.8 KB | **< 35 MB** | **Champion: Fastest execution, lowest memory overhead, direct Python streaming** |
| **PyMuPDF 2.0 (C-bindings)** | **300** | **722.32 ms** | 261.0 KB | **< 55 MB** | **Champion: Pristine vector rasterization, 2x faster than Poppler** |
| **Ghostscript 10 (`png16m`)** | 150 | 364.61 ms | 44.6 KB | ~85 MB | Reliable but 2.2x slower than PyMuPDF |
| **Ghostscript 10 (`png16m`)** | 300 | 1128.69 ms | 128.1 KB | ~140 MB | Sub-optimal process overhead |
| **Poppler `pdftocairo`** | 150 | 450.67 ms | 128.4 KB | ~75 MB | 2.7x slower than PyMuPDF |
| **Poppler `pdftocairo`** | 300 | 1327.33 ms | 297.0 KB | ~120 MB | Standard quality, sluggish execution |
| **Poppler `pdftoppm`** | 150 | 547.26 ms | 107.7 KB | ~80 MB | 3.3x slower than PyMuPDF |
| **Poppler `pdftoppm`** | 300 | 1404.65 ms | 239.5 KB | ~130 MB | Discarded: Highest latency |
| **In-Browser (`pdfjs-dist`)** | 150 | ~650 – 1,200 ms | Variable | Tab RAM > 150 MB | Good for preview, dangerous for multi-page downloads |

### 2.1 Benchmark Insights & Findings
1. **PyMuPDF 2.0 is Unrivaled in Speed:** At 164 ms for 150 DPI and 722 ms for 300 DPI, PyMuPDF is 2x to 3.3x faster than Poppler CLI tools on ARM64.
2. **Direct Memory Buffering:** PyMuPDF allows direct extraction to PNG/JPEG/WebP byte buffers without intermediate disk writes per page before ZIP packing.
3. **Format Flexibility:** Supports `pix.tobytes("png")`, `pix.tobytes("jpeg")`, and `pix.tobytes("webp")` out of the box with anti-aliasing control (`pymupdf.Rect`).

---

## 3. Architecture Specification

### 3.1 Topology & Request Flow
```
[User Dropzone / Staging]
         │
         ▼
[useToolWorkflow('pdf-to-image')]
         │
         ▼
[pdfToImageEngine (ToolEngineContract)]
         │ POST /api/convert/pdf-to-image (FormData: file, format, dpi)
         ▼
[handlePdfToImage (Express 5)]
         │
         ▼
[ProcessPool.run(uuid)]
         │ Isolated /tmp/everydaytools/<uuid>
         ▼
[pdf_to_image.py (PyMuPDF 2.0)]
         │
         ├── Single Page -> Return image/<fmt> (e.g. document.png)
         └── Multi-Page  -> Pack into document_images.zip (application/zip)
```

### 3.2 Concrete Module Responsibilities

1. **Python Worker (`apps/api-server/src/python/pdf_to_image.py`):**
   - Arguments: `--pdf <path> --output <path> --format <png|jpeg|webp> --dpi <72|150|300>`.
   - Opens PDF with `pymupdf.open()`.
   - Checks for password encryption (`needs_pass`) and zero-page PDFs.
   - For 1-page PDF: Saves direct image to `--output`.
   - For multi-page PDF: Creates a ZIP archive containing zero-padded files: `page_001.<ext>`, `page_002.<ext>`.
   - Enforces SRP (< 180 LOC).

2. **Express Route Handler (`apps/api-server/src/routes/convert/pdf-to-image-handler.ts`):**
   - Validates `%PDF-` signature.
   - Parses options: `format` (`png` default, `jpeg`, `webp`), `dpi` (`150` default, `72`, `300`).
   - Executes under `ProcessPool` with ephemeral workspace isolation.
   - Sets appropriate `Content-Type` (`image/png`, `image/jpeg`, `image/webp` or `application/zip`).
   - Sets RFC 5987 `Content-Disposition`.
   - Enforces SRP (< 150 LOC).

3. **Frontend Contract Adapter (`apps/everydaytools/src/engine/engines/pdf-to-image-engine.ts`):**
   - Implements `ToolEngineContract<File, PdfToImageOptions, Blob>`.
   - Serializes options to `FormData`.
   - Returns standard `ToolResult<Blob>`.
   - Enforces SRP (< 80 LOC).

4. **UI Page (`apps/everydaytools/src/pages/pdf-to-image.tsx`):**
   - Connects to `useToolWorkflow`.
   - Standard 4-Scene layout:
     * Scene 1: Dropzone (double-bezel).
     * Scene 2: Staging with format & DPI selectors.
     * Scene 3: Kinetic Conduit progress indicator.
     * Scene 4: Unboxed Result with direct download button, preview dialog, and next action continuum modal.
   - Enforces SRP (< 300 LOC).

---

## 4. TDD Verification Strategy

1. **API Server Test Suite (`pdf-to-image.test.ts`):**
   - Rejection of non-PDF or empty buffers.
   - Conversion of 1-page PDF to single image (valid PNG/JPEG/WebP magic bytes).
   - Conversion of multi-page PDF to valid ZIP archive containing `page_001.png`, `page_002.png`.
   - Respect of custom DPI (72, 150, 300).
   - Proper Content-Type and RFC 5987 Content-Disposition headers.
   - Ephemeral directory cleanup with dedicated UUID isolation.

2. **Frontend Engine Test Suite (`pdf-to-image-engine.test.ts`):**
   - Compliance with `ToolEngineContract`.
   - Accurate FormData serialization of `format` and `dpi`.
   - Error rejection on HTTP failures.

---

## 5. Decision & Recommendation

**Proceed with PyMuPDF 2.0 as the primary engine for Tool #8.**  
It delivers industry-leading latency (164 ms for 150 DPI), minimal RAM usage (< 35 MB), clean multi-page ZIP bundling, and zero new system package dependencies.
