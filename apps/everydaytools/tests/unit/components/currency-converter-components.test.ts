import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  CurrencyTelemetryBar,
  CurrencySwapDivider,
  CurrencySourceInput,
  CurrencyTargetOutput,
} from '@/components/currency-converter';
import CurrencyPickerModal from '@/components/CurrencyPickerModal';
import { LocaleProvider } from '@/contexts/locale-context';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function TestWrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(
    LocaleProvider,
    null,
    React.createElement(TooltipProvider, null, children)
  );
}

describe('Currency Converter Components (Anti-Slop & UX Integrity)', () => {
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

  describe('CurrencyTelemetryBar', () => {
    it('renders rate telemetry, pair chips and contains zero #FF6B35 and zero transition-all', async () => {
      const onRefresh = vi.fn();
      const onSelectPair = vi.fn();

      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(CurrencyTelemetryBar, {
              fromCurrency: 'USD',
              toCurrency: 'EUR',
              directRate: 0.92,
              inverseRate: 1.087,
              sourceInfo: { type: 'live', age: 5, timeStr: '12:00' },
              isRefreshing: false,
              onRefresh,
              onSelectPair,
              locale: 'fr-FR',
              isFr: true,
            })
          )
        );
      });

      expect(container.textContent).toContain('1 USD =');
      expect(container.textContent).toContain('EUR');

      const refreshBtn = container.querySelector('button[aria-label="Actualiser les cours"]') as HTMLButtonElement;
      expect(refreshBtn).not.toBeNull();
      act(() => {
        refreshBtn.click();
      });
      expect(onRefresh).toHaveBeenCalledTimes(1);

      // Verify popular pair button
      const eurUsdBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => b.textContent?.includes('EUR / USD')
      );
      expect(eurUsdBtn).toBeDefined();
      act(() => {
        eurUsdBtn?.click();
      });
      expect(onSelectPair).toHaveBeenCalledWith('EUR', 'USD');

      // Zero Prohibited Patterns
      expect(container.innerHTML).not.toContain('#FF6B35');
      expect(container.innerHTML).not.toContain('transition-all');
    });
  });

  describe('CurrencySwapDivider', () => {
    it('renders swap trigger and contains zero #FF6B35 and zero transition-all', async () => {
      const onSwap = vi.fn();

      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(CurrencySwapDivider, {
              isSwapping: false,
              onSwap,
              isFr: true,
            })
          )
        );
      });

      const swapBtn = container.querySelector('button') as HTMLButtonElement;
      expect(swapBtn).not.toBeNull();
      act(() => {
        swapBtn.click();
      });
      expect(onSwap).toHaveBeenCalledTimes(1);

      // Zero Prohibited Patterns
      expect(container.innerHTML).not.toContain('#FF6B35');
      expect(container.innerHTML).not.toContain('transition-all');
    });
  });

  describe('CurrencySourceInput', () => {
    it('renders input with accessible label and contains zero transition-all', async () => {
      const onAmountChange = vi.fn();
      const onOpenPicker = vi.fn();

      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(CurrencySourceInput, {
              amount: '100',
              onAmountChange,
              currency: 'USD',
              currencyName: 'Dollar US',
              currencySymbol: '$',
              onOpenPicker,
              label: 'Vous envoyez',
              isFr: true,
            })
          )
        );
      });

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.value).toBe('100');
      expect(input.getAttribute('aria-label')).toBe('Vous envoyez');

      act(() => {
        input.value = '250';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      const pickerBtn = container.querySelector('button[aria-label="Changer la devise source"]') as HTMLButtonElement;
      expect(pickerBtn).not.toBeNull();
      act(() => {
        pickerBtn.click();
      });
      expect(onOpenPicker).toHaveBeenCalledTimes(1);

      // Zero Prohibited Patterns
      expect(container.innerHTML).not.toContain('transition-all');
    });
  });

  describe('CurrencyTargetOutput', () => {
    it('renders target output, copy trigger and contains zero transition-all', async () => {
      const onOpenPicker = vi.fn();

      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(CurrencyTargetOutput, {
              convertedValue: '92.00',
              currency: 'EUR',
              currencyName: 'Euro',
              currencySymbol: '€',
              onOpenPicker,
              label: 'Vous recevez',
              isFr: true,
            })
          )
        );
      });

      expect(container.textContent).toContain('92.00');
      expect(container.textContent).toContain('€');

      const pickerBtn = container.querySelector('button[aria-label="Changer la devise cible"]') as HTMLButtonElement;
      expect(pickerBtn).not.toBeNull();
      act(() => {
        pickerBtn.click();
      });
      expect(onOpenPicker).toHaveBeenCalledTimes(1);

      // Zero Prohibited Patterns on the target output currency trigger
      expect(pickerBtn.className).not.toContain('transition-all');
    });
  });

  describe('CurrencyPickerModal', () => {
    it('renders modal, dismisses on backdrop click, and contains zero #FF6B35 and zero transition-all', async () => {
      const onClose = vi.fn();
      const onSelect = vi.fn();

      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(CurrencyPickerModal, {
              isOpen: true,
              onClose,
              selectedCurrency: 'USD',
              onSelect,
              title: 'Sélectionner une devise',
            })
          )
        );
      });

      expect(container.textContent).toContain('Sélectionner une devise');

      // Backdrop click dismissal
      const backdrop = container.firstElementChild as HTMLElement;
      expect(backdrop).not.toBeNull();
      act(() => {
        backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(onClose).toHaveBeenCalled();

      // Zero Prohibited Patterns
      expect(container.innerHTML).not.toContain('#FF6B35');
      expect(container.innerHTML).not.toContain('transition-all');
    });
  });
});
