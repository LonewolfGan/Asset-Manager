import { Router, type Request, type Response } from "express";
import { statfs } from "fs/promises";
import { tmpdir } from "os";
import { HealthCheckResponse } from "@workspace/api-zod";
import { getQueueMetrics, getRedisClient } from "../lib/queue.js";

const router = Router();

/**
 * Standard lightweight liveness check for Docker / load balancers.
 */
router.get("/healthz", (_req: Request, res: Response) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

/**
 * Detailed diagnostics for monitoring and system observability.
 */
router.get("/healthz/detailed", async (_req: Request, res: Response) => {
  const startTime = performance.now();

  // 1. Memory stats
  const mem = process.memoryUsage();
  const memoryInfo = {
    rssMb: Math.round(mem.rss / (1024 * 1024)),
    heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
    heapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
  };

  // 2. Queue & Redis metrics
  const queueMetrics = await getQueueMetrics();
  let redisPingMs: number | null = null;
  const redis = getRedisClient();
  if (redis) {
    try {
      const pingStart = performance.now();
      await redis.ping();
      redisPingMs = Math.round(performance.now() - pingStart);
    } catch {
      redisPingMs = null;
    }
  }

  // 3. Disk space on temp volume
  let diskInfo = {
    freeGb: "unknown",
    totalGb: "unknown",
    percentFree: "unknown",
    isLowDisk: false,
  };
  try {
    const stats = await statfs(tmpdir());
    const freeBytes = Number(stats.bavail) * Number(stats.bsize);
    const totalBytes = Number(stats.blocks) * Number(stats.bsize);
    const freeGb = (freeBytes / (1024 ** 3)).toFixed(1);
    const totalGb = (totalBytes / (1024 ** 3)).toFixed(1);
    const percentFree = totalBytes > 0 ? Math.round((freeBytes / totalBytes) * 100) : 0;
    diskInfo = {
      freeGb: `${freeGb} GB`,
      totalGb: `${totalGb} GB`,
      percentFree: `${percentFree}%`,
      isLowDisk: freeBytes < 2 * 1024 * 1024 * 1024, // Less than 2 GB free
    };
  } catch {
    // Soft ignore if statfs fails on custom environments
  }

  // 4. Auxiliary services check (Gotenberg, Python Daemon)
  const gotenbergUrl = process.env["GOTENBERG_URL"] ?? "http://127.0.0.1:3000";
  let gotenbergHealthy = false;
  try {
    const gRes = await fetch(`${gotenbergUrl}/health`, { signal: AbortSignal.timeout(1200) });
    gotenbergHealthy = gRes.ok;
  } catch {
    gotenbergHealthy = false;
  }

  const pythonUrl = process.env["PYTHON_DAEMON_URL"] ?? "http://127.0.0.1:5005";
  let pythonHealthy = false;
  try {
    const pRes = await fetch(`${pythonUrl}/health`, { signal: AbortSignal.timeout(1200) });
    pythonHealthy = pRes.ok;
  } catch {
    pythonHealthy = false;
  }

  const isDegraded = diskInfo.isLowDisk;
  const latencyMs = Math.round(performance.now() - startTime);

  res.status(isDegraded ? 503 : 200).json({
    status: isDegraded ? "degraded" : "ok",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    latencyMs,
    disk: diskInfo,
    memory: memoryInfo,
    queue: {
      redisConnected: queueMetrics.redisConnected,
      redisPingMs,
      waiting: queueMetrics.waiting,
      active: queueMetrics.active,
      completed: queueMetrics.completed,
      failed: queueMetrics.failed,
    },
    services: {
      gotenberg: gotenbergHealthy ? "connected" : "fallback_local",
      pythonDaemon: pythonHealthy ? "ready" : "offline",
    },
  });
});

export default router;
