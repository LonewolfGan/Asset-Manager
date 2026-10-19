import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LoremReadingCanvas } from '@/components/lorem-ipsum/LoremReadingCanvas';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'FR',
    t: {
      common: { copy: 'Copier', copied: 'Copié !' },
    },
  }),
}));

describe('LoremReadingCanvas Component', () => {
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

  it('renders paragraphs mode with individual copy buttons and without transition-all on canvas items', async () => {
    const blocks = ['Premier paragraphe de test.', 'Deuxième paragraphe de test.'];
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(LoremReadingCanvas, {
            unit: 'paragraphs',
            format: 'plain',
            blocks,
            fullText: blocks.join('\n\n'),
            isFr: true,
          })
        )
      );
    });

    expect(container.textContent).toContain('Premier paragraphe de test.');
    expect(container.textContent).toContain('Deuxième paragraphe de test.');
    
    // Check canvas cards use targeted transitions
    const paragraphCard = container.querySelector('.group');
    expect(paragraphCard).toBeTruthy();
    expect(paragraphCard?.className).not.toContain('transition-all');
    expect(paragraphCard?.className).toContain('transition-colors');
    expect(container.innerHTML).not.toContain('#FF6B35');
  });

  it('renders formatted code when format is json or html', async () => {
    const blocks = ['Item 1', 'Item 2'];
    const jsonText = JSON.stringify(blocks, null, 2);
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(LoremReadingCanvas, {
            unit: 'paragraphs',
            format: 'json',
            blocks,
            fullText: jsonText,
            isFr: true,
          })
        )
      );
    });

    expect(container.textContent).toContain('Item 1');
    expect(container.textContent).toContain('Item 2');
  });
});
