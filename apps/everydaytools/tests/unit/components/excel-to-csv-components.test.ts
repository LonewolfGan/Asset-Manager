import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ExcelSheetSelector } from '@/components/excel-to-csv/ExcelSheetSelector';

describe('ExcelSheetSelector component (TDD RED Phase)', () => {
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

  it('renders nothing when there is only 1 sheet or 0 sheets', async () => {
    await act(async () => {
      root.render(
        React.createElement(ExcelSheetSelector, {
          sheets: ['Feuille 1'],
          selectedSheet: 'Feuille 1',
          onSelectSheet: vi.fn(),
          label: 'Feuille à exporter',
        })
      );
    });

    expect(container.innerHTML).toBe('');
  });

  it('renders buttons for each sheet when sheets > 1 and handles selection', async () => {
    const handleSelect = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(ExcelSheetSelector, {
          sheets: ['Feuille 1', 'Feuille 2', 'Feuille 3'],
          selectedSheet: 'Feuille 2',
          onSelectSheet: handleSelect,
          label: 'Feuille à exporter',
        })
      );
    });

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(3);

    // Selected button check
    const selectedBtn = buttons[1];
    expect(selectedBtn.textContent).toBe('Feuille 2');
    expect(selectedBtn.getAttribute('aria-pressed')).toBe('true');

    const unselectedBtn = buttons[0];
    expect(unselectedBtn.getAttribute('aria-pressed')).toBe('false');

    // Click handler check
    act(() => {
      unselectedBtn.click();
    });
    expect(handleSelect).toHaveBeenCalledWith('Feuille 1');
  });

  it('satisfies anti-slop rules: no transition-all and no raw hex #21A366', async () => {
    await act(async () => {
      root.render(
        React.createElement(ExcelSheetSelector, {
          sheets: ['Alpha', 'Beta'],
          selectedSheet: 'Alpha',
          onSelectSheet: vi.fn(),
          label: 'Sheets',
        })
      );
    });

    expect(container.innerHTML).not.toContain('transition-all');
    expect(container.innerHTML).not.toContain('#21A366');
  });

  it('renders gracefully even if duplicate sheet names exist in malformed workbook', async () => {
    await act(async () => {
      root.render(
        React.createElement(ExcelSheetSelector, {
          sheets: ['Data', 'Data'],
          selectedSheet: 'Data',
          onSelectSheet: vi.fn(),
          label: 'Sheets',
        })
      );
    });

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });
});
