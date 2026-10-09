import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BatchItemRow } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BatchItemRow (TDD RED Phase)', () => {
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
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(BatchItemRow, props)
        )
      );
    });
  };

  it('renders file name, size and calls onRemove', async () => {
    const handleRemove = vi.fn();
    const item = {
      id: 'file-1',
      name: 'photo-vacances.png',
      size: 2048576,
      status: 'idle' as const,
    };

    await renderComponent({
      item,
      onRemove: handleRemove,
      isFr: true,
    });

    expect(container.textContent).toContain('photo-vacances.png');
    expect(container.textContent).toMatch(/2\s*(Mo|MB)/i);

    const removeBtn = container.querySelector('button[data-testid="remove-batch-item"]') as HTMLButtonElement;
    expect(removeBtn).not.toBeNull();

    act(() => {
      removeBtn.click();
    });

    expect(handleRemove).toHaveBeenCalledWith('file-1');
  });

  it('renders error state with retry button calling onRetry', async () => {
    const handleRetry = vi.fn();
    const item = {
      id: 'file-2',
      name: 'corrupted.pdf',
      size: 1024,
      status: 'error' as const,
      errorMessage: 'Fichier corrompu',
    };

    await renderComponent({
      item,
      onRetry: handleRetry,
      isFr: true,
    });

    expect(container.textContent).toContain('Fichier corrompu');

    const retryBtn = container.querySelector('button[data-testid="retry-batch-item"]') as HTMLButtonElement;
    expect(retryBtn).not.toBeNull();

    act(() => {
      retryBtn.click();
    });

    expect(handleRetry).toHaveBeenCalledWith('file-2');
  });

  it('renders download button when status is success', async () => {
    const handleDownload = vi.fn();
    const item = {
      id: 'file-3',
      name: 'compressed.webp',
      size: 512000,
      status: 'success' as const,
    };

    await renderComponent({
      item,
      onDownload: handleDownload,
      isFr: true,
    });

    const downloadBtn = container.querySelector('button[data-testid="download-batch-item"]') as HTMLButtonElement;
    expect(downloadBtn).not.toBeNull();

    act(() => {
      downloadBtn.click();
    });

    expect(handleDownload).toHaveBeenCalledWith('file-3');
  });
});
