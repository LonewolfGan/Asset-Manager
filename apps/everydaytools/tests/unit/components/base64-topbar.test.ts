import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Base64TopBar } from '@/components/base64/Base64TopBar';
import { TooltipProvider } from '@/components/ui/tooltip';

import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('Base64TopBar anti-slop design system contract', () => {
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
          React.createElement(Base64TopBar, {
            mode: 'encode',
            onModeChange: vi.fn(),
            onSwap: vi.fn(),
            urlSafe: false,
            onUrlSafeChange: vi.fn(),
            stripPadding: false,
            onStripPaddingChange: vi.fn(),
            dataUriPrefix: false,
            onDataUriPrefixChange: vi.fn(),
            chunkSize: 0,
            onChunkSizeChange: vi.fn(),
            historyLength: 1,
            onUndo: vi.fn(),
            hasContent: true,
            onClear: vi.fn(),
            output: 'SGVsbG8=',
            onDownload: vi.fn(),
            detectedBinary: null,
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('bg-[var(--accent)]');
    expect(html).toContain('transition-colors');
  });

  it('renders topbar without copy button having strictly zero transition-all', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(Base64TopBar, {
            mode: 'encode',
            onModeChange: vi.fn(),
            onSwap: vi.fn(),
            urlSafe: false,
            onUrlSafeChange: vi.fn(),
            stripPadding: false,
            onStripPaddingChange: vi.fn(),
            dataUriPrefix: false,
            onDataUriPrefixChange: vi.fn(),
            chunkSize: 0,
            onChunkSizeChange: vi.fn(),
            historyLength: 1,
            onUndo: vi.fn(),
            hasContent: false,
            onClear: vi.fn(),
            output: '',
            onDownload: vi.fn(),
            detectedBinary: null,
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('transition-all');
    expect(html).toContain('transition-colors');
  });
});
