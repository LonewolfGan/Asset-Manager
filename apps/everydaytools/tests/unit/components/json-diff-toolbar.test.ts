import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JsonDiffToolbar } from '@/components/json-diff/JsonDiffToolbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('JsonDiffToolbar Component (TDD)', () => {
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

  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  const renderToolbar = async (props: Partial<Parameters<typeof JsonDiffToolbar>[0]> = {}) => {
    const defaultProps = {
      viewMode: 'split' as const,
      onViewModeChange: vi.fn(),
      deltasCount: 3,
      normalizeKeys: true,
      onToggleNormalizeKeys: vi.fn(),
      filterOnlyDiffs: false,
      onToggleFilterOnlyDiffs: vi.fn(),
      hasBothInputs: true,
      hasInputs: true,
      onSwap: vi.fn(),
      onClear: vi.fn(),
      getDiffSummary: () => 'Diff summary text',
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: dummyLocale },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(JsonDiffToolbar, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders mode switch buttons and triggers change on click', async () => {
    const props = await renderToolbar();

    const unifiedBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Unifié')
    );
    expect(unifiedBtn).toBeDefined();

    await act(async () => {
      unifiedBtn?.click();
    });

    expect(props.onViewModeChange).toHaveBeenCalledWith('unified');
  });

  it('calls onSwap and onClear when buttons are clicked', async () => {
    const props = await renderToolbar();

    const swapBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Inverser les versions')
    );
    expect(swapBtn).toBeDefined();
    await act(async () => {
      swapBtn?.click();
    });
    expect(props.onSwap).toHaveBeenCalledTimes(1);

    const clearBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Vider')
    );
    expect(clearBtn).toBeDefined();
    await act(async () => {
      clearBtn?.click();
    });
    expect(props.onClear).toHaveBeenCalledTimes(1);
  });
});
