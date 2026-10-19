import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PngToGif from '@/pages/png-to-gif';
import WebpToGif from '@/pages/webp-to-gif';

vi.mock('wouter', () => ({
  useLocation: () => ['/png-to-gif', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
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
        'png-to-gif': {
          title: 'PNG to GIF',
          description: 'Convert PNG images to GIF format.',
        },
        'webp-to-gif': {
          title: 'WebP to GIF',
          description: 'Convert WebP images to GIF format.',
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
    toExt: 'gif',
    sourceFormat: { name: 'PNG', ext: 'png', color: '#3b82f6', icon: '/file.svg' },
    targetFormat: { name: 'GIF', ext: 'gif', color: '#f59e0b', icon: '/file.svg' },
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

describe('GIF Converters Pages (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
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

  it('renders PngToGif page without crashing', async () => {
    await act(async () => {
      root.render(React.createElement(PngToGif));
    });
    expect(container.innerHTML).toContain('PNG');
  });

  it('renders WebpToGif page without crashing', async () => {
    await act(async () => {
      root.render(React.createElement(WebpToGif));
    });
    expect(container.innerHTML).toContain('WebP');
  });
});
