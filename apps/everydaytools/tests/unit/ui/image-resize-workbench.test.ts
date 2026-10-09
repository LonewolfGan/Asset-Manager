import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ImageResizeWorkbench } from '@/components/image-resize/ImageResizeWorkbench';
import { getStandardPresets } from '@/lib/image-resize-logic';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('ImageResizeWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock'], 'sample-photo.jpg', { type: 'image/jpeg' });
  const presets = getStandardPresets(true);

  const renderWorkbench = async (props: Partial<Parameters<typeof ImageResizeWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      previewUrl: 'blob:mock-url',
      origW: 1920,
      origH: 1080,
      mode: 'pixels' as const,
      onModeChange: vi.fn(),
      width: 1920,
      height: 1080,
      onWidthChange: vi.fn(),
      onHeightChange: vi.fn(),
      lockRatio: true,
      onToggleLockRatio: vi.fn(),
      percentage: 100,
      onPercentageChange: vi.fn(),
      selectedPresetId: null,
      standardPresets: presets,
      onPresetSelect: vi.fn(),
      onResetDimensions: vi.fn(),
      targetW: 1920,
      targetH: 1080,
      isModified: false,
      visualScaleFactor: 1,
      targetRatioLabel: '16:9',
      isProcessing: false,
      onFullReset: vi.fn(),
      onProcessResize: vi.fn(),
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ImageResizeWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and action button', async () => {
    await renderWorkbench();

    // Verify StudioCommandBar integration
    expect(container.textContent).toContain('sample-photo.jpg');
    expect(container.textContent).toContain('(1920×1080)');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain("Redimensionner l'image");
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

  it('triggers onProcessResize when primary action button is clicked', async () => {
    const onProcessResize = vi.fn();
    await renderWorkbench({ onProcessResize });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onProcessResize).toHaveBeenCalledTimes(1);
  });

  it('renders DimensionLockGroup with width, height inputs and lock toggle', async () => {
    const onToggleLockRatio = vi.fn();
    const onWidthChange = vi.fn();
    await renderWorkbench({
      width: 1200,
      height: 800,
      lockRatio: true,
      onToggleLockRatio,
      onWidthChange,
    });

    const widthInput = container.querySelector('input[data-testid="dimension-width-input"]') as HTMLInputElement;
    expect(widthInput).not.toBeNull();
    expect(widthInput.value).toBe('1200');

    const lockBtn = container.querySelector('button[data-testid="dimension-lock-btn"]') as HTMLButtonElement;
    expect(lockBtn).not.toBeNull();

    act(() => {
      lockBtn.click();
    });

    expect(onToggleLockRatio).toHaveBeenCalled();
  });
});
