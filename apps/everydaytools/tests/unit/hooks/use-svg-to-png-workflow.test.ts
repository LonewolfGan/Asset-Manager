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

describe('use-svg-to-png-workflow: hook and conversion flow', () => {
  const originalImage = global.Image;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    vi.clearAllMocks();

    URL.createObjectURL = vi.fn(() => 'blob:http://localhost:5000/mock-svg-blob');
    URL.revokeObjectURL = vi.fn();

    class MockImage {
      src = '';
      width = 800;
      height = 600;
      naturalWidth = 800;
      naturalHeight = 600;
      crossOrigin = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      drawImage: vi.fn(),
      getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
      putImageData: vi.fn(),
    });

    HTMLCanvasElement.prototype.toBlob = vi.fn((cb, mime) => {
      cb(new Blob(['mock-png-data'], { type: mime || 'image/png' }));
    });
  });

  afterEach(() => {
    global.Image = originalImage;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  const defaultProps = {
    fromLabel: 'SVG',
    fromExts: ['.svg'],
    fromMimes: ['image/svg+xml'],
    toMime: 'image/png',
    slug: 'svg-to-png',
    isFr: false,
  };

  it('initializes correctly with SVG to PNG configuration', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    expect(result.current.toExt).toBe('png');
    expect(result.current.sourceFormat.extension).toBe('svg');
    expect(result.current.targetFormat.extension).toBe('png');
    expect(result.current.isPdfOutput).toBe(false);
    expect(result.current.files).toHaveLength(0);
    expect(result.current.isProcessing).toBe(false);

    unmount();
  });

  it('accepts valid .svg and image/svg+xml files into the pending queue', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const svgFile = new File(['<svg></svg>'], 'logo.svg', { type: 'image/svg+xml' });

    act(() => {
      result.current.validateAndAddFiles([svgFile]);
    });

    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].file.name).toBe('logo.svg');
    expect(result.current.files[0].status).toBe('pending');

    unmount();
  });

  it('rejects unsupported files with a destructive toast notification', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const unsupportedFile = new File(['content'], 'document.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

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

  it('performs in-browser conversion and updates status to done without artificial delay', async () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const svgFile = new File(['<svg viewBox="0 0 100 100"><circle r="50"/></svg>'], 'icon.svg', {
      type: 'image/svg+xml',
    });

    act(() => {
      result.current.validateAndAddFiles([svgFile]);
    });

    await act(async () => {
      await result.current.processAll();
    });

    expect(result.current.files[0].status).toBe('done');
    expect(result.current.files[0].blob).toBeDefined();
    expect(result.current.allDone).toBe(true);

    unmount();
  });

  it('formats output download filename as .png', () => {
    const { result, unmount } = renderHook(() => useImageBatchConvert(defaultProps));

    const fakeBlob = new Blob(['png-bytes'], { type: 'image/png' });
    const doneEntry = {
      id: 'test-1',
      file: new File(['<svg></svg>'], 'brand-graphic.svg', { type: 'image/svg+xml' }),
      originalUrl: 'blob:mock-orig',
      status: 'done' as const,
      blob: fakeBlob,
    };

    act(() => {
      result.current.downloadOne(doneEntry);
    });

    expect(downloadBlob).toHaveBeenCalledWith(fakeBlob, 'brand-graphic.png');

    unmount();
  });
});
