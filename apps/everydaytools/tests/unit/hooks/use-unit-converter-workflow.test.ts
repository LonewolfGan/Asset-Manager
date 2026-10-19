import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useUnitConverterWorkflow } from '@/hooks/use-unit-converter-workflow';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

let mockHandoffText: string | null = null;
vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffText: () => {
    const val = mockHandoffText;
    mockHandoffText = null;
    return val;
  },
  consumeHandoffFile: () => null,
}));

describe('useUnitConverterWorkflow with Modern Awwwards Standards (TDD RED Phase)', () => {
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

  it('initializes with default length category, fromValue=1 and accurate conversion', async () => {
    let hook!: ReturnType<typeof useUnitConverterWorkflow>;
    function Harness() {
      hook = useUnitConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.activeCategory).toBe('length');
    expect(hook.fromValue).toBe('1');
    expect(hook.toValue).toBe('0.001'); // 1 meter = 0.001 km
    expect(hook.fromDef.symbol).toBe('m');
    expect(hook.toDef.symbol).toBe('km');
  });

  it('consumes handoff text on mount when a numeric payload is provided', async () => {
    mockHandoffText = '42.5';
    let hook!: ReturnType<typeof useUnitConverterWorkflow>;
    function Harness() {
      hook = useUnitConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.fromValue).toBe('42.5');
    expect(hook.toValue).toBe('0.0425');
  });

  it('swaps units bidirectionally and maintains value symmetry', async () => {
    let hook!: ReturnType<typeof useUnitConverterWorkflow>;
    function Harness() {
      hook = useUnitConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    await act(async () => {
      hook.handleFromChange('1000');
    });
    expect(hook.toValue).toBe('1');

    await act(async () => {
      hook.handleSwap();
    });

    // After swap: from km to m, fromValue = 1, toValue = 1,000
    expect(hook.fromDef.symbol).toBe('km');
    expect(hook.toDef.symbol).toBe('m');
    expect(hook.fromValue).toBe('1');
    expect(hook.toValue).toBe('1,000');

    // Swap back: fromValue becomes '1,000' (with comma separator)
    await act(async () => {
      hook.handleSwap();
    });
    // From m to km, 1,000 m should convert to 1 km without thousand-separator truncation
    expect(hook.fromDef.symbol).toBe('m');
    expect(hook.toDef.symbol).toBe('km');
    expect(hook.toValue).toBe('1');
  });

  it('exposes quick popular conversion presets for current category', async () => {
    let hook!: ReturnType<typeof useUnitConverterWorkflow>;
    function Harness() {
      hook = useUnitConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.popularPresets).toBeDefined();
    expect(hook.popularPresets.length).toBeGreaterThanOrEqual(3);

    // Apply first preset
    const preset = hook.popularPresets[0];
    await act(async () => {
      hook.applyPopularPreset(preset);
    });

    expect(hook.fromUnit).toBe(preset.fromUnit);
    expect(hook.toUnit).toBe(preset.toUnit);
  });
});
