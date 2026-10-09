import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ImageCropWorkbench } from '@/components/image-crop/ImageCropWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';

describe('ImageCropWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-image-bytes'], 'photo.png', { type: 'image/png' });

  const renderWorkbench = async (props: Partial<Parameters<typeof ImageCropWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      origW: 800,
      origH: 600,
      isModified: false,
      isProcessing: false,
      isFr: true,
      onFullReset: vi.fn(),
      onResetCrop: vi.fn(),
      onProcessCrop: vi.fn(),
      imgObj: null,
      crop: { x: 50, y: 50, w: 400, h: 300 },
      setCrop: vi.fn(),
      aspectRatio: null,
      onCenterCrop: vi.fn(),
      onMaximizeCrop: vi.fn(),
      onSelectAspectPreset: vi.fn(),
      onSwapOrientation: vi.fn(),
      croppedRatioLabel: 'Libre',
      surfaceRetainedPct: 25,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(ImageCropWorkbench, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and crop action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('photo.png');
    expect(container.textContent).toContain('800×600');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Appliquer le recadrage');
  });

  it('triggers onFullReset when reset button is clicked', async () => {
    const onFullReset = vi.fn();
    await renderWorkbench({ onFullReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onFullReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onProcessCrop when primary action button is clicked', async () => {
    const onProcessCrop = vi.fn();
    await renderWorkbench({ onProcessCrop });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onProcessCrop).toHaveBeenCalledTimes(1);
  });

  it('renders CropRatioSelector and handles ratio selection', async () => {
    const onSelectAspectPreset = vi.fn();
    await renderWorkbench({ onSelectAspectPreset });

    const ratioBtn = container.querySelector('button[data-ratio-id="1:1"]') as HTMLButtonElement;
    expect(ratioBtn).not.toBeNull();

    act(() => {
      ratioBtn.click();
    });

    expect(onSelectAspectPreset).toHaveBeenCalled();
  });
});
