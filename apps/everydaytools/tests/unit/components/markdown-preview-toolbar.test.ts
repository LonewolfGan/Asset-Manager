import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { MarkdownToolbarLayout } from '@/components/markdown-preview/MarkdownToolbarLayout';

describe('MarkdownToolbarLayout anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex colors #FF6B35 or #e85a26 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(MarkdownToolbarLayout, {
            viewLayout: 'split',
            onViewLayoutChange: () => {},
            wordWrap: true,
            onToggleWordWrap: () => {},
            syncScroll: true,
            onToggleSyncScroll: () => {},
            canUndo: true,
            canRedo: true,
            onUndo: () => {},
            onRedo: () => {},
            hasContent: true,
            markdown: '# Hello',
            safeHtml: '<h1>Hello</h1>',
            onClear: () => {},
            onDownloadMd: () => {},
            onDownloadHtml: () => {},
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('var(--accent)');
    expect(html).toContain('bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors');
    expect(html).toContain('Annuler');
    expect(html).toContain('Rétablir');
  });

  it('omits undo and redo buttons when canUndo and canRedo are false', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(MarkdownToolbarLayout, {
            viewLayout: 'split',
            onViewLayoutChange: () => {},
            wordWrap: true,
            onToggleWordWrap: () => {},
            syncScroll: true,
            onToggleSyncScroll: () => {},
            canUndo: false,
            canRedo: false,
            onUndo: () => {},
            onRedo: () => {},
            hasContent: false,
            markdown: '',
            safeHtml: '',
            onClear: () => {},
            onDownloadMd: () => {},
            onDownloadHtml: () => {},
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('Annuler');
    expect(html).not.toContain('Rétablir');
  });
});
