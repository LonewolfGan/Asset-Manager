# EverydayTools API Server — Docker image for Render / Railway / Fly.io
#
# Includes: Node.js 24, LibreOffice, Ghostscript, Potrace, QPDF,
#           Python 3, pdfplumber, pikepdf, rembg (u2net model).
#
# Build context: repo root (so pnpm workspace files are available)
#   docker build -f artifacts/api-server/Dockerfile -t everydaytools-api .

FROM node:24-slim

# ── System packages ──────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
      libreoffice \
      libreoffice-writer \
      libreoffice-calc \
      libreoffice-impress \
      ghostscript \
      potrace \
      qpdf \
      python3 \
      python3-pip \
      python3-dev \
      build-essential \
      curl \
    && rm -rf /var/lib/apt/lists/*

# ── Python packages ───────────────────────────────────────────────────────────
# rembg will download the u2net model on first use (~170 MB) to ~/.u2net/
# Pre-warm by running: python3 -c "from rembg import new_session; new_session('u2net')"
RUN pip3 install --no-cache-dir \
      pdfplumber \
      pikepdf \
      "rembg[cpu]" \
      Pillow

# ── Node packages ─────────────────────────────────────────────────────────────
WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/everydaytools/package.json ./artifacts/everydaytools/

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
COPY . .

# Build frontend (static files served by Express in production)
RUN pnpm --filter @workspace/everydaytools run build

# Build API server
RUN pnpm --filter @workspace/api-server run build

# ── Runtime ───────────────────────────────────────────────────────────────────
ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

WORKDIR /app/artifacts/api-server

CMD ["node", "dist/index.js"]
