import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

describe('useColorConverterWorkflow', () => {
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

  it('initializes with default color #1A6BFF and calculates derived models', async () => {
    let hook!: ReturnType<typeof useColorConverterWorkflow>;
    function Harness() {
      hook = useColorConverterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.hex).toBe('#1A6BFF');
    expect(hook.rgb).toEqual({ r: 26, g: 107, b: 255 });
    expect(hook.hsl.h).toBe(219);
    expect(hook.colorInput).toBe('#1A6BFF');
    expect(hook.formats.length).toBeGreaterThanOrEqual(6);
  });

  it('updates color via handleColorInputChange with hex string', async () => {
    let hook!: ReturnType<typeof useColorConverterWorkflow>;
    function Harness() {
      hook = useColorConverterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleColorInputChange('#059669');
    });

    expect(hook.hex).toBe('#059669');
    expect(hook.rgb).toEqual({ r: 5, g: 150, b: 105 });
  });

  it('updates color via updateRgb and manages recent colors', async () => {
    let hook!: ReturnType<typeof useColorConverterWorkflow>;
    function Harness() {
      hook = useColorConverterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.updateRgb({ r: 220, g: 38, b: 38 }, true, true);
    });

    expect(hook.hex).toBe('#DC2626');
    expect(hook.recentColors[0]).toBe('#DC2626');
  });

  it('generates random color via handleRandomColor', async () => {
    let hook!: ReturnType<typeof useColorConverterWorkflow>;
    function Harness() {
      hook = useColorConverterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const initialHex = hook.hex;
    act(() => {
      hook.handleRandomColor();
    });

    expect(hook.hex).toBeDefined();
    expect(hook.hex.startsWith('#')).toBe(true);
  });
});
