import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfSplitOptions } from '@/hooks/use-pdf-split-options';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfSplitOptions (Unit Test)', () => {
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

  function renderHook(totalPages = 5) {
    let hookValue!: ReturnType<typeof usePdfSplitOptions>;
    function TestComponent() {
      hookValue = usePdfSplitOptions(totalPages);
      return null;
    }

    act(() => {
      root.render(React.createElement(TestComponent));
    });

    return {
      get current() {
        return hookValue;
      },
    };
  }

  it('initializes with default extract mode and empty selections', () => {
    const hook = renderHook(5);
    expect(hook.current.activeMode).toBe('extract');
    expect(hook.current.selectedPages).toEqual([]);
    expect(hook.current.canConvert).toBe(false);
    expect(hook.current.extractAsSinglePdf).toBe(true);
  });

  it('allows selecting pages and adding page ranges', () => {
    const hook = renderHook(5);

    act(() => {
      hook.current.setExtractRangeFrom(1);
      hook.current.setExtractRangeTo(3);
    });

    act(() => {
      hook.current.handleAddRange();
    });

    expect(hook.current.selectedPages).toEqual([1, 2, 3]);
    expect(hook.current.canConvert).toBe(true);
  });

  it('detects overlapping tranches when in split mode', () => {
    const hook = renderHook(10);

    act(() => {
      hook.current.setActiveMode('split');
      hook.current.setTranches([
        { id: 't1', from: 1, to: 4 },
        { id: 't2', from: 3, to: 6 },
      ]);
    });

    expect(hook.current.canConvert).toBe(true);
    expect(hook.current.overlappingTranchesInfo).not.toBeNull();
    expect(hook.current.overlappingTranchesInfo?.rangesText).toBe('3-4');
    expect(hook.current.overlappingTranchesInfo?.count).toBe(2);
  });

  it('resets options cleanly', () => {
    const hook = renderHook(5);

    act(() => {
      hook.current.setSelectedPages([1, 2]);
    });
    expect(hook.current.canConvert).toBe(true);

    act(() => {
      hook.current.resetOptions();
    });

    expect(hook.current.selectedPages).toEqual([]);
    expect(hook.current.canConvert).toBe(false);
  });
});
