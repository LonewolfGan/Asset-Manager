import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToHtml from '@/pages/pdf-to-html';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-html', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'PDF to HTML');
  },
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          pdf: 'PDF',
        },
      },
      tools: {
        'pdf-to-html': {
          title: 'PDF to HTML',
          description: 'Convert PDF documents into clean, responsive HTML web pages.',
        },
      },
      pdfToHtml: {
        convertBtn: 'Convert to HTML',
        converting: 'Generating HTML5 page...',
        convertAnother: 'Convert another PDF',
        downloadHtml: 'Download .html file',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('PdfToHtml Page UI & Workflow (TDD)', () => {
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

  it('renders Scene 1 (Dropzone) on initial idle state', async () => {
    await act(async () => {
      root.render(React.createElement(PdfToHtml));
    });

    const dropzone = container.querySelector('[role="region"]') || container.querySelector('button');
    expect(dropzone).toBeTruthy();
    expect(lastTitleProps).toBeTruthy();
    expect(lastTitleProps.currentSlug).toBe('pdf-to-html');
  });
});
