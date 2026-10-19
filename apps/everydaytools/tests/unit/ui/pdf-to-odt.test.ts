import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToOdt from '@/pages/pdf-to-odt';

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-odt', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'PDF to ODT');
  },
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          documents: 'Documents',
        },
      },
      tools: {
        'pdf-to-odt': {
          title: 'PDF to ODT',
          description: 'Convert PDF documents to OpenDocument Text (.odt).',
        },
      },
      pdfToOdt: {
        convertBtn: 'Convert to ODT',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadOdt: 'Download ODT',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('PdfToOdt Page Reciprocal Title (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
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

  it('renders ReciprocalTitle with pdf-to-odt slug in page header', async () => {
    await act(async () => {
      root.render(React.createElement(PdfToOdt));
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('pdf-to-odt');
  });
});
