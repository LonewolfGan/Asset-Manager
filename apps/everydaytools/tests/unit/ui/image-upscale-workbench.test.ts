import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ImageUpscaleWorkbench } from '@/components/image-upscale/ImageUpscaleWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('ImageUpscaleWorkbench integration with @workspace/ui (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.matchMedia = window.matchMedia || vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
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

  const sampleFile = new File(['mock-image-bytes'], 'artwork.png', { type: 'image/png' });

  const renderWorkbench = async (props: Partial<Parameters<typeof ImageUpscaleWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      previewUrl: 'data:image/png;base64,preview',
      resultUrl: null,
      resultBlob: null,
      origDims: { w: 1000, h: 800 },
      targetDims: { targetW: 2000, targetH: 1600, origW: 1000, origH: 800, scale: 2 as const, targetMp: '3.2 MP' },
      sourceMp: '0.8 MP',
      outputFilename: 'artwork_upscaled.png',
      scale: 2 as const,
      onScaleChange: vi.fn(),
      sharpen: false,
      onSharpenChange: vi.fn(),
      isProcessing: false,
      stageImageRef: { current: null },
      isLoupeActive: false,
      loupePos: null,
      onToggleLoupe: vi.fn(),
      onStagePointerMove: vi.fn(),
      onStagePointerLeave: vi.fn(),
      onUpscale: vi.fn(),
      onDownload: vi.fn(),
      onFullReset: vi.fn(),
      onBackToEditor: vi.fn(),
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ImageUpscaleWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar in staging scene with metadata and upscale action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('artwork.png');
    expect(container.textContent).toContain('1000×800');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Agrandir');
  });

  it('triggers onFullReset when reset button is clicked in staging', async () => {
    const onFullReset = vi.fn();
    await renderWorkbench({ onFullReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onFullReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onUpscale when primary action button is clicked in staging', async () => {
    const onUpscale = vi.fn();
    await renderWorkbench({ onUpscale });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onUpscale).toHaveBeenCalledTimes(1);
  });

  it('renders StudioCommandBar in result scene with download action button', async () => {
    const onDownload = vi.fn();
    await renderWorkbench({
      resultUrl: 'data:image/png;base64,result',
      resultBlob: new Blob(['result']),
      onDownload,
    });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Télécharger');

    act(() => {
      actionBtn.click();
    });

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
