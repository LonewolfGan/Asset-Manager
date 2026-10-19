import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { JwtCommandBar } from '@/components/jwt-decoder/JwtCommandBar';
import { decodeJwt } from '@/lib/jwt-logic';
import { SAMPLE_JWTS } from '@/lib/jwt-samples';
import { TooltipProvider } from '@/components/ui/tooltip';

import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('JwtCommandBar anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex #FF6B35 or #e85a26 and uses var(--accent)', () => {
    const decoded = decodeJwt(SAMPLE_JWTS.activeAdmin);
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JwtCommandBar, {
            isFr: true,
            hasToken: true,
            decoded,
            historyLength: 1,
            onCleanToken: vi.fn(),
            onUndo: vi.fn(),
            onClear: vi.fn(),
            onDownload: vi.fn(),
            copiedLabel: 'Copié !',
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('bg-[var(--accent)]');
  });
});
