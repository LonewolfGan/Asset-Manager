import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useCsvTableState } from '@/hooks/use-csv-table-state';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

describe('useCsvTableState (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ReturnType<typeof useCsvTableState>;
  const onBeforeMutation = vi.fn();
  const onUndoToast = vi.fn();

  const TestConsumer: React.FC = () => {
    hookValue = useCsvTableState({
      isFr: true,
      onBeforeMutation,
      onUndoToast,
    });
    return null;
  };

  beforeEach(() => {
    onBeforeMutation.mockClear();
    onUndoToast.mockClear();
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

  const renderComponent = async () => {
    await act(async () => {
      root.render(React.createElement(TestConsumer));
    });
  };

  it('initializes with default state', async () => {
    await renderComponent();
    expect(hookValue.isReady).toBe(false);
    expect(hookValue.headers).toEqual([]);
    expect(hookValue.rows).toEqual([]);
    expect(hookValue.sortConfig).toBeNull();
  });

  it('cycles sort direction: asc -> desc -> null', async () => {
    await renderComponent();
    act(() => {
      hookValue.handleStartBlank();
    });

    // First sort on column 0 -> asc
    act(() => {
      hookValue.handleSort(0);
    });
    expect(hookValue.sortConfig).toEqual({ colIndex: 0, direction: 'asc' });

    // Second sort on column 0 -> desc
    act(() => {
      hookValue.handleSort(0);
    });
    expect(hookValue.sortConfig).toEqual({ colIndex: 0, direction: 'desc' });

    // Third sort on column 0 -> null
    act(() => {
      hookValue.handleSort(0);
    });
    expect(hookValue.sortConfig).toBeNull();
  });

  it('adds and deletes rows with beforeMutation notification', async () => {
    await renderComponent();
    act(() => {
      hookValue.handleStartBlank();
    });
    const initialRowCount = hookValue.rows.length;

    act(() => {
      hookValue.addRow();
    });
    expect(hookValue.rows.length).toBe(initialRowCount + 1);
    expect(onBeforeMutation).toHaveBeenCalled();

    act(() => {
      hookValue.deleteRow(0);
    });
    expect(hookValue.rows.length).toBe(initialRowCount);
    expect(onUndoToast).toHaveBeenCalled();
  });

  it('adds and deletes columns with boundary check', async () => {
    await renderComponent();
    act(() => {
      hookValue.handleStartBlank();
    });
    const initialColCount = hookValue.headers.length;

    act(() => {
      hookValue.addCol();
    });
    expect(hookValue.headers.length).toBe(initialColCount + 1);

    act(() => {
      hookValue.deleteCol(hookValue.headers.length - 1);
    });
    expect(hookValue.headers.length).toBe(initialColCount);
  });

  it('updates cell value accurately', async () => {
    await renderComponent();
    act(() => {
      hookValue.handleStartBlank();
    });

    act(() => {
      hookValue.updateCell(0, 0, 'Test Value');
    });
    expect(hookValue.rows[0][0]).toBe('Test Value');
  });
});
