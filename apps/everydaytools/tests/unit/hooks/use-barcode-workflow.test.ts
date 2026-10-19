import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useBarcodeWorkflow } from '@/hooks/use-barcode-workflow';

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

vi.mock('jsbarcode', () => ({
  default: vi.fn(),
}));

describe('useBarcodeWorkflow', () => {
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

  it('initializes with default EAN-13, valid barcode and non-pure-black ink', async () => {
    let hook!: ReturnType<typeof useBarcodeWorkflow>;
    function Harness() {
      hook = useBarcodeWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.symbologyId).toBe('EAN13');
    expect(hook.value).toBe('4006381333931');
    expect(hook.validation.isValid).toBe(true);
    expect(hook.history.length).toBe(0);
    // Absolute Zero prohibition: Zero Pure Black #000000
    expect(hook.inkColor).not.toBe('#000000');
  });

  it('throttles rapid keystrokes in history', async () => {
    let hook!: ReturnType<typeof useBarcodeWorkflow>;
    function Harness() {
      hook = useBarcodeWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    // Rapid typing without 1000ms delay
    act(() => {
      hook.handleValueChange('400638133393');
    });
    act(() => {
      hook.handleValueChange('40063813339');
    });
    act(() => {
      hook.handleValueChange('4006381333');
    });

    // Should only have 1 snapshot pushed due to throttling
    expect(hook.history.length).toBe(1);
    expect(hook.value).toBe('4006381333');
  });

  it('supports undo and redo transitions', async () => {
    let hook!: ReturnType<typeof useBarcodeWorkflow>;
    function Harness() {
      hook = useBarcodeWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleValueChange('1234567890128');
    });

    expect(hook.value).toBe('1234567890128');

    act(() => {
      hook.handleUndo();
    });

    expect(hook.value).toBe('4006381333931');
    expect(hook.redoStack.length).toBe(1);

    act(() => {
      hook.handleRedo();
    });

    expect(hook.value).toBe('1234567890128');
  });

  it('consumes handoff text on mount', async () => {
    mockHandoffText = '9780201379624';
    let hook!: ReturnType<typeof useBarcodeWorkflow>;
    function Harness() {
      hook = useBarcodeWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.value).toBe('9780201379624');
  });

  it('switches symbology and resets value to sample', async () => {
    let hook!: ReturnType<typeof useBarcodeWorkflow>;
    function Harness() {
      hook = useBarcodeWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const code128 = hook.symbologies.find((s) => s.id === 'CODE128')!;
    act(() => {
      hook.handleSelectSymbology(code128);
    });

    expect(hook.symbologyId).toBe('CODE128');
    expect(hook.value).toBe('SHIP-2026-X88');
    expect(hook.validation.isValid).toBe(true);
  });

  it('restores parent symbology alongside value during Undo and Redo', async () => {
    let hook!: ReturnType<typeof useBarcodeWorkflow>;
    function Harness() {
      hook = useBarcodeWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    // Initial state: EAN13
    expect(hook.symbologyId).toBe('EAN13');

    // Switch to CODE128
    const code128 = hook.symbologies.find((s) => s.id === 'CODE128')!;
    act(() => {
      hook.handleSelectSymbology(code128);
    });
    expect(hook.symbologyId).toBe('CODE128');

    // Switch to Pharmacode
    const pharma = hook.symbologies.find((s) => s.id === 'pharmacode')!;
    act(() => {
      hook.handleSelectSymbology(pharma);
    });
    expect(hook.symbologyId).toBe('pharmacode');

    // Undo should restore CODE128 symbology, not leave Pharmacode active
    act(() => {
      hook.handleUndo();
    });
    expect(hook.symbologyId).toBe('CODE128');
    expect(hook.value).toBe('SHIP-2026-X88');

    // Redo should restore Pharmacode symbology
    act(() => {
      hook.handleRedo();
    });
    expect(hook.symbologyId).toBe('pharmacode');
    expect(hook.value).toBe('12345');
  });

  it('sanitizes spaces in numeric symbologies before passing to JsBarcode and does not flood analytics', async () => {
    const jsbarcode = (await import('jsbarcode')).default;
    const { trackToolUsed } = await import('@/lib/analytics');
    vi.clearAllMocks();

    let hook!: ReturnType<typeof useBarcodeWorkflow>;
    function Harness() {
      hook = useBarcodeWorkflow(true);
      return React.createElement('svg', { ref: hook.svgRef });
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleValueChange('4006 3813 3393 1');
    });

    // JsBarcode should be called with stripped digits '4006381333931'
    expect(jsbarcode).toHaveBeenCalledWith(
      expect.anything(),
      '4006381333931',
      expect.anything()
    );

    // Render loop should NOT flood Plausible analytics
    expect(trackToolUsed).not.toHaveBeenCalledWith('barcode-generator', 'render');
  });
});
