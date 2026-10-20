import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useImageBatchConvert } from '@/hooks/use-image-batch-convert';
import * as downloadModule from '@/lib/download';
import * as toastModule from '@/hooks/use-toast';

vi.mock('@/lib/download', () => ({
  downloadBlob: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

function renderBatchConvertHook() {
  const hookResult: { current: ReturnType<typeof useImageBatchConvert> } = {} as any;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    function TestHarness() {
      hookResult.current = useImageBatchConvert({
        fromLabel: 'WebP',
        fromExts: ['.webp'],
        fromMimes: ['image/webp'],
        toMime: 'image/gif',
        slug: 'webp-to-gif',
        isFr: false,
      });
      return null;
    }
    root.render(React.createElement(TestHarness));
  });

  return {
    result: hookResult,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('useImageBatchConvert — webp-to-gif Workflow (#100)', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('initializes correctly with webp-to-gif configuration', () => {
    const { result, unmount } = renderBatchConvertHook();
    expect(result.current.toExt).toBe('gif');
    expect(result.current.sourceFormat.extension).toBe('webp');
    expect(result.current.targetFormat.extension).toBe('gif');
    expect(result.current.isPdfOutput).toBe(false);
    expect(result.current.showQuality).toBe(false);
    expect(result.current.files).toEqual([]);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.allDone).toBe(false);
    expect(result.current.isSingle).toBe(false);
    unmount();
  });

  it('validates and accepts .webp / image/webp files', () => {
    const { result, unmount } = renderBatchConvertHook();
    const validFile = new File(['mock-webp-content'], 'animation.webp', { type: 'image/webp' });

    act(() => {
      result.current.validateAndAddFiles([validFile]);
    });

    expect(result.current.files.length).toBe(1);
    expect(result.current.files[0].file.name).toBe('animation.webp');
    expect(result.current.files[0].status).toBe('pending');
    expect(result.current.isSingle).toBe(true);
    expect(result.current.singleFile?.file.name).toBe('animation.webp');
    unmount();
  });

  it('rejects unsupported file formats with error toast', () => {
    const { result, unmount } = renderBatchConvertHook();
    const invalidFile = new File(['text-data'], 'document.pdf', { type: 'application/pdf' });

    act(() => {
      result.current.validateAndAddFiles([invalidFile]);
    });

    expect(result.current.files.length).toBe(0);
    expect(toastModule.toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive', title: 'Unsupported format' })
    );
    unmount();
  });

  it('delegates conversion to backend /api/convert/image with format image/gif', async () => {
    const { result, unmount } = renderBatchConvertHook();
    const sampleFile = new File(['sample-webp-binary'], 'banner.webp', { type: 'image/webp' });

    let capturedUrl = '';
    let capturedBody: FormData | null = null;
    const mockGifBlob = new Blob(['mock-gif-output'], { type: 'image/gif' });

    globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedBody = init?.body as FormData;
      return {
        ok: true,
        blob: async () => mockGifBlob,
      } as Response;
    });

    act(() => {
      result.current.validateAndAddFiles([sampleFile]);
    });

    await act(async () => {
      await result.current.processAll();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(capturedUrl).toContain('/api/convert/image');
    expect(capturedBody).toBeInstanceOf(FormData);
    expect(capturedBody?.get('format')).toBe('image/gif');
    expect(capturedBody?.get('animated')).toBe('true');

    expect(result.current.files[0].status).toBe('done');
    expect(result.current.files[0].blob?.type).toBe('image/gif');
    expect(result.current.allDone).toBe(true);
    expect(result.current.doneCount).toBe(1);
    expect(result.current.isProcessing).toBe(false);
    unmount();
  });

  it('executes conversion without any artificial delay >= 600ms', async () => {
    const { result, unmount } = renderBatchConvertHook();
    const sampleFile = new File(['data'], 'speed.webp', { type: 'image/webp' });
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['gif-data'], { type: 'image/gif' }),
    });

    act(() => {
      result.current.validateAndAddFiles([sampleFile]);
    });

    await act(async () => {
      await result.current.processAll();
    });

    const longDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 600);
    expect(longDelays.length).toBe(0);
    setTimeoutSpy.mockRestore();
    unmount();
  });

  it('formats output download filename with .gif extension', async () => {
    const { result, unmount } = renderBatchConvertHook();
    const sampleFile = new File(['data'], 'cool_cat.webp', { type: 'image/webp' });
    const mockBlob = new Blob(['gif-data'], { type: 'image/gif' });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });

    act(() => {
      result.current.validateAndAddFiles([sampleFile]);
    });

    await act(async () => {
      await result.current.processAll();
    });

    act(() => {
      result.current.downloadOne(result.current.files[0]);
    });

    expect(downloadModule.downloadBlob).toHaveBeenCalledWith(
      mockBlob,
      'cool_cat.gif'
    );
    unmount();
  });
});
