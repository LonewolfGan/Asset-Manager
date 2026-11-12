import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import Changelog from '@/pages/changelog';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Changelog & Product Updates Page Suite', () => {
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

  const renderChangelog = async (localePath = '/changelog', localeStorage = 'EN') => {
    window.history.pushState({}, '', localePath);
    localStorage.setItem('et:locale', localeStorage);

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Changelog />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders French changelog heading, releases, and engine highlights', async () => {
    await renderChangelog('/fr/changelog', 'FR');

    expect(container.textContent).toContain('Mises à jour');
    expect(container.textContent).toContain('v2.4.0');
    expect(container.textContent).toContain('Refonte Haute Fidélité');
    expect(container.textContent).toContain('v2.3.0');
    expect(container.textContent).toContain('QPDF');
    expect(container.textContent).toContain('Ghostscript');
  });

  it('renders English changelog heading, releases, and engine highlights', async () => {
    await renderChangelog('/en/changelog', 'EN');

    expect(container.textContent).toContain('Changelog');
    expect(container.textContent).toContain('v2.4.0');
    expect(container.textContent).toContain('High-Fidelity Resend Architecture');
    expect(container.textContent).toContain('v2.2.0');
    expect(container.textContent).toContain('Ghostscript');
  });

  it('renders version pills, metrics, and associated tool tags', async () => {
    await renderChangelog('/fr/changelog', 'FR');

    // Version pill
    expect(container.textContent).toContain('v2.4.0');
    // Metrics
    expect(container.textContent).toContain('< 120ms');
    expect(container.textContent).toContain('AES-256 bit');
    // Tools
    expect(container.textContent).toContain('Protéger PDF');
  });

  it('uses full-width container-wide layout with top breadcrumb navigation', async () => {
    await renderChangelog('/fr/changelog', 'FR');

    expect(container.querySelector('.container-wide')).not.toBeNull();
    expect(container.textContent).toContain('Accueil');
    expect(container.textContent).toContain('Mises à jour');
    expect(container.querySelectorAll('[data-testid="changelog-item"]').length).toBeGreaterThan(0);
  });
});
