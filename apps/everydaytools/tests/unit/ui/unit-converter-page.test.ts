import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import UnitConverter from '@/pages/unit-converter';
import { LocaleProvider } from '@/contexts/locale-context';

import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/components/ToolPageLayout', () => ({
  default: ({ children }: any) => React.createElement('div', { 'data-testid': 'tool-layout' }, children),
}));

describe('UnitConverter Page UI (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    try {
      localStorage.setItem('et:locale', 'FR');
    } catch (_) {}
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    try {
      localStorage.removeItem('et:locale');
    } catch (_) {}
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders popular preset pills with French label when locale is FR', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          { initialLocale: 'FR' },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(UnitConverter)
          )
        )
      );
    });

    // Should display French translation for presets when available
    expect(container.textContent).toContain('Kilomètres en Miles');
  });
});
