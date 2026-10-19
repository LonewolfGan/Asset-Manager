import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WordCounterCanvas } from '@/components/word-counter/WordCounterCanvas';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'FR',
    isFr: true,
    t: {
      common: { copy: 'Copier', copied: 'Copié !' },
    },
  }),
}));

describe('WordCounterCanvas Component', () => {
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

  it('renders textarea and displays sample pills when text is empty', async () => {
    const handleLoadSample = vi.fn();
    const textareaRef = { current: null };

    await act(async () => {
      root.render(
        React.createElement(WordCounterCanvas, {
          text: '',
          isDraggingOver: false,
          textareaRef,
          isFr: true,
          copiedLabel: 'Copié !',
          onTextChange: vi.fn(),
          onDragOver: vi.fn(),
          onDragLeave: vi.fn(),
          onDrop: vi.fn(),
          onQuickCopy: vi.fn(),
          onLoadSample: handleLoadSample,
        })
      );
    });

    const textarea = container.querySelector('textarea');
    expect(textarea).not.toBeNull();
    expect(textarea?.placeholder).toContain('Tapez, collez votre texte');

    // Samples buttons should be visible when empty
    expect(container.textContent).toContain('Exemples rapides');
    const sampleBtn = container.querySelector('button[data-sample="editorial"]') as HTMLButtonElement;
    expect(sampleBtn).not.toBeNull();

    await act(async () => {
      sampleBtn.click();
    });

    expect(handleLoadSample).toHaveBeenCalledWith('editorial');

    // Anti-slop checks
    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('transition-all');
  });

  it('renders drag over overlay without #FF6B35 and without transition-all', async () => {
    const textareaRef = { current: null };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(WordCounterCanvas, {
            text: 'Texte présent',
            isDraggingOver: true,
            textareaRef,
            isFr: true,
            copiedLabel: 'Copié !',
            onTextChange: vi.fn(),
            onDragOver: vi.fn(),
            onDragLeave: vi.fn(),
            onDrop: vi.fn(),
            onQuickCopy: vi.fn(),
            onLoadSample: vi.fn(),
          })
        )
      );
    });

    expect(container.textContent).toContain('Déposez votre document ici');

    // Anti-slop checks on the drag & drop overlay
    const overlay = container.querySelector('.animate-bounce')?.parentElement;
    expect(overlay).not.toBeNull();
    expect(overlay?.className).not.toContain('#FF6B35');
    expect(overlay?.className).not.toContain('transition-all');
    expect(overlay?.className).toContain('border-[var(--accent)]');
  });
});
