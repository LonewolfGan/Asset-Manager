import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { BarcodeTopBar } from '@/components/barcode-generator/BarcodeTopBar';
import { getSymbologies } from '@/lib/barcode-symbologies';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

describe('BarcodeTopBar', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders without hardcoded #FF6B35 or prohibited transition-all', async () => {
    const symbologies = getSymbologies(true);
    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: { locale: 'fr', isFr: true, t: TRANSLATIONS.fr, setLocale: vi.fn() } },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(BarcodeTopBar, {
              symbologies,
              symbologyId: 'EAN13',
              onSelectSymbology: vi.fn(),
              historyLength: 2,
              onUndo: vi.fn(),
              canRedo: true,
              onRedo: vi.fn(),
              validation: { isValid: true, status: 'valid', message: 'Valid' },
              onPrint: vi.fn(),
              onCopyPng: vi.fn().mockResolvedValue(undefined),
              getSvgString: () => '<svg></svg>',
              showDownloadMenu: false,
              onDownloadMenuChange: vi.fn(),
              onDownloadPng: vi.fn(),
              onDownloadSvg: vi.fn(),
              isFr: true,
            })
          )
        )
      );
    });

    const html = container.innerHTML;
    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('EAN-13');

    const downloadBtn = container.querySelector('button[aria-label="Download menu"], button[aria-label="Menu de téléchargement"]');
    expect(downloadBtn?.className).toContain('transition-colors');
    expect(downloadBtn?.className).not.toContain('transition-all');

    const printBtn = container.querySelector('button[aria-label="Print barcode"], button[aria-label="Imprimer le code-barres"]');
    expect(printBtn?.className).toContain('transition-colors');
    expect(printBtn?.className).not.toContain('transition-all');
  });
});
