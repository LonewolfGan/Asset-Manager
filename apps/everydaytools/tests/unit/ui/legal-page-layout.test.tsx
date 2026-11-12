import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('LegalPageLayout - Editorial High-End Legal Component Suite', () => {
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

  const mockProps = {
    title: "Conditions d'utilisation",
    badge: "Légal & Transparence",
    effectiveDate: "7 novembre 2026",
    summaryTitle: "En résumé (TL;DR)",
    summaryPoints: [
      "EverydayTools est 100% gratuit et sans création de compte.",
      "Zéro conservation de vos fichiers : suppression automatique après traitement.",
      "Vous conservez l'entière propriété et les droits d'auteur sur vos documents.",
    ],
    tocTitle: "Sommaire",
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptation des conditions",
        content: <p>Texte de la section 1</p>,
      },
      {
        id: "files-and-data",
        title: "2. Vos fichiers et données",
        content: <p>Texte de la section 2</p>,
      },
    ],
    contactTitle: "Une question juridique ?",
    contactText: "Notre équipe légale est joignable directement.",
    contactEmail: "legal@everydaytools.qzz.io",
    lang: "fr" as const,
  };

  it('strictly eliminates any breadcrumb per Resend specification and renders clean header', async () => {
    await act(async () => {
      root.render(<LegalPageLayout {...mockProps} />);
    });

    // Verify complete absence of breadcrumb
    const breadcrumb = container.querySelector('nav[aria-label="Breadcrumb"]');
    expect(breadcrumb).toBeNull();

    expect(container.textContent).toContain("Conditions d'utilisation");
    expect(container.textContent).toContain("7 novembre 2026");
  });

  it('renders the Executive Summary (TL;DR) in a dedicated sculpted summary card', async () => {
    await act(async () => {
      root.render(<LegalPageLayout {...mockProps} />);
    });

    const summaryCard = container.querySelector('[data-testid="legal-summary-card"]');
    expect(summaryCard).not.toBeNull();

    expect(container.textContent).toContain("En résumé (TL;DR)");
    expect(container.textContent).toContain("EverydayTools est 100% gratuit et sans création de compte.");
    expect(container.textContent).toContain("Zéro conservation de vos fichiers : suppression automatique après traitement.");
    expect(container.textContent).toContain("Vous conservez l'entière propriété et les droits d'auteur sur vos documents.");
  });

  it('renders in Resend-style centered editorial container with max-w-4xl', async () => {
    await act(async () => {
      root.render(<LegalPageLayout {...mockProps} />);
    });

    // Verify absence of any sidebar TOC rail
    const tocNav = container.querySelector('nav[aria-label="Table des matières"], nav[aria-label="Table of contents"], aside');
    expect(tocNav).toBeNull();

    // Verify Resend-inspired reading container
    const resendContainer = container.querySelector('.max-w-4xl');
    expect(resendContainer).not.toBeNull();
  });

  it('renders sections linearly without any two-column FAQ grid', async () => {
    await act(async () => {
      root.render(<LegalPageLayout {...mockProps} />);
    });

    // Verify absence of FAQ 2-column grid
    const faqLeftCol = container.querySelector('.md\\:col-span-4');
    const faqRightCol = container.querySelector('.md\\:col-span-8');
    expect(faqLeftCol).toBeNull();
    expect(faqRightCol).toBeNull();
  });

  it('strictly bans colored accent dashes and points from lists', async () => {
    await act(async () => {
      root.render(<LegalPageLayout {...mockProps} />);
    });

    // Verify no text-[var(--accent)] is applied to dashes/bullets
    const accentDashes = container.querySelectorAll('.text-\\[var\\(--accent\\)\\]');
    accentDashes.forEach(el => {
      expect(el.textContent).not.toContain('—');
      expect(el.textContent).not.toContain('•');
    });
  });

  it('renders all semantic sections with corresponding IDs and titles', async () => {
    await act(async () => {
      root.render(<LegalPageLayout {...mockProps} />);
    });

    const section1 = container.querySelector('section#acceptance');
    expect(section1).not.toBeNull();
    expect(section1?.textContent).toContain('1. Acceptation des conditions');
    expect(section1?.textContent).toContain('Texte de la section 1');

    const section2 = container.querySelector('section#files-and-data');
    expect(section2).not.toBeNull();
    expect(section2?.textContent).toContain('2. Vos fichiers et données');
    expect(section2?.textContent).toContain('Texte de la section 2');
  });

  it('renders the bottom Contact Inquiry Card with verified email mailto link', async () => {
    await act(async () => {
      root.render(<LegalPageLayout {...mockProps} />);
    });

    const inquiryCard = container.querySelector('[data-testid="legal-inquiry-card"]');
    expect(inquiryCard).not.toBeNull();

    const emailLink = container.querySelector('a[href="mailto:legal@everydaytools.qzz.io"]');
    expect(emailLink).not.toBeNull();
    expect(emailLink?.textContent).toContain('legal@everydaytools.qzz.io');
    expect(container.textContent).toContain('Une question juridique ?');
  });
});
