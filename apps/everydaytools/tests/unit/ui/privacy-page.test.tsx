import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import { SITE_CONFIG } from '@/config/site.config';
import Privacy from '@/pages/privacy';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Privacy Policy Page Suite (Truth & Editorial Layout)', () => {
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

  const renderPrivacy = async (localePath = '/privacy') => {
    window.history.pushState({}, '', localePath);
    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Privacy />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders the high-end legal layout with verified effective date and TL;DR cartouche', async () => {
    await renderPrivacy('/privacy');

    expect(container.textContent).toContain('Privacy Policy');
    expect(container.textContent).toContain('Executive Summary (TL;DR)');

    // Verified contact email from SITE_CONFIG
    const privacyEmailLink = container.querySelector(`a[href="mailto:${SITE_CONFIG.emails.privacy}"]`);
    expect(privacyEmailLink).not.toBeNull();
  });

  it('renders French localized content in French locale', async () => {
    await renderPrivacy('/fr/privacy');

    expect(container.textContent).toContain('Politique de confidentialité');
    expect(container.textContent).toContain('En résumé (TL;DR)');
    expect(container.textContent).toContain('1. Principes fondamentaux');
  });

  it('contains strictly zero legacy dummy emails, fake ad claims, or AdSense references', async () => {
    await renderPrivacy('/privacy');
    const fullText = container.textContent || '';

    // No fake emails
    expect(fullText).not.toContain('privacy@everydaytoolshub.com');
    expect(fullText).not.toContain('legal@everydaytoolshub.com');
    expect(fullText).not.toContain('security@everydaytools.app');

    // No fake ad claims or Google AdSense references
    expect(fullText).not.toContain('Google AdSense');
    expect(fullText).not.toContain('Ads keep our tools free');
    expect(fullText).not.toContain('Les publicités permettent de maintenir');
  });
});
