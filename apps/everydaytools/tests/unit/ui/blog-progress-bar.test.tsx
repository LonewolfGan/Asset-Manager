import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BlogProgressBar } from '@/components/blog/blog-progress-bar';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogProgressBar (TDD Phase GREEN)', () => {
  let container: HTMLDivElement;
  let root: Root;

  const setScrollDimensions = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
    Object.defineProperty(window, 'scrollY', {
      value: scrollTop,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: scrollTop,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: scrollHeight,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: clientHeight,
      configurable: true,
      writable: true,
    });
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    // Default scroll mock: page top, scrollable content
    setScrollDimensions(0, 2000, 1000);

    // Mock requestAnimationFrame to run synchronously for deterministic tests
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(performance.now());
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  const renderComponent = async () => {
    await act(async () => {
      root.render(React.createElement(BlogProgressBar));
    });
  };

  const getProgressBarElement = (): HTMLElement => {
    const el =
      (container.querySelector('[role="progressbar"]') as HTMLElement) ||
      (container.querySelector('[data-testid="blog-progress-bar"]') as HTMLElement) ||
      (container.firstElementChild as HTMLElement);
    expect(el).not.toBeNull();
    return el;
  };

  it('renders fixed 2px progress bar with accessibility attributes at top of screen', async () => {
    await renderComponent();
    const el = getProgressBarElement();

    // Must be fixed at the top
    const classList = el.className;
    const style = el.getAttribute('style') || '';

    const isFixed = classList.includes('fixed') || style.includes('position: fixed');
    const isTop = classList.includes('top-0') || style.includes('top: 0');
    const isFullWidth =
      (classList.includes('left-0') && classList.includes('right-0')) ||
      classList.includes('w-full') ||
      style.includes('left: 0');

    expect(isFixed).toBe(true);
    expect(isTop).toBe(true);
    expect(isFullWidth).toBe(true);

    // Height should be 2px (e.g. h-[2px], h-0.5, or style height: 2px)
    const has2pxHeight =
      classList.includes('h-[2px]') ||
      classList.includes('h-0.5') ||
      style.includes('height: 2px');
    expect(has2pxHeight).toBe(true);

    // Z-index layer for editorial reading overlay
    const hasZIndex = classList.includes('z-50') || style.includes('z-index');
    expect(hasZIndex).toBe(true);

    // Accessible attributes: either role="progressbar" or aria-hidden="true"
    const hasAccessibleAttr =
      el.getAttribute('role') === 'progressbar' ||
      el.getAttribute('aria-hidden') === 'true';
    expect(hasAccessibleAttr).toBe(true);

    // Transform origin must be left to expand from left to right
    const hasOriginLeft =
      classList.includes('origin-left') ||
      style.toLowerCase().includes('transform-origin: left') ||
      style.toLowerCase().includes('transformorigin: left') ||
      el.style.transformOrigin.includes('left');
    expect(hasOriginLeft).toBe(true);
  });

  it('initializes scaleX(0) when page is at the top', async () => {
    setScrollDimensions(0, 2000, 1000);
    await renderComponent();

    const el = getProgressBarElement();
    const style = el.getAttribute('style') || '';
    const transform = el.style.transform || style;

    // Should indicate 0 progress
    expect(transform).toMatch(/scaleX\(0(\.0+)?\)/);
  });

  it('updates scaleX proportionally as window scrolls down', async () => {
    setScrollDimensions(0, 2000, 1000); // max scroll = 1000
    await renderComponent();

    const el = getProgressBarElement();

    // Scroll 50% (scrollTop = 500 of 1000)
    await act(async () => {
      setScrollDimensions(500, 2000, 1000);
      window.dispatchEvent(new Event('scroll'));
    });

    const styleAt50 = el.style.transform || el.getAttribute('style') || '';
    expect(styleAt50).toMatch(/scaleX\(0\.5\d*\)/);

    // Scroll 100% (scrollTop = 1000 of 1000)
    await act(async () => {
      setScrollDimensions(1000, 2000, 1000);
      window.dispatchEvent(new Event('scroll'));
    });

    const styleAt100 = el.style.transform || el.getAttribute('style') || '';
    expect(styleAt100).toMatch(/scaleX\(1(\.0+)?\)/);
  });

  it('handles edge cases gracefully without NaN or invalid scales', async () => {
    // Edge case 1: Page has no scrollable content (scrollHeight <= clientHeight)
    setScrollDimensions(0, 800, 1000);
    await renderComponent();

    const el = getProgressBarElement();
    let style = el.style.transform || el.getAttribute('style') || '';
    expect(style).not.toContain('NaN');
    expect(style).toMatch(/scaleX\(0(\.0+)?\)/);

    // Edge case 2: Overscroll top (negative scrollTop on mobile/elastic scroll)
    await act(async () => {
      setScrollDimensions(-100, 2000, 1000);
      window.dispatchEvent(new Event('scroll'));
    });
    style = el.style.transform || el.getAttribute('style') || '';
    expect(style).not.toContain('NaN');
    expect(style).toMatch(/scaleX\(0(\.0+)?\)/);

    // Edge case 3: Overscroll bottom (scrollTop > max scroll)
    await act(async () => {
      setScrollDimensions(1500, 2000, 1000);
      window.dispatchEvent(new Event('scroll'));
    });
    style = el.style.transform || el.getAttribute('style') || '';
    expect(style).not.toContain('NaN');
    expect(style).toMatch(/scaleX\(1(\.0+)?\)/);
  });

  it('removes window scroll event listener on unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    await renderComponent();
    expect(removeEventListenerSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function));

    act(() => {
      root.unmount();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
