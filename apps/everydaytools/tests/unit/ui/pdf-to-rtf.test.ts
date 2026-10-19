import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToRtf from '@/pages/pdf-to-rtf';

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-rtf', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'PDF to RTF');
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
        'pdf-to-rtf': {
          title: 'PDF to RTF',
          description: 'Convert PDF documents to Rich Text Format (.rtf).',
        },
      },
      pdfToRtf: {
        convertBtn: 'Convert to RTF',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadRtf: 'Download RTF',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('PdfToRtf Page Reciprocal Title (TDD)', () => {
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

  it('renders ReciprocalTitle with pdf-to-rtf slug in page header', async () => {
    await act(async () => {
      root.render(React.createElement(PdfToRtf));
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('pdf-to-rtf');
  });
});
