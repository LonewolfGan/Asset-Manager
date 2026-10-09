import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ImageCompressWorkbench } from '@/components/image-compress/ImageCompressWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getCompressionPresets } from '@/lib/image-compress-logic';

describe('ImageCompressWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-image-bytes'], 'paysage.jpg', { type: 'image/jpeg' });
  const mockFormat = {
    name: 'Image',
    extension: 'jpg',
    icon: '/images/formats/jpg.svg',
    color: '#FF6B35',
  };
  const presets = getCompressionPresets(true);

  const renderWorkbench = async (props: Partial<Parameters<typeof ImageCompressWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      format: mockFormat as any,
      presets,
      level: 'balanced' as const,
      isFr: true,
      onLevelChange: vi.fn(),
      onReset: vi.fn(),
      onCompress: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ImageCompressWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and compress action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('paysage.jpg');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain("Compresser l'image");
  });

  it('triggers onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    await renderWorkbench({ onReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onCompress when primary action button is clicked', async () => {
    const onCompress = vi.fn();
    await renderWorkbench({ onCompress });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onCompress).toHaveBeenCalledTimes(1);
  });

  it('renders QualitySliderField when custom quality is enabled', async () => {
    const onQualityChange = vi.fn();
    await renderWorkbench({
      customQuality: 75,
      onQualityChange,
      showCustomQuality: true,
    } as any);

    const slider = container.querySelector('input[data-testid="quality-slider"]') as HTMLInputElement;
    expect(slider).not.toBeNull();
    expect(slider.value).toBe('75');
  });
});
