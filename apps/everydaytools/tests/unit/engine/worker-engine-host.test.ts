/**
 * Tests TDD — WorkerEngineHost (Phase 1, Tâche 1.2)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  WorkerEngineHost,
  type ToolExecuteOptions,
  type ToolResult,
  type ToolProgress,
} from '@/engine/worker-engine-host';

// Mock hermétique de l'environnement standard HTML5 Worker
class MockWorker {
  public postMessage = vi.fn();
  public terminate = vi.fn();
  public onmessage: ((ev: MessageEvent) => void) | null = null;
  public onerror: ((ev: ErrorEvent) => void) | null = null;
  private listeners: Record<string, Set<EventListener>> = {};

  addEventListener(type: string, listener: EventListener): void {
    if (!this.listeners[type]) this.listeners[type] = new Set();
    this.listeners[type].add(listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.listeners[type]?.delete(listener);
  }

  simulateMessage(data: unknown): void {
    const event = { data } as MessageEvent;
    if (this.onmessage) this.onmessage(event);
    this.listeners['message']?.forEach((cb) => cb(event));
  }

  simulateError(error: Error | string): void {
    const event = {
      error,
      message: typeof error === 'string' ? error : error.message,
    } as ErrorEvent;
    if (this.onerror) this.onerror(event);
    this.listeners['error']?.forEach((cb) => cb(event));
  }
}

describe('WorkerEngineHost (TDD Phase 1 - Tâche 1.2)', () => {
  let mockWorker: MockWorker;
  let workerFactory: () => Worker;

  beforeEach(() => {
    mockWorker = new MockWorker();
    workerFactory = () => mockWorker as unknown as Worker;
  });

  describe('Pillar 1: Instantiation & ToolEngineContract Compliance', () => {
    it('instantiates properly with a Worker factory and exposes lifecycle methods', () => {
      const host = new WorkerEngineHost({ workerFactory });
      expect(host).toBeDefined();
      expect(typeof host.execute).toBe('function');
      expect(typeof host.terminate).toBe('function');
      expect(host.isSupported()).toBe(true);
    });

    it('sends typed EXECUTE message with payload and options to Worker', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const testBuffer = new ArrayBuffer(16);
      const executePromise = host.execute(testBuffer, {
        paramA: 'value1',
      } as unknown as ToolExecuteOptions);

      expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
      const [postedMessage] = mockWorker.postMessage.mock.calls[0];
      expect(postedMessage).toMatchObject({
        type: 'EXECUTE',
        payload: {
          input: testBuffer,
        },
      });

      // Simulation de complétion pour clore la promesse
      mockWorker.simulateMessage({
        type: 'SUCCESS',
        result: { data: new Blob(['test-output']), filename: 'output.bin' },
      });
      await executePromise;
    });

    it('forwards PROGRESS messages from worker to options.onProgress callback', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const onProgress = vi.fn();
      const executePromise = host.execute(new ArrayBuffer(8), { onProgress });

      const progressEvent1: ToolProgress = {
        percent: 25,
        stage: 'parsing',
        message: 'Parsing input document',
      };
      const progressEvent2: ToolProgress = {
        percent: 80,
        stage: 'rendering',
        message: 'Rendering output stream',
      };

      mockWorker.simulateMessage({ type: 'PROGRESS', ...progressEvent1 });
      expect(onProgress).toHaveBeenCalledWith(progressEvent1);

      mockWorker.simulateMessage({ type: 'PROGRESS', ...progressEvent2 });
      expect(onProgress).toHaveBeenCalledWith(progressEvent2);

      mockWorker.simulateMessage({
        type: 'SUCCESS',
        result: { data: new Blob(['done']) },
      });
      await executePromise;
    });

    it('resolves ToolResult upon receiving SUCCESS message from Worker', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const outputBlob = new Blob(['expected-result'], { type: 'application/pdf' });
      const executePromise = host.execute(new ArrayBuffer(8));

      mockWorker.simulateMessage({
        type: 'SUCCESS',
        result: {
          data: outputBlob,
          filename: 'converted.pdf',
          mimeType: 'application/pdf',
        },
      });

      const result: ToolResult<Blob | ArrayBuffer> = await executePromise;
      expect(result.data).toBe(outputBlob);
      expect(result.filename).toBe('converted.pdf');
      expect(result.mimeType).toBe('application/pdf');
    });

    it('rejects with an Error upon receiving ERROR message from Worker', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const executePromise = host.execute(new ArrayBuffer(8));

      mockWorker.simulateMessage({
        type: 'ERROR',
        error: 'Corrupted document header encountered',
      });

      await expect(executePromise).rejects.toThrow('Corrupted document header encountered');
    });

    it('rejects with Error when worker emits an unhandled error event', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const executePromise = host.execute(new ArrayBuffer(8));

      mockWorker.simulateError(new Error('Out of WebAssembly memory'));

      await expect(executePromise).rejects.toThrow('Out of WebAssembly memory');
    });
  });

  describe('Pillar 2: AbortSignal Cancellation & Worker Lifecycle', () => {
    it('immediately rejects if the AbortSignal is already triggered before execute', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const controller = new AbortController();
      controller.abort();

      const executePromise = host.execute(new ArrayBuffer(8), {
        signal: controller.signal,
      });

      await expect(executePromise).rejects.toThrow(/aborted|AbortError/i);
      expect(mockWorker.postMessage).not.toHaveBeenCalled();
    });

    it('aborts cleanly during active execution, posts ABORT or terminates worker, and rejects with AbortError', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const controller = new AbortController();
      const executePromise = host.execute(new ArrayBuffer(8), {
        signal: controller.signal,
      });

      expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);

      controller.abort();

      const abortedCall = mockWorker.postMessage.mock.calls.find(
        ([msg]) => msg && (msg as { type: string }).type === 'ABORT'
      );
      const isTerminatedOrNotified = Boolean(abortedCall) || mockWorker.terminate.mock.calls.length > 0;
      expect(isTerminatedOrNotified).toBe(true);

      await expect(executePromise).rejects.toMatchObject({
        name: 'AbortError',
      });
    });

    it('terminates active worker on host.terminate() call', () => {
      const host = new WorkerEngineHost({ workerFactory });
      void host.execute(new ArrayBuffer(8));
      host.terminate();

      expect(mockWorker.terminate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pillar 3: Zero-Copy Transferable Objects Support', () => {
    it('passes transferables in postMessage options to prevent memory duplication', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const buffer = new ArrayBuffer(1024 * 64);
      const executePromise = host.execute(buffer, {
        transferables: [buffer],
      });

      expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
      const [, transferList] = mockWorker.postMessage.mock.calls[0];
      expect(transferList).toBeDefined();
      expect(transferList).toContain(buffer);

      mockWorker.simulateMessage({
        type: 'SUCCESS',
        result: { data: new ArrayBuffer(0) },
      });
      await executePromise;
    });

    it('handles returned Transferable objects from SUCCESS payload without corruption', async () => {
      const host = new WorkerEngineHost({ workerFactory });
      const outputBuffer = new ArrayBuffer(2048);
      const executePromise = host.execute(new ArrayBuffer(8));

      mockWorker.simulateMessage({
        type: 'SUCCESS',
        result: { data: outputBuffer },
        transferables: [outputBuffer],
      });

      const result = await executePromise;
      expect(result.data).toBe(outputBuffer);
    });
  });

  describe('Pillar 4: Graceful Degradation & Unsupported Environment Fallback', () => {
    it('detects when Worker is unavailable and returns isSupported() === false', () => {
      const host = new WorkerEngineHost({
        workerFactory: () => {
          throw new Error('Worker is not supported in this runtime');
        },
      });

      expect(host.isSupported()).toBe(false);
    });

    it('rejects with explicit explanatory error when executing without Worker support and no fallback', async () => {
      const host = new WorkerEngineHost({
        workerFactory: () => {
          throw new Error('Worker constructor undefined');
        },
      });

      await expect(host.execute(new ArrayBuffer(8))).rejects.toThrow(
        /WebWorker is not supported/i
      );
    });

    it('delegates to fallbackEngine when Worker is unavailable and fallbackEngine is provided', async () => {
      const fallbackEngine = {
        id: 'fallback-engine',
        name: 'Fallback Engine',
        execute: vi.fn().mockResolvedValue({
          data: new Blob(['fallback-result']),
          filename: 'fallback.txt',
        }),
      };

      const host = new WorkerEngineHost({
        workerFactory: () => {
          throw new Error('Worker unsupported');
        },
        fallbackEngine,
      });

      const input = new ArrayBuffer(16);
      const result = await host.execute(input);

      expect(fallbackEngine.execute).toHaveBeenCalledWith(input, expect.anything());
      expect(result.filename).toBe('fallback.txt');
    });
  });
});
