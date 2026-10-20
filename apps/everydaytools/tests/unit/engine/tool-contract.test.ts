import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type ToolEngineContract,
  type ToolExecuteOptions,
  type ToolProgress,
  type ToolResult,
  useToolWorkflow,
} from '@/engine/tool-contract';

// @ts-expect-error React act test environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
  trackLanguageChanged: vi.fn(),
}));

vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffFile: vi.fn(() => null),
  setHandoffFile: vi.fn(),
  hasHandoffFile: vi.fn(() => false),
}));

function renderHook<T>(hookFn: () => T) {
  const result = { current: null as unknown as T };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(React.createElement(() => { result.current = hookFn(); return null; }));
  });
  return {
    result,
    unmount: () => {
      act(() => { root.unmount(); });
      container.remove();
    },
  };
}

class MockToolEngine implements ToolEngineContract<File, ToolExecuteOptions, Blob> {
  id = 'mock-test-engine';
  name = 'Mock Test Engine';

  async execute(file: File, options?: ToolExecuteOptions): Promise<ToolResult<Blob>> {
    if (options?.signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');
    options?.onProgress?.({ percent: 25, stage: 'reading', message: 'Reading input...' });

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(resolve, 30);
      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Operation aborted', 'AbortError'));
        });
      }
    });

    options?.onProgress?.({ percent: 100, stage: 'complete', message: 'Complete' });
    const outputBlob = new Blob(['processed-' + file.name], { type: 'image/png' });
    return {
      data: outputBlob,
      filename: `result-${file.name}`,
      mimeType: 'image/png',
      originalSize: file.size,
      resultSize: outputBlob.size,
    };
  }
}

describe('ToolEngineContract — Structure & Execution', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('executes successfully and streams progress milestones', async () => {
    const engine = new MockToolEngine();
    const file = new File(['test-payload'], 'sample.png', { type: 'image/png' });
    const progressHistory: ToolProgress[] = [];

    const result = await engine.execute(file, {
      onProgress: (p) => progressHistory.push(p),
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.filename).toBe('result-sample.png');
    expect(progressHistory.length).toBeGreaterThanOrEqual(2);
    expect(progressHistory[progressHistory.length - 1].percent).toBe(100);
  });

  it('aborts immediately with AbortError when AbortSignal triggers', async () => {
    const engine = new MockToolEngine();
    const file = new File(['test-payload'], 'sample.png', { type: 'image/png' });
    const controller = new AbortController();

    const executionPromise = engine.execute(file, { signal: controller.signal });
    controller.abort();
    await expect(executionPromise).rejects.toThrow();
  });
});

describe('useToolWorkflow — Universal Reactive Hook', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('initializes in idle state with null file and 0% progress', () => {
    const engine = new MockToolEngine();
    const { result } = renderHook(() =>
      useToolWorkflow({
        engine,
        acceptedMimeTypes: ['image/png'],
        maxFileSizeBytes: 1024 * 1024,
        toolSlug: 'mock-tool',
        category: 'image',
      })
    );
    expect(result.current.status).toBe('idle');
    expect(result.current.inputFile).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.isProcessing).toBe(false);
  });

  it('transitions to staged on valid file drop matching MIME and size', () => {
    const engine = new MockToolEngine();
    const { result } = renderHook(() =>
      useToolWorkflow({ engine, acceptedMimeTypes: ['image/png'], maxFileSizeBytes: 1024 * 1024 })
    );

    const validFile = new File(['valid'], 'avatar.png', { type: 'image/png' });
    let accepted = false;
    act(() => { accepted = result.current.handleFileSelect(validFile); });

    expect(accepted).toBe(true);
    expect(result.current.status).toBe('staged');
    expect(result.current.inputFile).toBe(validFile);
  });

  it('rejects invalid MIME types and triggers analytics trackToolError', () => {
    const engine = new MockToolEngine();
    const { result } = renderHook(() =>
      useToolWorkflow({ engine, acceptedMimeTypes: ['image/png'], toolSlug: 'mock-tool' })
    );

    const pdfFile = new File(['doc'], 'sample.pdf', { type: 'application/pdf' });
    let accepted = true;
    act(() => { accepted = result.current.handleFileSelect(pdfFile); });

    expect(accepted).toBe(false);
    expect(result.current.status).toBe('idle');
    expect(trackToolError).toHaveBeenCalledWith('mock-tool', 'invalid_mime_type');
  });

  it('rejects files exceeding maxFileSizeBytes with size error', () => {
    const engine = new MockToolEngine();
    const { result } = renderHook(() =>
      useToolWorkflow({ engine, maxFileSizeBytes: 500, toolSlug: 'mock-tool' })
    );

    const bigFile = new File([new Uint8Array(1000)], 'large.png', { type: 'image/png' });
    let accepted = true;
    act(() => { accepted = result.current.handleFileSelect(bigFile); });

    expect(accepted).toBe(false);
    expect(trackToolError).toHaveBeenCalledWith('mock-tool', 'file_too_large');
  });

  it('runs execution cycle with live progress, result metrics and trackToolUsed', async () => {
    const engine = new MockToolEngine();
    const { result } = renderHook(() =>
      useToolWorkflow({ engine, toolSlug: 'mock-tool', category: 'image' })
    );

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    act(() => { result.current.handleFileSelect(file); });

    let executionPromise: Promise<ToolResult<Blob> | null>;
    await act(async () => {
      executionPromise = result.current.handleExecute();
      await executionPromise;
    });

    expect(result.current.status).toBe('completed');
    expect(result.current.progress.percent).toBe(100);
    expect(result.current.result?.filename).toBe('result-test.png');
    expect(trackToolUsed).toHaveBeenCalledWith('mock-tool', 'image');
  });

  it('handles mid-flight cancellation via handleCancel returning to staged', async () => {
    const engine = new MockToolEngine();
    const { result } = renderHook(() => useToolWorkflow({ engine, toolSlug: 'mock-tool' }));

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    act(() => { result.current.handleFileSelect(file); });

    let executionPromise: Promise<ToolResult<Blob> | null>;
    act(() => { executionPromise = result.current.handleExecute(); });
    expect(result.current.isProcessing).toBe(true);

    act(() => { result.current.handleCancel(); });
    try { await executionPromise!; } catch { /* Abort */ }

    expect(result.current.status).toBe('staged');
    expect(result.current.isProcessing).toBe(false);
  });

  it('auto-stages file from handoff bridge if consumeHandoffFile returns staged file', () => {
    const handedFile = new File(['handoff-data'], 'pipeline.pdf', { type: 'application/pdf' });
    vi.mocked(consumeHandoffFile).mockReturnValueOnce(handedFile);

    const engine = new MockToolEngine();
    const { result } = renderHook(() => useToolWorkflow({ engine, autoConsumeHandoff: true }));

    expect(consumeHandoffFile).toHaveBeenCalled();
    expect(result.current.status).toBe('staged');
    expect(result.current.inputFile).toBe(handedFile);
  });

  it('resets workflow back to idle on handleReset', () => {
    const engine = new MockToolEngine();
    const { result } = renderHook(() => useToolWorkflow({ engine }));

    const file = new File(['sample'], 'photo.png', { type: 'image/png' });
    act(() => { result.current.handleFileSelect(file); });
    expect(result.current.status).toBe('staged');

    act(() => { result.current.handleReset(); });
    expect(result.current.status).toBe('idle');
    expect(result.current.inputFile).toBeNull();
  });
});
