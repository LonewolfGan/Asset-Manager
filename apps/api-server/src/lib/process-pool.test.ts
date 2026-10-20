import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { ProcessPool, TimeoutError } from "./process-pool.js";
import type { ProcessContext } from "./process-pool.js";

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("ProcessPool — Concurrency, Isolation & Resilience (TDD)", () => {
  // =========================================================================
  // 1. Limite de concurrence & mise en file d'attente
  // =========================================================================
  describe("Concurrency Control & Queuing", () => {
    it("limits concurrent tasks to concurrencyLimit and queues excess tasks", async () => {
      const pool = new ProcessPool({ concurrencyLimit: 2 });
      const d1 = createDeferred<string>();
      const d2 = createDeferred<string>();
      const d3 = createDeferred<string>();

      assert.strictEqual(pool.activeCount, 0);
      assert.strictEqual(pool.pendingCount, 0);

      // Launch 3 tasks in parallel
      const p1 = pool.run(async () => d1.promise);
      const p2 = pool.run(async () => d2.promise);
      const p3 = pool.run(async () => d3.promise);

      // Tasks 1 and 2 occupy the 2 slots, Task 3 is pending in queue
      assert.strictEqual(pool.activeCount, 2, "Only 2 tasks should be active");
      assert.strictEqual(pool.pendingCount, 1, "Task 3 must wait in queue");

      // Release Task 1
      d1.resolve("T1 done");
      const res1 = await p1;
      assert.strictEqual(res1, "T1 done");

      // Microtask tick to allow queue pump
      await new Promise((r) => setImmediate(r));

      // Task 3 now occupies the liberated slot
      assert.strictEqual(pool.activeCount, 2, "Task 3 should have started");
      assert.strictEqual(pool.pendingCount, 0, "Queue should now be empty");

      // Release Task 2 and Task 3
      d2.resolve("T2 done");
      d3.resolve("T3 done");

      const [res2, res3] = await Promise.all([p2, p3]);
      assert.strictEqual(res2, "T2 done");
      assert.strictEqual(res3, "T3 done");

      assert.strictEqual(pool.activeCount, 0);
      assert.strictEqual(pool.pendingCount, 0);
    });

    it("processes tasks in strict FIFO order as slots become available", async () => {
      const pool = new ProcessPool({ concurrencyLimit: 1 });
      const executionOrder: number[] = [];
      const d1 = createDeferred();

      const p1 = pool.run(async () => {
        await d1.promise;
        executionOrder.push(1);
      });
      const p2 = pool.run(async () => {
        executionOrder.push(2);
      });
      const p3 = pool.run(async () => {
        executionOrder.push(3);
      });

      assert.strictEqual(pool.pendingCount, 2);
      d1.resolve();
      await Promise.all([p1, p2, p3]);

      assert.deepStrictEqual(executionOrder, [1, 2, 3], "Tasks must execute in FIFO order");
    });
  });

  // =========================================================================
  // 2. Workspaces éphémères & auto-nettoyage
  // =========================================================================
  describe("Ephemeral Workspaces & Auto-Cleanup", () => {
    it("allocates an isolated /tmp/everydaytools/<uuid> directory and purges it on success", async () => {
      const pool = new ProcessPool({ concurrencyLimit: 1 });
      let capturedDir = "";

      const result = await pool.run(async (ctx: ProcessContext) => {
        capturedDir = ctx.workspaceDir;
        assert.match(
          ctx.workspaceDir,
          /\/tmp\/everydaytools\/[0-9a-f-]{36}/i,
          "Workspace must be isolated in /tmp/everydaytools/<uuid>",
        );
        assert.strictEqual(existsSync(ctx.workspaceDir), true, "Workspace directory must exist on disk");

        // Write a test payload in the ephemeral workspace
        const testFile = join(ctx.workspaceDir, "test.txt");
        await writeFile(testFile, "ephemeral-content");
        assert.strictEqual(existsSync(testFile), true);

        return "success";
      });

      assert.strictEqual(result, "success");
      assert.strictEqual(
        existsSync(capturedDir),
        false,
        "Ephemeral workspace directory must be deleted immediately upon completion",
      );
    });

    it("purges ephemeral workspace directory even if the task throws an error", async () => {
      const pool = new ProcessPool({ concurrencyLimit: 1 });
      let capturedDir = "";

      await assert.rejects(
        pool.run(async (ctx: ProcessContext) => {
          capturedDir = ctx.workspaceDir;
          assert.strictEqual(existsSync(ctx.workspaceDir), true);
          await writeFile(join(ctx.workspaceDir, "scratch.dat"), "failure-data");
          throw new Error("Task computation error");
        }),
        /Task computation error/,
      );

      assert.strictEqual(
        existsSync(capturedDir),
        false,
        "Ephemeral workspace directory must be deleted even if task threw an error",
      );
    });
  });

  // =========================================================================
  // 3. Timeout dur de sécurité
  // =========================================================================
  describe("Hard Security Timeout", () => {
    it("rejects with TimeoutError, aborts signal, cleans workspace, and frees slot", async () => {
      const pool = new ProcessPool({ concurrencyLimit: 1 });
      let capturedDir = "";
      let abortTriggered = false;

      await assert.rejects(
        pool.run(
          async (ctx: ProcessContext) => {
            capturedDir = ctx.workspaceDir;
            ctx.signal.addEventListener("abort", () => {
              abortTriggered = true;
            });
            // Sleep longer than timeoutMs (50ms)
            await new Promise((resolve) => setTimeout(resolve, 300));
            return "late-result";
          },
          { timeoutMs: 50 },
        ),
        (err: unknown) => {
          assert(err instanceof TimeoutError || (err as Error)?.name === "TimeoutError");
          return true;
        },
      );

      assert.strictEqual(abortTriggered, true, "Task AbortSignal must be aborted upon timeout");
      assert.strictEqual(existsSync(capturedDir), false, "Workspace must be cleaned after timeout");
      assert.strictEqual(pool.activeCount, 0, "Pool slot must be freed immediately after timeout");

      // Subsequent task can execute immediately without being blocked
      const nextResult = await pool.run(async () => "recovery-ok");
      assert.strictEqual(nextResult, "recovery-ok");
    });
  });

  // =========================================================================
  // 4. Résilience aux erreurs
  // =========================================================================
  describe("Error Resilience & Fault Isolation", () => {
    it("releases pool slot and remains operational when a task fails", async () => {
      const pool = new ProcessPool({ concurrencyLimit: 1 });

      await assert.rejects(
        pool.run(async () => {
          throw new Error("Fatal process crash");
        }),
        /Fatal process crash/,
      );

      assert.strictEqual(pool.activeCount, 0);
      assert.strictEqual(pool.pendingCount, 0);

      // Verify normal execution continues
      const res = await pool.run(async () => "ok");
      assert.strictEqual(res, "ok");
    });

    it("isolates errors across concurrent tasks without affecting surviving tasks", async () => {
      const pool = new ProcessPool({ concurrencyLimit: 2 });

      const pFailing = pool.run(async () => {
        await new Promise((r) => setTimeout(r, 20));
        throw new Error("Worker failed");
      });

      const pSucceeding = pool.run(async () => {
        await new Promise((r) => setTimeout(r, 50));
        return "Worker succeeded";
      });

      await assert.rejects(pFailing, /Worker failed/);
      const res = await pSucceeding;
      assert.strictEqual(res, "Worker succeeded");

      assert.strictEqual(pool.activeCount, 0);
      assert.strictEqual(pool.pendingCount, 0);
    });
  });
});
