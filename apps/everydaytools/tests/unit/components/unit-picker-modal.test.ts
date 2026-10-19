import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import UnitPickerModal from '@/components/UnitPickerModal';
import { UNIT_CATEGORIES } from '@/config/units.config';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('UnitPickerModal Design System & Anti-Slop (TDD RED Phase)', () => {
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

  it('renders modal without arbitrary hex #FF6B35 and without transition-all', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(UnitPickerModal, {
            isOpen: true,
            onClose: vi.fn(),
            units: lengthCategory.units,
            selectedUnit: 'meter',
            onSelect: vi.fn(),
            title: 'Select Unit',
          })
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
