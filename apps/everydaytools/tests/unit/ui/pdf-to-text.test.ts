import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToText from '@/pages/pdf-to-text';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-text', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'PDF to Text');
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
        'pdf-to-text': {
          title: 'PDF to Text',
          description: 'Extract text from PDF documents.',
        },
      },
      pdfToText: {
        convertBtn: 'Extract Text',
        converting: 'Extracting...',
        convertAnother: 'Convert Another',
        downloadTxt: 'Download Text',
        error: 'Extraction failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('PdfToText Page UI & Workflow (TDD)', () => {
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

  it('renders Scene 1 (Dropzone) and ReciprocalTitle with pdf-to-text slug on initial idle state', async () => {
    await act(async () => {
      root.render(React.createElement(PdfToText));
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('pdf-to-text');

    const dropzone = container.querySelector('[role="region"]') || container.querySelector('button');
    expect(dropzone).toBeTruthy();
  });
});
