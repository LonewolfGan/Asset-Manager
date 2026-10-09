import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { StudioGeometryResult } from '@workspace/ui';

describe('StudioGeometryResult (TDD)', () => {
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

  const renderComponent = async (props: any) => {
    await act(async () => {
      root.render(React.createElement(StudioGeometryResult, props));
    });
  };

  it('renders preview, file name, and dimension transformations', async () => {
    const handleDownload = vi.fn();
    const handleBack = vi.fn();
    const handleReset = vi.fn();

    await renderComponent({
      fileName: 'photo-paysage.png',
      previewUrl: 'data:image/png;base64,mock',
      origDimensions: { width: 1920, height: 1080 },
      finalDimensions: { width: 1280, height: 720 },
      origRatioLabel: '16:9',
      finalRatioLabel: '16:9',
      sizeBefore: 2000000,
      sizeAfter: 850000,
      onDownload: handleDownload,
      onBackToEditor: handleBack,
      onReset: handleReset,
      isFr: true,
    });

    expect(container.textContent).toContain('photo-paysage.png');
    expect(container.textContent).toContain('1920 × 1080');
    expect(container.textContent).toContain('1280 × 720');

    const downloadBtn = container.querySelector('button[data-testid="studio-geometry-download-btn"]') as HTMLButtonElement;
    expect(downloadBtn).not.toBeNull();
    act(() => {
      downloadBtn.click();
    });
    expect(handleDownload).toHaveBeenCalledTimes(1);

    const editBtn = container.querySelector('button[data-testid="studio-geometry-edit-btn"]') as HTMLButtonElement;
    expect(editBtn).not.toBeNull();
    act(() => {
      editBtn.click();
    });
    expect(handleBack).toHaveBeenCalledTimes(1);

    const resetBtn = container.querySelector('button[data-testid="studio-geometry-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();
    act(() => {
      resetBtn.click();
    });
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
