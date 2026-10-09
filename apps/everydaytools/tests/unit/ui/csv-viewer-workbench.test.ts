import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CsvViewerWorkbench } from '@/components/csv-viewer/CsvViewerWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';

describe('CsvViewerWorkbench integration with @workspace/ui (TDD)', () => {
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

  const renderWorkbench = async (propsOverrides: any = {}) => {
    const defaultProps = {
      isFr: true,
      documentName: 'dataset.csv',
      fileSize: '12.4 Ko',
      rows: [
        ['Alice', 'Paris', '30'],
        ['Bob', 'Lyon', '25'],
      ],
      headers: ['Nom', 'Ville', 'Age'],
      searchQuery: '',
      onSearchChange: vi.fn(),
      onClearSearch: vi.fn(),
      onReset: vi.fn(),
      showExportMenu: false,
      setShowExportMenu: vi.fn(),
      onDownloadCsv: vi.fn(),
      onDownloadExcel: vi.fn(),
      paginatedRows: [
        { originalIndex: 0, row: ['Alice', 'Paris', '30'] },
        { originalIndex: 1, row: ['Bob', 'Lyon', '25'] },
      ],
      filteredAndSortedCount: 2,
      sortCol: null,
      sortDir: 'none' as const,
      onSort: vi.fn(),
      currentPage: 1,
      totalPages: 1,
      pageSize: 50,
      onPageSizeChange: vi.fn(),
      onPageChange: vi.fn(),
      ...propsOverrides,
    };

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(CsvViewerWorkbench, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with document metadata and reset button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('dataset.csv');
    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]');
    expect(resetBtn).not.toBeNull();
  });

  it('triggers onReset when studio reset button is clicked', async () => {
    const onReset = vi.fn();
    await renderWorkbench({ onReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onSearchChange when search input is modified', async () => {
    const onSearchChange = vi.fn();
    await renderWorkbench({ onSearchChange });

    const searchInput = container.querySelector('input[data-testid="csv-search-input"]') as HTMLInputElement;
    expect(searchInput).not.toBeNull();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Alice');
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(onSearchChange).toHaveBeenCalled();
  });
});
