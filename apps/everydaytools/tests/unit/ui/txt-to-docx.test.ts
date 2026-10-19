import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import TxtToDocx from '@/pages/txt-to-docx';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/txt-to-docx', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'Text to Word');
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
        'txt-to-docx': {
          title: 'Text to Word',
          description: 'Convert plain text into Word document.',
        },
      },
      txtToDocx: {
        error: 'Error',
        tabUpload: 'Upload',
        tabPaste: 'Paste',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

describe('TxtToDocx Page Reciprocal Title (TDD)', () => {
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

  it('renders ReciprocalTitle with txt-to-docx slug in page header without fetch calls', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await act(async () => {
      root.render(React.createElement(TxtToDocx));
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('txt-to-docx');
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
