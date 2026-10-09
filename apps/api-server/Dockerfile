# ─────────────────────────────────────────────────────────────────────────────
# EverydayTools API Server — Multi-stage Dockerfile
# Compatible with ARM64 (Oracle Cloud aarch64) and x86_64.
#
# Build context: repository root  (run from workspace root)
#   docker build -f artifacts/api-server/Dockerfile -t everydaytools-api .
#
# The two-stage approach:
#   Stage 1 (builder) — uses the full pnpm monorepo to compile TypeScript via
#     esbuild. Workspace deps (@workspace/api-zod, @workspace/db) are resolved
#     here and bundled into dist/index.mjs.
#   Stage 2 (runtime) — lean Ubuntu 24.04 image with Node 20, system tools,
#     Python deps, and only the native npm packages that esbuild cannot inline.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

RUN npm install -g pnpm@10

WORKDIR /workspace

# Copy monorepo manifests first (maximise layer cache)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc tsconfig.base.json ./

# Copy workspace packages needed by the api-server
COPY lib/ ./lib/
COPY apps/api-server/ ./apps/api-server/

# Install all deps (devDeps required for esbuild)
RUN pnpm install --frozen-lockfile --registry https://registry.npmjs.org

# Compile TypeScript → dist/index.mjs
RUN pnpm --filter @workspace/api-server run build


# ── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive

# System tools:
# - libreoffice: Headless document conversions (DOCX, ODT, RTF, PPTX, XLSX -> PDF / target formats)
# - ghostscript: PDF compression, multi-page rendering to raster, PDF/A conversion
# - potrace: High-quality SVG vector tracing from bitmaps
# - qpdf: Fast PDF linearization, repair, page manipulation, AES-256 protection & unlock
# - tesseract-ocr (+ eng/fra): Optical Character Recognition for image & PDF OCR
# - poppler-utils: High-performance PDF rasterization utilities (pdftoppm, pdfinfo)
RUN apt-get update && apt-get install -y \
        curl \
        python3 python3-pip \
        libreoffice \
        ghostscript \
        potrace \
        qpdf \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-fra \
        poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Node.js 20 (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# pnpm
RUN npm install -g pnpm@10

# Python dependencies:
# - rembg[cpu]: ONNX AI background removal (isnet-general-use / u2net models)
# - pdfplumber + pypdf: Structured PDF table, layout and text extraction
# - Pillow: Image manipulation and format conversions
# - pillow-heif: Native Apple HEIC/HEIF photo decoding and conversion
# - openpyxl: Excel spreadsheet processing
# - python-docx: Word document manipulation
# - pytesseract: Python OCR integration wrapper
RUN pip3 install --break-system-packages \
        "rembg[cpu]>=2.0.77" \
        pdfplumber \
        pypdf \
        Pillow \
        pillow-heif \
        openpyxl \
        python-docx \
        pytesseract

# ── Create unprivileged app user for defense in depth ────────────────────────
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /bin/bash appuser && \
    chmod 1777 /tmp

WORKDIR /app

# Pre-download isnet-general-use model into shared /app/.u2net directory
ENV U2NET_HOME=/app/.u2net
RUN mkdir -p /app/.u2net && python3 -c "import os; os.environ['U2NET_HOME']='/app/.u2net'; from rembg import new_session; new_session('isnet-general-use')" || true

# Copy compiled JS bundle from builder
COPY --from=builder /workspace/apps/api-server/dist/ ./dist/

# Copy Python helper scripts (called as subprocesses — not bundled by esbuild).
# Placed at /app/python/ to match the PYTHON_SCRIPTS_DIR runtime default.
COPY apps/api-server/src/python/ ./python/

# Install only the native / dynamically-imported npm packages the bundle needs
# at runtime. All pure-JS deps are already inlined by esbuild.
COPY apps/api-server/package.runtime.json ./package.json
RUN pnpm install --no-lockfile

# Ensure ownership belongs to unprivileged user
RUN chown -R appuser:appgroup /app

# ── Environment defaults ──────────────────────────────────────────────────────
ENV NODE_ENV=production
ENV PORT=3001
ENV PYTHON_SCRIPTS_DIR=/app/python
ENV U2NET_HOME=/app/.u2net
# Override FRONTEND_URL at runtime: docker run -e FRONTEND_URL=https://your-domain
ENV FRONTEND_URL=https://everydaytools.qzz.io

USER appuser

EXPOSE 3001

# Healthcheck (used by Docker / container orchestrators)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/api/healthz || exit 1

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
