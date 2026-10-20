/**
 * Universal WebWorker Engine Host
 * Coordinates client-side WebWorker execution with AbortSignal cancellation,
 * zero-copy transferable objects support, and graceful fallback degradation.
 */

import type {
  ToolProgress,
  ToolExecuteOptions,
  ToolResult,
  ToolEngineContract,
} from './tool-contract';

export type {
  ToolProgress,
  ToolExecuteOptions,
  ToolResult,
  ToolEngineContract,
} from './tool-contract';

export interface WorkerExecuteOptions extends ToolExecuteOptions {
  transferables?: Transferable[];
  [key: string]: unknown;
}

export interface WorkerEngineHostConfig<TInput = unknown, TOutput = unknown> {
  id?: string;
  name?: string;
  workerFactory: () => Worker;
  fallbackEngine?: {
    execute(input: TInput, options?: any): Promise<any>;
    id?: string;
    name?: string;
    abort?(): void;
  };
}

interface WorkerProgressMessage {
  type: 'PROGRESS';
  percent: number;
  stage?: string;
  message?: string;
}

interface WorkerSuccessMessage<TOutput> {
  type: 'SUCCESS';
  result: ToolResult<TOutput>;
  transferables?: Transferable[];
}

interface WorkerErrorMessage {
  type: 'ERROR';
  error?: string;
}

type WorkerIncomingMessage<TOutput> =
  | WorkerProgressMessage
  | WorkerSuccessMessage<TOutput>
  | WorkerErrorMessage;

export class WorkerEngineHost<TInput = unknown, TOutput = unknown>
  implements ToolEngineContract<TInput, WorkerExecuteOptions, TOutput>
{
  public readonly id: string;
  public readonly name: string;
  private readonly workerFactory: () => Worker;
  private readonly fallbackEngine?: WorkerEngineHostConfig<TInput, TOutput>['fallbackEngine'];
  private activeWorker: Worker | null = null;
  private supported: boolean | null = null;

  constructor(config: WorkerEngineHostConfig<TInput, TOutput>) {
    this.id = config.id ?? 'worker-engine-host';
    this.name = config.name ?? 'WebWorker Engine Host';
    this.workerFactory = config.workerFactory;
    this.fallbackEngine = config.fallbackEngine;
  }

  isSupported(): boolean {
    if (this.supported !== null) {
      return this.supported;
    }
    try {
      const worker = this.workerFactory();
      this.activeWorker = worker;
      this.supported = true;
      return true;
    } catch {
      this.supported = false;
      return false;
    }
  }

  async execute(
    input: TInput,
    options?: WorkerExecuteOptions
  ): Promise<ToolResult<TOutput>> {
    if (options?.signal?.aborted) {
      throw new DOMException('Operation aborted', 'AbortError');
    }

    if (!this.isSupported()) {
      if (this.fallbackEngine) {
        return this.fallbackEngine.execute(input, options ?? {}) as Promise<
          ToolResult<TOutput>
        >;
      }
      throw new Error(
        'WebWorker is not supported in this runtime and no fallback provided'
      );
    }

    const worker = this.activeWorker ?? this.workerFactory();
    this.activeWorker = worker;

    return new Promise<ToolResult<TOutput>>((resolve, reject) => {
      const cleanup = () => {
        worker.removeEventListener('message', onMessage as EventListener);
        worker.removeEventListener('error', onError as EventListener);
        if (options?.signal) {
          options.signal.removeEventListener('abort', onAbort);
        }
      };

      const onMessage = (event: MessageEvent) => {
        const data = event.data as WorkerIncomingMessage<TOutput> | undefined;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'PROGRESS') {
          const progress: ToolProgress = { percent: data.percent };
          if (data.stage !== undefined) progress.stage = data.stage;
          if (data.message !== undefined) progress.message = data.message;
          options?.onProgress?.(progress);
          return;
        }

        if (data.type === 'SUCCESS') {
          cleanup();
          resolve(data.result);
          return;
        }

        if (data.type === 'ERROR') {
          cleanup();
          reject(new Error(data.error ?? 'Worker execution failed'));
          return;
        }
      };

      const onError = (ev: ErrorEvent) => {
        cleanup();
        const errorMessage =
          typeof ev.error === 'string'
            ? ev.error
            : (ev.error?.message ?? ev.message ?? 'Worker execution failed');
        reject(new Error(errorMessage));
      };

      const onAbort = () => {
        cleanup();
        try {
          worker.postMessage({ type: 'ABORT' });
        } catch {
          // ignore postMessage error if worker is terminated
        }
        worker.terminate();
        if (this.activeWorker === worker) {
          this.activeWorker = null;
        }
        reject(new DOMException('Operation aborted', 'AbortError'));
      };

      worker.addEventListener('message', onMessage as EventListener);
      worker.addEventListener('error', onError as EventListener);

      if (options?.signal) {
        options.signal.addEventListener('abort', onAbort, { once: true });
      }

      const transferables = options?.transferables;
      const messagePayload = {
        type: 'EXECUTE',
        payload: { input, options: options ?? {} },
      };

      if (transferables && transferables.length > 0) {
        worker.postMessage(messagePayload, transferables);
      } else {
        worker.postMessage(messagePayload);
      }
    });
  }

  terminate(): void {
    if (this.activeWorker) {
      this.activeWorker.terminate();
      this.activeWorker = null;
    }
  }

  abort(): void {
    this.terminate();
    this.fallbackEngine?.abort?.();
  }
}
