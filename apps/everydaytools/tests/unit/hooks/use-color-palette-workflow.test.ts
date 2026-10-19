import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useColorPaletteWorkflow } from '@/hooks/use-color-palette-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

let mockHandoffText: string | null = null;
vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffText: () => {
    const val = mockHandoffText;
    mockHandoffText = null;
    return val;
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useColorPaletteWorkflow', () => {
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

  it('initializes with default trending palette of 5 colors', async () => {
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.mode).toBe('trending');
    expect(hook.count).toBe(5);
    expect(hook.palette).toHaveLength(5);
    expect(hook.format).toBe('hex');
    expect(hook.lockedCount).toBe(0);
    expect(hook.canUndo).toBe(false);
    expect(hook.canRedo).toBe(false);
  });

  it('supports undo and redo when regenerating palette', async () => {
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(false);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const initialHexes = hook.palette.map((c) => c.hex);

    act(() => {
      hook.handleRegenerate();
    });

    expect(hook.canUndo).toBe(true);
    const newHexes = hook.palette.map((c) => c.hex);
    expect(newHexes).not.toEqual(initialHexes);

    act(() => {
      hook.handleUndo();
    });

    expect(hook.palette.map((c) => c.hex)).toEqual(initialHexes);
    expect(hook.canRedo).toBe(true);

    act(() => {
      hook.handleRedo();
    });

    expect(hook.palette.map((c) => c.hex)).toEqual(newHexes);
  });

  it('allows locking a color which is preserved during regeneration', async () => {
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.toggleLock(1);
    });

    expect(hook.palette[1].isLocked).toBe(true);
    expect(hook.lockedCount).toBe(1);
    const lockedHex = hook.palette[1].hex;

    act(() => {
      hook.handleRegenerate();
    });

    expect(hook.palette[1].hex).toBe(lockedHex);
    expect(hook.palette[1].isLocked).toBe(true);
  });

  it('converts color values correctly across hex, rgb and hsl formats', async () => {
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const firstColor = hook.palette[0];

    const hexVal = hook.getColorValue(firstColor);
    expect(hexVal).toMatch(/^#[0-9A-F]{6}$/i);

    act(() => {
      hook.setFormat('rgb');
    });

    const rgbVal = hook.getColorValue(firstColor);
    expect(rgbVal).toContain('rgb(');

    act(() => {
      hook.setFormat('hsl');
    });

    const hslVal = hook.getColorValue(firstColor);
    expect(hslVal).toContain('hsl(');
  });

  it('adjusts lightness and updates custom hex', async () => {
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleCustomHexChange(0, '#123456');
    });

    expect(hook.palette[0].hex.toLowerCase()).toBe('#123456');

    act(() => {
      hook.handleAdjustLightness(0, 10);
    });

    expect(hook.palette[0].hex.toLowerCase()).not.toBe('#123456');
    expect(hook.canUndo).toBe(true);
  });

  it('consumes handoff text with hex colors on mount', async () => {
    mockHandoffText = '#3b82f6, #10b981, #f59e0b';
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.palette.length).toBe(3);
    expect(hook.palette[0].hex.toLowerCase()).toBe('#3b82f6');
    expect(hook.palette[1].hex.toLowerCase()).toBe('#10b981');
    expect(hook.palette[2].hex.toLowerCase()).toBe('#f59e0b');
  });

  it('guarantees minimum 3 colors when handoff text contains fewer than 3 colors', async () => {
    mockHandoffText = '#8b5cf6';
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.palette.length).toBeGreaterThanOrEqual(3);
    expect(hook.count).toBeGreaterThanOrEqual(3);
    expect(hook.palette[0].hex.toLowerCase()).toBe('#8b5cf6');
  });

  it('caps history without off-by-one or resetting to history[0] after 35 changes', async () => {
    let hook!: ReturnType<typeof useColorPaletteWorkflow>;
    function Harness() {
      hook = useColorPaletteWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    for (let i = 0; i < 35; i++) {
      act(() => {
        hook.handleRegenerate();
      });
    }

    // Palette should NOT be undefined and should not fall back to history[0] incorrectly
    expect(hook.palette).toBeDefined();
    expect(hook.palette.length).toBe(5);
    expect(hook.canUndo).toBe(true);
    expect(hook.canRedo).toBe(false);

    // Locking should continue to work
    act(() => {
      hook.toggleLock(0);
    });
    expect(hook.palette[0].isLocked).toBe(true);
  });
});
