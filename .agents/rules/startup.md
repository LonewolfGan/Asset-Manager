# EverydayTools Local Development & Startup Guide

When the user asks to run, start, or launch the application in local development mode, follow this exact procedure:

## Architecture
1. **Frontend (EverydayTools Hub)**:
   - Directory: `artifacts/everydaytools`
   - Port: `5000`
   - Command: `pnpm --filter @workspace/everydaytools run dev`
   - Proxies `/api` requests to `http://localhost:3001`

2. **Backend API Server**:
   - Directory: `artifacts/api-server`
   - Port: `3001`
   - Command: `PORT=3001 pnpm --filter @workspace/api-server run dev`
   - Spawns and manages `bg_daemon.py` on port `5005` automatically at startup via warmup.

3. **Python AI Daemon (rembg ISNet)**:
   - Script: `artifacts/api-server/python/bg_daemon.py`
   - Port: `5005`
   - Automatically warmed up and kept in memory by the API server.

## Quick One-Command Startup
Simply run:
```bash
pnpm dev
# or
./scripts/dev-local.sh
```

## Health Checks
- Frontend: `http://localhost:5000`
- API Health: `http://localhost:3001/api/health`
- Background Remover: `http://localhost:5000/en/background-remover`
