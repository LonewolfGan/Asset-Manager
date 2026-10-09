import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfRepairWorkbench } from '@/components/pdf-repair/PdfRepairWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfRepairWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['corrupted-pdf-bytes'], 'damaged.pdf', { type: 'application/pdf' });

  const renderWorkbench = async (workflowOverrides = {}, propsOverrides = {}) => {
    const defaultWorkflow = {
      file: sampleFile,
      isProcessing: false,
      repairedBlob: null,
      error: null,
      handleReset: vi.fn(),
      handleRepair: vi.fn(),
      handleDownload: vi.fn(),
      ...workflowOverrides,
    };

    const defaultProps = {
      workflow: defaultWorkflow as any,
      isFr: true,
      repairBtnLabel: 'Réparer le document PDF',
      repairingLabel: 'Réparation en cours...',
      ...propsOverrides,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfRepairWorkbench, defaultProps)
        )
      );
    });

    return { workflow: defaultWorkflow, props: defaultProps };
  };

  it('renders StudioCommandBar with file metadata and repair action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('damaged.pdf');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Réparer');
  });

  it('triggers handleReset when reset button is clicked', async () => {
    const handleReset = vi.fn();
    await renderWorkbench({ handleReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('triggers handleRepair when primary action button is clicked', async () => {
    const handleRepair = vi.fn();
    await renderWorkbench({ handleRepair });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(handleRepair).toHaveBeenCalledTimes(1);
  });
});
