import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useWordCounterWorkflow } from '@/hooks/use-word-counter-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

let mockHandoffText: string | null = null;
vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffFile: () => null,
  consumeHandoffText: () => {
    const val = mockHandoffText;
    mockHandoffText = null;
    return val;
  },
}));

describe('useWordCounterWorkflow', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
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

  it('initializes with empty text and computes zero stats', async () => {
    let hook!: ReturnType<typeof useWordCounterWorkflow>;
    function Harness() {
      hook = useWordCounterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.text).toBe('');
    expect(hook.stats.words).toBe(0);
    expect(hook.stats.characters).toBe(0);
    expect(hook.undoStack.length).toBe(0);
  });

  it('updates text via handleTextChange and computes real-time stats', async () => {
    let hook!: ReturnType<typeof useWordCounterWorkflow>;
    function Harness() {
      hook = useWordCounterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleTextChange('Bonjour le monde. Ceci est un test de comptage.');
    });

    expect(hook.text).toBe('Bonjour le monde. Ceci est un test de comptage.');
    expect(hook.stats.words).toBe(9);
    expect(hook.stats.sentences).toBe(2);
  });

  it('throttles rapid keystrokes in undoStack', async () => {
    let hook!: ReturnType<typeof useWordCounterWorkflow>;
    function Harness() {
      hook = useWordCounterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    // Rapid typing without 1000ms pause
    act(() => {
      hook.handleTextChange('H');
    });
    act(() => {
      hook.handleTextChange('He');
    });
    act(() => {
      hook.handleTextChange('Hel');
    });
    act(() => {
      hook.handleTextChange('Hello');
    });

    // Only initial empty text should be in undoStack
    expect(hook.undoStack.length).toBe(1);
    expect(hook.undoStack[0]).toBe('');

    // Trigger undo
    act(() => {
      hook.handleUndo();
    });
    expect(hook.text).toBe('');
    expect(hook.redoStack).toContain('Hello');
  });

  it('transforms case and pushes immediately to history', async () => {
    let hook!: ReturnType<typeof useWordCounterWorkflow>;
    function Harness() {
      hook = useWordCounterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleTextChange('super projet');
    });

    act(() => {
      hook.handleTransformCase('upper');
    });

    expect(hook.text).toBe('SUPER PROJET');
    expect(hook.undoStack[hook.undoStack.length - 1]).toBe('super projet');
  });

  it('consumes handoff text on mount if available', async () => {
    mockHandoffText = 'Texte transmis via handoff inter-outils';
    let hook!: ReturnType<typeof useWordCounterWorkflow>;
    function Harness() {
      hook = useWordCounterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.text).toBe('Texte transmis via handoff inter-outils');
    expect(hook.stats.words).toBe(5);
  });

  it('loads sample text via handleLoadSample', async () => {
    let hook!: ReturnType<typeof useWordCounterWorkflow>;
    function Harness() {
      hook = useWordCounterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleLoadSample('editorial');
    });

    expect(hook.text.length).toBeGreaterThan(50);
    expect(hook.stats.words).toBeGreaterThan(10);
  });
});
