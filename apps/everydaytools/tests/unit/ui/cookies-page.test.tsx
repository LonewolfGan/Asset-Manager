import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Cookies } from '@/pages/cookies';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Cookies Page - CNIL & GDPR Tracker Compliance Suite', () => {
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

  it('renders French cookie policy with mandatory CNIL disclosures and tracker inventory', async () => {
    window.history.pushState({}, '', '/fr/cookies');
    localStorage.setItem('et:locale', 'FR');

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Cookies />
          </LocaleProvider>
        </HelmetProvider>
      );
    });

    // 1. Page Title & Date
    expect(container.textContent).toContain('Politique des cookies et traceurs');
    expect(container.textContent).toContain('Dernière mise à jour :');

    // 2. Executive Summary TL;DR
    expect(container.textContent).toContain('En résumé (Transparence traceurs)');
    expect(container.textContent).toContain('Zéro cookie publicitaire tiers');

    // 3. Technical inventory table
    expect(container.textContent).toContain('et:theme');
    expect(container.textContent).toContain('et:locale');
    expect(container.textContent).toContain('et_consent');
    expect(container.textContent).toContain('Exempté de consentement');

    // 4. CNIL compliance and management
    expect(container.textContent).toContain('Recommandations CNIL');
    expect(container.textContent).toContain('Personnaliser mes préférences');
  });

  it('renders English cookie policy with technical tracker transparency', async () => {
    window.history.pushState({}, '', '/en/cookies');
    localStorage.setItem('et:locale', 'EN');

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Cookies />
          </LocaleProvider>
        </HelmetProvider>
      );
    });

    expect(container.textContent).toContain('Cookie & Tracker Policy');
    expect(container.textContent).toContain('Last update:');
    expect(container.textContent).toContain('Summary (Tracker Transparency)');
    expect(container.textContent).toContain('Zero third-party advertising cookies');
    expect(container.textContent).toContain('Customize my preferences');
  });

  it('triggers the et:show-consent event when the preference management button is clicked', async () => {
    window.history.pushState({}, '', '/fr/cookies');
    localStorage.setItem('et:locale', 'FR');

    const consentListener = vi.fn();
    window.addEventListener('et:show-consent', consentListener);

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Cookies />
          </LocaleProvider>
        </HelmetProvider>
      );
    });

    const triggerBtn = container.querySelector('[data-testid="open-cookie-preferences-btn"]') as HTMLButtonElement;
    expect(triggerBtn).not.toBeNull();

    await act(async () => {
      triggerBtn.click();
    });

    expect(consentListener).toHaveBeenCalledTimes(1);
    window.removeEventListener('et:show-consent', consentListener);
  });

  it('uses the Resend-style layout architecture without breadcrumb or colored dashes', async () => {
    window.history.pushState({}, '', '/fr/cookies');
    localStorage.setItem('et:locale', 'FR');

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <Cookies />
          </LocaleProvider>
        </HelmetProvider>
      );
    });

    expect(container.querySelector('[aria-label="Breadcrumb"]')).toBeNull();
    expect(container.textContent).not.toContain('text-[var(--accent)] —');
    expect(container.querySelector('[data-testid="legal-summary-card"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="legal-inquiry-card"]')).not.toBeNull();
  });
});
