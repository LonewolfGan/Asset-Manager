import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  BlogContentRenderer,
  type BlogContentRendererProps,
} from '@/components/blog/blog-content-renderer';
import type { ContentBlock } from '@/config/blog-data';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogContentRenderer (TDD Phase RED)', () => {
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

  const renderComponent = async (props: BlogContentRendererProps) => {
    await act(async () => {
      root.render(React.createElement(BlogContentRenderer, props));
    });
  };

  const sampleBlocks: ContentBlock[] = [
    { type: 'p', text: 'Introductory paragraph discussing file conversion.' },
    { type: 'h2', text: 'Why convert PDF to Word?' },
    { type: 'p', text: 'PDFs are fixed format, whereas Word documents are editable.' },
    { type: 'h3', text: 'Sécurité et Confidentialité' },
    { type: 'ul', items: ['Zero upload to server', 'Client-side processing', 'Instant result'] },
    { type: 'h2', text: 'Step-by-step Guide' },
    { type: 'ol', items: ['Select your PDF', 'Wait for conversion', 'Download DOCX'] },
    { type: 'callout', text: 'Your files are processed directly on your device.' },
  ];

  describe('1. Headings H2 & H3 (Anchors & Scroll Offset)', () => {
    it('renders h2 and h3 elements with deterministic slugified id attributes', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const h2Elements = container.querySelectorAll('h2');
      const h3Elements = container.querySelectorAll('h3');

      expect(h2Elements.length).toBe(2);
      expect(h3Elements.length).toBe(1);

      expect(h2Elements[0].textContent).toContain('Why convert PDF to Word?');
      expect(h2Elements[0].getAttribute('id')).toBe('why-convert-pdf-to-word');

      expect(h3Elements[0].textContent).toContain('Sécurité et Confidentialité');
      expect(h3Elements[0].getAttribute('id')).toBe('securite-et-confidentialite');

      expect(h2Elements[1].textContent).toContain('Step-by-step Guide');
      expect(h2Elements[1].getAttribute('id')).toBe('step-by-step-guide');
    });

    it('applies scroll-mt class to prevent headings from being obscured by sticky headers', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const headings = container.querySelectorAll('h2, h3');
      expect(headings.length).toBeGreaterThan(0);

      headings.forEach((heading) => {
        const className = heading.className || '';
        expect(className).toMatch(/scroll-mt-(?:16|20|24|28|32)/);
      });
    });

    it('generates distinct unique IDs when multiple headings share the same text', async () => {
      const duplicateBlocks: ContentBlock[] = [
        { type: 'h2', text: 'Overview' },
        { type: 'p', text: 'First overview section' },
        { type: 'h2', text: 'Overview' },
        { type: 'p', text: 'Second overview section' },
      ];

      await renderComponent({ blocks: duplicateBlocks });

      const h2Elements = container.querySelectorAll('h2');
      expect(h2Elements.length).toBe(2);

      const id1 = h2Elements[0].getAttribute('id');
      const id2 = h2Elements[1].getAttribute('id');

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toBe('overview');
      expect(id2).toBe('overview-1');
    });
  });

  describe('2. Paragraphs P (Editorial Typography)', () => {
    it('renders paragraph elements with exact content and editorial leading class', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThanOrEqual(2);

      const firstP = paragraphs[0];
      expect(firstP.textContent).toBe('Introductory paragraph discussing file conversion.');
      expect(firstP.className).toMatch(/leading-(?:relaxed|loose|7|8)/);
    });
  });

  describe('3. Lists UL & OL (Hierarchy and Ordering)', () => {
    it('renders unordered list ul with all li items', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const ul = container.querySelector('ul');
      expect(ul).not.toBeNull();

      const items = ul!.querySelectorAll('li');
      expect(items.length).toBe(3);
      expect(items[0].textContent).toBe('Zero upload to server');
      expect(items[1].textContent).toBe('Client-side processing');
      expect(items[2].textContent).toBe('Instant result');
    });

    it('renders ordered list ol with all li items preserving sequential order', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const ol = container.querySelector('ol');
      expect(ol).not.toBeNull();

      const items = ol!.querySelectorAll('li');
      expect(items.length).toBe(3);
      expect(items[0].textContent).toContain('Select your PDF');
      expect(items[1].textContent).toContain('Wait for conversion');
      expect(items[2].textContent).toContain('Download DOCX');
    });

    it('renders stylized machined step counter badges for ordered step lists', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const ol = container.querySelector('ol');
      expect(ol).not.toBeNull();

      const badges = ol!.querySelectorAll('span[aria-hidden="true"]');
      expect(badges.length).toBe(3);
      expect(badges[0].textContent?.trim()).toBe('01');
      expect(badges[1].textContent?.trim()).toBe('02');
      expect(badges[2].textContent?.trim()).toBe('03');
    });

    it('renders clean editorial typographic indicators for unordered list items without orange accent slop', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const ul = container.querySelector('ul');
      expect(ul).not.toBeNull();

      const items = ul!.querySelectorAll('li');
      expect(items.length).toBe(3);

      // Verify ZERO orange accent slop on bullet points and clean typographic before dash
      items.forEach((item) => {
        const className = item.className || '';
        expect(className).toContain("before:content-['—']");
        expect(className).not.toContain('var(--accent)');
        expect(className).not.toContain('bg-[var(--accent)]');
      });
    });
  });

  describe('4. Callout Elements (Editorial Pull-Quote & Zero Slop)', () => {
    it('renders callout container with dedicated data attribute and exact text', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const callout = container.querySelector(
        '[data-slot="callout"], [data-testid="blog-callout"]'
      ) as HTMLElement;
      expect(callout).not.toBeNull();
      expect(callout.textContent).toContain('Your files are processed directly on your device.');
    });

    it('applies refined editorial pull-quote styling with border-l and zero box-slop or orange accent badges', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const callout = container.querySelector(
        '[data-slot="callout"], [data-testid="blog-callout"]'
      ) as HTMLElement;
      expect(callout).not.toBeNull();

      const className = callout.className || '';
      expect(className).toMatch(/border-l/);
      expect(className).not.toMatch(/bg-gradient/);
      expect(className).not.toMatch(/border-l-\[var\(--accent\)\]/);
    });

    it('contains strictly zero emojis in callout text and icons (Anti-Slop rule)', async () => {
      await renderComponent({ blocks: sampleBlocks });

      const callout = container.querySelector(
        '[data-slot="callout"], [data-testid="blog-callout"]'
      ) as HTMLElement;
      expect(callout).not.toBeNull();

      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(emojiRegex.test(callout.textContent || '')).toBe(false);
    });
  });

  describe('5. Robustness & Edge Cases', () => {
    it('handles empty blocks array without crashing', async () => {
      await renderComponent({ blocks: [] });
      expect(container.querySelectorAll('h2, h3, p, ul, ol').length).toBe(0);
    });

    it('handles undefined or null blocks prop safely', async () => {
      await renderComponent({ blocks: undefined } as any);
      expect(container.querySelectorAll('h2, h3, p, ul, ol').length).toBe(0);
    });

    it('skips unknown or malformed block types gracefully', async () => {
      const mixedBlocks = [
        { type: 'p', text: 'Valid paragraph' },
        { type: 'unknown_type', foo: 'bar' } as any,
        { type: null } as any,
        { type: 'h2', text: 'Valid heading' },
      ];

      await renderComponent({ blocks: mixedBlocks });

      expect(container.querySelectorAll('p').length).toBe(1);
      expect(container.querySelectorAll('h2').length).toBe(1);
    });

    it('handles empty list items arrays without error', async () => {
      const emptyListBlocks: ContentBlock[] = [
        { type: 'ul', items: [] },
        { type: 'ol', items: [] },
      ];

      await renderComponent({ blocks: emptyListBlocks });
      expect(container.querySelectorAll('li').length).toBe(0);
    });

    it('applies custom className to the root container if provided', async () => {
      await renderComponent({
        blocks: [{ type: 'p', text: 'Custom class test' }],
        className: 'custom-prose-container',
      });

      const rootElement = container.firstElementChild as HTMLElement;
      expect(rootElement).not.toBeNull();
      expect(rootElement.className).toContain('custom-prose-container');
    });
  });
});
