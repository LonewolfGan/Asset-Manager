import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Base64Workbench } from '@/components/base64/Base64Workbench';

import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('Base64Workbench anti-slop design system contract', () => {
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
          React.createElement(Base64Workbench, {
            isDragOver: true,
            onDragOver: vi.fn(),
            onDragLeave: vi.fn(),
            onDrop: vi.fn(),
            sourceProps: {
              mode: 'encode',
              input: '',
              inputBytes: 0,
              wordWrap: true,
              onInputChange: vi.fn(),
              fileInfo: null,
              onRemoveFile: vi.fn(),
              fileInputRef: { current: null },
              onFileUpload: vi.fn(),
              error: '',
              isFr: true,
            },
            resultProps: {
              mode: 'encode',
              output: '',
              outputBytes: 0,
              wordWrap: true,
              onWordWrapToggle: vi.fn(),
              outputTab: 'text',
              onOutputTabChange: vi.fn(),
              detectedBinary: null,
              isFr: true,
            },
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('text-[var(--accent)]');
  });
});
