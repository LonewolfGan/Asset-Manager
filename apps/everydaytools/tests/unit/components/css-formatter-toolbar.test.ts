import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { CssFormatterToolbar } from '@/components/css-formatter/CssFormatterToolbar';

describe('CssFormatterToolbar anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex colors #FF6B35 or #e85a26', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(CssFormatterToolbar, {
            mode: 'format',
            setMode: () => {},
            indent: 2,
            setIndent: () => {},
            sortProperties: false,
            setSortProperties: () => {},
            stripComments: false,
            setStripComments: () => {},
            wordWrap: true,
            setWordWrap: () => {},
            hasHistory: true,
            hasContent: true,
            output: '.btn { color: red; }',
            isFr: true,
            onUndo: () => {},
            onClear: () => {},
            onDownload: () => {},
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('var(--accent)');
  });
});
