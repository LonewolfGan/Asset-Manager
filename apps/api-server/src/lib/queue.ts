import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import { join } from "path";
import { mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import { logger } from "./logger.js";
import { JOBS_DIR, processConversionJob } from "./queue-processor.js";
import type { ConversionJobData, JobProgress, JobResult, InMemoryJobEntry } from "./queue-types.js";
import {
  setInMemoryJob,
  evictExpiredInMemoryJobs,
  getInMemoryMetrics,
  getInMemoryJobStatus,
} from "./queue-memory.js";

export type { ConversionJobData, JobProgress, JobResult } from "./queue-types.js";
export {
  clearInMemoryJobs,
  getInMemoryJobEntry,
  recordInMemoryJob,
  evictExpiredInMemoryJobs,
} from "./queue-memory.js";

const REDIS_URL = process.env["REDIS_URL"] ?? "redis://127.0.0.1:6379";
const QUEUE_NAME = "document-conversions";

let redisConnection: Redis | null = null;
let conversionQueue: Queue<ConversionJobData> | null = null;
let conversionWorker: Worker<ConversionJobData> | null = null;
let isRedisReady = false;

/**
 * Initialize Redis and BullMQ worker.
 * If Redis is unavailable, logs a warning and falls back to an in-process queue.
 */
export async function initConversionQueue(): Promise<void> {
  await mkdir(JOBS_DIR, { recursive: true }).catch(() => {});

  try {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 500, 2000);
      },
    });

    client.on("error", (err) => {
      if (!isRedisReady) {
        logger.debug({ err: err.message }, "Redis connection failed — in-memory async fallback active");
      }
    });

    await client.connect();
    redisConnection = client;
    isRedisReady = true;

    conversionQueue = new Queue<ConversionJobData>(QUEUE_NAME, {
      connection: redisConnection,
      defaultJobOptions: {
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 3600 },
      },
    });

    conversionWorker = new Worker<ConversionJobData>(
      QUEUE_NAME,
      async (job: Job<ConversionJobData>) => {
        return await processConversionJob(job.data, async (percent, label) => {
          await job.updateProgress({ percent, label });
        });
      },
      {
        connection: redisConnection,
        concurrency: 2,
      },
    );

    conversionWorker.on("completed", (job) => {
      logger.info({ jobId: job.data.jobId }, "Conversion job completed successfully");
    });

    conversionWorker.on("failed", (job, err) => {
      logger.warn({ jobId: job?.data.jobId, err: err.message }, "Conversion job failed");
    });

    logger.info({ url: REDIS_URL, queue: QUEUE_NAME }, "BullMQ conversion queue and worker initialized with Redis");
  } catch (_err) {
    isRedisReady = false;
    logger.info("Redis not detected — async conversions will use resilient in-process queue");
  }
}

/**
 * Submit a new conversion job.
 * Returns the jobId immediately (HTTP 202).
 */
export async function submitConversionJob(
  taskType: ConversionJobData["taskType"],
  fileBuffer: Buffer,
  originalName: string,
  targetFormat: string,
): Promise<{ jobId: string }> {
  const jobId = randomUUID();
  const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const inputExt = extMatch ? extMatch[1].toLowerCase() : "docx";

  const jobData: ConversionJobData = {
    jobId,
    taskType,
    originalName,
    inputExt,
    targetFormat,
    inputBufferBase64: fileBuffer.toString("base64"),
  };

  if (isRedisReady && conversionQueue) {
    await conversionQueue.add("convert", jobData, { jobId });
  } else {
    const memEntry: InMemoryJobEntry = {
      data: jobData,
      status: "waiting",
      progress: { percent: 0, label: "En attente dans la file..." },
      createdAt: Date.now(),
      listeners: [],
    };
    setInMemoryJob(jobId, memEntry);

    setImmediate(async () => {
      memEntry.status = "active";
      try {
        const result = await processConversionJob(jobData, async (percent, label) => {
          memEntry.progress = { percent, label };
          memEntry.listeners.forEach((l) => l({ percent, label }));
        });
        memEntry.status = "completed";
        memEntry.result = result;
      } catch (err) {
        memEntry.status = "failed";
        memEntry.error = err instanceof Error ? err.message : "Erreur de conversion";
      } finally {
        // Free base64 buffer from memory entry to avoid retention
        delete memEntry.data.inputBufferBase64;
        delete jobData.inputBufferBase64;
        memEntry.completedAt = Date.now();
        evictExpiredInMemoryJobs();
      }
    });
  }

  return { jobId };
}

/**
 * Query current job status (for polling or initial state).
 */
export async function getJobStatus(jobId: string): Promise<{
  id: string;
  status: "waiting" | "active" | "completed" | "failed" | "not_found";
  progress: JobProgress;
  result?: { filename: string; size: number };
  error?: string;
}> {
  if (isRedisReady && conversionQueue) {
    const job = await conversionQueue.getJob(jobId);
    if (!job) {
      return {
        id: jobId,
        status: "not_found",
        progress: { percent: 0, label: "Tâche introuvable" },
      };
    }

    const state = await job.getState();
    const progress = (job.progress as JobProgress) || { percent: 0, label: "En attente..." };
    const result = job.returnvalue as JobResult | undefined;

    return {
      id: jobId,
      status: state as "waiting" | "active" | "completed" | "failed",
      progress,
      result: result ? { filename: result.filename, size: result.size } : undefined,
      error: job.failedReason,
    };
  }

  return getInMemoryJobStatus(jobId);
}

/**
 * Retrieve path to output file for downloading.
 */
export async function getJobOutputPath(jobId: string): Promise<{ path: string; filename: string } | null> {
  const jobFolder = join(JOBS_DIR, jobId);
  try {
    const { readdir } = await import("fs/promises");
    const files = await readdir(jobFolder);
    if (files.length === 0) return null;
    return {
      path: join(jobFolder, files[0]),
      filename: files[0],
    };
  } catch {
    return null;
  }
}

/**
 * Access the active Redis client if connected.
 */
export function getRedisClient(): Redis | null {
  return isRedisReady ? redisConnection : null;
}

/**
 * Diagnostic metrics for health checks and observability.
 */
export async function getQueueMetrics(): Promise<{
  redisConnected: boolean;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}> {
  if (isRedisReady && conversionQueue) {
    try {
      const counts = await conversionQueue.getJobCounts("waiting", "active", "completed", "failed");
      return {
        redisConnected: true,
        waiting: counts.waiting ?? 0,
        active: counts.active ?? 0,
        completed: counts.completed ?? 0,
        failed: counts.failed ?? 0,
      };
    } catch {
      // Fall through if Redis error
    }
  }

  const counts = getInMemoryMetrics();
  return {
    redisConnected: false,
    ...counts,
  };
}
