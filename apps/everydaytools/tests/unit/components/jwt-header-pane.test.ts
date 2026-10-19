import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { JwtHeaderPane } from '@/components/jwt-decoder/JwtHeaderPane';
import { decodeJwt } from '@/lib/jwt-logic';
import { SAMPLE_JWTS } from '@/lib/jwt-samples';
import { TooltipProvider } from '@/components/ui/tooltip';

import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('JwtHeaderPane anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex #FF6B35 and uses var(--accent)', () => {
    const decoded = decodeJwt(SAMPLE_JWTS.activeAdmin);
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JwtHeaderPane, {
            isFr: true,
            decoded,
            copiedLabel: 'Copié !',
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('text-[var(--accent)]');
  });
});
