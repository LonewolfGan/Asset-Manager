import type {
  ConversionJobData,
  JobProgress,
  JobResult,
  InMemoryJobEntry,
} from "./queue-types.js";

const IN_MEMORY_JOB_TTL_MS = 60 * 60 * 1000; // 1 hour TTL
const DEFAULT_MAX_MEMORY_JOBS = 200;

// In-memory fallback map for environments without Redis
const inMemoryJobs = new Map<string, InMemoryJobEntry>();

export function clearInMemoryJobs(): void {
  inMemoryJobs.clear();
}

export function getInMemoryJobEntry(jobId: string): InMemoryJobEntry | undefined {
  return inMemoryJobs.get(jobId);
}

export function setInMemoryJob(jobId: string, entry: InMemoryJobEntry): void {
  inMemoryJobs.set(jobId, entry);
}

export function recordInMemoryJob(
  entry: Partial<InMemoryJobEntry> & { jobId: string; status: InMemoryJobEntry["status"] },
): InMemoryJobEntry {
  const fullEntry: InMemoryJobEntry = {
    data: entry.data ?? {
      jobId: entry.jobId,
      taskType: "word-to-pdf",
      originalName: "file",
      inputExt: "docx",
      targetFormat: "pdf",
    },
    status: entry.status,
    progress: entry.progress ?? { percent: 0, label: "" },
    result: entry.result,
    error: entry.error,
    createdAt: entry.createdAt ?? Date.now(),
    completedAt: entry.completedAt,
    listeners: entry.listeners ?? [],
  };
  inMemoryJobs.set(entry.jobId, fullEntry);
  return fullEntry;
}

/**
 * Evict completed or failed in-memory jobs older than TTL or when exceeding cap.
 */
export function evictExpiredInMemoryJobs(
  now = Date.now(),
  maxAgeMs = IN_MEMORY_JOB_TTL_MS,
  maxJobs = DEFAULT_MAX_MEMORY_JOBS,
): number {
  let evicted = 0;

  for (const [id, entry] of inMemoryJobs.entries()) {
    if ((entry.status === "completed" || entry.status === "failed") && entry.completedAt) {
      if (now - entry.completedAt > maxAgeMs) {
        inMemoryJobs.delete(id);
        evicted++;
      }
    }
  }

  if (inMemoryJobs.size > maxJobs) {
    const finished = [...inMemoryJobs.entries()]
      .filter(([_, e]) => e.status === "completed" || e.status === "failed")
      .sort((a, b) => (a[1].completedAt ?? 0) - (b[1].completedAt ?? 0));

    while (inMemoryJobs.size > maxJobs && finished.length > 0) {
      const [oldId] = finished.shift()!;
      inMemoryJobs.delete(oldId);
      evicted++;
    }
  }

  return evicted;
}

export function getInMemoryMetrics(): { waiting: number; active: number; completed: number; failed: number } {
  let waiting = 0;
  let active = 0;
  let completed = 0;
  let failed = 0;
  for (const job of inMemoryJobs.values()) {
    if (job.status === "waiting") waiting++;
    else if (job.status === "active") active++;
    else if (job.status === "completed") completed++;
    else if (job.status === "failed") failed++;
  }
  return { waiting, active, completed, failed };
}

export function getInMemoryJobStatus(jobId: string): {
  id: string;
  status: "waiting" | "active" | "completed" | "failed" | "not_found";
  progress: JobProgress;
  result?: { filename: string; size: number };
  error?: string;
} {
  const mem = inMemoryJobs.get(jobId);
  if (!mem) {
    return {
      id: jobId,
      status: "not_found",
      progress: { percent: 0, label: "Tâche introuvable" },
    };
  }

  return {
    id: jobId,
    status: mem.status,
    progress: mem.progress,
    result: mem.result ? { filename: mem.result.filename, size: mem.result.size } : undefined,
    error: mem.error,
  };
}
