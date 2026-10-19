import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LoremCommandBar } from '@/components/lorem-ipsum/LoremCommandBar';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'FR',
    t: {
      common: { copy: 'Copier', copied: 'Copié !' },
    },
  }),
}));

describe('LoremCommandBar Component', () => {
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

  const defaultProps = {
    unit: 'paragraphs' as const,
    count: 3,
    flavor: 'classic' as const,
    format: 'plain' as const,
    startWithClassic: true,
    isRefreshing: false,
    fullText: 'Lorem ipsum dolor sit amet...',
    onUnitSelect: vi.fn(),
    onCountChange: vi.fn(),
    onCountSet: vi.fn(),
    onFlavorChange: vi.fn(),
    onFormatChange: vi.fn(),
    onToggleStartWithClassic: vi.fn(),
    onRegenerate: vi.fn(),
    onDownload: vi.fn(),
    isFr: true,
  };

  it('renders unit and format options and respects anti-slop rules', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(LoremCommandBar, defaultProps)
        )
      );
    });

    expect(container.textContent).toContain('Paragraphes');
    expect(container.textContent).toContain('Phrases');
    expect(container.textContent).toContain('Mots');
    expect(container.textContent).toContain('Listes');

    // Anti-slop check: zero arbitrary orange hex
    const html = container.innerHTML;
    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');

    // Target buttons should use targeted transitions (not transition-all)
    const buttons = Array.from(container.querySelectorAll('button'));
    const regenerateBtn = buttons.find((b) => b.textContent?.includes('Régénérer'));
    expect(regenerateBtn).toBeTruthy();
    expect(regenerateBtn?.className).not.toContain('transition-all');
    expect(regenerateBtn?.className).toContain('transition-colors');
  });

  it('renders regenerate and copy action buttons', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(LoremCommandBar, defaultProps)
        )
      );
    });

    expect(container.textContent).toContain('Régénérer');
    expect(container.textContent).toContain('Copier tout');
  });
});
