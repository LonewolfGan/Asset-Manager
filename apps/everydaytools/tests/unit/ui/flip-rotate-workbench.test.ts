import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FlipRotateWorkbench } from '@/components/flip-rotate/FlipRotateWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('FlipRotateWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-bytes'], 'paysage-photo.jpg', { type: 'image/jpeg' });

  const renderWorkbench = async (props: Partial<Parameters<typeof FlipRotateWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      previewUrl: 'blob:mock-url',
      imgRef: { current: null },
      currentDims: { w: 1920, h: 1080, isSwapped: false },
      rotation: 0,
      flipH: false,
      flipV: false,
      outputFormat: 'jpg' as const,
      hasTransform: false,
      isDraggingRotation: false,
      isProcessing: false,
      error: null,
      isFr: true,
      onFullReset: vi.fn(),
      onRotateLeft: vi.fn(),
      onRotateRight: vi.fn(),
      onRotate180: vi.fn(),
      onToggleFlipH: vi.fn(),
      onToggleFlipV: vi.fn(),
      onFormatChange: vi.fn(),
      onResetTransform: vi.fn(),
      onDownload: vi.fn(),
      onRotatePointerDown: vi.fn(),
      onRotatePointerMove: vi.fn(),
      onRotatePointerUp: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(FlipRotateWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('paysage-photo.jpg');
    expect(container.textContent).toContain('(1920×1080)');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain("Télécharger l'image");
  });

  it('triggers onFullReset when the return button is clicked', async () => {
    const onFullReset = vi.fn();
    await renderWorkbench({ onFullReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onFullReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onDownload when primary download button is clicked', async () => {
    const onDownload = vi.fn();
    await renderWorkbench({ onDownload });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it('renders FormatPillsSelector and changes output format', async () => {
    const onFormatChange = vi.fn();
    await renderWorkbench({ onFormatChange });

    const formatBtn = container.querySelector('button[data-format="image/png"]') as HTMLButtonElement;
    expect(formatBtn).not.toBeNull();

    act(() => {
      formatBtn.click();
    });

    expect(onFormatChange).toHaveBeenCalledWith('image/png');
  });
});
