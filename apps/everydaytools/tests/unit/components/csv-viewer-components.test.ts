import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';
import { CsvViewerWorkbench } from '@/components/csv-viewer/CsvViewerWorkbench';
import { CsvViewerDropzoneScene } from '@/components/csv-viewer/CsvViewerDropzoneScene';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('CsvViewer Components & Design System Invariants', () => {
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

  const mockWorkbenchProps = {
    isFr: true,
    documentName: 'data.csv',
    fileSize: '1.2 Ko',
    rows: [['Alice', '30']],
    headers: ['Name', 'Age'],
    searchQuery: '',
    onSearchChange: vi.fn(),
    onClearSearch: vi.fn(),
    onReset: vi.fn(),
    showExportMenu: false,
    setShowExportMenu: vi.fn(),
    onDownloadCsv: vi.fn(),
    onDownloadExcel: vi.fn(),
    paginatedRows: [{ originalIndex: 0, row: ['Alice', '30'] }],
    filteredAndSortedCount: 1,
    sortCol: null,
    sortDir: 'none' as const,
    onSort: vi.fn(),
    currentPage: 1,
    totalPages: 1,
    pageSize: 50,
    onPageSizeChange: vi.fn(),
    onPageChange: vi.fn(),
  };

  it('CsvViewerWorkbench export button has ZERO #FF6B35, ZERO #E85A24, and ZERO transition-all', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(CsvViewerWorkbench, mockWorkbenchProps)
          )
        )
      );
    });

    const exportBtn = container.querySelector('button[type="button"].rounded-xl.bg-\\[var\\(--accent\\,\\#f97316\\)\\]') ??
      container.querySelector('button.bg-\\[\\#FF6B35\\]');
    
    // We expect the button to exist and not contain forbidden classes
    const allButtons = Array.from(container.querySelectorAll('button'));
    const downloadBtn = allButtons.find((b) => b.textContent?.includes('Exporter') || b.textContent?.includes('Export'));
    expect(downloadBtn).toBeDefined();

    const btnClass = downloadBtn?.className ?? '';
    expect(btnClass).not.toContain('transition-all');
    expect(btnClass).not.toContain('#FF6B35');
    expect(btnClass).not.toContain('#E85A24');
    expect(btnClass).toContain('var(--accent');
  });

  it('CsvViewerDropzoneScene has ZERO transition-all classes', async () => {
    const mockDropzoneProps = {
      inputMode: 'file' as const,
      setInputMode: vi.fn(),
      isFr: true,
      error: null,
      sourceFormat: {
        name: 'CSV',
        extension: 'csv',
        icon: '/icons/csv.svg',
        color: 'var(--accent, #10b981)',
      },
      isDragging: false,
      onFileSelected: vi.fn(),
      onDragOver: vi.fn(),
      onDragLeave: vi.fn(),
      onDrop: vi.fn(),
      onLoadSample: vi.fn(),
      rawText: '',
      setRawText: vi.fn(),
      onPasteSubmit: vi.fn(),
    };

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(CsvViewerDropzoneScene, mockDropzoneProps)
          )
        )
      );
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain('transition-all');
    });
  });
});
