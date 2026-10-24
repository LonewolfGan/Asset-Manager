import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfRotateOptions } from '@/hooks/use-pdf-rotate-options';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfRotateOptions (Unit Test)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => { root.unmount(); });
    container.remove();
  });

  function renderHook(totalPages = 4) {
    let hookValue!: ReturnType<typeof usePdfRotateOptions>;
    function TestComponent() {
      hookValue = usePdfRotateOptions(totalPages);
      return null;
    }
    act(() => { root.render(React.createElement(TestComponent)); });
    return {
      get current() { return hookValue; },
    };
  }

  it('initializes with empty selections and zero rotations', () => {
    const hook = renderHook(4);
    expect(hook.current.pageRotations).toEqual({});
    expect(hook.current.selectedPages).toEqual([]);
    expect(hook.current.modifiedPagesCount).toBe(0);
  });

  it('handles page selection patterns: selectAll, selectOdd, selectEven, toggle, clear', () => {
    const hook = renderHook(4);

    act(() => { hook.current.selectAllPages(); });
    expect(hook.current.selectedPages).toEqual([1, 2, 3, 4]);

    act(() => { hook.current.selectOddPages(); });
    expect(hook.current.selectedPages).toEqual([1, 3]);

    act(() => { hook.current.selectEvenPages(); });
    expect(hook.current.selectedPages).toEqual([2, 4]);

    act(() => { hook.current.toggleSelectPage(2); });
    expect(hook.current.selectedPages).toEqual([4]);

    act(() => { hook.current.clearSelection(); });
    expect(hook.current.selectedPages).toEqual([]);
  });

  it('applies rotation delta to single page, selected pages, and all pages', () => {
    const hook = renderHook(4);

    act(() => { hook.current.rotateSinglePage(1, 90); });
    expect(hook.current.pageRotations).toEqual({ 0: 90 });
    expect(hook.current.modifiedPagesCount).toBe(1);

    act(() => {
      hook.current.setSelectedPages([2, 3]);
    });
    act(() => {
      hook.current.rotateSelectedPages(180);
    });
    expect(hook.current.pageRotations[1]).toBe(180);
    expect(hook.current.pageRotations[2]).toBe(180);

    act(() => { hook.current.rotateAllPages(90); });
    expect(hook.current.pageRotations).toEqual({ 0: 180, 1: 270, 2: 270, 3: 90 });
    expect(hook.current.modifiedPagesCount).toBe(4);
  });

  it('normalizes 360-degree rotations back to 0 and removes from map', () => {
    const hook = renderHook(2);
    act(() => { hook.current.rotateSinglePage(1, 270); });
    expect(hook.current.pageRotations[0]).toBe(270);

    act(() => { hook.current.rotateSinglePage(1, 90); });
    expect(hook.current.pageRotations[0]).toBeUndefined();
    expect(hook.current.modifiedPagesCount).toBe(0);
  });

  it('resets rotations and selections cleanly', () => {
    const hook = renderHook(3);
    act(() => {
      hook.current.rotateSinglePage(1, 90);
      hook.current.setSelectedPages([1, 2]);
    });

    act(() => { hook.current.resetOptions(); });
    expect(hook.current.pageRotations).toEqual({});
    expect(hook.current.selectedPages).toEqual([]);
    expect(hook.current.modifiedPagesCount).toBe(0);
  });
});
