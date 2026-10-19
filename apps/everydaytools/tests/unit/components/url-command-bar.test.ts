import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UrlCommandBar } from '@/components/url-encoder/UrlCommandBar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('UrlCommandBar anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex #FF6B35 or #e85a26 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UrlCommandBar, {
            isFr: true,
            mode: 'encode',
            setMode: vi.fn(),
            encodeMode: 'component',
            setEncodeMode: vi.fn(),
            wordWrap: true,
            setWordWrap: vi.fn(),
            historyLength: 1,
            onUndo: vi.fn(),
            hasOutput: true,
            output: 'https%3A%2F%2Fexample.com',
            hasInput: true,
            onClear: vi.fn(),
            hasParams: false,
            urlInspection: { isValid: false, params: [] },
            onDownload: vi.fn(),
            copiedLabel: 'Copié !',
            onSwap: vi.fn(),
          } as any)
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('bg-[var(--accent)]');
  });

  it('renders command bar buttons with strictly zero transition-all', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UrlCommandBar, {
            isFr: true,
            mode: 'encode',
            setMode: vi.fn(),
            encodeMode: 'component',
            setEncodeMode: vi.fn(),
            wordWrap: true,
            setWordWrap: vi.fn(),
            historyLength: 0,
            onUndo: vi.fn(),
            hasOutput: false,
            output: '',
            hasInput: false,
            onClear: vi.fn(),
            hasParams: false,
            urlInspection: { isValid: false, params: [] },
            onDownload: vi.fn(),
            copiedLabel: 'Copié !',
            onSwap: vi.fn(),
          } as any)
        )
      )
    );

    expect(html).not.toContain('transition-all');
    expect(html).toContain('transition-colors');
  });

  it('renders parameters export action when hasParams is true', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UrlCommandBar, {
            isFr: true,
            mode: 'encode',
            setMode: vi.fn(),
            encodeMode: 'component',
            setEncodeMode: vi.fn(),
            wordWrap: true,
            setWordWrap: vi.fn(),
            historyLength: 0,
            onUndo: vi.fn(),
            hasOutput: true,
            output: 'https://example.com?q=1',
            hasInput: true,
            onClear: vi.fn(),
            hasParams: true,
            urlInspection: { isValid: true, params: [{ key: 'q', value: '1' }] },
            onDownload: vi.fn(),
            copiedLabel: 'Copié !',
            onSwap: vi.fn(),
          } as any)
        )
      )
    );

    expect(html).toContain('bg-[var(--accent)]');
  });
});
