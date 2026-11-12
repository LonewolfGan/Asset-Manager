import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from '@/contexts/locale-context';
import { BLOG_POSTS } from '@/config/blog-data';
import BlogIndex from '@/pages/blog-index';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogIndex Pagination & Authentic Presentation Suite', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  const renderBlogIndex = async (localePath = '/en/blog') => {
    window.history.pushState({}, '', localePath);
    await act(async () => {
      root.render(
        <HelmetProvider>
          <LocaleProvider>
            <BlogIndex />
          </LocaleProvider>
        </HelmetProvider>
      );
    });
  };

  it('renders the initial page with exactly 15 blog posts on desktop (page 1)', async () => {
    window.innerWidth = 1200;
    await renderBlogIndex('/en/blog');

    const articles = container.querySelectorAll('article');
    expect(articles.length).toBe(15);

    // Verify first post title is displayed
    const firstPostTitle = BLOG_POSTS[0].title.en;
    expect(container.textContent).toContain(firstPostTitle);
  });

  it('adapts posts per page responsively (10 on tablet, 6 on mobile)', async () => {
    // Tablet
    window.innerWidth = 768;
    await renderBlogIndex('/en/blog');
    let articles = container.querySelectorAll('article');
    expect(articles.length).toBe(10);

    // Mobile
    act(() => {
      root.unmount();
    });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    window.innerWidth = 480;
    await renderBlogIndex('/en/blog');
    articles = container.querySelectorAll('article');
    expect(articles.length).toBe(6);
  });

  it('renders pagination navigation controls with total pages calculation for 15 posts per page on desktop', async () => {
    window.innerWidth = 1200;
    await renderBlogIndex('/en/blog');

    const paginationNav = container.querySelector('nav[aria-label="Pagination"]');
    expect(paginationNav).not.toBeNull();

    const expectedTotalPages = Math.ceil(BLOG_POSTS.length / 15);
    const pageButtons = paginationNav!.querySelectorAll('button');

    // Previous + Next + page number buttons
    expect(pageButtons.length).toBe(expectedTotalPages + 2);
  });

  it('styles Previous and Next buttons with zero box (no rectangular border or background box)', async () => {
    window.innerWidth = 1200;
    await renderBlogIndex('/en/blog');

    const prevButton = container.querySelector('button[aria-label="Previous page"]') as HTMLButtonElement;
    expect(prevButton).not.toBeNull();
    expect(prevButton.style.borderStyle === 'none' || prevButton.style.border === 'none').toBe(true);
    expect(['transparent', 'none', ''].includes(prevButton.style.background)).toBe(true);

    const nextButton = container.querySelector('button[aria-label="Next page"]') as HTMLButtonElement;
    expect(nextButton).not.toBeNull();
    expect(nextButton.style.borderStyle === 'none' || nextButton.style.border === 'none').toBe(true);
    expect(['transparent', 'none', ''].includes(nextButton.style.background)).toBe(true);
  });

  it('styles page number buttons as perfect circular pills with borderRadius 50%', async () => {
    window.innerWidth = 1200;
    await renderBlogIndex('/en/blog');

    const page1Button = container.querySelector('button[aria-label="Page 1"]') as HTMLButtonElement;
    expect(page1Button).not.toBeNull();
    expect(page1Button.style.borderRadius).toBe('50%');
    expect(page1Button.style.width).toBe('36px');
    expect(page1Button.style.height).toBe('36px');

    const page2Button = container.querySelector('button[aria-label="Page 2"]') as HTMLButtonElement;
    expect(page2Button).not.toBeNull();
    expect(page2Button.style.borderRadius).toBe('50%');
    expect(page2Button.style.width).toBe('36px');
    expect(page2Button.style.height).toBe('36px');
  });

  it('disables the Previous button on page 1 and marks page 1 with aria-current="page"', async () => {
    window.innerWidth = 1200;
    await renderBlogIndex('/en/blog');

    const prevButton = container.querySelector('button[aria-label="Previous page"]') as HTMLButtonElement;
    expect(prevButton).not.toBeNull();
    expect(prevButton.disabled).toBe(true);

    const page1Button = container.querySelector('button[aria-label="Page 1"]') as HTMLButtonElement;
    expect(page1Button).not.toBeNull();
    expect(page1Button.getAttribute('aria-current')).toBe('page');
  });

  it('navigates to page 2 when clicking page 2 button and renders the second slice of posts', async () => {
    window.innerWidth = 1200;
    await renderBlogIndex('/en/blog');

    const page2Button = container.querySelector('button[aria-label="Page 2"]') as HTMLButtonElement;
    expect(page2Button).not.toBeNull();

    await act(async () => {
      page2Button.click();
    });

    const articles = container.querySelectorAll('article');
    expect(articles.length).toBe(15);

    // Post at index 15 should now be visible
    const sixteenthPostTitle = BLOG_POSTS[15].title.en;
    const articleTitles = Array.from(container.querySelectorAll('article h2')).map((h2) => h2.textContent);
    expect(articleTitles).toContain(sixteenthPostTitle);

    // Page 1 post should not be in page 2
    const firstPostTitle = BLOG_POSTS[0].title.en;
    expect(articleTitles).not.toContain(firstPostTitle);

    // Previous button should now be enabled
    const prevButton = container.querySelector('button[aria-label="Previous page"]') as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);

    // Page 2 should have aria-current="page"
    expect(page2Button.getAttribute('aria-current')).toBe('page');

    // window.scrollTo was invoked
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('navigates to the last page and disables the Next button', async () => {
    window.innerWidth = 1200;
    await renderBlogIndex('/en/blog');

    const totalPages = Math.ceil(BLOG_POSTS.length / 15);
    const lastPageButton = container.querySelector(`button[aria-label="Page ${totalPages}"]`) as HTMLButtonElement;
    expect(lastPageButton).not.toBeNull();

    await act(async () => {
      lastPageButton.click();
    });

    const nextButton = container.querySelector('button[aria-label="Next page"]') as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);

    const remainingCount = BLOG_POSTS.length - (totalPages - 1) * 15;
    const articles = container.querySelectorAll('article');
    expect(articles.length).toBe(remainingCount);
  });

  it('supports Next and Previous sequential navigation', async () => {
    await renderBlogIndex('/en/blog');

    const nextButton = container.querySelector('button[aria-label="Next page"]') as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);

    await act(async () => {
      nextButton.click();
    });

    // Now on page 2
    let page2Button = container.querySelector('button[aria-label="Page 2"]') as HTMLButtonElement;
    expect(page2Button.getAttribute('aria-current')).toBe('page');

    const prevButton = container.querySelector('button[aria-label="Previous page"]') as HTMLButtonElement;
    await act(async () => {
      prevButton.click();
    });

    // Back on page 1
    const page1Button = container.querySelector('button[aria-label="Page 1"]') as HTMLButtonElement;
    expect(page1Button.getAttribute('aria-current')).toBe('page');
  });

  it('renders French labels in French locale', async () => {
    await renderBlogIndex('/fr/blog');

    const prevButton = container.querySelector('button[aria-label="Page précédente"]');
    expect(prevButton).not.toBeNull();
    expect(prevButton?.textContent).toContain('Précédent');

    const nextButton = container.querySelector('button[aria-label="Page suivante"]');
    expect(nextButton).not.toBeNull();
    expect(nextButton?.textContent).toContain('Suivant');

    // Breadcrumb and headings in French
    expect(container.textContent).toContain('Accueil');
    expect(container.textContent).toContain('Guides pratiques');
  });

  it('preserves the authentic card inline styling and typography', async () => {
    await renderBlogIndex('/en/blog');

    const firstArticle = container.querySelector('article') as HTMLElement;
    expect(firstArticle).not.toBeNull();
    expect(firstArticle.style.background).toBe('var(--bg-surface)');
    expect(firstArticle.style.border).toBe('1px solid var(--border)');
    expect(firstArticle.style.borderRadius).toBe('var(--radius-lg, 12px)');
    expect(firstArticle.style.padding).toBe('24px');

    const h2 = firstArticle.querySelector('h2') as HTMLHeadingElement;
    expect(h2).not.toBeNull();
    expect(h2.style.fontFamily).toBe('var(--font-display)');

    const span = firstArticle.querySelector('span[style*="var(--accent)"]');
    expect(span).not.toBeNull();
    expect(span?.textContent).toContain('Read guide →');
  });
});
