import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CsvToExcelModeSelector } from '@/components/csv-to-excel/CsvToExcelModeSelector';
import { CsvToExcelPastePane } from '@/components/csv-to-excel/CsvToExcelPastePane';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('CsvToExcel Components & Design System Invariants', () => {
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

  it('CsvToExcelModeSelector has ZERO transition-all', async () => {
    await act(async () => {
      root.render(
        React.createElement(CsvToExcelModeSelector, {
          mode: 'upload',
          onModeChange: vi.fn(),
          uploadLabel: 'Upload',
          pasteLabel: 'Paste',
        })
      );
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.length).toBe(2);
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain('transition-all');
    });
  });

  it('CsvToExcelPastePane has ZERO transition-all', async () => {
    await act(async () => {
      root.render(
        React.createElement(CsvToExcelPastePane, {
          csvText: 'Nom,Age\nAlice,30',
          onCsvTextChange: vi.fn(),
          onSubmit: vi.fn(),
          isFr: true,
        })
      );
    });

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.className).not.toContain('transition-all');
  });
});
