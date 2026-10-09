import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfCompressResultShowcase } from '@/components/pdf-compress/PdfCompressResultShowcase';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfCompressResultShowcase integration with StudioResultCard (TDD)', () => {
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

  const mockResult = {
    blob: new Blob(['pdf-data']),
    filename: 'annual-report-compressed.pdf',
    sizeBefore: 2000000,
    sizeAfter: 800000,
    gain: 60,
  };

  const mockFormat = {
    id: 'pdf',
    name: 'PDF',
    extension: '.pdf',
    mimeType: 'application/pdf',
    icon: '/icons/pdf.svg',
  };

  it('renders StudioResultCard monument with compression metrics and download button', async () => {
    const handleDownload = vi.fn();
    const handleReset = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfCompressResultShowcase, {
            result: mockResult,
            pdfFormat: mockFormat,
            isFr: true,
            onDownload: handleDownload,
            onReset: handleReset,
          })
        )
      );
    });

    const monument = container.querySelector('[data-testid="studio-result-monument"]');
    expect(monument).not.toBeNull();
    expect(container.textContent).toContain('annual-report-compressed.pdf');
    expect(container.textContent).toContain('-60%');

    const downloadBtn = container.querySelector('button[data-testid="studio-result-download-btn"]') as HTMLButtonElement;
    expect(downloadBtn).not.toBeNull();
    act(() => {
      downloadBtn.click();
    });
    expect(handleDownload).toHaveBeenCalledTimes(1);
  });
});
