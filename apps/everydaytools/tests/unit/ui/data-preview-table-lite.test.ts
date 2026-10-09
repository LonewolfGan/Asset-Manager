import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { DataPreviewTableLite } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('DataPreviewTableLite (TDD RED Phase)', () => {
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
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(DataPreviewTableLite, props)
        )
      );
    });
  };

  it('renders headers and table rows correctly', async () => {
    const headers = ['Nom', 'Email', 'Rôle'];
    const rows = [
      ['Alice', 'alice@example.com', 'Admin'],
      ['Bob', 'bob@example.com', 'Membre'],
    ];

    await renderComponent({
      headers,
      rows,
      isFr: true,
    });

    const thElements = container.querySelectorAll('th');
    expect(thElements.length).toBe(3);
    expect(thElements[0].textContent?.trim()).toBe('Nom');

    const trElements = container.querySelectorAll('tbody tr');
    expect(trElements.length).toBe(2);
    expect(trElements[0].textContent).toContain('Alice');
  });

  it('limits rows to maxRows and displays total rows counter', async () => {
    const headers = ['ID', 'Valeur'];
    const rows = [
      ['1', 'A'],
      ['2', 'B'],
      ['3', 'C'],
      ['4', 'D'],
    ];

    await renderComponent({
      headers,
      rows,
      maxRows: 2,
      totalRows: 4,
      isFr: true,
    });

    const trElements = container.querySelectorAll('tbody tr');
    expect(trElements.length).toBe(2);

    const counter = container.querySelector('[data-testid="data-preview-counter"]');
    expect(counter).not.toBeNull();
    expect(counter?.textContent).toContain('2');
    expect(counter?.textContent).toContain('4');
  });

  it('renders empty message when rows are empty', async () => {
    await renderComponent({
      headers: ['A', 'B'],
      rows: [],
      isFr: true,
      emptyMessage: 'Aucune donnée disponible',
    });

    expect(container.textContent).toContain('Aucune donnée disponible');
  });
});
