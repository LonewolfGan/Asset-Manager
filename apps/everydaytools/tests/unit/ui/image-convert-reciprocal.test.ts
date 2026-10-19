import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import ImageConvertPage from '@/components/ImageConvertPage';

vi.mock('wouter', () => ({
  useLocation: () => ['/png-to-svg', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' });
  },
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          image: 'Image Tools',
        },
      },
      tools: {
        'png-to-svg': {
          title: 'PNG to SVG',
          description: 'Convert PNG to SVG vector.',
        },
        'svg-to-png': {
          title: 'SVG to PNG',
          description: 'Convert SVG to raster PNG.',
        },
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

vi.mock('@/hooks/use-file-drop', () => ({
  useFileDrop: () => ({
    isDragging: false,
    dropProps: {
      onDragOver: vi.fn(),
      onDragLeave: vi.fn(),
      onDrop: vi.fn(),
    },
  }),
}));

vi.mock('@/hooks/use-image-batch-convert', () => ({
  useImageBatchConvert: ({ slug }: any) => ({
    toExt: slug.split('-to-')[1] || 'svg',
    sourceFormat: { name: 'PNG', ext: 'png', color: '#3b82f6', icon: '/file.svg' },
    targetFormat: { name: 'SVG', ext: 'svg', color: '#10b981', icon: '/file.svg' },
    isPdfOutput: false,
    showQuality: false,
    files: [],
    isProcessing: false,
    quality: 90,
    setQuality: vi.fn(),
    isSingle: false,
    singleFile: null,
    allDone: false,
    doneCount: 0,
    validateAndAddFiles: vi.fn(),
    removeFile: vi.fn(),
    handleResetAll: vi.fn(),
    processAll: vi.fn(),
    downloadOne: vi.fn(),
    downloadAllZip: vi.fn(),
    isNextActionOpen: false,
    setIsNextActionOpen: vi.fn(),
    downloadedPdf: null,
    downloadedImage: null,
  }),
}));

describe('ImageConvertPage Reciprocal Title in Header (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders ReciprocalTitle in header for png-to-svg reciprocal pair', async () => {
    await act(async () => {
      root.render(
        React.createElement(ImageConvertPage, {
          fromLabel: 'PNG',
          fromExts: ['.png'],
          fromMimes: ['image/png'],
          toMime: 'image/svg+xml',
          slug: 'png-to-svg',
        })
      );
    });

    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('png-to-svg');
  });

  it('renders ReciprocalTitle in header for svg-to-png reciprocal pair', async () => {
    await act(async () => {
      root.render(
        React.createElement(ImageConvertPage, {
          fromLabel: 'SVG',
          fromExts: ['.svg'],
          fromMimes: ['image/svg+xml'],
          toMime: 'image/png',
          slug: 'svg-to-png',
        })
      );
    });

    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('svg-to-png');
  });

  it('renders ReciprocalTitle in header for jpg-to-avif reciprocal pair', async () => {
    await act(async () => {
      root.render(
        React.createElement(ImageConvertPage, {
          fromLabel: 'JPG/JPEG',
          fromExts: ['.jpg', '.jpeg'],
          fromMimes: ['image/jpeg'],
          toMime: 'image/avif',
          slug: 'jpg-to-avif',
        })
      );
    });

    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('jpg-to-avif');
  });

  it('renders ReciprocalTitle in header for png-to-avif reciprocal pair', async () => {
    await act(async () => {
      root.render(
        React.createElement(ImageConvertPage, {
          fromLabel: 'PNG',
          fromExts: ['.png'],
          fromMimes: ['image/png'],
          toMime: 'image/avif',
          slug: 'png-to-avif',
        })
      );
    });

    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('png-to-avif');
  });
});
