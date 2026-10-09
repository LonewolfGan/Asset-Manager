import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { StudioResultCard } from '@workspace/ui';

describe('StudioResultCard (TDD)', () => {
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
      root.render(React.createElement(StudioResultCard, props));
    });
  };

  it('renders result file details and calculates compression savings when originalSize is given', async () => {
    await renderComponent({
      fileName: 'compressed-archive.pdf',
      fileSize: 1048576, // 1 Mo
      originalSize: 2097152, // 2 Mo (50% saving)
      onDownload: vi.fn(),
      onReset: vi.fn(),
    });

    expect(container.textContent).toContain('compressed-archive.pdf');
    expect(container.textContent).toContain('1 Mo');
    expect(container.textContent).toContain('-50%');
  });

  it('triggers onDownload when download button is clicked', async () => {
    const handleDownload = vi.fn();
    await renderComponent({
      fileName: 'export.png',
      fileSize: 500000,
      onDownload: handleDownload,
      onReset: vi.fn(),
      downloadLabel: 'Télécharger le fichier',
    });

    const downloadBtn = container.querySelector('button[data-testid="studio-result-download-btn"]') as HTMLButtonElement;
    expect(downloadBtn).not.toBeNull();

    act(() => {
      downloadBtn.click();
    });

    expect(handleDownload).toHaveBeenCalledTimes(1);
  });

  it('triggers onReset when start-over button is clicked', async () => {
    const handleReset = vi.fn();
    await renderComponent({
      fileName: 'export.png',
      fileSize: 500000,
      onDownload: vi.fn(),
      onReset: handleReset,
      resetLabel: 'Traiter un autre fichier',
    });

    const resetBtn = container.querySelector('button[data-testid="studio-result-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('renders monument variant with full-width typographic comparison and gain badge', async () => {
    await renderComponent({
      variant: 'monument',
      fileName: 'document.pdf',
      fileSize: 500000,
      originalSize: 1000000,
      onDownload: vi.fn(),
      onReset: vi.fn(),
    });

    const monument = container.querySelector('[data-testid="studio-result-monument"]');
    expect(monument).not.toBeNull();
    expect(container.textContent).toContain('-50%');
  });
});
