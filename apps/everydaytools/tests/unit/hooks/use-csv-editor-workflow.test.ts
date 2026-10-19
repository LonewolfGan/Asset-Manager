import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useCsvEditorWorkflow } from '@/hooks/use-csv-editor-workflow';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

let mockHandoffFile: File | null = null;
let mockHandoffText: string | null = null;

vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffFile: () => {
    const f = mockHandoffFile;
    mockHandoffFile = null;
    return f;
  },
  consumeHandoffText: () => {
    const t = mockHandoffText;
    mockHandoffText = null;
    return t;
  },
}));

describe('useCsvEditorWorkflow (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ReturnType<typeof useCsvEditorWorkflow>;

  const TestConsumer: React.FC<{ isFr?: boolean }> = ({ isFr = true }) => {
    hookValue = useCsvEditorWorkflow(isFr);
    return null;
  };

  const renderComponent = async (isFr = true) => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(TestConsumer, { isFr })
        )
      );
    });
  };

  beforeEach(() => {
    mockHandoffFile = null;
    mockHandoffText = null;
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

  it('starts in unready state with empty headers and rows', async () => {
    await renderComponent(true);
    expect(hookValue.table.isReady).toBe(false);
    expect(hookValue.table.headers).toEqual([]);
    expect(hookValue.table.rows).toEqual([]);
  });

  it('loads sample table via table.handleLoadSample', async () => {
    await renderComponent(true);

    act(() => {
      hookValue.table.handleLoadSample();
    });

    expect(hookValue.table.isReady).toBe(true);
    expect(hookValue.table.headers.length).toBeGreaterThan(0);
    expect(hookValue.table.rows.length).toBeGreaterThan(0);
    expect(hookValue.table.documentName).toBe('donnees_exemple');
  });

  it('creates blank table via table.handleStartBlank', async () => {
    await renderComponent(true);

    act(() => {
      hookValue.table.handleStartBlank();
    });

    expect(hookValue.table.isReady).toBe(true);
    expect(hookValue.table.headers).toHaveLength(4);
    expect(hookValue.table.rows).toHaveLength(5);
  });

  it('consumes handoff file on mount', async () => {
    const mockFile = new File(['Nom,Age\nAlice,30'], 'data.csv', { type: 'text/csv' });
    mockHandoffFile = mockFile;

    await renderComponent(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(hookValue.table.isReady).toBe(true);
    expect(hookValue.table.headers).toEqual(['Nom', 'Age']);
    expect(hookValue.table.rows).toEqual([['Alice', '30']]);
  });

  it('consumes handoff text on mount when available', async () => {
    mockHandoffText = 'Produit,Prix\nLivre,15';

    await renderComponent(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(hookValue.table.isReady).toBe(true);
    expect(hookValue.table.headers).toEqual(['Produit', 'Prix']);
    expect(hookValue.table.rows).toEqual([['Livre', '15']]);
  });

  it('resets state when handleReset is called', async () => {
    await renderComponent(true);

    act(() => {
      hookValue.table.handleLoadSample();
    });
    expect(hookValue.table.isReady).toBe(true);

    act(() => {
      hookValue.handleReset();
    });

    expect(hookValue.table.isReady).toBe(false);
    expect(hookValue.table.headers).toEqual([]);
    expect(hookValue.table.rows).toEqual([]);
  });
});
