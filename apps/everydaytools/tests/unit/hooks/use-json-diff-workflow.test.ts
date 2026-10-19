import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useJsonDiffWorkflow } from '@/hooks/use-json-diff-workflow';
import { DEFAULT_LEFT, DEFAULT_RIGHT } from '@/lib/json-diff-aligned-logic';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useJsonDiffWorkflow Hook (TDD)', () => {
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

  it('initializes with default payloads and computes deltas', async () => {
    let hook!: ReturnType<typeof useJsonDiffWorkflow>;

    function Harness() {
      hook = useJsonDiffWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.inputLeft).toBe(DEFAULT_LEFT);
    expect(hook.inputRight).toBe(DEFAULT_RIGHT);
    expect(hook.parseLeft.ok).toBe(true);
    expect(hook.parseRight.ok).toBe(true);
    expect(hook.deltas.length).toBeGreaterThan(0);
    expect(hook.metrics.added).toBeGreaterThan(0);

    // Swap
    await act(async () => {
      hook.handleSwap();
    });
    expect(hook.inputLeft).toBe(DEFAULT_RIGHT);
    expect(hook.inputRight).toBe(DEFAULT_LEFT);

    // Clear
    await act(async () => {
      hook.handleClear();
    });
    expect(hook.inputLeft).toBe('');
    expect(hook.inputRight).toBe('');
    expect(hook.hasBothInputs).toBe(false);

    // Load sample when empty
    await act(async () => {
      hook.handleLoadSample();
    });
    expect(hook.inputLeft).toBe(DEFAULT_LEFT);
    expect(hook.inputRight).toBe(DEFAULT_RIGHT);
    expect(hook.hasBothInputs).toBe(true);

    // getDiffSummary
    const summary = hook.getDiffSummary();
    expect(summary).toContain('Diff JSON');
    expect(summary).toContain('ajouts');
  });

  it('handles auto-repair on malformed left and right inputs', async () => {
    let hook!: ReturnType<typeof useJsonDiffWorkflow>;

    function Harness() {
      hook = useJsonDiffWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    // Set malformed input on left
    await act(async () => {
      hook.setInputLeft("{ 'unquotedKey': 'val', }");
    });
    expect(hook.parseLeft.ok).toBe(false);

    await act(async () => {
      hook.handleAutoRepairA();
    });
    expect(hook.parseLeft.ok).toBe(true);
  });
});
