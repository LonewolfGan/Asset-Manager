import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfCompressWorkflow } from '@/hooks/use-pdf-compress-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfCompressWorkflow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function renderWorkflowHook(isFr = false) {
    let hookValue!: ReturnType<typeof usePdfCompressWorkflow>;
    function TestHook() {
      hookValue = usePdfCompressWorkflow({ isFr });
      return null;
    }

    act(() => {
      root.render(React.createElement(TestHook));
    });

    return {
      get current() {
        return hookValue;
      },
    };
  }

  it('does NOT invoke simulated delay timers (setTimeout >= 1000ms) during compression', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const file = new File([new Uint8Array(2048)], 'document.pdf', {
      type: 'application/pdf',
    });

    const mockBlob = new Blob([new Uint8Array(1024)], { type: 'application/pdf' });
    const mockHeaders = new Headers();
    mockHeaders.set('X-Original-Size', '2048');
    mockHeaders.set('X-Compressed-Size', '1024');
    mockHeaders.set('X-Compression-Gain', '50');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: mockHeaders,
    });

    const hook = renderWorkflowHook(false);

    act(() => {
      hook.current.validateAndSetFile(file);
    });

    expect(hook.current.file).toBeDefined();

    await act(async () => {
      await hook.current.handleCompress();
    });

    const artificialDelays = setTimeoutSpy.mock.calls.filter((call) => {
      const delay = call[1];
      return typeof delay === 'number' && delay >= 1000;
    });

    expect(artificialDelays.length).toBe(0);
  });

  it('sets successful result with blob, filename, sizeBefore, sizeAfter, gain and updates liveBytes', async () => {
    const file = new File([new Uint8Array(4000)], 'annual_report.pdf', {
      type: 'application/pdf',
    });

    const mockBlob = new Blob([new Uint8Array(2000)], { type: 'application/pdf' });
    const mockHeaders = new Headers();
    mockHeaders.set('X-Original-Size', '4000');
    mockHeaders.set('X-Compressed-Size', '2000');
    mockHeaders.set('X-Compression-Gain', '50');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: mockHeaders,
    });

    const hook = renderWorkflowHook(false);

    act(() => {
      hook.current.validateAndSetFile(file);
    });

    await act(async () => {
      await hook.current.handleCompress();
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.blob).toBe(mockBlob);
    expect(hook.current.result?.sizeBefore).toBe(4000);
    expect(hook.current.result?.sizeAfter).toBe(2000);
    expect(hook.current.result?.gain).toBe(50);
    expect(hook.current.result?.filename).toContain('annual_report_compressed.pdf');
    expect(hook.current.liveBytes).toBe(2000);
  });

  it('handles server failure correctly and populates error state', async () => {
    const file = new File([new Uint8Array(1000)], 'corrupt.pdf', {
      type: 'application/pdf',
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid PDF syntax' }),
      headers: new Headers(),
    });

    const hook = renderWorkflowHook(false);

    act(() => {
      hook.current.validateAndSetFile(file);
    });

    await act(async () => {
      await hook.current.handleCompress();
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(hook.current.error).toBe('Invalid PDF syntax');
  });

  it('safely falls back to calculated gain when X-Compression-Gain header is corrupt or missing', async () => {
    const file = new File([new Uint8Array(4000)], 'test.pdf', {
      type: 'application/pdf',
    });
    const mockBlob = new Blob([new Uint8Array(2000)], { type: 'application/pdf' });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: new Headers({
        'X-Original-Size': '4000',
        'X-Compressed-Size': '2000',
        'X-Compression-Gain': 'invalid_nan',
      }),
    });

    const hook = renderWorkflowHook(false);

    act(() => {
      hook.current.validateAndSetFile(file);
    });

    await act(async () => {
      await hook.current.handleCompress();
    });

    expect(hook.current.result?.gain).toBe(50);
  });
});
