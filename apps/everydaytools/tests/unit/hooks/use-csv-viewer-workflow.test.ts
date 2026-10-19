import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useCsvViewerWorkflow } from '@/hooks/use-csv-viewer-workflow';
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

describe('useCsvViewerWorkflow (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ReturnType<typeof useCsvViewerWorkflow>;

  const TestConsumer: React.FC<{ isFr?: boolean }> = ({ isFr = true }) => {
    hookValue = useCsvViewerWorkflow({ isFr });
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
    vi.restoreAllMocks();
  });

  it('initializes with default empty state', async () => {
    await renderComponent();
    expect(hookValue.isReady).toBe(false);
    expect(hookValue.headers).toEqual([]);
    expect(hookValue.rows).toEqual([]);
    expect(hookValue.inputMode).toBe('file');
    expect(hookValue.error).toBeNull();
  });

  it('loads sample data and transitions to ready state', async () => {
    await renderComponent(true);

    act(() => {
      hookValue.handleLoadSample();
    });

    expect(hookValue.isReady).toBe(true);
    expect(hookValue.headers.length).toBeGreaterThan(0);
    expect(hookValue.rows.length).toBeGreaterThan(0);
    expect(hookValue.documentName).toContain('equipe_et_performances');
  });

  it('parses raw text on paste submit', async () => {
    await renderComponent(true);

    act(() => {
      hookValue.setRawText('Nom,Ville,Age\nAlice,Paris,30\nBob,Lyon,25');
    });

    act(() => {
      hookValue.handlePasteSubmit();
    });

    expect(hookValue.isReady).toBe(true);
    expect(hookValue.headers).toEqual(['Nom', 'Ville', 'Age']);
    expect(hookValue.rows.length).toBe(2);
    expect(hookValue.detectedDelimiter).toBe(',');
  });

  it('resets state when handleReset is called', async () => {
    await renderComponent(true);

    act(() => {
      hookValue.handleLoadSample();
    });
    expect(hookValue.isReady).toBe(true);

    act(() => {
      hookValue.handleReset();
    });

    expect(hookValue.isReady).toBe(false);
    expect(hookValue.headers).toEqual([]);
    expect(hookValue.rows).toEqual([]);
  });

  it('consumes handoff file on mount if available', async () => {
    const mockFile = new File(['ColA,ColB\n1,2'], 'handoff.csv', { type: 'text/csv' });
    mockHandoffFile = mockFile;

    await renderComponent(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(hookValue.isReady).toBe(true);
    expect(hookValue.headers).toEqual(['ColA', 'ColB']);
    expect(hookValue.rows).toEqual([['1', '2']]);
  });

  it('consumes handoff text on mount if available', async () => {
    mockHandoffText = 'Produit,Prix,Stock\nClavier,49.99,15\nSouris,29.99,40';

    await renderComponent(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(hookValue.isReady).toBe(true);
    expect(hookValue.headers).toEqual(['Produit', 'Prix', 'Stock']);
    expect(hookValue.rows.length).toBe(2);
  });
});
