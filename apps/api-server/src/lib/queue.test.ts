import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  evictExpiredInMemoryJobs,
  clearInMemoryJobs,
  getInMemoryJobEntry,
  recordInMemoryJob,
} from "./queue.js";

describe("Queue Memory Leak & Eviction (TDD)", () => {
  beforeEach(() => {
    clearInMemoryJobs();
  });

  it("evicts completed and failed jobs older than TTL", () => {
    const now = Date.now();
    const oldTime = now - (3600 * 1000 + 1000); // 1 hour + 1 second ago

    recordInMemoryJob({
      jobId: "job-old-completed",
      status: "completed",
      completedAt: oldTime,
      data: {
        jobId: "job-old-completed",
        taskType: "word-to-pdf",
        originalName: "test.docx",
        inputExt: "docx",
        targetFormat: "pdf",
      },
      progress: { percent: 100, label: "Done" },
    });

    recordInMemoryJob({
      jobId: "job-fresh-completed",
      status: "completed",
      completedAt: now - 5000,
      data: {
        jobId: "job-fresh-completed",
        taskType: "word-to-pdf",
        originalName: "test2.docx",
        inputExt: "docx",
        targetFormat: "pdf",
      },
      progress: { percent: 100, label: "Done" },
    });

    const evictedCount = evictExpiredInMemoryJobs(now, 3600 * 1000);
    assert.strictEqual(evictedCount, 1);
    assert.strictEqual(getInMemoryJobEntry("job-old-completed"), undefined);
    assert.notStrictEqual(getInMemoryJobEntry("job-fresh-completed"), undefined);
  });

  it("caps maximum memory jobs by evicting oldest completed jobs", () => {
    const now = Date.now();
    // Fill with 15 entries where max is 10
    for (let i = 0; i < 15; i++) {
      recordInMemoryJob({
        jobId: `job-${i}`,
        status: "completed",
        completedAt: now + i * 10,
        data: {
          jobId: `job-${i}`,
          taskType: "word-to-pdf",
          originalName: `test-${i}.docx`,
          inputExt: "docx",
          targetFormat: "pdf",
        },
        progress: { percent: 100, label: "Done" },
      });
    }

    const evictedCount = evictExpiredInMemoryJobs(now, 3600 * 1000, 10);
    assert.strictEqual(evictedCount, 5);
    // Oldest jobs (0, 1, 2, 3, 4) should be gone
    assert.strictEqual(getInMemoryJobEntry("job-0"), undefined);
    assert.strictEqual(getInMemoryJobEntry("job-4"), undefined);
    assert.notStrictEqual(getInMemoryJobEntry("job-14"), undefined);
  });

  it("ensures inputBufferBase64 can be cleared from memory entry", () => {
    const entry = recordInMemoryJob({
      jobId: "job-buf-test",
      status: "waiting",
      data: {
        jobId: "job-buf-test",
        taskType: "word-to-pdf",
        originalName: "test.docx",
        inputExt: "docx",
        targetFormat: "pdf",
        inputBufferBase64: "dGVzdC1kYXRh",
      },
      progress: { percent: 0, label: "Waiting" },
    });

    assert.strictEqual(entry.data.inputBufferBase64, "dGVzdC1kYXRh");

    // Clear buffer after processing
    delete entry.data.inputBufferBase64;
    assert.strictEqual(entry.data.inputBufferBase64, undefined);
    assert.strictEqual(getInMemoryJobEntry("job-buf-test")?.data.inputBufferBase64, undefined);
  });
});
