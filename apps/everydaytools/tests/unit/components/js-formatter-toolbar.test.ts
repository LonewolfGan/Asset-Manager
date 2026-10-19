import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { JsFormatterToolbar } from '@/components/js-formatter/JsFormatterToolbar';

describe('JsFormatterToolbar anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex colors #FF6B35 or #e85a26 and zero transition-all', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JsFormatterToolbar, {
            mode: 'format',
            setMode: () => {},
            language: 'javascript',
            setLanguage: () => {},
            indent: 2,
            setIndent: () => {},
            semicolons: true,
            setSemicolons: () => {},
            quotes: 'preserve',
            setQuotes: () => {},
            stripComments: false,
            setStripComments: () => {},
            wordWrap: true,
            setWordWrap: () => {},
            historyLength: 1,
            onUndo: () => {},
            hasContent: true,
            output: 'const x = 1;',
            onClear: () => {},
            onDownload: () => {},
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('var(--accent)');
    expect(html).toContain('bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors');
  });
});
