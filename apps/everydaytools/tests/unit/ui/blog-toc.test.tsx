import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BlogToc } from '@/components/blog/blog-toc';
import type { ContentBlock } from '@/config/blog-data';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogToc (TDD Phase RED)', () => {
  let container: HTMLDivElement;
  let root: Root;

  const sampleBlocks: ContentBlock[] = [
    { type: 'p', text: 'Converting files is easy with our tool.' },
    { type: 'h2', text: 'Why convert PDF to Word' },
    { type: 'p', text: 'PDFs are fixed format, while Word documents are editable.' },
    { type: 'h3', text: 'Security and Privacy' },
    { type: 'ul', items: ['Zero uploads', 'Browser execution'] },
    { type: 'h2', text: 'Step by Step Guide' },
    { type: 'ol', items: ['Select file', 'Convert', 'Download'] },
    { type: 'h3', text: 'Troubleshooting Common Issues' },
    { type: 'callout', text: 'Always check formatting after conversion.' },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    // Mock IntersectionObserver as a constructible class
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    (window as any).IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  const renderComponent = async (props: {
    blocks?: ContentBlock[];
    activeId?: string;
    lang?: 'en' | 'fr';
  }) => {
    await act(async () => {
      root.render(React.createElement(BlogToc, props as any));
    });
  };

  describe('1. Empty and Edge Cases', () => {
    it('renders null or empty when blocks array is empty', async () => {
      await renderComponent({ blocks: [] });
      const nav = container.querySelector('nav');
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(0);
      expect(nav === null || container.innerHTML.trim() === '').toBe(true);
    });

    it('renders null or empty when blocks contain no h2 or h3 headings', async () => {
      const nonHeadingBlocks: ContentBlock[] = [
        { type: 'p', text: 'Paragraph only' },
        { type: 'ul', items: ['Item 1', 'Item 2'] },
        { type: 'callout', text: 'Note' },
      ];
      await renderComponent({ blocks: nonHeadingBlocks });
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(0);
    });

    it('handles null or undefined blocks gracefully without crashing', async () => {
      await renderComponent({ blocks: undefined });
      expect(container.querySelectorAll('a').length).toBe(0);
    });
  });

  describe('2. Heading Extraction and Anchor Generation', () => {
    it('extracts exactly h2 and h3 blocks while ignoring all other content types', async () => {
      await renderComponent({ blocks: sampleBlocks });
      const links = container.querySelectorAll('a');
      expect(links.length).toBe(4);

      const linkTexts = Array.from(links).map((a) => a.textContent?.trim());
      expect(linkTexts).toEqual([
        'Why convert PDF to Word',
        'Security and Privacy',
        'Step by Step Guide',
        'Troubleshooting Common Issues',
      ]);
    });

    it('generates coherent, URL-safe anchor hashes from heading titles', async () => {
      await renderComponent({ blocks: sampleBlocks });
      const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
      expect(hrefs).toEqual([
        '#why-convert-pdf-to-word',
        '#security-and-privacy',
        '#step-by-step-guide',
        '#troubleshooting-common-issues',
      ]);
    });

    it('sanitizes special characters, accents, and punctuation in anchor hashes', async () => {
      const complexBlocks: ContentBlock[] = [
        { type: 'h2', text: 'Édition facile & rapide (100% gratuit) !' },
        { type: 'h3', text: 'Comment ça marche ?' },
      ];
      await renderComponent({ blocks: complexBlocks });
      const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
      expect(hrefs[0]).toBeDefined();
      expect(hrefs[0]).toMatch(/^#[a-z0-9-]+$/);
      expect(hrefs[0]).not.toContain('%');
      expect(hrefs[0]).not.toContain('&');
      expect(hrefs[0]).not.toContain('(');
      expect(hrefs[0]).not.toContain('!');
    });
  });

  describe('3. Accessibility and Semantics', () => {
    it('renders a <nav> container with aria-label or data-testid="blog-toc"', async () => {
      await renderComponent({ blocks: sampleBlocks });
      const nav =
        container.querySelector('nav') ||
        container.querySelector('[data-testid="blog-toc"]');
      expect(nav).not.toBeNull();
      const ariaLabel = nav?.getAttribute('aria-label') || '';
      expect(ariaLabel.length > 0 || nav?.getAttribute('data-testid') === 'blog-toc').toBe(true);
    });

    it('displays a monospace section label according to language', async () => {
      // English label check
      await renderComponent({ blocks: sampleBlocks, lang: 'en' });
      let labelEl = container.querySelector('[data-testid="blog-toc-title"]') ||
        container.querySelector('.font-mono') ||
        container.querySelector('span, p, div, header');
      expect(container.textContent).toMatch(/TABLE OF CONTENTS|SOMMAIRE|CONTENTS|ON THIS PAGE/i);

      // French label check
      await renderComponent({ blocks: sampleBlocks, lang: 'fr' });
      expect(container.textContent).toMatch(/SOMMAIRE|TABLE DES MATIÈRES|SUR CETTE PAGE/i);
    });

    it('renders valid clickable links pointing to page anchor targets', async () => {
      await renderComponent({ blocks: sampleBlocks });
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/^#[a-z0-9-]+$/);
      });
    });
  });

  describe('4. Visual Differentiation H2 vs H3', () => {
    it('applies indentation styling or level attribute to distinguish h3 from h2', async () => {
      await renderComponent({ blocks: sampleBlocks });
      const links = Array.from(container.querySelectorAll('a'));
      expect(links.length).toBe(4);

      const h2Item = links[0]; // 'Why convert PDF to Word'
      const h3Item = links[1]; // 'Security and Privacy'

      const h2Level = h2Item.getAttribute('data-level') || h2Item.parentElement?.getAttribute('data-level');
      const h3Level = h3Item.getAttribute('data-level') || h3Item.parentElement?.getAttribute('data-level');

      const h3HasIndentClass =
        h3Item.className.includes('pl-') ||
        h3Item.className.includes('ml-') ||
        h3Item.parentElement?.className.includes('pl-') ||
        h3Item.parentElement?.className.includes('ml-');

      const h3HasInlineIndent =
        parseInt(h3Item.style.paddingLeft || h3Item.parentElement?.style.paddingLeft || '0', 10) > 0;

      // Either explicit data-level (2 vs 3) or CSS indentation class/style
      const differentiates =
        (h2Level === '2' && h3Level === '3') ||
        h3HasIndentClass ||
        h3HasInlineIndent;

      expect(differentiates).toBe(true);
    });
  });

  describe('5. Active Section Highlighting', () => {
    it('applies aria-current and active styling to link matching activeId', async () => {
      await renderComponent({ blocks: sampleBlocks, activeId: 'step-by-step-guide' });
      const activeLink = container.querySelector('a[href="#step-by-step-guide"]');
      const inactiveLink = container.querySelector('a[href="#why-convert-pdf-to-word"]');

      expect(activeLink).not.toBeNull();
      expect(inactiveLink).not.toBeNull();

      const isActive =
        activeLink?.getAttribute('aria-current') === 'true' ||
        activeLink?.getAttribute('aria-current') === 'location' ||
        activeLink?.getAttribute('data-active') === 'true' ||
        activeLink?.className.includes('accent') ||
        activeLink?.className.includes('active');

      const isInactive =
        inactiveLink?.getAttribute('aria-current') === null ||
        inactiveLink?.getAttribute('aria-current') === 'false' ||
        inactiveLink?.getAttribute('data-active') === 'false';

      expect(isActive).toBe(true);
      expect(isInactive).toBe(true);
    });

    it('updates active link when activeId prop changes', async () => {
      await renderComponent({ blocks: sampleBlocks, activeId: 'why-convert-pdf-to-word' });
      let link1 = container.querySelector('a[href="#why-convert-pdf-to-word"]');
      expect(
        link1?.getAttribute('aria-current') === 'true' ||
        link1?.getAttribute('data-active') === 'true' ||
        link1?.className.includes('active')
      ).toBe(true);

      // Re-render with new activeId
      await renderComponent({ blocks: sampleBlocks, activeId: 'security-and-privacy' });
      const link2 = container.querySelector('a[href="#security-and-privacy"]');
      link1 = container.querySelector('a[href="#why-convert-pdf-to-word"]');

      expect(
        link2?.getAttribute('aria-current') === 'true' ||
        link2?.getAttribute('data-active') === 'true' ||
        link2?.className.includes('active')
      ).toBe(true);

      expect(link1?.getAttribute('aria-current')).toBeFalsy();
    });
  });

  describe('6. Click and Navigation Behavior', () => {
    it('prevents default click event and scrolls to existing target element', async () => {
      // Add target heading element to body
      const targetSection = document.createElement('h2');
      targetSection.id = 'why-convert-pdf-to-word';
      targetSection.scrollIntoView = vi.fn();
      document.body.appendChild(targetSection);

      await renderComponent({ blocks: sampleBlocks });
      const link = container.querySelector('a[href="#why-convert-pdf-to-word"]') as HTMLAnchorElement;
      expect(link).not.toBeNull();

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

      link.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(targetSection.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' })
      );
    });

    it('handles click without crashing when target element is not present in DOM', async () => {
      await renderComponent({ blocks: sampleBlocks });
      const link = container.querySelector('a[href="#why-convert-pdf-to-word"]') as HTMLAnchorElement;
      expect(link).not.toBeNull();

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      expect(() => {
        link.dispatchEvent(clickEvent);
      }).not.toThrow();
    });
  });
});
