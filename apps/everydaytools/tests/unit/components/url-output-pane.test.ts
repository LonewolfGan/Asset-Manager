import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UrlOutputPane } from '@/components/url-encoder/UrlOutputPane';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('UrlOutputPane anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex #FF6B35 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UrlOutputPane, {
            isFr: true,
            output: 'https%3A%2F%2Fexample.com',
            mode: 'encode',
            encodeMode: 'component',
            wordWrap: true,
            hasInput: true,
            hasOutput: true,
            outputStats: { chars: 27, bytes: 27 },
            copiedLabel: 'Copié !',
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('text-[var(--accent)]');
  });
});
