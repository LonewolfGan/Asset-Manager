import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BlogToolCard, type BlogToolCardProps } from '@/components/blog/blog-tool-card';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogToolCard (TDD Phase RED)', () => {
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
    document.body.innerHTML = '';
  });

  const renderComponent = async (props: BlogToolCardProps) => {
    await act(async () => {
      root.render(React.createElement(BlogToolCard, props));
    });
  };

  describe('1. Render and Navigation', () => {
    it('renders a primary link targeting the tool route /${toolSlug}', async () => {
      await renderComponent({
        toolSlug: 'pdf-to-word',
        label: 'Convertir PDF en Word',
      });

      const card = container.querySelector('[data-testid="blog-tool-card"]') as HTMLElement;
      expect(card).not.toBeNull();

      const link = container.querySelector('a') as HTMLAnchorElement;
      expect(link).not.toBeNull();
      const href = link.getAttribute('href') || '';
      expect(href.endsWith('/pdf-to-word') || href === '/pdf-to-word').toBe(true);
    });

    it('displays the action label and optional title provided in props', async () => {
      await renderComponent({
        toolSlug: 'image-compress',
        label: 'Compresser mes images',
        title: 'Studio Compression',
      });

      expect(container.textContent).toContain('Compresser mes images');
      expect(container.textContent).toContain('Studio Compression');
    });

    it('respects lang prop for localized routing or links', async () => {
      await renderComponent({
        toolSlug: 'pdf-merge',
        label: 'Fusionner les PDF',
        lang: 'fr',
      });

      const link = container.querySelector('a') as HTMLAnchorElement;
      expect(link).not.toBeNull();
      const href = link.getAttribute('href') || '';
      expect(href.includes('pdf-merge')).toBe(true);
    });
  });

  describe('2. Double-Bezel Concentric Architecture', () => {
    it('renders outer shell and inner core with concentric radii and test id', async () => {
      await renderComponent({
        toolSlug: 'pdf-split',
        label: 'Découper le fichier',
      });

      const card = container.querySelector('[data-testid="blog-tool-card"]') as HTMLElement;
      expect(card).not.toBeNull();

      // Outer shell: rounded exterior with micro-padding
      const outerClass = card.className;
      expect(outerClass).toMatch(/rounded-(2xl|\[1\.[5-9]rem\]|\[2rem\]|3xl)/);
      expect(outerClass).toMatch(/p-(1|1\.5|2|2\.5)/);

      // Inner core: concentric calculated or scaled radius
      const core = (card.querySelector('[data-slot="core"]') ||
        card.querySelector('[data-testid="blog-tool-card-core"]') ||
        card.firstElementChild) as HTMLElement;
      expect(core).not.toBeNull();
      const coreClass = core.className;
      expect(coreClass).toMatch(/rounded-(xl|\[calc\([^)]+\)\]|lg)/);
    });

    it('applies hardware machined styling with subtle border and distinct surfaces', async () => {
      await renderComponent({
        toolSlug: 'pdf-rotate',
        label: 'Pivoter les pages',
      });

      const card = container.querySelector('[data-testid="blog-tool-card"]') as HTMLElement;
      expect(card.className).toMatch(/border/);
      expect(card.className).toMatch(/bg-/);
    });
  });

  describe('3. Button-in-Button Pattern', () => {
    it('renders CTA containing a distinct circular container for the action arrow', async () => {
      await renderComponent({
        toolSlug: 'pdf-protect',
        label: 'Sécuriser le document',
      });

      // Distinct circular icon container inside CTA
      const iconContainer = (container.querySelector('[data-slot="cta-icon"]') ||
        container.querySelector('.rounded-full, [class*="rounded-full"]')) as HTMLElement;
      expect(iconContainer).not.toBeNull();

      // Contains SVG arrow icon
      const svg = iconContainer.querySelector('svg');
      expect(svg).not.toBeNull();
    });
  });

  describe('4. Anti-Slop & Strict Technical Honesty (Adversarial)', () => {
    it('contains strictly zero decorative pill-slop marketing badges', async () => {
      await renderComponent({
        toolSlug: 'pdf-unlock',
        label: 'Déverrouiller le PDF',
      });

      const badges = container.querySelectorAll(
        '[data-slot="badge"], .badge, [class*="badge-"], [class*="bg-emerald-"], [class*="bg-green-"]'
      );
      expect(badges.length).toBe(0);
    });

    it('adversarial check: text contains zero forbidden AI buzzwords or clichés', async () => {
      await renderComponent({
        toolSlug: 'pdf-watermark',
        label: 'Ajouter un filigrane',
        title: 'Filigrane Pro',
        description: 'Appliquez un texte net ou une image en filigrane sans altération.',
      });

      const allText = (container.textContent || '').toLowerCase();
      const bannedWords = [
        '100% client-side',
        'game-changer',
        'seamless',
        'next-gen',
        'elevate your',
        'magic',
        'best tool',
        'revolutionary',
      ];

      for (const banned of bannedWords) {
        expect(allText).not.toContain(banned);
      }

      // Zero emoji in rendered tree
      const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
      expect(emojiRegex.test(allText)).toBe(false);
    });
  });

  describe('5. Variants: Sidebar vs Banner', () => {
    it('renders sidebar variant by default with vertical compact layout', async () => {
      await renderComponent({
        toolSlug: 'pdf-page-numbers',
        label: 'Numéroter le PDF',
        variant: 'sidebar',
      });

      const card = container.querySelector('[data-testid="blog-tool-card"]') as HTMLElement;
      expect(card).not.toBeNull();
      const variantAttr = card.getAttribute('data-variant') || '';
      const classes = card.className;
      expect(variantAttr === 'sidebar' || /sidebar|col|flex-col/i.test(classes)).toBe(true);
    });

    it('renders banner variant with horizontal layout and utility description', async () => {
      await renderComponent({
        toolSlug: 'pdf-page-numbers',
        label: 'Numéroter le PDF',
        title: 'Numérotation de pages',
        description: 'Positionnez et personnalisez les numéros de folio selon vos marges.',
        variant: 'banner',
      });

      const card = container.querySelector('[data-testid="blog-tool-card"]') as HTMLElement;
      expect(card).not.toBeNull();
      const variantAttr = card.getAttribute('data-variant') || '';
      const classes = card.className;
      expect(variantAttr === 'banner' || /banner|row|sm:flex-row/i.test(classes)).toBe(true);

      // Description must be rendered in banner variant
      expect(container.textContent).toContain('Positionnez et personnalisez les numéros de folio');
    });
  });

  describe('6. Robustness & Edge Cases', () => {
    it('handles actionLabel prop as alias for label', async () => {
      await renderComponent({
        toolSlug: 'odt-to-pdf',
        actionLabel: 'Convertir ODT',
      });

      expect(container.textContent).toContain('Convertir ODT');
    });

    it('handles minimal props without title or description without crashing', async () => {
      await renderComponent({
        toolSlug: 'rtf-to-pdf',
        label: 'Lancer',
      });

      const card = container.querySelector('[data-testid="blog-tool-card"]');
      expect(card).not.toBeNull();
      expect(container.textContent).toContain('Lancer');
    });
  });
});
