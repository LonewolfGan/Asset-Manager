import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfRotateWorkbench } from '@/components/pdf-rotate/PdfRotateWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfRotateWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'sample-contract.pdf', { type: 'application/pdf' });
  const mockFormat = {
    id: 'pdf',
    name: 'PDF',
    extension: 'pdf',
    icon: '/images/formats/pdf.svg',
    color: '#FF6B35',
  };

  const renderWorkbench = async (props: Partial<Parameters<typeof PdfRotateWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      format: mockFormat,
      pages: [
        { pageNum: 1, dataUrl: 'data:image/png;base64,mock', width: 600, height: 800 },
        { pageNum: 2, dataUrl: 'data:image/png;base64,mock', width: 600, height: 800 },
      ],
      isLoadingThumbs: false,
      pageRotations: {},
      selectedPages: [],
      modifiedPagesCount: 0,
      isProcessing: false,
      isFr: true,
      t: {},
      onReset: vi.fn(),
      onApplyRotation: vi.fn(),
      onRotateSelectedPages: vi.fn(),
      onResetAllRotations: vi.fn(),
      onSelectAllPages: vi.fn(),
      onClearSelection: vi.fn(),
      onSelectOddPages: vi.fn(),
      onSelectEvenPages: vi.fn(),
      onToggleSelectPage: vi.fn(),
      onRotateSinglePage: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfRotateWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('sample-contract.pdf');
    expect(container.textContent).toContain('2 p.');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Pivoter tout (+90°)');
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

  it('triggers onApplyRotation when primary action button is clicked', async () => {
    const onApplyRotation = vi.fn();
    await renderWorkbench({ onApplyRotation });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onApplyRotation).toHaveBeenCalledTimes(1);
  });
});
