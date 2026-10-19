import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useDiffCheckerWorkflow } from '@/hooks/use-diff-checker-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useDiffCheckerWorkflow', () => {
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

  it('initializes with empty text and default edit mode', async () => {
    let hook!: ReturnType<typeof useDiffCheckerWorkflow>;
    function Harness() {
      hook = useDiffCheckerWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.textA).toBe('');
    expect(hook.textB).toBe('');
    expect(hook.viewMode).toBe('edit');
    expect(hook.hasContent).toBe(false);
  });

  it('loads sample datasets and switches to split view', async () => {
    let hook!: ReturnType<typeof useDiffCheckerWorkflow>;
    function Harness() {
      hook = useDiffCheckerWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    await act(async () => {
      hook.loadSample('text');
    });

    expect(hook.textA).toContain('Le développement web moderne');
    expect(hook.textB).toContain('accessibilité irréprochable');
    expect(hook.viewMode).toBe('split');
    expect(hook.hasContent).toBe(true);
  });

  it('swaps textA and textB when handleSwap is called', async () => {
    let hook!: ReturnType<typeof useDiffCheckerWorkflow>;
    function Harness() {
      hook = useDiffCheckerWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    await act(async () => {
      hook.handleUpdateOriginal('First');
      hook.handleUpdateModified('Second');
    });

    await act(async () => {
      hook.handleSwap();
    });

    expect(hook.textA).toBe('Second');
    expect(hook.textB).toBe('First');
  });

  it('throttles rapid typing so intermediate single-character states do not flood history', async () => {
    let hook!: ReturnType<typeof useDiffCheckerWorkflow>;
    function Harness() {
      hook = useDiffCheckerWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    await act(async () => {
      hook.handleUpdateOriginal('h');
      hook.handleUpdateOriginal('he');
      hook.handleUpdateOriginal('hel');
      hook.handleUpdateOriginal('hello');
    });

    // Rapid keystrokes within 1000ms threshold should not push 4 separate entries
    expect(hook.history.length).toBeLessThanOrEqual(2);
  });
});
