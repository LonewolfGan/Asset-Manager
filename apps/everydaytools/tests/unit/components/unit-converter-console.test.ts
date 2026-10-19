import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { UnitConverterConsole } from '@/components/unit-converter/UnitConverterConsole';
import { UNIT_CATEGORIES } from '@/config/units.config';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/components/ui/copy-button', () => ({
  CopyButton: (props: any) => React.createElement('button', { 'data-testid': 'copy-btn', disabled: props.disabled }, 'Copy'),
}));

describe('UnitConverterConsole Design System & Anti-Slop (TDD RED Phase)', () => {
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

  const lengthCategory = UNIT_CATEGORIES.find((c) => c.id === 'length')!;
  const fromDef = lengthCategory.units[0];
  const toDef = lengthCategory.units[1];

  it('renders bilateral console without arbitrary hex #FF6B35 and without transition-all', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(UnitConverterConsole, {
              formulaExplanation: '1 m = 0.001 km',
              fromDef,
              toDef,
              fromSystem: 'metric',
              toSystem: 'metric',
              fromValue: '1',
              toValue: '0.001',
              isSwapping: false,
              isFr: false,
              onFromChange: vi.fn(),
              onToChange: vi.fn(),
              onSwap: vi.fn(),
              onOpenPicker: vi.fn(),
            })
          )
        )
      );
    });

    const html = container.innerHTML;
    // Strict Design System Rule: Zero arbitrary hex #FF6B35
    expect(html.toUpperCase()).not.toContain('#FF6B35');

    // Strict Design System Rule: Zero transition-all
    expect(html).not.toContain('transition-all');
  });
});
