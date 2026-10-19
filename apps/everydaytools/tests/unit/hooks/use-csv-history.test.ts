import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useCsvHistory } from '@/hooks/use-csv-history';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useCsvHistory (TDD RED-GREEN)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ReturnType<typeof useCsvHistory>;

  let headers = ['A', 'B'];
  let rows = [['1', '2']];
  let docName = 'test';

  const setHeaders = vi.fn((newHeaders) => {
    headers = newHeaders;
  });
  const setRows = vi.fn((newRows) => {
    rows = newRows;
  });
  const setDocumentName = vi.fn((newName) => {
    docName = newName;
  });

  const TestConsumer: React.FC = () => {
    hookValue = useCsvHistory({
      headers,
      rows,
      documentName: docName,
      setHeaders,
      setRows,
      setDocumentName,
      isFr: true,
    });
    return null;
  };

  beforeEach(() => {
    headers = ['A', 'B'];
    rows = [['1', '2']];
    docName = 'test';
    setHeaders.mockClear();
    setRows.mockClear();
    setDocumentName.mockClear();
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

  it('saves snapshot and performs undo/redo', async () => {
    await renderComponent();

    // Initial state: empty history and future
    expect(hookValue.history.length).toBe(0);
    expect(hookValue.future.length).toBe(0);

    // Save snapshot
    act(() => {
      hookValue.saveSnapshot();
    });
    expect(hookValue.history.length).toBe(1);

    // Perform undo
    act(() => {
      hookValue.handleUndo();
    });
    expect(hookValue.history.length).toBe(0);
    expect(hookValue.future.length).toBe(1);

    // Perform redo
    act(() => {
      hookValue.handleRedo();
    });
    expect(hookValue.history.length).toBe(1);
    expect(hookValue.future.length).toBe(0);
  });

  it('triggers undo toast notification', async () => {
    await renderComponent();

    act(() => {
      hookValue.triggerUndoToast('Ligne 1 supprimée');
    });

    expect(hookValue.undoNotification).not.toBeNull();
    expect(hookValue.undoNotification?.message).toBe('Ligne 1 supprimée');
  });

  it('handles Ctrl+Shift+Z keyboard shortcuts without interfering with inputs', async () => {
    await renderComponent();

    act(() => {
      hookValue.saveSnapshot();
      hookValue.handleUndo();
    });
    expect(hookValue.future.length).toBe(1);

    // Create an input and focus it
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    // Fire Ctrl+Shift+Z while input is active - should NOT redo
    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    // Unfocus input and fire again
    input.blur();
    input.remove();

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
    });

    expect(hookValue.future.length).toBe(0);
  });
});
