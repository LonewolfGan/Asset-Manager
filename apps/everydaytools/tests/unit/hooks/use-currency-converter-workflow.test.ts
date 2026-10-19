import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useCurrencyConverterWorkflow } from '@/hooks/use-currency-converter-workflow';
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

describe('useCurrencyConverterWorkflow (TDD RED-GREEN Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mockHandoffText = null;
    localStorage.clear();
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

  it('initializes with default USD to EUR and amount 100', async () => {
    let hook!: ReturnType<typeof useCurrencyConverterWorkflow>;
    function Harness() {
      hook = useCurrencyConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.fromCurrency).toBe('USD');
    expect(hook.toCurrency).toBe('EUR');
    expect(hook.amount).toBe('100');
    expect(hook.fromInfo.code).toBe('USD');
    expect(hook.toInfo.code).toBe('EUR');
  });

  it('consumes handoff text on mount when numeric payload arrives', async () => {
    mockHandoffText = '250.75';
    let hook!: ReturnType<typeof useCurrencyConverterWorkflow>;
    function Harness() {
      hook = useCurrencyConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.amount).toBe('250.75');
  });

  it('cleans comma and spaces when consuming handoff text', async () => {
    mockHandoffText = '1 250,50';
    let hook!: ReturnType<typeof useCurrencyConverterWorkflow>;
    function Harness() {
      hook = useCurrencyConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.amount).toBe('1250.50');
  });

  it('swaps currencies symmetrically using handleSwap', async () => {
    let hook!: ReturnType<typeof useCurrencyConverterWorkflow>;
    function Harness() {
      hook = useCurrencyConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.fromCurrency).toBe('USD');
    expect(hook.toCurrency).toBe('EUR');

    await act(async () => {
      hook.handleSwap();
    });

    expect(hook.fromCurrency).toBe('EUR');
    expect(hook.toCurrency).toBe('USD');
  });

  it('handles selecting pair cleanly via handleSelectPair', async () => {
    let hook!: ReturnType<typeof useCurrencyConverterWorkflow>;
    function Harness() {
      hook = useCurrencyConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    await act(async () => {
      hook.handleSelectPair('GBP', 'JPY');
    });

    expect(hook.fromCurrency).toBe('GBP');
    expect(hook.toCurrency).toBe('JPY');
  });

  it('avoids duplicate currencies when selecting target equal to source', async () => {
    let hook!: ReturnType<typeof useCurrencyConverterWorkflow>;
    function Harness() {
      hook = useCurrencyConverterWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    // Currently from=USD, to=EUR. If user selects USD for target, from should flip to EUR
    await act(async () => {
      hook.setPickerModal({ isOpen: true, target: 'to' });
    });

    await act(async () => {
      hook.handleSelectCurrency('USD');
    });

    expect(hook.toCurrency).toBe('USD');
    expect(hook.fromCurrency).toBe('EUR');
  });
});
