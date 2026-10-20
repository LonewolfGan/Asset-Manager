# Architecture Contract — Oracle VM & Fullstack Topology

## 1. System Topology & Runtime Matrix

EverydayTools Hub is engineered as a high-performance **hybrid client-server architecture**:

| Component | Technology | Runtime Port | Host Environment | Core Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web App** | React 19 + Vite + Tailwind CSS v4 | `5000` | Edge CDN / Local | UI, interactive workbench, client-side tools, previews |
| **API Server** | Express 5 + BullMQ + pino | `3001` | Dedicated Oracle VM | REST routes, job orchestration, streaming file pipelines |
| **Python Daemon** | FastAPI / Python 3 + Uvicorn | `5005` | Dedicated Oracle VM | In-memory ONNX AI background removal (`rembg`) |

---

## 2. Server-Side Execution Pipeline (Oracle VM)

All resource-intensive document and image transformations run on the **dedicated Oracle Cloud VM** (ARM64/Ubuntu 24.04), utilizing optimized system binaries:

1. **LibreOffice headless (`soffice`)**: Multi-page document conversions (DOCX, PPTX, XLSX, ODT, RTF). Concurrency-safe sandboxes with isolated profile directories.
2. **Ghostscript (`gs`)**: High-performance PDF compression, multi-page raster rendering, and PDF/A archiving.
3. **qpdf**: Fast PDF linearization, AES-256 encryption, password unlock, document repair, and page numbering.
4. **potrace**: High-resolution vector SVG generation from bitmap masks.
5. **rembg ONNX**: Neural network background removal model (`isnet-general-use`), kept prewarmed in GPU/CPU memory via Python daemon.
6. **Tesseract OCR**: Optical character recognition for scanned PDFs and image text extraction.
7. **sharp**: High-throughput libvips image re-encoding, resizing, and color space transformations.

---

## 3. Data Lifecycle & Ephemeral Privacy Guarantees

1. **Zero Permanent Storage**: User documents are NEVER written to a persistent database or disk archive.
2. **Ephemeral Workspaces**:
   - Files uploaded for server-assisted conversions are stored in isolated per-request sandboxes: `/tmp/everydaytools/<uuid>`.
   - Workspaces are owned by an unprivileged process user (`appuser`, UID 10001).
3. **Automated Eviction Scheduler** (`temp-cleanup.ts`):
   - Scans and deletes workspaces older than 15 minutes.
   - Runs automatically on server boot and repeats every 15 minutes.
   - Cleans orphan in-memory queue jobs and temporary profile directories (`/tmp/lo-work-*`, `/tmp/rembg-*`).
4. **Forbidden Copywriting**: Never claim in UI copy that "no files leave your device" or "all conversions run 100% in your browser". Describe the architecture accurately: *lightweight tools execute client-side in browser memory, while advanced document processing is handled securely and ephemerally on dedicated cloud servers with automatic deletion*.
