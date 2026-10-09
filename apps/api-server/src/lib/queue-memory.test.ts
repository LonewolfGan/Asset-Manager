import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  evictExpiredInMemoryJobs,
  clearInMemoryJobs,
  getInMemoryJobEntry,
  recordInMemoryJob,
  getInMemoryMetrics,
  getInMemoryJobStatus,
} from "./queue-memory.js";

describe("Queue Memory Store & Eviction (TDD)", () => {
  beforeEach(() => {
    clearInMemoryJobs();
  });

  it("calculates in-memory queue metrics accurately", () => {
    recordInMemoryJob({ jobId: "job-w", status: "waiting" });
    recordInMemoryJob({ jobId: "job-a", status: "active" });
    recordInMemoryJob({ jobId: "job-c", status: "completed" });
    recordInMemoryJob({ jobId: "job-f", status: "failed" });

    const metrics = getInMemoryMetrics();
    assert.deepStrictEqual(metrics, {
      waiting: 1,
      active: 1,
      completed: 1,
      failed: 1,
    });
  });

  it("returns not_found status when job ID is unknown", () => {
    const status = getInMemoryJobStatus("unknown-job");
    assert.strictEqual(status.status, "not_found");
  });

  it("evicts stale completed jobs and retains fresh ones", () => {
    const now = Date.now();
    recordInMemoryJob({
      jobId: "stale",
      status: "completed",
      completedAt: now - 3600_000 - 1000,
    });
    recordInMemoryJob({
      jobId: "fresh",
      status: "completed",
      completedAt: now - 1000,
    });

    const evicted = evictExpiredInMemoryJobs(now, 3600_000);
    assert.strictEqual(evicted, 1);
    assert.strictEqual(getInMemoryJobEntry("stale"), undefined);
    assert.notStrictEqual(getInMemoryJobEntry("fresh"), undefined);
  });
});
