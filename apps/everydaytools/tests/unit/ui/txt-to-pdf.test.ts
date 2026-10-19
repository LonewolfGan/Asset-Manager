import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import TxtToPdf from '@/pages/txt-to-pdf';

vi.mock('wouter', () => ({
  useLocation: () => ['/txt-to-pdf', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'Text to PDF');
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
        'txt-to-pdf': {
          title: 'Text to PDF',
          description: 'Convert plain text into PDF.',
        },
      },
      txtToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadPdf: 'Download PDF',
        tabUpload: 'Upload',
        tabPaste: 'Paste',
        error: 'Conversion failed',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

describe('TxtToPdf Page Reciprocal Title (TDD)', () => {
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

  it('renders ReciprocalTitle with txt-to-pdf slug in page header', async () => {
    await act(async () => {
      root.render(React.createElement(TxtToPdf));
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('txt-to-pdf');
  });
});
