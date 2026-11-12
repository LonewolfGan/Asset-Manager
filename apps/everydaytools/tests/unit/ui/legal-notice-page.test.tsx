import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LegalNotice } from '@/pages/legal-notice';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('LegalNotice Page - Statutory French LCEN & GDPR Compliance Suite', () => {
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

  it('renders French statutory legal notices with mandatory LCEN information', async () => {
    window.history.pushState({}, '', '/fr/mentions-legales');
    localStorage.setItem('et:locale', 'FR');

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <LegalNotice />
          </LocaleProvider>
        </HelmetProvider>
      );
    });

    // 1. Page Title & Date
    expect(container.textContent).toContain('Mentions légales');
    expect(container.textContent).toContain('Dernière mise à jour :');

    // 2. LCEN Mandatory Identity: Publisher & Publication Director
    expect(container.textContent).toContain('Éditeur');
    expect(container.textContent).toContain('EverydayTools Hub');
    expect(container.textContent).toContain('Directeur de la publication');

    // 3. LCEN Mandatory Infrastructure Host: Oracle Cloud
    expect(container.textContent).toContain('Hébergeur de la plateforme');
    expect(container.textContent).toContain('Oracle Cloud Infrastructure');
    expect(container.textContent).toContain('Oracle France');
    expect(container.textContent).toContain('92700 Colombes');

    // 4. Intellectual Property & Ephemeral Processing
    expect(container.textContent).toContain('Propriété intellectuelle');
    expect(container.textContent).toContain('Protection des données personnelles');
  });

  it('renders English statutory legal notice with international compliance and host identification', async () => {
    window.history.pushState({}, '', '/legal-notice');
    localStorage.setItem('et:locale', 'EN');

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <LegalNotice />
          </LocaleProvider>
        </HelmetProvider>
      );
    });

    expect(container.textContent).toContain('Legal Notice');
    expect(container.textContent).toContain('Publisher');
    expect(container.textContent).toContain('Hosting Provider');
    expect(container.textContent).toContain('Oracle Cloud Infrastructure');
    expect(container.textContent).toContain('Intellectual Property');
  });

  it('uses the Resend-style layout architecture without breadcrumb or colored dashes', async () => {
    window.history.pushState({}, '', '/fr/mentions-legales');
    localStorage.setItem('et:locale', 'FR');

    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <LegalNotice />
          </LocaleProvider>
        </HelmetProvider>
      );
    });

    // Zero breadcrumb
    const breadcrumb = container.querySelector('nav[aria-label="Breadcrumb"]');
    expect(breadcrumb).toBeNull();

    // Summary MagicCard present
    const summaryCard = container.querySelector('[data-testid="legal-summary-card"]');
    expect(summaryCard).not.toBeNull();

    // Contact MagicCard present
    const inquiryCard = container.querySelector('[data-testid="legal-inquiry-card"]');
    expect(inquiryCard).not.toBeNull();

    // Zero colored accent dashes
    const accentDashes = container.querySelectorAll('.text-\\[var\\(--accent\\)\\]');
    accentDashes.forEach(el => {
      expect(el.textContent).not.toContain('—');
      expect(el.textContent).not.toContain('•');
    });
  });
});
