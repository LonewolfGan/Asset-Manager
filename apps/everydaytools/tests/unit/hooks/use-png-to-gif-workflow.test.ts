import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useImageBatchConvert } from '@/hooks/use-image-batch-convert';
import { downloadBlob } from '@/lib/download';
import { toast } from '@/hooks/use-toast';

vi.mock('@/lib/download', () => ({
  downloadBlob: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

function renderHook<T>(hookFn: () => T) {
  const result = { current: null as unknown as T };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function TestComponent() {
    result.current = hookFn();
    return null;
  }

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  return {
    result,
    rerender: () => {
      act(() => {
        root.render(React.createElement(TestComponent));
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('use-png-to-gif-workflow: hook and server delegation flow', () => {
  const originalFetch = global.fetch;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    vi.clearAllMocks();

    URL.createObjectURL = vi.fn(() => 'blob:http://localhost:5000/mock-gif-blob');
    URL.revokeObjectURL = vi.fn();

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/convert/image')) {
        return Promise.resolve({
          ok: true,
          blob: async () => new Blob(['fake-gif-bytes'], { type: 'image/gif' }),
        });
      }
      return Promise.reject(new Error(`Unhandled url: ${url}`));
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  const defaultProps = {
    fromLabel: 'PNG',
    fromExts: ['.png'],
    fromMimes: ['image/png'],
    toMime: 'image/gif',
    slug: 'png-to-gif',
    isFr: false,
  };

  it('initializes correctly with PNG to GIF configuration', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    expect(result.current.toExt).toBe('gif');
    expect(result.current.sourceFormat.extension).toBe('png');
    expect(result.current.targetFormat.extension).toBe('gif');
    expect(result.current.isPdfOutput).toBe(false);
    expect(result.current.files).toHaveLength(0);
    expect(result.current.isProcessing).toBe(false);

    unmount();
  });

  it('accepts valid .png and image/png files into the pending queue', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const pngFile = new File(['png-data'], 'sprite.png', { type: 'image/png' });

    act(() => {
      result.current.validateAndAddFiles([pngFile]);
    });

    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].file.name).toBe('sprite.png');
    expect(result.current.files[0].status).toBe('pending');

    unmount();
  });

  it('rejects unsupported files with a destructive toast notification', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const unsupportedFile = new File(['content'], 'archive.zip', { type: 'application/zip' });

    act(() => {
      result.current.validateAndAddFiles([unsupportedFile]);
    });

    expect(result.current.files).toHaveLength(0);
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
      })
    );

    unmount();
  });

  it('delegates conversion to server /api/convert/image with format image/gif and succeeds without artificial delay', async () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const pngFile = new File(['png-binary'], 'animation-frame.png', { type: 'image/png' });

    act(() => {
      result.current.validateAndAddFiles([pngFile]);
    });

    await act(async () => {
      await result.current.processAll();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [fetchUrl, fetchOptions] = (global.fetch as any).mock.calls[0];
    expect(fetchUrl).toContain('/api/convert/image');
    expect(fetchOptions.method).toBe('POST');
    expect(fetchOptions.body).toBeInstanceOf(FormData);
    expect(fetchOptions.body.get('format')).toBe('image/gif');

    expect(result.current.files[0].status).toBe('done');
    expect(result.current.files[0].blob?.type).toBe('image/gif');
    expect(result.current.allDone).toBe(true);

    unmount();
  });

  it('formats output download filename as .gif', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const fakeBlob = new Blob(['gif-bytes'], { type: 'image/gif' });
    const doneEntry = {
      id: 'gif-test-1',
      file: new File(['png-binary'], 'animated-asset.png', { type: 'image/png' }),
      originalUrl: 'blob:mock-orig',
      status: 'done' as const,
      blob: fakeBlob,
    };

    act(() => {
      result.current.downloadOne(doneEntry);
    });

    expect(downloadBlob).toHaveBeenCalledWith(fakeBlob, 'animated-asset.gif');

    unmount();
  });
});
