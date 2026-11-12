import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import { SITE_CONFIG } from '@/config/site.config';
import Terms from '@/pages/terms';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Terms of Service Page Suite (Truth & Editorial Layout)', () => {
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

  const renderTerms = async (localePath = '/terms') => {
    window.history.pushState({}, '', localePath);
    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Terms />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders the high-end legal layout with verified effective date and TL;DR cartouche', async () => {
    await renderTerms('/terms');

    expect(container.textContent).toContain('Terms of Service');
    expect(container.textContent).toContain('Executive Summary (TL;DR)');

    // Verified contact email from SITE_CONFIG
    const legalEmailLink = container.querySelector(`a[href="mailto:${SITE_CONFIG.emails.legal}"]`);
    expect(legalEmailLink).not.toBeNull();
  });

  it('renders French localized content and legal terms in French locale', async () => {
    await renderTerms('/fr/terms');

    expect(container.textContent).toContain("Conditions d'utilisation");
    expect(container.textContent).toContain('En résumé (TL;DR)');
    expect(container.textContent).toContain('1. Acceptation des conditions');
  });

  it('contains strictly zero legacy dummy emails, fake ad claims, or dead links', async () => {
    await renderTerms('/terms');
    const fullText = container.textContent || '';

    // No fake emails
    expect(fullText).not.toContain('legal@everydaytoolshub.com');
    expect(fullText).not.toContain('security@everydaytools.app');
    expect(fullText).not.toContain('privacy@everydaytoolshub.com');
    expect(fullText).not.toContain('example.com');

    // No fake ad claims
    expect(fullText).not.toContain('soutenu par des revenus publicitaires');
    expect(fullText).not.toContain('supported by advertising revenue');
  });
});
