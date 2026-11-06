import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import BlogPost from '@/pages/blog-post';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogPost Page Integration (TDD Phase RED)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

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

  const renderBlogPost = async (slug: string) => {
    await act(async () => {
      root.render(
        React.createElement(
          HelmetProvider,
          null,
          React.createElement(
            LocaleProvider,
            null,
            React.createElement(BlogPost, { params: { slug } })
          )
        )
      );
    });
  };

  describe('1. 404 Not Found Handling', () => {
    it('renders NotFound view when slug does not correspond to any known post', async () => {
      await renderBlogPost('unknown-non-existent-article-slug');
      expect(container.textContent).toContain('404');
      expect(container.querySelector('[data-testid="blog-progress-bar"]')).toBeNull();
      expect(container.querySelector('[data-testid="blog-toc"]')).toBeNull();
    });

    it('renders NotFound view when slug is empty', async () => {
      await renderBlogPost('');
      expect(container.textContent).toContain('404');
    });
  });

  describe('2. Valid Article Rendering & Core Components Integration', () => {
    const validSlug = 'how-to-convert-pdf-to-word';

    it('renders the reading progress bar (BlogProgressBar)', async () => {
      await renderBlogPost(validSlug);
      const progressBar = container.querySelector('[data-testid="blog-progress-bar"]');
      expect(progressBar).not.toBeNull();
      expect(progressBar?.getAttribute('role')).toBe('progressbar');
    });

    it('renders breadcrumb navigation with links to Home and Blog', async () => {
      await renderBlogPost(validSlug);
      const breadcrumb = container.querySelector('nav[aria-label="Breadcrumb"]');
      expect(breadcrumb).not.toBeNull();

      const links = breadcrumb?.querySelectorAll('a');
      expect(links?.length).toBeGreaterThanOrEqual(2);
      const hrefs = Array.from(links || []).map((l) => l.getAttribute('href'));
      expect(hrefs).toContain('/');
      expect(hrefs.some((h) => h?.includes('/blog'))).toBe(true);
    });

    it('renders article metadata with date and reading minutes formatted with Geist Mono font', async () => {
      await renderBlogPost(validSlug);
      const header = container.querySelector('header');
      expect(header).not.toBeNull();
      expect(header?.textContent).toMatch(/min read|min de lecture/i);

      const monoMeta = header?.querySelector('.font-mono, [style*="font-mono"], [style*="var(--font-mono)"]');
      expect(monoMeta).not.toBeNull();
    });

    it('renders the article H1 title and description subtitle', async () => {
      await renderBlogPost(validSlug);
      const h1 = container.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toContain('How to Convert a PDF to Word');

      const text = container.textContent || '';
      expect(text).toContain('Learn how to convert any PDF');
    });

    it('renders interactive Table of Contents (BlogToc) with heading anchor targets', async () => {
      await renderBlogPost(validSlug);
      const toc = container.querySelector('[data-testid="blog-toc"]');
      expect(toc).not.toBeNull();

      const tocLinks = toc?.querySelectorAll('a');
      expect(tocLinks?.length).toBeGreaterThan(0);
    });

    it('renders article content via BlogContentRenderer with anchored headings and scroll margin', async () => {
      await renderBlogPost(validSlug);
      const headings = container.querySelectorAll('article h2, article h3');
      expect(headings.length).toBeGreaterThan(0);

      headings.forEach((heading) => {
        expect(heading.getAttribute('id')).toBeTruthy();
        expect(heading.className).toMatch(/scroll-mt-/);
      });
    });

    it('renders dual tool cards (BlogToolCard) for both sticky sidebar and bottom banner', async () => {
      await renderBlogPost(validSlug);
      const toolCards = container.querySelectorAll('[data-testid="blog-tool-card"]');
      expect(toolCards.length).toBeGreaterThanOrEqual(2);

      const sidebarCard = container.querySelector('[data-testid="blog-tool-card"][data-variant="sidebar"]');
      const bannerCard = container.querySelector('[data-testid="blog-tool-card"][data-variant="banner"]');

      expect(sidebarCard).not.toBeNull();
      expect(bannerCard).not.toBeNull();
    });

    it('renders related articles recommendations grid (BlogRelatedPosts)', async () => {
      await renderBlogPost(validSlug);
      const relatedSection = container.querySelector('[data-testid="blog-related-posts"]');
      expect(relatedSection).not.toBeNull();

      const relatedLinks = relatedSection?.querySelectorAll('a');
      expect(relatedLinks?.length).toBeGreaterThan(0);
      const hrefs = Array.from(relatedLinks || []).map((l) => l.getAttribute('href') || '');
      expect(hrefs.some((h) => h.includes(validSlug))).toBe(false);
    });
  });

  describe('3. Asymmetric Studio Layout & Sticky Sidebar', () => {
    it('structures content in an asymmetric grid with a sticky sidebar on desktop', async () => {
      await renderBlogPost('how-to-convert-pdf-to-word');
      const grid = container.querySelector('.lg\\:grid, [class*="lg:grid-cols"]');
      expect(grid).not.toBeNull();

      const stickySidebar = container.querySelector('.sticky, [class*="sticky"]');
      expect(stickySidebar).not.toBeNull();
    });
  });

  describe('4. French Localization & Slug Resolution', () => {
    it('correctly loads and displays post content when French slug is accessed', async () => {
      await renderBlogPost('comment-convertir-pdf-en-word');
      const h1 = container.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toContain('Comment convertir un PDF en Word');
    });
  });

  describe('5. Anti-Slop & Quality Gates', () => {
    it('contains zero gratuitous pill-slop decorative badges', async () => {
      await renderBlogPost('how-to-convert-pdf-to-word');
      const pillSlopBadges = container.querySelectorAll('.badge-pill, .pill-badge, [class*="pill-gradient"]');
      expect(pillSlopBadges.length).toBe(0);
    });

    it('does not contain false claims such as "100% client-side"', async () => {
      await renderBlogPost('how-to-convert-pdf-to-word');
      const text = container.textContent || '';
      expect(text.toLowerCase()).not.toContain('100% client-side');
    });
  });
});
