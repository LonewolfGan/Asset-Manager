import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import Footer from '@/components/Footer';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as any;
}

describe('Footer Dot Matrix Wave Animation (TDD RED Phase)', () => {
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

  it('renders EVERYDAYTOOLS wordmark with dot-matrix continuous wave class', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(Footer)
        )
      );
    });

    const wordmark = container.querySelector('footer span.footer-dot-matrix-wave');
    expect(wordmark).not.toBeNull();
    expect(wordmark?.textContent).toContain('EVERYDAYTOOLS');

    const style = (wordmark as HTMLElement)?.style;
    expect(style.maskImage || style.webkitMaskImage).toContain('radial-gradient');
  });
});
