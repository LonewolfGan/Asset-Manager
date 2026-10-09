import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { DocumentPageGrid } from '@workspace/ui';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('DocumentPageGrid (TDD RED Phase)', () => {
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

  const renderComponent = async (props: any) => {
    await act(async () => {
      root.render(React.createElement(DocumentPageGrid, props));
    });
  };

  it('renders total pages count and page cards', async () => {
    const mockPages = [
      { id: 1, pageNumber: 1 },
      { id: 2, pageNumber: 2 },
      { id: 3, pageNumber: 3 },
    ];

    await renderComponent({
      pages: mockPages,
      isFr: true,
      renderPageCard: (page: any) =>
        React.createElement('div', { key: page.id, 'data-testid': `page-${page.pageNumber}` }, `Page ${page.pageNumber}`),
    });

    expect(container.textContent).toContain('Toutes les pages (3)');
    expect(container.querySelector('[data-testid="page-1"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page-2"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="page-3"]')).not.toBeNull();
  });

  it('renders selection count and triggers onClearSelection', async () => {
    const handleClearSelection = vi.fn();
    const mockPages = [
      { id: 1, pageNumber: 1, isSelected: true },
      { id: 2, pageNumber: 2, isSelected: true },
    ];

    await renderComponent({
      pages: mockPages,
      selectedCount: 2,
      isFr: true,
      onClearSelection: handleClearSelection,
    });

    expect(container.textContent).toContain('2 pages sélectionnées');
    const clearBtn = container.querySelector('[data-testid="page-grid-clear-selection"]') as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();

    act(() => {
      clearBtn.click();
    });

    expect(handleClearSelection).toHaveBeenCalledTimes(1);
  });

  it('triggers quick selection callbacks: all, odd, even', async () => {
    const handleSelectAll = vi.fn();
    const handleSelectOdd = vi.fn();
    const handleSelectEven = vi.fn();

    await renderComponent({
      pages: [{ id: 1, pageNumber: 1 }, { id: 2, pageNumber: 2 }],
      onSelectAll: handleSelectAll,
      onSelectOdd: handleSelectOdd,
      onSelectEven: handleSelectEven,
      isFr: true,
    });

    const selectAllBtn = container.querySelector('[data-testid="page-grid-select-all"]') as HTMLButtonElement;
    const selectOddBtn = container.querySelector('[data-testid="page-grid-select-odd"]') as HTMLButtonElement;
    const selectEvenBtn = container.querySelector('[data-testid="page-grid-select-even"]') as HTMLButtonElement;

    expect(selectAllBtn).not.toBeNull();
    expect(selectOddBtn).not.toBeNull();
    expect(selectEvenBtn).not.toBeNull();

    act(() => {
      selectAllBtn.click();
      selectOddBtn.click();
      selectEvenBtn.click();
    });

    expect(handleSelectAll).toHaveBeenCalledTimes(1);
    expect(handleSelectOdd).toHaveBeenCalledTimes(1);
    expect(handleSelectEven).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when isLoading is true', async () => {
    await renderComponent({
      pages: [],
      isLoading: true,
      loadingMessage: 'Génération des planches du document...',
      loadingProgress: { current: 3, total: 10 },
      isFr: true,
    });

    const loadingEl = container.querySelector('[data-testid="page-grid-loading"]');
    expect(loadingEl).not.toBeNull();
    expect(container.textContent).toContain('Génération des planches du document...');
    expect(container.textContent).toContain('Page 3 / 10');
  });

  it('renders custom headerSlot when provided', async () => {
    await renderComponent({
      pages: [{ id: 1, pageNumber: 1 }],
      headerSlot: React.createElement('div', { 'data-testid': 'custom-header-slot' }, 'Extra Actions'),
    });

    expect(container.querySelector('[data-testid="custom-header-slot"]')).not.toBeNull();
  });

  it('forwards pointer down event to onPointerDownGrid', async () => {
    const handlePointerDown = vi.fn();
    await renderComponent({
      pages: [{ id: 1, pageNumber: 1 }],
      onPointerDownGrid: handlePointerDown,
    });

    const gridCanvas = container.querySelector('[data-testid="page-grid-canvas"]') as HTMLDivElement;
    expect(gridCanvas).not.toBeNull();

    act(() => {
      gridCanvas.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    });

    expect(handlePointerDown).toHaveBeenCalledTimes(1);
  });
});
