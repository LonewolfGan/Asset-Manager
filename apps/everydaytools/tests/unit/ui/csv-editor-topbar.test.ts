import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CsvEditorTopBar } from '@/components/csv-editor/CsvEditorTopBar';

describe('CsvEditorTopBar with DelimiterRadioGroup (TDD RED Phase)', () => {
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

  it('renders DelimiterRadioGroup inside export popover when open', async () => {
    const handleExportCsv = vi.fn();
    const handleExportExcel = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(CsvEditorTopBar, {
            documentName: 'test-data',
            onDocumentNameChange: vi.fn(),
            rowsCount: 10,
            colsCount: 3,
            searchQuery: '',
            onSearchQueryChange: vi.fn(),
            onReset: vi.fn(),
            historyLength: 2,
            futureLength: 0,
            onUndo: vi.fn(),
            onRedo: vi.fn(),
            onAddRow: vi.fn(),
            onAddCol: vi.fn(),
            onClearRows: vi.fn(),
            showExportMenu: true,
            onShowExportMenuChange: vi.fn(),
            onExportCsv: handleExportCsv,
            onExportExcel: handleExportExcel,
            isFr: true,
          })
        )
      );
    });

    // DelimiterRadioGroup buttons should exist
    const delimiterBtn = document.body.querySelector('button[data-delimiter=";"]');
    expect(delimiterBtn).not.toBeNull();
  });
});
