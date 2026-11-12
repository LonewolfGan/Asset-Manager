import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import Contact from '@/pages/contact';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Contact Page Suite', () => {
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

  const renderContact = async (localePath = '/contact', localeStorage = 'EN') => {
    window.history.pushState({}, '', localePath);
    localStorage.setItem('et:locale', localeStorage);
    await act(async () => {
      root.render(
        <HelmetProvider>
          <TooltipProvider>
            <LocaleProvider>
              <Contact />
            </LocaleProvider>
          </TooltipProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders contact page shell with zero server path leaks or legacy dummy emails', async () => {
    await renderContact('/contact');
    const fullText = container.textContent || '';

    expect(fullText).not.toContain('legal@everydaytoolshub.com');
    expect(fullText).not.toContain('security@everydaytools.app');
    expect(fullText).not.toContain('privacy@everydaytoolshub.com');
    expect(fullText).not.toContain('/tmp');
    expect(fullText).not.toContain('<uuid>');
    expect(fullText).not.toContain('—');
  });

  it('renders transverse platform FAQ in French with formats, size limits, 15-min purge, and browser support', async () => {
    await renderContact('/fr/contact', 'FR');
    const fullText = container.textContent || '';

    expect(fullText).toContain('Quels types de fichiers et formats puis-je traiter sur la plateforme ?');
    expect(fullText).toContain('Existe-t-il une limite de taille pour les fichiers importés ?');
    expect(fullText).toContain('Mes fichiers sont-ils conservés sur vos serveurs ?');
    expect(fullText).toContain('Les outils sont-ils entièrement gratuits et sans filigrane imposé ?');
    expect(fullText).toContain('La plateforme fonctionne-t-elle sur mobile et sur tous les navigateurs ?');
  });

  it('renders transverse platform FAQ in English with formats, size limits, 15-min purge, and browser support', async () => {
    await renderContact('/contact', 'EN');
    const fullText = container.textContent || '';

    expect(fullText).toContain('What file types and formats are supported across the platform?');
    expect(fullText).toContain('Are there any file size limits for uploaded documents?');
    expect(fullText).toContain('Are my uploaded files permanently stored on your servers?');
    expect(fullText).toContain('Are the tools completely free and free of forced watermarks?');
    expect(fullText).toContain('Does the platform work across all browsers and mobile devices?');
  });
});
