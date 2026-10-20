import { Router, type Request, type Response } from "express";
import { statfs } from "fs/promises";
import { tmpdir } from "os";
import { HealthCheckResponse } from "@workspace/api-zod";
import { getQueueMetrics, getRedisClient } from "../lib/queue.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";

const router = Router();

export interface MemoryDiagnostics {
  rssMb: number;
  heapUsedMb: number;
  heapTotalMb: number;
}

export interface DiskDiagnostics {
  freeGb: string;
  totalGb: string;
  percentFree: string;
  isLowDisk: boolean;
}

export function getMemoryInfo(mem = process.memoryUsage()): MemoryDiagnostics {
  return {
    rssMb: Math.round(mem.rss / (1024 * 1024)),
    heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
    heapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
  };
}

export async function getDiskInfo(
  statfsFn = statfs,
  dir = tmpdir(),
): Promise<DiskDiagnostics> {
  try {
    const stats = await statfsFn(dir);
    const freeBytes = Number(stats.bavail) * Number(stats.bsize);
    const totalBytes = Number(stats.blocks) * Number(stats.bsize);
    const freeGb = (freeBytes / (1024 ** 3)).toFixed(1);
    const totalGb = (totalBytes / (1024 ** 3)).toFixed(1);
    const percentFree = totalBytes > 0 ? Math.round((freeBytes / totalBytes) * 100) : 0;
    return {
      freeGb: `${freeGb} GB`,
      totalGb: `${totalGb} GB`,
      percentFree: `${percentFree}%`,
      isLowDisk: freeBytes < 2 * 1024 * 1024 * 1024, // Less than 2 GB free
    };
  } catch {
    return {
      freeGb: "unknown",
      totalGb: "unknown",
      percentFree: "unknown",
      isLowDisk: false,
    };
  }
}

export async function checkServiceHealth(
  url: string,
  timeoutMs = 1200,
  fetchFn = fetch,
): Promise<boolean> {
  try {
    const res = await fetchFn(url, { signal: AbortSignal.timeout(timeoutMs) });
    const ok = res.ok;
    res.body?.cancel().catch(() => {});
    return ok;
  } catch {
    return false;
  }
}

/**
 * Standard lightweight liveness check for Docker / load balancers.
 */
router.get("/healthz", (_req: Request, res: Response) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.set("Cache-Control", "no-store");
  res.json(data);
});

/**
 * Detailed diagnostics for monitoring and system observability.
 */
router.get("/healthz/detailed", defaultRateLimit, async (_req: Request, res: Response) => {
  const startTime = performance.now();

  // 1. Memory stats
  const memoryInfo = getMemoryInfo();

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
  const diskInfo = await getDiskInfo();

  // 4. Auxiliary services check (Gotenberg, Python Daemon) — queried concurrently
  const gotenbergUrl = process.env["GOTENBERG_URL"] ?? "http://127.0.0.1:3000";
  const rembgPort = process.env["REMBG_DAEMON_PORT"] ?? "5005";
  const pythonUrl = process.env["PYTHON_DAEMON_URL"] ?? `http://127.0.0.1:${rembgPort}`;

  const [gotenbergHealthy, pythonHealthy] = await Promise.all([
    checkServiceHealth(`${gotenbergUrl}/health`),
    checkServiceHealth(`${pythonUrl}/health`),
  ]);

  const isDegraded = diskInfo.isLowDisk;
  const latencyMs = Math.round(performance.now() - startTime);

  res.set("Cache-Control", "no-store");
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
