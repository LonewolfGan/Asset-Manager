import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';
import { CsvEditorTopBar } from '@/components/csv-editor/CsvEditorTopBar';
import { CsvEditorTable } from '@/components/csv-editor/CsvEditorTable';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('CsvEditor Components & Design System Invariants', () => {
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

  it('CsvEditorTopBar has ZERO transition-all and ZERO hardcoded #FF6B35', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(CsvEditorTopBar, {
              documentName: 'test-dataset',
              onDocumentNameChange: vi.fn(),
              rowsCount: 5,
              colsCount: 3,
              searchQuery: '',
              onSearchQueryChange: vi.fn(),
              onReset: vi.fn(),
              historyLength: 1,
              futureLength: 0,
              onUndo: vi.fn(),
              onRedo: vi.fn(),
              onAddRow: vi.fn(),
              onAddCol: vi.fn(),
              onClearRows: vi.fn(),
              showExportMenu: false,
              onShowExportMenuChange: vi.fn(),
              onExportCsv: vi.fn(),
              onExportExcel: vi.fn(),
              isFr: true,
            })
          )
        )
      );
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain('transition-all');
      expect(btn.className).not.toContain('#FF6B35');
      expect(btn.className).not.toContain('#E85A24');
    });

    const inputs = Array.from(container.querySelectorAll('input'));
    inputs.forEach((inp) => {
      expect(inp.className).not.toContain('border-[#FF6B35]');
    });
  });

  it('CsvEditorTable renders with aria-sort and ZERO transition-all', async () => {
    const mockHeaders = ['ID', 'Nom', 'Ville'];
    const mockRows = [
      { row: ['1', 'Alice', 'Paris'], originalIndex: 0 },
      { row: ['2', 'Bob', 'Lyon'], originalIndex: 1 },
    ];

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(CsvEditorTable, {
              headers: mockHeaders,
              onUpdateHeader: vi.fn(),
              processedRows: mockRows,
              totalRowsCount: 2,
              searchQuery: '',
              sortConfig: { colIndex: 1, direction: 'asc' },
              onSort: vi.fn(),
              onDeleteCol: vi.fn(),
              onAddCol: vi.fn(),
              onUpdateCell: vi.fn(),
              onDeleteRow: vi.fn(),
              onAddRow: vi.fn(),
              isFr: true,
            })
          )
        )
      );
    });

    const thElements = Array.from(container.querySelectorAll('th'));
    // The second header (colIndex 1: Nom) should have aria-sort="ascending"
    const sortedTh = thElements.find((th) => th.getAttribute('aria-sort') === 'ascending');
    expect(sortedTh).toBeDefined();

    const buttons = Array.from(container.querySelectorAll('button'));
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain('transition-all');
      expect(btn.className).not.toContain('#10B981');
    });
  });
});
