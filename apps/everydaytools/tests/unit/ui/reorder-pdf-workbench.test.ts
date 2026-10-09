import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ReorderPdfWorkbench } from '@/components/reorder-pdf/ReorderPdfWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('ReorderPdfWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'presentation.pdf', { type: 'application/pdf' });

  const renderWorkbench = async (workflowOverrides = {}, labelsOverrides = {}) => {
    const defaultWorkflow = {
      file: sampleFile,
      pages: [
        { pageNum: 1, originalIndex: 0, dataUrl: 'data:mock1' },
        { pageNum: 2, originalIndex: 1, dataUrl: 'data:mock2' },
      ],
      originalPages: [
        { pageNum: 1, originalIndex: 0, dataUrl: 'data:mock1' },
        { pageNum: 2, originalIndex: 1, dataUrl: 'data:mock2' },
      ],
      isLoadingThumbs: false,
      loadingProgress: 100,
      isSaving: false,
      isOrderModified: false,
      dragIdx: null,
      dropIdx: null,
      setDragIdx: vi.fn(),
      setDropIdx: vi.fn(),
      handleReset: vi.fn(),
      reversePages: vi.fn(),
      resetOrder: vi.fn(),
      handleSave: vi.fn(),
      handlePageDrop: vi.fn(),
      removePage: vi.fn(),
      movePage: vi.fn(),
      ...workflowOverrides,
    };

    const defaultLabels = {
      reverseOrder: "Inverser l'ordre",
      resetOrder: "Ordre initial",
      saving: 'Enregistrement...',
      savePdf: 'Enregistrer le PDF',
      loadingThumbs: 'Chargement des miniatures...',
      ...labelsOverrides,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ReorderPdfWorkbench, {
            isFr: true,
            sourceFormatIcon: '/images/formats/pdf.svg',
            workflow: defaultWorkflow as any,
            labels: defaultLabels,
          })
        )
      );
    });

    return { workflow: defaultWorkflow, labels: defaultLabels };
  };

  it('renders StudioCommandBar with file metadata and save action', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('presentation.pdf');
    expect(container.textContent).toContain('2 p.');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Enregistrer le PDF');
  });

  it('triggers handleReset when return button is clicked', async () => {
    const handleReset = vi.fn();
    await renderWorkbench({ handleReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('triggers handleSave when primary action button is clicked', async () => {
    const handleSave = vi.fn();
    await renderWorkbench({ handleSave });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('triggers reversePages when reverse order button is clicked', async () => {
    const reversePages = vi.fn();
    await renderWorkbench({ reversePages });

    const reverseBtn = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes("Inverser l'ordre")
    );
    expect(reverseBtn).toBeDefined();

    act(() => {
      reverseBtn?.click();
    });

    expect(reversePages).toHaveBeenCalledTimes(1);
  });

  it('triggers resetOrder when reset order button is clicked when modified', async () => {
    const resetOrder = vi.fn();
    await renderWorkbench({ isOrderModified: true, resetOrder });

    const resetOrderBtn = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Ordre initial')
    );
    expect(resetOrderBtn).toBeDefined();

    act(() => {
      resetOrderBtn?.click();
    });

    expect(resetOrder).toHaveBeenCalledTimes(1);
  });
});
