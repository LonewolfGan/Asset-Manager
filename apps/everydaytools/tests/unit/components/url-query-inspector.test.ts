import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UrlQueryInspector } from '@/components/url-encoder/UrlQueryInspector';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('UrlQueryInspector anti-slop design system contract', () => {
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
          React.createElement(UrlQueryInspector, {
            isFr: true,
            urlInspection: {
              isValid: true,
              protocol: 'https:',
              host: 'example.com',
              pathname: '/search',
              params: [{ key: 'q', value: 'bonjour' }],
            },
            onRemoveParam: vi.fn(),
            copiedLabel: 'Copié !',
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('text-[var(--accent)]');
  });
});
