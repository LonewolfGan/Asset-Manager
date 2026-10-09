import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfMergeWorkbench } from '@/components/pdf-merge/PdfMergeWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfMergeWorkbench integration with @workspace/ui (TDD)', () => {
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

  const mockFormat = {
    id: 'pdf',
    name: 'PDF',
    extension: 'pdf',
    icon: '/images/formats/pdf.svg',
    color: '#FF6B35',
  };

  const mockFiles = [
    {
      id: 'f-1',
      file: new File(['a'], 'doc1.pdf', { type: 'application/pdf' }),
      name: 'doc1.pdf',
      size: 1024,
      pageCount: 3,
    },
    {
      id: 'f-2',
      file: new File(['b'], 'doc2.pdf', { type: 'application/pdf' }),
      name: 'doc2.pdf',
      size: 2048,
      pageCount: 5,
    },
  ];

  const renderWorkbench = async (props: Partial<Parameters<typeof PdfMergeWorkbench>[0]> = {}) => {
    const defaultProps = {
      files: mockFiles,
      format: mockFormat,
      totalSize: 3072,
      outputFilename: 'fusion.pdf',
      viewMode: 'grid' as const,
      draggedIndex: null,
      dragOverIndex: null,
      isProcessing: false,
      isFr: true,
      t: {},
      fileInputRef: { current: null },
      onReset: vi.fn(),
      onMerge: vi.fn(),
      onViewModeChange: vi.fn(),
      onOutputFilenameChange: vi.fn(),
      onMoveItem: vi.fn(),
      onRemoveFile: vi.fn(),
      onSortAZ: vi.fn(),
      onReverseOrder: vi.fn(),
      onItemDragStart: vi.fn(),
      onItemDragOver: vi.fn(),
      onItemDragEnd: vi.fn(),
      onItemDrop: vi.fn(),
      onDragOver: vi.fn(),
      onDragLeave: vi.fn(),
      onDrop: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfMergeWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file count and merge button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('2 documents');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Fusionner (2 documents)');
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

  it('triggers onMerge when primary action button is clicked', async () => {
    const onMerge = vi.fn();
    await renderWorkbench({ onMerge });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onMerge).toHaveBeenCalledTimes(1);
  });

  it('disables merge button when files count is less than 2', async () => {
    await renderWorkbench({
      files: [mockFiles[0]],
      totalSize: 1024,
    });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();
    expect(actionBtn.disabled).toBe(true);
    expect(actionBtn.textContent).toContain('min. 2 docs');
  });
});
