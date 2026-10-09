import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfSplitWorkbench } from '@/components/pdf-split/PdfSplitWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfSplitWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'sample-doc.pdf', { type: 'application/pdf' });
  const mockFormat = {
    id: 'pdf',
    name: 'PDF',
    extension: 'pdf',
    icon: '/images/formats/pdf.svg',
    color: '#FF6B35',
  };

  const renderWorkbench = async (props: Partial<Parameters<typeof PdfSplitWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      format: mockFormat,
      pages: [
        { pageNumber: 1, dataUrl: 'data:image/png;base64,mock', width: 600, height: 800, aspectRatio: 0.75 },
        { pageNumber: 2, dataUrl: 'data:image/png;base64,mock', width: 600, height: 800, aspectRatio: 0.75 },
        { pageNumber: 3, dataUrl: 'data:image/png;base64,mock', width: 600, height: 800, aspectRatio: 0.75 },
      ],
      isLoadingThumbs: false,
      activeMode: 'extract' as const,
      selectedPages: [1],
      extractRangeFrom: 1,
      extractRangeTo: 3,
      isEditingCustomSyntax: false,
      rawSyntaxText: '',
      extractAsSinglePdf: true,
      tranches: [],
      batchChunkSize: 2,
      splitViewMode: 'pages' as const,
      overlappingTranchesInfo: null,
      error: null,
      isProcessing: false,
      canConvert: true,
      isFr: true,
      t: {},
      contactSheetRef: { current: null },
      onReset: vi.fn(),
      onModeChange: vi.fn(),
      onConvert: vi.fn(),
      onRangeFromChange: vi.fn(),
      onRangeToChange: vi.fn(),
      onAddRange: vi.fn(),
      setSelectedPages: vi.fn(),
      setIsEditingCustomSyntax: vi.fn(),
      setRawSyntaxText: vi.fn(),
      setExtractAsSinglePdf: vi.fn(),
      setSplitViewMode: vi.fn(),
      setBatchChunkSize: vi.fn(),
      setTranches: vi.fn(),
      getPageTrancheIndices: vi.fn(() => []),
      onPageCardClick: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfSplitWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('sample-doc.pdf');
    expect(container.textContent).toContain('3 p.');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Extraire la sélection');
  });

  it('triggers onReset when the return button is clicked', async () => {
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

  it('triggers onModeChange when switching mode in center controls', async () => {
    const onModeChange = vi.fn();
    await renderWorkbench({ onModeChange });

    const splitModeBtn = Array.from(container.querySelectorAll('button')).find(
      (btn) => btn.textContent?.includes('Découper en tranches')
    );
    expect(splitModeBtn).toBeDefined();

    act(() => {
      splitModeBtn?.click();
    });

    expect(onModeChange).toHaveBeenCalledWith('split');
  });

  it('renders PageRangeSelector with input and quick action shortcuts in extract mode', async () => {
    const setSelectedPages = vi.fn();
    await renderWorkbench({
      activeMode: 'extract',
      selectedPages: [1, 2],
      setSelectedPages,
    });

    const rangeInput = container.querySelector('input[data-testid="page-range-input"]') as HTMLInputElement;
    expect(rangeInput).not.toBeNull();
    expect(rangeInput.value).toBe('1-2');

    const quickOddBtn = container.querySelector('button[data-testid="range-quick-odd"]') as HTMLButtonElement;
    expect(quickOddBtn).not.toBeNull();

    act(() => {
      quickOddBtn.click();
    });

    expect(setSelectedPages).toHaveBeenCalled();
  });
});
