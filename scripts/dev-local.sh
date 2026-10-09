#!/usr/bin/env bash
set -e

echo "=================================================="
echo "🚀 Launching EverydayTools Hub in Local Dev Mode"
echo "=================================================="

# Ports:
# - Frontend: 5000 (Vite)
# - Backend API: 3001 (Node.js Express)
# - Python AI Daemon: 5005 (bg_daemon.py rembg)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Cleanup function on Ctrl+C or exit
cleanup() {
  echo ""
  echo "🛑 Stopping all local servers..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend API Server (Port 3001)
echo "📦 [1/2] Starting Backend API Server on http://localhost:3001..."
PORT=3001 NODE_ENV=development pnpm --filter @workspace/api-server run dev &
API_PID=$!

# Wait briefly for API server to initialize
sleep 2

# 2. Start Vite Frontend (Port 5000)
echo "🌐 [2/2] Starting Vite Frontend on http://localhost:5000..."
VITE_API_PROXY_TARGET="http://localhost:3001" pnpm --filter @workspace/everydaytools run dev &
VITE_PID=$!

echo ""
echo "✅ All services started successfully!"
echo "   - Frontend: http://localhost:5000"
echo "   - API Server: http://localhost:3001"
echo "   - Python AI Daemon (bg_daemon): http://localhost:5005"
echo "=================================================="
echo "Press Ctrl+C to stop all services."

# Wait for background processes
wait
