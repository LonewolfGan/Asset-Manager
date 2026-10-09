import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfPageNumbersWorkbench } from '@/components/pdf-page-numbers/PdfPageNumbersWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfPageNumbersWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'contrat.pdf', { type: 'application/pdf' });
  const mockFormat = {
    id: 'pdf',
    name: 'PDF',
    extension: 'pdf',
    icon: '/images/formats/pdf.svg',
    color: '#FF6B35',
  };

  const renderWorkbench = async (props: Partial<Parameters<typeof PdfPageNumbersWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      sourceFormat: mockFormat,
      totalPages: 10,
      isProcessing: false,
      isFr: true,
      tc: { applyBtn: 'Numéroter le PDF' },
      onReset: vi.fn(),
      onConvert: vi.fn(),
      position: 'bottom-right' as const,
      setPosition: vi.fn(),
      format: '{n}',
      setFormat: vi.fn(),
      startNum: 1,
      setStartNum: vi.fn(),
      fontSize: 11,
      setFontSize: vi.fn(),
      skipFirst: false,
      onToggleSkipFirst: vi.fn(),
      positionOptions: [],
      formatOptions: [],
      pagePreviewUrl: null,
      previewPage: 1,
      isLoadingPreview: false,
      onPageChange: vi.fn(),
      stampLabel: '1',
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfPageNumbersWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('contrat.pdf');
    expect(container.textContent).toContain('10 p.');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Numéroter le PDF');
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

  it('triggers onConvert when primary action button is clicked', async () => {
    const onConvert = vi.fn();
    await renderWorkbench({ onConvert });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onConvert).toHaveBeenCalledTimes(1);
  });

  it('renders PositionPlacementGrid with placement anchors and selects position', async () => {
    const setPosition = vi.fn();
    await renderWorkbench({
      position: 'bottom-right',
      setPosition,
    });

    const topLeftAnchor = container.querySelector('button[data-placement="top-left"]') as HTMLButtonElement;
    expect(topLeftAnchor).not.toBeNull();

    act(() => {
      topLeftAnchor.click();
    });

    expect(setPosition).toHaveBeenCalledWith('top-left');
  });
});
