import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfCompressWorkbench } from '@/components/pdf-compress/PdfCompressWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getPresets, getPdfFormat } from '@/lib/pdf-compress-logic';

describe('PdfCompressWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'report-2026.pdf', { type: 'application/pdf' });
  const pdfFormat = getPdfFormat(true);
  const presets = getPresets(true);

  const renderWorkbench = async (props: Partial<Parameters<typeof PdfCompressWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      pdfFormat,
      presets,
      level: 'ebook' as const,
      isFr: true,
      isProcessing: false,
      onReset: vi.fn(),
      onCompress: vi.fn(),
      onSelectLevel: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfCompressWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and compress action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('report-2026.pdf');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Compresser le document');
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

  it('renders FileSizeBadge with estimated savings in calibrator cards', async () => {
    await renderWorkbench();

    const savingsBadges = container.querySelectorAll('[data-testid="savings-badge"]');
    expect(savingsBadges.length).toBeGreaterThan(0);
  });
});

