import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePasswordHistory } from '@/hooks/use-password-history';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePasswordHistory (TDD RED Phase)', () => {
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

  it('starts with initial password in history and cannot undo/redo initially', async () => {
    let hook!: ReturnType<typeof usePasswordHistory>;
    function Harness() {
      hook = usePasswordHistory('initial-secret-123');
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.currentPassword).toBe('initial-secret-123');
    expect(hook.canUndo).toBe(false);
    expect(hook.canRedo).toBe(false);
    expect(hook.historyList).toEqual(['initial-secret-123']);
  });

  it('records new passwords in history and enables undo', async () => {
    let hook!: ReturnType<typeof usePasswordHistory>;
    function Harness() {
      hook = usePasswordHistory('pwd-1');
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    await act(async () => {
      hook.pushPassword('pwd-2');
    });

    expect(hook.currentPassword).toBe('pwd-2');
    expect(hook.canUndo).toBe(true);
    expect(hook.canRedo).toBe(false);
    expect(hook.historyList).toEqual(['pwd-2', 'pwd-1']);
  });

  it('performs undo and redo sequentially', async () => {
    let hook!: ReturnType<typeof usePasswordHistory>;
    function Harness() {
      hook = usePasswordHistory('first');
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    await act(async () => {
      hook.pushPassword('second');
    });
    await act(async () => {
      hook.pushPassword('third');
    });

    expect(hook.currentPassword).toBe('third');
    expect(hook.canUndo).toBe(true);

    // Undo to second
    let undone: string | null = null;
    await act(async () => {
      undone = hook.undo();
    });
    expect(undone).toBe('second');
    expect(hook.currentPassword).toBe('second');
    expect(hook.canUndo).toBe(true);
    expect(hook.canRedo).toBe(true);

    // Undo to first
    await act(async () => {
      undone = hook.undo();
    });
    expect(undone).toBe('first');
    expect(hook.currentPassword).toBe('first');
    expect(hook.canUndo).toBe(false);
    expect(hook.canRedo).toBe(true);

    // Redo to second
    let redone: string | null = null;
    await act(async () => {
      redone = hook.redo();
    });
    expect(redone).toBe('second');
    expect(hook.currentPassword).toBe('second');
    expect(hook.canUndo).toBe(true);
    expect(hook.canRedo).toBe(true);
  });

  it('drops redo branch when a new password is added after undo', async () => {
    let hook!: ReturnType<typeof usePasswordHistory>;
    function Harness() {
      hook = usePasswordHistory('a');
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    await act(async () => {
      hook.pushPassword('b');
    });
    await act(async () => {
      hook.pushPassword('c');
    });

    await act(async () => {
      hook.undo(); // back to b
    });
    expect(hook.currentPassword).toBe('b');

    await act(async () => {
      hook.pushPassword('d'); // new branch
    });

    expect(hook.currentPassword).toBe('d');
    expect(hook.canRedo).toBe(false); // c is gone
    expect(hook.canUndo).toBe(true);

    await act(async () => {
      hook.undo();
    });
    expect(hook.currentPassword).toBe('b');
  });

  it('ignores duplicate sequential pushes', async () => {
    let hook!: ReturnType<typeof usePasswordHistory>;
    function Harness() {
      hook = usePasswordHistory('same');
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    await act(async () => {
      hook.pushPassword('same');
    });

    expect(hook.historyList).toEqual(['same']);
    expect(hook.canUndo).toBe(false);
  });
});
