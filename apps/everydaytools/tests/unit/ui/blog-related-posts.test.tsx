import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BlogRelatedPosts, type BlogRelatedPostsProps } from '@/components/blog/blog-related-posts';
import type { BlogPost } from '@/config/blog-data';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const createMockPost = (enSlug: string, frSlug: string, enTitle: string, frTitle: string, mins: number): BlogPost => ({
  slug: { en: enSlug, fr: frSlug },
  title: { en: enTitle, fr: frTitle },
  description: { en: `Desc ${enTitle}`, fr: `Desc ${frTitle}` },
  keywords: { en: ['pdf', 'doc'], fr: ['pdf', 'doc'] },
  publishedAt: '2025-05-15',
  readingMinutes: mins,
  relatedToolSlug: 'pdf-tool',
  relatedToolLabel: { en: 'Tool', fr: 'Outil' },
  content: { en: [], fr: [] },
});

const mockPosts: BlogPost[] = [
  createMockPost('pdf-to-word', 'pdf-en-word', 'How to convert PDF to Word', 'Comment convertir un PDF en Word', 5),
  createMockPost('compress-pdf', 'compresser-pdf', 'Compress PDF files easily', 'Compresser des fichiers PDF', 3),
  createMockPost('merge-pdf', 'fusionner-pdf', 'Merge Multiple PDF pages', 'Fusionner plusieurs PDF', 4),
  createMockPost('remove-bg', 'supprimer-fond', 'Remove Image Background Fast', 'Supprimer le fond rapidement', 2),
];

