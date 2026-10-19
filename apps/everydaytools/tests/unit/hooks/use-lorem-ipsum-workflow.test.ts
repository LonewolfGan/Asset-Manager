import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useLoremIpsumWorkflow } from '@/hooks/use-lorem-ipsum-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

describe('useLoremIpsumWorkflow', () => {
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

  it('initializes with default settings (paragraphs, count 3, classic flavor, plain format, startWithClassic true)', async () => {
    let hook!: ReturnType<typeof useLoremIpsumWorkflow>;
    function Harness() {
      hook = useLoremIpsumWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.unit).toBe('paragraphs');
    expect(hook.count).toBe(3);
    expect(hook.flavor).toBe('classic');
    expect(hook.format).toBe('plain');
    expect(hook.startWithClassic).toBe(true);
    expect(hook.blocks).toHaveLength(3);
    expect(hook.fullText).toContain('Lorem ipsum dolor sit amet');
  });

  it('updates unit and clamps count accordingly', async () => {
    let hook!: ReturnType<typeof useLoremIpsumWorkflow>;
    function Harness() {
      hook = useLoremIpsumWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleUnitSelect('words');
    });
    expect(hook.unit).toBe('words');
    expect(hook.count).toBeGreaterThanOrEqual(15);

    act(() => {
      hook.handleUnitSelect('paragraphs');
    });
    expect(hook.unit).toBe('paragraphs');
    expect(hook.count).toBeLessThanOrEqual(20);
  });

  it('increments and decrements count via handleCountChange', async () => {
    let hook!: ReturnType<typeof useLoremIpsumWorkflow>;
    function Harness() {
      hook = useLoremIpsumWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleCountChange(2);
    });
    expect(hook.count).toBe(5);

    act(() => {
      hook.handleCountChange(-3);
    });
    expect(hook.count).toBe(2);
  });

  it('supports format switching to html, markdown, and json', async () => {
    let hook!: ReturnType<typeof useLoremIpsumWorkflow>;
    function Harness() {
      hook = useLoremIpsumWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.setFormat('html');
    });
    expect(hook.format).toBe('html');
    expect(hook.fullText).toContain('<p>');

    act(() => {
      hook.setFormat('json');
    });
    expect(hook.format).toBe('json');
    const parsed = JSON.parse(hook.fullText);
    expect(Array.isArray(parsed)).toBe(true);

    act(() => {
      hook.setFormat('markdown');
    });
    expect(hook.format).toBe('markdown');
  });

  it('supports toggling startWithClassic', async () => {
    let hook!: ReturnType<typeof useLoremIpsumWorkflow>;
    function Harness() {
      hook = useLoremIpsumWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.setStartWithClassic(false);
    });
    expect(hook.startWithClassic).toBe(false);
  });

  it('regenerates text and triggers refreshing animation state', async () => {
    vi.useFakeTimers();
    let hook!: ReturnType<typeof useLoremIpsumWorkflow>;
    function Harness() {
      hook = useLoremIpsumWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleRegenerate();
    });
    expect(hook.isRefreshing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(hook.isRefreshing).toBe(false);
    vi.useRealTimers();
  });

  it('handles rapid consecutive regenerations safely', async () => {
    vi.useFakeTimers();
    let hook!: ReturnType<typeof useLoremIpsumWorkflow>;
    function Harness() {
      hook = useLoremIpsumWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleRegenerate();
      hook.handleRegenerate();
    });
    expect(hook.isRefreshing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(hook.isRefreshing).toBe(false);
    vi.useRealTimers();
  });
});
