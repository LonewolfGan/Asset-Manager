import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import ServerError from '@/pages/server-error';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('500 Server Error Page Suite', () => {
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

  const renderServerError = async (localePath = '/500') => {
    window.history.pushState({}, '', localePath);
    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <ServerError />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders HTTP 500 semantic label, error heading, and reload button', async () => {
    await renderServerError('/500');

    expect(container.textContent).toContain('500');
    expect(container.textContent).toContain('Internal Server Error');

    const reloadButton = container.querySelector('button[data-testid="reload-btn"]');
    expect(reloadButton).not.toBeNull();
    expect(reloadButton!.textContent).toContain('Try again');
  });

  it('renders brand-adapted 500 illustration and home link', async () => {
    await renderServerError('/500');

    const illustration = container.querySelector('img[src*="500-error"]');
    expect(illustration).not.toBeNull();

    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink!.textContent).toContain('Go back home');
  });

  it('does NOT render support email text or clunky details', async () => {
    await renderServerError('/500');

    expect(container.textContent).not.toContain('Le problème persiste');
    expect(container.textContent).not.toContain('contact@everydaytools.qzz.io');
    const details = container.querySelector('details');
    expect(details).toBeNull();
  });

  it('renders localized French messages in French locale', async () => {
    await renderServerError('/fr/500');

    expect(container.textContent).toContain('500');
    expect(container.textContent).toContain('Erreur serveur');
    expect(container.textContent).toContain('Recharger la page');

    const homeLink = container.querySelector('a[href="/fr"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink!.textContent).toContain("Retour à l'accueil");
  });
});
