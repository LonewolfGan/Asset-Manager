import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HtmlFormatterTopBar } from '@/components/html-formatter/HtmlFormatterTopBar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('HtmlFormatterTopBar Component (TDD)', () => {
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

  const renderTopBar = async (props: Partial<Parameters<typeof HtmlFormatterTopBar>[0]> = {}) => {
    const defaultProps = {
      mode: 'format' as const,
      indent: 2 as const,
      stripComments: false,
      wordWrap: true,
      historyLength: 1,
      hasContent: true,
      output: '<div>Hello</div>',
      onSetMode: vi.fn(),
      onSetIndent: vi.fn(),
      onToggleStripComments: vi.fn(),
      onToggleWordWrap: vi.fn(),
      onUndo: vi.fn(),
      onClear: vi.fn(),
      onDownload: vi.fn(),
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
            React.createElement(HtmlFormatterTopBar, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders without arbitrary hex colors and without transition-all on buttons', async () => {
    await renderTopBar();

    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a26');
    expect(container.innerHTML).toContain('var(--accent)');

    const downloadBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Télécharger')
    );
    expect(downloadBtn?.className).not.toContain('transition-all');
    expect(downloadBtn?.className).toContain('transition-colors');
  });

  it('handles download click when hasContent is true', async () => {
    const props = await renderTopBar();

    const downloadBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Télécharger')
    );
    expect(downloadBtn).toBeDefined();

    await act(async () => {
      downloadBtn?.click();
    });

    expect(props.onDownload).toHaveBeenCalledTimes(1);
  });
});
