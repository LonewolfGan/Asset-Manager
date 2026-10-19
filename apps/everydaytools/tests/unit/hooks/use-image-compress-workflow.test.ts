import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useImageCompressWorkflow } from '@/hooks/use-image-compress-workflow';
import { getCompressionPresets } from '@/lib/image-compress-logic';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useImageCompressWorkflow (TDD Phase RED)', () => {
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

  function renderWorkflowHook(
    file: File | undefined,
    presets = getCompressionPresets(false),
    isFr = false
  ) {
    let hookValue: ReturnType<typeof useImageCompressWorkflow>;
    function TestHook() {
      hookValue = useImageCompressWorkflow(file, presets, isFr);
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
    const file = new File([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])], 'sample.jpg', {
      type: 'image/jpeg',
    });

    const mockBlob = new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'image/jpeg' });
    const mockHeaders = new Headers();
    mockHeaders.set('X-Original-Size', '8');
    mockHeaders.set('X-Compressed-Size', '4');
    mockHeaders.set('X-Compression-Gain', '50');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: mockHeaders,
    });

    const hook = renderWorkflowHook(file);

    await act(async () => {
      const promise = hook.current.handleCompress();
      await promise;
    });

    // Check if any simulated delays (>= 1000ms) were scheduled
    const artificialDelays = setTimeoutSpy.mock.calls.filter((call) => {
      const delay = call[1];
      return typeof delay === 'number' && delay >= 1000;
    });

    expect(artificialDelays.length).toBe(0);
  });

  it('sets successful result with sizeBefore, sizeAfter, gain and filename', async () => {
    const file = new File([new Uint8Array(1000)], 'test-image.png', {
      type: 'image/png',
    });

    const mockBlob = new Blob([new Uint8Array(500)], { type: 'image/png' });
    const mockHeaders = new Headers();
    mockHeaders.set('X-Original-Size', '1000');
    mockHeaders.set('X-Compressed-Size', '500');
    mockHeaders.set('X-Compression-Gain', '50');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: mockHeaders,
    });

    const hook = renderWorkflowHook(file);

    let success = false;
    await act(async () => {
      success = await hook.current.handleCompress();
    });

    expect(success).toBe(true);
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.sizeBefore).toBe(1000);
    expect(hook.current.result?.sizeAfter).toBe(500);
    expect(hook.current.result?.gain).toBe(50);
    expect(hook.current.result?.filename).toContain('test-image');
  });

  it('handles server failure correctly and populates error state', async () => {
    const file = new File([new Uint8Array(200)], 'corrupt.jpg', {
      type: 'image/jpeg',
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Corrupt image data' }),
      headers: new Headers(),
    });

    const hook = renderWorkflowHook(file, getCompressionPresets(false), false);

    let success = true;
    await act(async () => {
      success = await hook.current.handleCompress();
    });

    expect(success).toBe(false);
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(hook.current.error).toBe('Corrupt image data');
  });
});
