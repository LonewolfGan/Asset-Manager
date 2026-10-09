import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { RemoverStudioScene } from '@/components/background-remover/RemoverStudioScene';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('RemoverStudioScene integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-image-bytes'], 'portrait.png', { type: 'image/png' });

  const renderWorkbench = async (props: Partial<Parameters<typeof RemoverStudioScene>[0]> = {}) => {
    const mockItem = {
      id: 'item-1',
      file: sampleFile,
      previewUrl: 'data:image/png;base64,mock',
      cutoutUrl: 'data:image/png;base64,cutout',
      status: 'done' as const,
      progress: 100,
      error: null,
      dims: { w: 1024, h: 768 },
    };

    const defaultProps = {
      item: mockItem,
      isInspecting: false,
      onBackToGallery: vi.fn(),
      onFullReset: vi.fn(),
      viewMode: 'cutout' as const,
      onViewModeChange: vi.fn(),
      backdropType: 'transparent' as const,
      onBackdropTypeChange: vi.fn(),
      customColor: '#ffffff',
      onCustomColorChange: vi.fn(),
      customBgUrl: null,
      customBgInputRef: { current: null },
      onCustomBgChange: vi.fn(),
      stageBackgroundStyle: {},
      isCompositing: false,
      onDownload: vi.fn(),
      onRetry: vi.fn(),
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(RemoverStudioScene, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and download action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('portrait.png');
    expect(container.textContent).toContain('1024×768');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Télécharger PNG');
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

  it('triggers onDownload when primary action button is clicked', async () => {
    const onDownload = vi.fn();
    await renderWorkbench({ onDownload });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
