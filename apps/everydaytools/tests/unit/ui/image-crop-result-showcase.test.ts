import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ImageCropResultShowcase } from '@/components/image-crop/ImageCropResultShowcase';
import { LocaleProvider } from '@/contexts/locale-context';

describe('ImageCropResultShowcase integration with StudioGeometryResult (TDD)', () => {
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
    blob: new Blob(['cropped-data']),
    filename: 'portrait-cropped.png',
    sizeBefore: 2500000,
    sizeAfter: 900000,
    finalW: 800,
    finalH: 800,
    format: 'png' as const,
  };

  it('renders StudioGeometryResult with cropped dimensions and decisive actions', async () => {
    const handleDownload = vi.fn();
    const handleBack = vi.fn();
    const handleReset = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(ImageCropResultShowcase, {
            result: mockResult,
            resultPreviewUrl: 'data:image/png;base64,mock',
            origW: 1600,
            origH: 1200,
            originalRatioLabel: '4:3',
            onDownload: handleDownload,
            onBackToEditor: handleBack,
            onFullReset: handleReset,
          })
        )
      );
    });

    const downloadBtn = container.querySelector('button[data-testid="studio-geometry-download-btn"]') as HTMLButtonElement;
    expect(downloadBtn).not.toBeNull();
    expect(container.textContent).toContain('portrait-cropped.png');
    expect(container.textContent).toContain('800 × 800');

    act(() => {
      downloadBtn.click();
    });
    expect(handleDownload).toHaveBeenCalledTimes(1);
  });
});
