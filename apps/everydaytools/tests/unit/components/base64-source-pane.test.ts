import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Base64SourcePane } from '@/components/base64/Base64SourcePane';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('Base64SourcePane anti-slop design system contract', () => {
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
          React.createElement(Base64SourcePane, {
            mode: 'encode',
            input: '',
            inputBytes: 100,
            wordWrap: true,
            onInputChange: vi.fn(),
            fileInfo: { name: 'sample.txt', type: 'text/plain', size: 100 },
            onRemoveFile: vi.fn(),
            fileInputRef: { current: null },
            onFileUpload: vi.fn(),
            error: '',
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('text-[var(--accent)]');
  });
});
