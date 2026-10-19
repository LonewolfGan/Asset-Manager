import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UrlInputPane } from '@/components/url-encoder/UrlInputPane';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('UrlInputPane anti-slop design system contract', () => {
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
          React.createElement(UrlInputPane, {
            isFr: true,
            input: '',
            onUpdateInput: vi.fn(),
            mode: 'encode',
            wordWrap: true,
            error: null,
            hasInput: false,
            inputStats: { chars: 0, bytes: 0 },
            isDragging: false,
            setIsDragging: vi.fn(),
            onFileUpload: vi.fn(),
          } as any)
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('text-[var(--accent)]');
  });
});
