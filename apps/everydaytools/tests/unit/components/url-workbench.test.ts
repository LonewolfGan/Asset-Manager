import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { UrlWorkbench } from '@/components/url-encoder/UrlWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('UrlWorkbench anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  const dummyWorkflow: any = {
    input: '',
    output: '',
    error: null,
    mode: 'encode',
    setMode: vi.fn(),
    encodeMode: 'component',
    setEncodeMode: vi.fn(),
    wordWrap: true,
    setWordWrap: vi.fn(),
    history: [],
    isDragging: false,
    setIsDragging: vi.fn(),
    urlInspection: { isValid: false, params: [] },
    hasInput: false,
    hasOutput: false,
    hasParams: false,
    inputStats: { chars: 0, bytes: 0 },
    outputStats: { chars: 0, bytes: 0 },
    handleUpdateInput: vi.fn(),
    handleUndo: vi.fn(),
    handleSwap: vi.fn(),
    handleClear: vi.fn(),
    handleLoadSample: vi.fn(),
    handleRemoveParam: vi.fn(),
    handleFileUpload: vi.fn(),
    handleDownload: vi.fn(),
    samples: [
      {
        id: 'search',
        titleFr: 'Recherche E-Commerce',
        titleEn: 'Search',
        url: 'https://example.com/search?q=test',
        descriptionFr: '',
        descriptionEn: '',
      },
    ],
  };

  it('renders workbench with zero arbitrary hex #FF6B35 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UrlWorkbench, {
            isFr: true,
            workflow: dummyWorkflow,
            copiedLabel: 'Copié !',
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('text-[var(--accent)]');
  });
});
