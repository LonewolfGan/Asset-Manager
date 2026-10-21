import { randomUUID } from "node:crypto";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

/**
 * Thrown when a task execution exceeds its allocated execution timeout.
 */
export class TimeoutError extends Error {
  constructor(message = "Process execution timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Execution context provided to each task run in the ProcessPool.
 */
export interface ProcessContext {
  taskId: string;
  workspaceDir: string;
  signal: AbortSignal;
}

/**
 * Configuration options for ProcessPool initialization.
 */
export interface ProcessPoolOptions {
  concurrencyLimit?: number;
  defaultTimeoutMs?: number;
  baseTempDir?: string;
}

/**
 * Options for a single task execution in ProcessPool.
 */
export interface ProcessRunOptions {
  timeoutMs?: number;
}

/**
 * High-performance concurrency pool providing resource-isolated ephemeral
 * workspaces and hard abort timeouts for server document processes.
 */
export class ProcessPool {
  public readonly concurrencyLimit: number;
  public readonly defaultTimeoutMs?: number;
  public readonly baseTempDir: string;

  private activeWorkers = 0;
  private readonly queue: Array<() => void> = [];

  constructor(options?: ProcessPoolOptions) {
    this.concurrencyLimit = Math.max(1, options?.concurrencyLimit ?? 4);
    this.defaultTimeoutMs = options?.defaultTimeoutMs;
    this.baseTempDir = options?.baseTempDir ?? "/tmp/everydaytools";
  }

  /**
   * Number of tasks currently executing in isolated worker slots.
   */
  public get activeCount(): number {
    return this.activeWorkers;
  }

  /**
   * Number of tasks waiting in FIFO queue for an available execution slot.
   */
  public get pendingCount(): number {
    return this.queue.length;
  }

  /**
   * Runs a task inside an isolated ephemeral workspace with timeout and concurrency control.
   */
  public async run<T>(
    taskFn: (ctx: ProcessContext) => Promise<T> | T,
    options?: ProcessRunOptions,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const execute = async () => {
        const taskId = randomUUID();
        const workspaceDir = join(this.baseTempDir, taskId);
        const controller = new AbortController();
        const ctx: ProcessContext = {
          taskId,
          workspaceDir,
          signal: controller.signal,
        };

        const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
        let timer: NodeJS.Timeout | undefined;
        let settled = false;

        const cleanupAndRelease = async () => {
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
          try {
            await rm(workspaceDir, { recursive: true, force: true });
          } catch {
            // Ephemeral workspace directory already removed or inaccessible
          }
          this.activeWorkers--;
          this.processQueue();
        };

        if (timeoutMs !== undefined && timeoutMs > 0) {
          timer = setTimeout(async () => {
            if (settled) return;
            settled = true;
            controller.abort();
            await cleanupAndRelease();
            reject(new TimeoutError(`Process execution timed out after ${timeoutMs}ms`));
          }, timeoutMs);

          if (typeof timer.unref === "function") {
            timer.unref();
          }
        }

        try {
          await mkdir(workspaceDir, { recursive: true });
        } catch (mkdirErr) {
          if (settled) return;
          settled = true;
          await cleanupAndRelease();
          reject(mkdirErr);
          return;
        }

        try {
          const result = await taskFn(ctx);
          if (settled) return;
          settled = true;
          await cleanupAndRelease();
          resolve(result);
        } catch (err) {
          if (settled) return;
          settled = true;
          await cleanupAndRelease();
          reject(err);
        }
      };

      if (this.activeWorkers < this.concurrencyLimit) {
        this.activeWorkers++;
        void execute();
      } else {
        this.queue.push(() => {
          void execute();
        });
      }
    });
  }

  /**
   * Dispatches pending tasks in FIFO order when worker slots are available.
   */
  private processQueue(): void {
    while (this.activeWorkers < this.concurrencyLimit && this.queue.length > 0) {
      const nextTask = this.queue.shift();
      if (!nextTask) break;
      this.activeWorkers++;
      nextTask();
    }
  }
}

/**
 * Shared singleton process pool for server document processing.
 */
export const defaultProcessPool = new ProcessPool({
  concurrencyLimit: 4,
  defaultTimeoutMs: 120_000,
});

