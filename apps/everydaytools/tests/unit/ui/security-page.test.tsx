import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import { SITE_CONFIG } from '@/config/site.config';
import Security from '@/pages/security';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Security Page Suite (Truth, Architecture & Responsible Disclosure)', () => {
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

  const renderSecurity = async (localePath = '/security') => {
    window.history.pushState({}, '', localePath);
    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Security />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders the high-end legal layout with verified security email and TL;DR cartouche', async () => {
    await renderSecurity('/security');

    expect(container.textContent).toContain('Security');
    expect(container.textContent).toContain('Executive Summary (TL;DR)');

    // Verified contact email from SITE_CONFIG
    const securityEmailLink = container.querySelector(`a[href="mailto:${SITE_CONFIG.emails.security}"]`);
    expect(securityEmailLink).not.toBeNull();

    // RFC 9116 link
    const rfcLink = container.querySelector('a[href="/.well-known/security.txt"]');
    expect(rfcLink).not.toBeNull();
  });

  it('renders French localized content in French locale', async () => {
    await renderSecurity('/fr/security');

    expect(container.textContent).toContain('Sécurité');
    expect(container.textContent).toContain('En résumé (TL;DR)');
    expect(container.textContent).toContain('1. Signalement responsable de vulnérabilités');
  });

  it('contains strictly zero leaked internal file paths, ports, or UIDs', async () => {
    await renderSecurity('/security');
    const fullText = container.textContent || '';

    // No leaked internal paths
    expect(fullText).not.toContain('/tmp');
    expect(fullText).not.toContain('UID 10001');
    expect(fullText).not.toContain('Port 3001');
    expect(fullText).not.toContain('port 3001');

    // No wrong domains or legacy dummy emails
    expect(fullText).not.toContain('security@everydaytools.app');
    expect(fullText).not.toContain('everydaytools.app');
  });
});