describe('BlogRelatedPosts (TDD Phase RED)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => { root.unmount(); });
    container.remove();
    document.body.innerHTML = '';
  });

  const renderComponent = async (props: BlogRelatedPostsProps) => {
    await act(async () => {
      root.render(React.createElement(BlogRelatedPosts, props));
    });
  };

  describe('1. Exclusion of Current Article', () => {
    it('never renders the post matching currentSlug in English', async () => {
      await renderComponent({ currentSlug: 'pdf-to-word', posts: mockPosts, lang: 'en' });
      const text = container.textContent || '';
      expect(text).not.toContain('How to convert PDF to Word');
      const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href') || '');
      expect(hrefs.some((h) => h.includes('pdf-to-word'))).toBe(false);
    });

    it('never renders the post matching currentSlug in French even if requested in English', async () => {
      await renderComponent({ currentSlug: 'pdf-en-word', posts: mockPosts, lang: 'en' });
      const text = container.textContent || '';
      expect(text).not.toContain('How to convert PDF to Word');
      const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href') || '');
      expect(hrefs.some((h) => h.includes('pdf-to-word') || h.includes('pdf-en-word'))).toBe(false);
    });

    it('excludes current article when using default global BLOG_POSTS', async () => {
      await renderComponent({ currentSlug: 'how-to-convert-pdf-to-word', lang: 'en' });
      const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href') || '');
      expect(hrefs.some((h) => h.includes('how-to-convert-pdf-to-word'))).toBe(false);
      expect(hrefs.some((h) => h.includes('comment-convertir-pdf-en-word'))).toBe(false);
    });
  });

  describe('2. Post Selection & Responsive Grid', () => {
    it('renders at most 3 related posts by default', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'en' });
      const cards = container.querySelectorAll('[data-testid="blog-related-post-card"], article');
      expect(cards.length).toBeLessThanOrEqual(3);
      expect(cards.length).toBe(3);
    });

    it('respects maxPosts parameter when specified', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, maxPosts: 2, lang: 'en' });
      const cards = container.querySelectorAll('[data-testid="blog-related-post-card"], article');
      expect(cards.length).toBe(2);
    });

    it('renders cards in a responsive grid container', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'en' });
      const grid = container.querySelector('[data-testid="blog-related-posts-grid"]') || container.querySelector('.grid');
      expect(grid).not.toBeNull();
      expect(grid?.className || '').toContain('grid');
    });
  });

  describe('3. Metadata, Content & Localization', () => {
    it('renders English titles, formatted date and reading time for lang="en"', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'en' });
      const text = container.textContent || '';
      expect(text).toContain('Compress PDF files easily');
      expect(text).toMatch(/min read/i);
      expect(text).toMatch(/2025/);
    });

    it('renders French titles, formatted date and reading time for lang="fr"', async () => {
      await renderComponent({ currentSlug: 'supprimer-fond', posts: mockPosts, lang: 'fr' });
      const text = container.textContent || '';
      expect(text).toContain('Compresser des fichiers PDF');
      expect(text).toMatch(/min de lecture/i);
      expect(text).toMatch(/2025/);
    });

    it('defaults to English when lang prop is omitted', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts });
      const text = container.textContent || '';
      expect(text).toContain('Compress PDF files easily');
      expect(text).toMatch(/min read/i);
    });
  });

  describe('4. Links and Navigation', () => {
    it('renders valid anchor links matching /${lang}/blog/${post.slug[lang]}', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'fr' });
      const links = Array.from(container.querySelectorAll('a'));
      expect(links.length).toBeGreaterThan(0);
      const hrefs = links.map((a) => a.getAttribute('href') || '');
      expect(hrefs.some((h) => h === '/fr/blog/compresser-pdf' || h.endsWith('/compresser-pdf'))).toBe(true);
    });

    it('formats English links targeting /en/blog/${slug.en}', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'en' });
      const links = Array.from(container.querySelectorAll('a'));
      const hrefs = links.map((a) => a.getAttribute('href') || '');
      expect(hrefs.some((h) => h === '/en/blog/compress-pdf' || h.endsWith('/compress-pdf'))).toBe(true);
    });
  });

  describe('5. Semantics and Accessibility', () => {
    it('renders a section landmark with accessible title and test id', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'en' });
      const section = container.querySelector('[data-testid="blog-related-posts"]') || container.querySelector('section');
      expect(section).not.toBeNull();
      const heading = container.querySelector('h2, h3');
      expect(heading).not.toBeNull();
      expect(heading?.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('displays localized section title in French and English', async () => {
      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'fr' });
      const textFr = container.textContent || '';
      expect(
        textFr.includes('À lire') ||
        textFr.includes('Articles connexes') ||
        textFr.includes('Guides') ||
        textFr.includes('lecture')
      ).toBe(true);

      await renderComponent({ currentSlug: 'remove-bg', posts: mockPosts, lang: 'en' });
      const textEn = container.textContent || '';
      expect(
        textEn.includes('Related') ||
        textEn.includes('reading') ||
        textEn.includes('Guides')
      ).toBe(true);
    });
  });

  describe('6. Edge Cases & Resilience', () => {
    it('returns null or empty container when posts array is empty', async () => {
      await renderComponent({ currentSlug: 'any-slug', posts: [], lang: 'en' });
      const cards = container.querySelectorAll('[data-testid="blog-related-post-card"], article');
      expect(cards.length).toBe(0);
    });

    it('returns null or empty container when currentSlug is the only post in dataset', async () => {
      await renderComponent({ currentSlug: 'pdf-to-word', posts: [mockPosts[0]], lang: 'en' });
      const cards = container.querySelectorAll('[data-testid="blog-related-post-card"], article');
      expect(cards.length).toBe(0);
    });

    it('handles non-existent currentSlug without crashing', async () => {
      await renderComponent({ currentSlug: 'non-existent-article-slug', posts: mockPosts, lang: 'en' });
      const cards = container.querySelectorAll('[data-testid="blog-related-post-card"], article');
      expect(cards.length).toBe(3);
    });

    it('handles undefined or malformed inputs gracefully', async () => {
      await renderComponent({ currentSlug: '', posts: undefined, lang: undefined });
      const section = container.querySelector('[data-testid="blog-related-posts"]') || container.querySelector('section');
      expect(section).not.toBeNull();
    });
  });
});
