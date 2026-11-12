import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import AccessDenied from '@/pages/access-denied';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('403 Access Denied (Forbidden) Page Suite', () => {
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

  const renderAccessDenied = async (localePath = '/403', localeStorage = 'EN') => {
    window.history.pushState({}, '', localePath);
    localStorage.setItem('et:locale', localeStorage);

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <AccessDenied />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders 403 display with brand SVG illustration in exact same DA as 404 and 500', async () => {
    await renderAccessDenied('/403', 'EN');
    expect(container.textContent).toContain('403');
    expect(container.querySelector('.sr-only')?.textContent).toBe('403');

    const img = container.querySelector('img[src="/illustrations/403-error.svg"]');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('alt')).toContain('403');
  });

  it('renders English headings, security/rate-limit copy, and action CTAs', async () => {
    await renderAccessDenied('/en/403', 'EN');
    expect(container.textContent).toContain('Access Restricted');
    expect(container.textContent).toContain('firewall');
    expect(container.textContent).toContain('rate limit');

    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink?.textContent).toContain('Go back home');

    const backBtn = container.querySelector('button');
    expect(backBtn).not.toBeNull();
    expect(backBtn?.textContent).toContain('Go back');
  });

  it('renders French headings, security/rate-limit copy, and action CTAs', async () => {
    await renderAccessDenied('/fr/403', 'FR');
    expect(container.textContent).toContain('Accès restreint');
    expect(container.textContent).toContain('pare-feu');
    expect(container.textContent).toContain('limite');

    const homeLink = container.querySelector('a[href="/fr"]');
    expect(homeLink).not.toBeNull();
    expect(homeLink?.textContent).toContain("Retour à l'accueil");

    const backBtn = container.querySelector('button');
    expect(backBtn).not.toBeNull();
    expect(backBtn?.textContent).toContain('Page précédente');
  });
});
