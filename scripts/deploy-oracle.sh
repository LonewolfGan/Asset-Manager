#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "🚀 EverydayTools Hub — Deployment Script (Oracle Cloud VM)"
echo "=========================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# 1. Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed or not in PATH."
  exit 1
fi

COMPOSE_CMD=""
if docker compose version &> /dev/null; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
else
  echo "❌ Docker Compose is not installed."
  exit 1
fi

echo "📦 Using Compose: $COMPOSE_CMD"
echo "📂 Project root:  $ROOT_DIR"
echo ""

# 2. Build and restart containers gracefully
echo "🔄 [1/4] Building and launching containers in background..."
$COMPOSE_CMD up -d --build --remove-orphans

# 3. Wait for API Healthcheck
echo ""
echo "⏳ [2/4] Waiting for services to become healthy..."
MAX_ATTEMPTS=30
ATTEMPT=0
HEALTHY=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  sleep 2

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/api/healthz || true)
  if [ "$STATUS" = "200" ]; then
    HEALTHY=1
    break
  fi
  printf "."
done

echo ""
if [ $HEALTHY -eq 1 ]; then
  echo "✅ API Server is live and healthy (HTTP 200)!"
else
  echo "⚠️ API Server took longer than expected to report healthy."
  echo "   Inspect logs with: $COMPOSE_CMD logs api-server"
fi

# 4. Fetch detailed system diagnostic
echo ""
echo "📊 [3/4] System & Queue Diagnostics:"
curl -s http://127.0.0.1:3001/api/healthz/detailed | grep -v '^$' || echo "Could not fetch detailed metrics"

# 5. Disk space and image cleanup
echo ""
echo "🧹 [4/4] Pruning dangling Docker images to preserve disk space..."
docker image prune -f > /dev/null 2>&1 || true

echo ""
echo "=========================================================="
echo "🎉 Deployment completed successfully on Oracle VM!"
echo "   - API Endpoint:    http://127.0.0.1:3001"
echo "   - Healthcheck:     http://127.0.0.1:3001/api/healthz"
echo "   - Diagnostics:     http://127.0.0.1:3001/api/healthz/detailed"
echo "   - View logs:       $COMPOSE_CMD logs -f"
echo "=========================================================="
