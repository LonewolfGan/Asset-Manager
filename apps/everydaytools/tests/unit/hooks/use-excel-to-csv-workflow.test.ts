import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';
import { useExcelToCsvWorkflow } from '@/hooks/use-excel-to-csv-workflow';

// Mock consumeHandoffFile
const mockConsumeHandoffFile = vi.fn();
vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffFile: () => mockConsumeHandoffFile(),
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('useExcelToCsvWorkflow (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ReturnType<typeof useExcelToCsvWorkflow>;

  function TestHarness() {
    hookValue = useExcelToCsvWorkflow();
    return null;
  }

  beforeEach(() => {
    mockConsumeHandoffFile.mockReset();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  const renderComponent = async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(TestHarness)
          )
        )
      );
    });
  };

  it('initializes with clean default state', async () => {
    await renderComponent();

    expect(hookValue.file).toBeUndefined();
    expect(hookValue.sheets).toEqual([]);
    expect(hookValue.selectedSheet).toBe('');
    expect(hookValue.delimiter).toBe(',');
    expect(hookValue.result).toBeNull();
    expect(hookValue.isProcessing).toBe(false);
    expect(hookValue.isNextActionOpen).toBe(false);
  });

  it('validates and stages a valid Excel file', async () => {
    await renderComponent();

    const XLSX = await import('xlsx');
    const ws1 = XLSX.utils.aoa_to_sheet([['ID', 'Name'], [1, 'Alpha']]);
    const ws2 = XLSX.utils.aoa_to_sheet([['Code', 'Desc'], ['X', 'Omega']]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1');
    XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const file = new File([buf], 'data.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    await act(async () => {
      await hookValue.validateAndSetFile(file);
    });

    expect(hookValue.file).toBe(file);
    expect(hookValue.sheets).toEqual(['Sheet1', 'Sheet2']);
    expect(hookValue.selectedSheet).toBe('Sheet1');
  });

  it('consumes handoff file on mount without double execution', async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.aoa_to_sheet([['A', 'B'], [1, 2]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const staged = new File([buf], 'staged.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    mockConsumeHandoffFile.mockReturnValueOnce(staged);

    await renderComponent();

    expect(mockConsumeHandoffFile).toHaveBeenCalledTimes(1);
    expect(hookValue.file).toBe(staged);
    expect(hookValue.selectedSheet).toBe('Summary');
  });

  it('resets workflow state when handleReset is called', async () => {
    await renderComponent();

    const file = new File(['mock'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    await act(async () => {
      await hookValue.validateAndSetFile(file);
    });

    act(() => {
      hookValue.handleReset();
    });

    expect(hookValue.file).toBeUndefined();
    expect(hookValue.sheets).toEqual([]);
    expect(hookValue.selectedSheet).toBe('');
    expect(hookValue.result).toBeNull();
  });

  it('converts excel sheet with custom delimiter and sets result', async () => {
    await renderComponent();

    const XLSX = await import('xlsx');
    const ws = XLSX.utils.aoa_to_sheet([['Item', 'Qty'], ['Book', 10]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const file = new File([buf], 'inventory.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    await act(async () => {
      await hookValue.validateAndSetFile(file);
    });

    act(() => {
      hookValue.setDelimiter(';');
    });

    await act(async () => {
      await hookValue.handleConvert();
    });

    expect(hookValue.result).not.toBeNull();
    expect(hookValue.result?.filename).toBe('inventory.csv');
    expect(hookValue.result?.textOutput).toContain('Item;Qty');
    expect(hookValue.result?.textOutput).toContain('Book;10');
  });

  it('triggers isNextActionOpen after handleDownload', async () => {
    await renderComponent();

    const XLSX = await import('xlsx');
    const ws = XLSX.utils.aoa_to_sheet([['X', 'Y'], [1, 2]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const file = new File([buf], 'sample.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    await act(async () => {
      await hookValue.validateAndSetFile(file);
    });

    await act(async () => {
      await hookValue.handleConvert();
    });
    expect(hookValue.result).not.toBeNull();

    vi.useFakeTimers();
    try {
      act(() => {
        hookValue.handleDownload();
      });

      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(hookValue.isNextActionOpen).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
