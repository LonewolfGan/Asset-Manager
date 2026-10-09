import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ImageResizeResultScene } from '@/components/image-resize/ImageResizeResultScene';

describe('ImageResizeResultScene integration with StudioGeometryResult (TDD)', () => {
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

  const mockResult = {
    blob: new Blob(['resized']),
    filename: 'landscape-resized.png',
    sizeBefore: 3000000,
    sizeAfter: 1200000,
    origW: 1920,
    origH: 1080,
    finalW: 1280,
    finalH: 720,
  };

  it('renders StudioGeometryResult with transformation metrics and download action', async () => {
    const handleDownload = vi.fn();
    const handleBack = vi.fn();
    const handleReset = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(ImageResizeResultScene, {
          result: mockResult,
          resultPreviewUrl: 'data:image/png;base64,mock',
          origW: 1920,
          origH: 1080,
          originalRatioLabel: '16:9',
          onDownload: handleDownload,
          onBackToEditor: handleBack,
          onFullReset: handleReset,
          isFr: true,
        })
      );
    });

    const downloadBtn = container.querySelector('button[data-testid="studio-geometry-download-btn"]') as HTMLButtonElement;
    expect(downloadBtn).not.toBeNull();
    expect(container.textContent).toContain('landscape-resized.png');
    expect(container.textContent).toContain('1280 × 720');

    act(() => {
      downloadBtn.click();
    });
    expect(handleDownload).toHaveBeenCalledTimes(1);

    const savingsBadge = container.querySelector('[data-testid="savings-badge"]');
    expect(savingsBadge).not.toBeNull();
    expect(savingsBadge?.textContent).toContain('-60%');
  });
});
