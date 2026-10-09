import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MetadataCleanerWorkbench } from '@/components/metadata-cleaner/MetadataCleanerWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('MetadataCleanerWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-image-bytes'], 'photo.jpg', { type: 'image/jpeg' });
  const mockFormat = {
    id: 'jpg',
    name: 'JPG',
    extension: 'jpg',
    icon: '/images/formats/jpg.svg',
    color: '#FF6B35',
  };

  const renderWorkbench = async (props: Partial<Parameters<typeof MetadataCleanerWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      telemetryDetails: '1920×1080',
      isProcessing: false,
      error: null,
      previewUrl: null,
      isPreviewLoading: false,
      targetFormat: mockFormat as any,
      inspection: null,
      visibleTags: [],
      activeFilter: 'all' as const,
      isInspecting: false,
      isFr: true,
      onReset: vi.fn(),
      onClean: vi.fn(),
      onFilterChange: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(MetadataCleanerWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and clean action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('photo.jpg');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Nettoyer et Télécharger');
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

  it('triggers onClean when primary action button is clicked', async () => {
    const onClean = vi.fn();
    await renderWorkbench({ onClean });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onClean).toHaveBeenCalledTimes(1);
  });
});
