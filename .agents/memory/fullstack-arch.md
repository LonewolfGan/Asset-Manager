---
name: Fullstack architecture
description: How the fullstack Express + React setup works, key port/proxy wiring, and Oracle VM backend details.
---

## API Server port & Architecture
The API server runs on **Port 3001** (`PORT=3001 pnpm --filter @workspace/api-server run dev`).
In production, it is deployed on a **dedicated Oracle Cloud VM** (ARM64/Ubuntu 24.04).

## Vite proxy
`apps/everydaytools/vite.config.ts` proxies `/api` to `http://localhost:3001` in local development.
In production, the web application communicates with the Oracle VM API server endpoint over TLS.

## Backend System Binaries & Python Daemon
The API server utilizes dedicated server tools for heavy file operations:
- **LibreOffice headless (`soffice`)**: Multi-page document conversions (DOCX, PPTX, XLSX, ODT, RTF).
- **Ghostscript (`gs`)**: High-performance PDF compression and rasterization.
- **qpdf**: Linearization, encryption, decryption, repairs, and page numbering.
- **potrace**: Vector SVG generation from raster images.
- **rembg ONNX**: AI background removal model running with Python 3 daemon.
- **Tesseract OCR**: Optical character recognition.
- **sharp**: High-throughput image processing.

## Ephemeral Temp Workspaces
Files processed by the API server are kept in isolated sandboxes under `/tmp/everydaytools/<uuid>` and automatically cleaned up every 15 minutes by `temp-cleanup.ts`. No permanent file storage exists.
