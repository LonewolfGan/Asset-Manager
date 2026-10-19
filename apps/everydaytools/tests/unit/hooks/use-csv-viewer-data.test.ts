import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useCsvViewerData } from '@/hooks/use-csv-viewer-data';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useCsvViewerData (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ReturnType<typeof useCsvViewerData>;

  const sampleRows = [
    ['Alice', '30', 'Paris'],
    ['Bob', '25', 'Lyon'],
    ['Charlie', '35', 'Marseille'],
  ];

  const TestConsumer: React.FC<{ rows: string[][] }> = ({ rows }) => {
    hookValue = useCsvViewerData(rows);
    return null;
  };

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

  const renderComponent = async (rows = sampleRows) => {
    await act(async () => {
      root.render(React.createElement(TestConsumer, { rows }));
    });
  };

  it('cycles sortCol and sortDir properly: asc -> desc -> null and resets sortCol', async () => {
    await renderComponent();

    expect(hookValue.sortCol).toBeNull();
    expect(hookValue.sortDir).toBeNull();

    // 1st click on Col 0 -> asc
    act(() => {
      hookValue.handleSort(0);
    });
    expect(hookValue.sortCol).toBe(0);
    expect(hookValue.sortDir).toBe('asc');

    // 2nd click on Col 0 -> desc
    act(() => {
      hookValue.handleSort(0);
    });
    expect(hookValue.sortCol).toBe(0);
    expect(hookValue.sortDir).toBe('desc');

    // 3rd click on Col 0 -> null (reset)
    act(() => {
      hookValue.handleSort(0);
    });
    expect(hookValue.sortCol).toBeNull();
    expect(hookValue.sortDir).toBeNull();
  });

  it('switches to a new column on first click as asc', async () => {
    await renderComponent();

    act(() => {
      hookValue.handleSort(0);
    });
    expect(hookValue.sortCol).toBe(0);
    expect(hookValue.sortDir).toBe('asc');

    act(() => {
      hookValue.handleSort(1);
    });
    expect(hookValue.sortCol).toBe(1);
    expect(hookValue.sortDir).toBe('asc');
  });

  it('filters rows by search query and calculates pagination', async () => {
    await renderComponent();

    expect(hookValue.filteredAndSortedRows.length).toBe(3);

    act(() => {
      hookValue.setSearchQuery('Lyon');
    });

    expect(hookValue.filteredAndSortedRows.length).toBe(1);
    expect(hookValue.filteredAndSortedRows[0].row[0]).toBe('Bob');

    act(() => {
      hookValue.resetViewParams();
    });

    expect(hookValue.searchQuery).toBe('');
    expect(hookValue.filteredAndSortedRows.length).toBe(3);
  });
});
