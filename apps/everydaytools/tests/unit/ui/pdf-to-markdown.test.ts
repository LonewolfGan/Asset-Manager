import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToMarkdown from '@/pages/pdf-to-markdown';

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-markdown', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'PDF to Markdown');
  },
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          pdf: 'PDF Tools',
        },
      },
      tools: {
        'pdf-to-markdown': {
          title: 'PDF to Markdown',
          description: 'Convert PDF documents to Markdown.',
        },
      },
      pdfToMarkdown: {
        convertBtn: 'Convert to Markdown',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadMd: 'Download Markdown',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('PdfToMarkdown Page Reciprocal Title (TDD)', () => {
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

  it('renders ReciprocalTitle with pdf-to-markdown slug in page header', async () => {
    await act(async () => {
      root.render(React.createElement(PdfToMarkdown));
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('pdf-to-markdown');
  });
});
