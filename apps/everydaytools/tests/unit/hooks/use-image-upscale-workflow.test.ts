import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useImageUpscaleWorkflow } from '@/hooks/use-image-upscale-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useImageUpscaleWorkflow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;
  const origImage = globalThis.Image;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.restoreAllMocks();

    globalThis.URL.createObjectURL = vi.fn((_b: Blob) => 'blob:mock-upscale-url');
    globalThis.URL.revokeObjectURL = vi.fn();

    class MockImage {
      width = 400;
      height = 300;
      onload: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    globalThis.Image = MockImage as unknown as typeof Image;

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({ drawImage: vi.fn() })),
          toBlob: (cb: (b: Blob | null) => void, mime?: string) => {
            cb(new Blob(['fallback-blob'], { type: mime || 'image/png' }));
          },
        } as unknown as HTMLCanvasElement;
      }
      return origCreateElement(tagName);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    globalThis.Image = origImage;
  });

  function renderHook() {
    let hookValue: ReturnType<typeof useImageUpscaleWorkflow>;
    function TestComponent() {
      hookValue = useImageUpscaleWorkflow({ isFr: false });
      return null;
    }
    act(() => root.render(React.createElement(TestComponent)));
    return {
      get current() {
        return hookValue;
      },
    };
  }

  async function loadTestImage(hook: ReturnType<typeof renderHook>) {
    const file = new File(['fake-img'], 'test.png', { type: 'image/png' });
    await act(async () => {
      hook.current.validateAndSetFile(file);
      await new Promise((r) => setTimeout(r, 10));
    });
    return file;
  }

  it('does NOT invoke simulated delay timers (setTimeout >= 1000ms) during upscale', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const hook = renderHook();
    await loadTestImage(hook);

    const mockBlob = new Blob(['api-upscaled-bytes'], { type: 'image/png' });
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, blob: async () => mockBlob });

    await act(async () => {
      await hook.current.handleUpscale();
    });

    const artificialDelays = setTimeoutSpy.mock.calls.filter((call) => {
      const delay = call[1];
      return typeof delay === 'number' && delay >= 1000;
    });

    expect(artificialDelays.length).toBe(0);
    expect(hook.current.resultBlob).toBe(mockBlob);
    expect(hook.current.isProcessing).toBe(false);
  });

  it('successfully executes upscale when backend API returns 200 OK blob', async () => {
    const hook = renderHook();
    await loadTestImage(hook);

    const mockBlob = new Blob(['upscaled-2x'], { type: 'image/webp' });
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, blob: async () => mockBlob });

    await act(async () => {
      await hook.current.handleUpscale();
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.resultBlob).toBe(mockBlob);
    expect(hook.current.resultUrl).toBe('blob:mock-upscale-url');
  });

  it('falls back to client-side canvas when API fails with 500 error', async () => {
    const hook = renderHook();
    await loadTestImage(hook);

    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    await act(async () => {
      await hook.current.handleUpscale();
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.resultBlob).toBeInstanceOf(Blob);
    expect(hook.current.resultUrl).toBe('blob:mock-upscale-url');
  });

  it('falls back to client-side canvas when fetch throws network error', async () => {
    const hook = renderHook();
    await loadTestImage(hook);

    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

    await act(async () => {
      await hook.current.handleUpscale();
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.resultBlob).toBeInstanceOf(Blob);
  });

  it('resets workflow correctly on handleFullReset and handleBackToEditor', async () => {
    const hook = renderHook();
    await loadTestImage(hook);
    expect(hook.current.file).not.toBeNull();

    act(() => hook.current.handleBackToEditor());
    expect(hook.current.resultUrl).toBeNull();
    expect(hook.current.resultBlob).toBeNull();

    act(() => hook.current.handleFullReset());
    expect(hook.current.files.length).toBe(0);
    expect(hook.current.file).toBeNull();
    expect(hook.current.previewUrl).toBeNull();
  });
});
