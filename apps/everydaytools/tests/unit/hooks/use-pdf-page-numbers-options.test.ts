import { describe, it, expect, beforeEach, afterEach } from 'vitest';
// TDD RED Phase: use-pdf-page-numbers-options hook tests
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  usePdfPageNumbersOptions,
  type UsePdfPageNumbersOptionsProps,
} from '@/hooks/use-pdf-page-numbers-options';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfPageNumbersOptions (Unit Test)', () => {
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

  function renderHook(props?: UsePdfPageNumbersOptionsProps) {
    let hookValue!: ReturnType<typeof usePdfPageNumbersOptions>;
    function TestComponent() {
      hookValue = usePdfPageNumbersOptions(props);
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

  it('initializes with default page numbering options', () => {
    const hook = renderHook();

    expect(hook.current.position).toBe('bottom-center');
    expect(hook.current.format).toBe('{n} / {total}');
    expect(hook.current.startFrom).toBe(1);
    expect(hook.current.skipFirst).toBe(false);
    expect(hook.current.fontSize).toBe(11);
    expect(hook.current.margin).toBe(36);
    expect(hook.current.color).toBe('#000000');
    expect(hook.current.isValid).toBe(true);
  });

  it('updates position, format, startFrom, skipFirst, fontSize, margin, and color', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setPosition('top-right');
      hook.current.setFormat('{roman}');
      hook.current.setStartFrom(5);
      hook.current.setSkipFirst(true);
      hook.current.setFontSize(14);
      hook.current.setMargin(48);
      hook.current.setColor('#333333');
    });

    expect(hook.current.position).toBe('top-right');
    expect(hook.current.format).toBe('{roman}');
    expect(hook.current.startFrom).toBe(5);
    expect(hook.current.skipFirst).toBe(true);
    expect(hook.current.fontSize).toBe(14);
    expect(hook.current.margin).toBe(48);
    expect(hook.current.color).toBe('#333333');
    expect(hook.current.isValid).toBe(true);
  });

  it('toggles skipFirst cleanly via toggleSkipFirst helper', () => {
    const hook = renderHook();
    expect(hook.current.skipFirst).toBe(false);

    act(() => {
      hook.current.toggleSkipFirst();
    });
    expect(hook.current.skipFirst).toBe(true);

    act(() => {
      hook.current.toggleSkipFirst();
    });
    expect(hook.current.skipFirst).toBe(false);
  });

  it('marks isValid as false when format is empty or startFrom < 1 or fontSize <= 0', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setFormat('   ');
    });
    expect(hook.current.isValid).toBe(false);

    act(() => {
      hook.current.setFormat('{n}');
      hook.current.setStartFrom(0);
    });
    expect(hook.current.isValid).toBe(false);

    act(() => {
      hook.current.setStartFrom(1);
      hook.current.setFontSize(0);
    });
    expect(hook.current.isValid).toBe(false);
  });

  it('respects initial option overrides via props', () => {
    const hook = renderHook({
      initialPosition: 'top-center',
      initialFormat: 'Page {n} of {total}',
      initialStartFrom: 3,
      initialSkipFirst: true,
      initialFontSize: 12,
      initialMargin: 24,
      initialColor: '#1A1A1A',
    });

    expect(hook.current.position).toBe('top-center');
    expect(hook.current.format).toBe('Page {n} of {total}');
    expect(hook.current.startFrom).toBe(3);
    expect(hook.current.skipFirst).toBe(true);
    expect(hook.current.fontSize).toBe(12);
    expect(hook.current.margin).toBe(24);
    expect(hook.current.color).toBe('#1A1A1A');
  });

  it('resets options cleanly back to initial default state', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setPosition('bottom-left');
      hook.current.setFormat('{n}');
      hook.current.setStartFrom(10);
      hook.current.setSkipFirst(true);
      hook.current.setFontSize(16);
      hook.current.setMargin(50);
      hook.current.setColor('#FF0000');
    });

    act(() => {
      hook.current.resetOptions();
    });

    expect(hook.current.position).toBe('bottom-center');
    expect(hook.current.format).toBe('{n} / {total}');
    expect(hook.current.startFrom).toBe(1);
    expect(hook.current.skipFirst).toBe(false);
    expect(hook.current.fontSize).toBe(11);
    expect(hook.current.margin).toBe(36);
    expect(hook.current.color).toBe('#000000');
    expect(hook.current.isValid).toBe(true);
  });
});
