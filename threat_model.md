# Threat Model — EverydayTools Hub

## Project Overview

EverydayTools Hub is a modern, high-performance multi-tool utility application operating on a **hybrid client-server architecture**:

1. **Frontend Client Application** (`apps/everydaytools`):
   - Built with React 19, TypeScript, Vite, Tailwind CSS v4, and wouter.
   - Deployed on edge CDN (Vercel/Cloudflare).
   - Handles lightweight utilities, calculators, text formatters, and interactive studio previews client-side in browser memory.

2. **Dedicated Backend API Server** (`apps/api-server`):
   - Hosted on a **dedicated Oracle Cloud VM** (ARM64/Ubuntu 24.04).
   - Runs Express 5 on **Port 3001** with BullMQ job queues and an automated Python daemon (Port 5005).
   - Orchestrates hardened system binaries and libraries:
     - **LibreOffice headless (`soffice`)**: High-fidelity document conversions (DOCX, PPTX, XLSX, ODT, RTF).
     - **Ghostscript (`gs`)**: PDF compression, multi-page rasterization, and PDF/A archiving.
     - **qpdf**: Fast PDF linearization, AES-256 encryption/unlock, page repairs, and numbering.
     - **potrace**: High-resolution bitmap-to-SVG vector tracing.
     - **rembg ONNX**: AI neural network background removal (`isnet-general-use`).
     - **Tesseract OCR**: Optical character recognition.
     - **sharp**: High-throughput image processing and resizing.

**Users:** Anonymous public users performing secure, fast document and media processing without mandatory account creation.

---

## Assets & Data Lifecycle

- **Client In-Memory Data**: Pure client-side calculations (hash generation, UUIDs, unit conversion, JSON formatting) execute entirely in client memory (ArrayBuffer/Blob). No external network requests occur for these tools.
- **Server Ephemeral Workspaces**:
  - Files submitted for server-assisted conversion are uploaded over TLS into dedicated ephemeral directories (`/tmp/everydaytools/<session-uuid>`).
  - An automated cleanup daemon (`apps/api-server/src/lib/temp-cleanup.ts`) runs every 15 minutes and immediately on boot, enforcing strict purging of workspaces older than 15 minutes.
  - Processed files are served with streaming buffers and ephemeral Object URLs, never stored in persistent databases.
- **LocalStorage Data**: Strictly restricted to non-sensitive UI preferences (theme, locale) and short-lived currency exchange rates (1-hour TTL).
- **Environment & Secrets**: Handled strictly via server environment variables (`FRONTEND_URL`, `PORT=3001`). No secrets are bundled into the client bundle.

---

## Trust Boundaries

1. **Browser / Edge CDN Boundary**: Client assets delivered via secure CDN with strict CSP headers, HSTS, and subresource integrity.
2. **Client / Oracle VM API Server Boundary**:
   - TLS-encrypted API traffic.
   - CORS strictly locked to `FRONTEND_URL`.
   - Rate limiting enforced on all endpoints to prevent abuse.
3. **API Process / Operating System Sandbox Boundary**:
   - Subprocesses (`soffice`, `gs`, `qpdf`, Python daemon) run under an unprivileged user (`appuser`, UID 10001) in Docker on the Oracle VM.
   - Isolated temporary workspaces with bounded disk quotas and aggressive timeouts prevent resource exhaustion.
4. **User File / DOM Boundary**:
   - Any document preview rendered in the browser DOM (DOCX preview, HTML view) MUST be sanitized using DOMPurify before insertion to eliminate stored or reflected XSS.

---

## Threat Categories & Mitigation Guarantees

### 1. Tampering & XSS (DOM Sanitization)
- **Risk**: Malicious files containing embedded `<script>` or event handlers executed in DOM previews.
- **Guarantees**:
  - DOMPurify sanitization enforced on all HTML rendered in previews.
  - CSP `script-src 'self'` prevents inline script execution.

### 2. Information Disclosure & Data Retention
- **Risk**: User documents persisting on server storage or leaking across sessions.
- **Guarantees**:
  - Zero permanent document storage: all conversions operate in temporary memory/disk sandboxes.
  - `cleanupTempFiles()` automatically evicts stale workspaces and in-memory queue jobs.
  - No document analytics or tracking of file contents.

### 3. Denial of Service (Server & Client Resource Exhaustion)
- **Risk**: Decompression bombs (zip bombs), gigantic PDFs, or abusive batch processing overwhelming the Oracle VM CPU/RAM.
- **Guarantees**:
  - Strict upload payload limits enforced by `multer` (PDF/DOCX ≤ 50MB, images ≤ 25MB, text ≤ 5MB).
  - Queue management via BullMQ with memory fallbacks to throttle concurrent LibreOffice / rembg executions.
  - Client-side rate limiting on rapid repeated requests.

### 4. Command Injection in Binary Wrappers
- **Risk**: Malicious filenames or parameters passed into CLI arguments (`soffice`, `gs`, `qpdf`).
- **Guarantees**:
  - All binary invocations use `execFile` with explicit argument arrays—never shell string interpolation (`exec`).
  - Filenames in temp workspaces use sanitized UUID-generated identifiers.
