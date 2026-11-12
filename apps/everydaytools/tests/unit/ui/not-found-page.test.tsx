import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import NotFound from '@/pages/not-found';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('404 Not Found Page Suite', () => {
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
    vi.restoreAllMocks();
  });

  const renderNotFound = async (localePath = '/some-random-unknown-page') => {
    window.history.pushState({}, '', localePath);
    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <NotFound />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders 404 display and home link labeled Go back home with brand accent', async () => {
    await renderNotFound('/random-page');
    expect(container.textContent).toContain('404');
    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink!.textContent).toContain('Go back home');
  });

  it('renders go back button with back arrow affordance', async () => {
    await renderNotFound('/random-page');
    const backBtn = container.querySelector('button');
    expect(backBtn).not.toBeNull();
    expect(backBtn!.textContent).toContain('Go back');
  });

  it('does NOT render shortcut links or tool launcher', async () => {
    await renderNotFound('/random-page');
    const mergeLink = container.querySelector('a[href="/pdf-merge"]');
    const compressLink = container.querySelector('a[href="/pdf-compress"]');
    expect(mergeLink).toBeNull();
    expect(compressLink).toBeNull();
  });

  it('does NOT render any search input (banned by design contract)', async () => {
    await renderNotFound('/random-page');
    const searchInput = container.querySelector('input');
    expect(searchInput).toBeNull();
  });

  it('renders localized French messages on a French route including Retour à l accueil', async () => {
    await renderNotFound('/fr/random-unknown');
    expect(container.textContent).toContain('404');
    expect(container.textContent).toContain('Page introuvable');
    const homeLink = container.querySelector('a[href="/fr"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink!.textContent).toContain("Retour à l'accueil");
  });

  it('renders the brand-adapted illustration', async () => {
    await renderNotFound('/random-page');
    const illustration = container.querySelector('img[src*="404-error"], svg');
    expect(illustration).not.toBeNull();
  });

  it('renders a human, Swiss editorial title message', async () => {
    await renderNotFound('/random-page');
    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1!.textContent!.length).toBeGreaterThan(5);
  });
});
