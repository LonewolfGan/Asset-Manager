import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import * as blogDataModule from '@/config/blog-data';
import type { BlogPost } from '@/config/blog-types';

export type BlogCategory = 'pdf' | 'image' | 'documents' | 'security';

interface BlogDataExports {
  BLOG_POSTS: (BlogPost & { category?: BlogCategory })[];
  BLOG_CATEGORIES?: Array<{ id: BlogCategory | 'all'; label: { en: string; fr: string } }>;
  filterBlogPosts?: (
    posts: (BlogPost & { category?: BlogCategory })[],
    category: BlogCategory | 'all',
    query: string,
    lang: 'en' | 'fr'
  ) => (BlogPost & { category?: BlogCategory })[];
  getCategoryPostCount?: (
    posts: (BlogPost & { category?: BlogCategory })[],
    category: BlogCategory | 'all'
  ) => number;
}

const {
  BLOG_POSTS,
  BLOG_CATEGORIES,
  filterBlogPosts,
  getCategoryPostCount,
} = blogDataModule as unknown as BlogDataExports;

const POSTS_DIR = path.resolve(__dirname, '../../../src/config/blog-posts');
const BLOG_DATA_PATH = path.resolve(__dirname, '../../../src/config/blog-data.ts');

const VALID_CATEGORIES: BlogCategory[] = ['pdf', 'image', 'documents', 'security'];

const REQUIRED_NEW_PILLAR_POSTS = [
  'pdf-rotate',
  'pdf-unlock',
  'pdf-watermark',
  'pdf-page-numbers',
  'pdf-to-epub',
  'pdf-to-image',
  'pdf-metadata',
  'svg-to-png',
  'heic-to-pdf',
  'markdown-to-pdf',
] as const;

const FORBIDDEN_MISLEADING_PATTERNS = [
  /runs entirely in (the|your) browser/i,
  /entirely in your browser/i,
  /never sent to a server/i,
  /not uploaded to any server/i,
  /no files are uploaded/i,
  /no upload to servers/i,
  /sans envoi à un serveur/i,
  /aucun fichier n'est téléversé/i,
  /files? never leaves? your device/i,
  /leaves? your device/i,
  /browser-only/i,
];

const FORBIDDEN_AI_EM_DASH = /—/;

describe('Blog Programmatic Pillar Matrix & Taxonomy (TDD Phase RED)', () => {
  describe('1. Category Registry & Coverage', () => {
    it('exports BLOG_CATEGORIES with "all" and the 4 canonical categories', () => {
      expect(BLOG_CATEGORIES).toBeDefined();
      expect(Array.isArray(BLOG_CATEGORIES)).toBe(true);
      expect(BLOG_CATEGORIES!.length).toBe(5);

      const categoryIds = BLOG_CATEGORIES!.map((c) => c.id);
      expect(categoryIds).toEqual(['all', 'pdf', 'image', 'documents', 'security']);

      BLOG_CATEGORIES!.forEach((cat) => {
        expect(cat.label.en).toBeDefined();
        expect(cat.label.en.trim().length).toBeGreaterThan(0);
        expect(cat.label.fr).toBeDefined();
        expect(cat.label.fr.trim().length).toBeGreaterThan(0);
      });
    });

    it('enforces that every post in BLOG_POSTS has a valid category in [pdf, image, documents, security]', () => {
      expect(BLOG_POSTS).toBeDefined();
      expect(BLOG_POSTS.length).toBeGreaterThan(0);

      BLOG_POSTS.forEach((post) => {
        expect(post).toHaveProperty('category');
        expect(VALID_CATEGORIES).toContain(post.category);
      });
    });
  });

  describe('2. Total Post Count & 10 New Pillar Posts Coverage', () => {
    it('contains at least 23 posts in BLOG_POSTS (13 existing + 10 new pillar posts)', () => {
      expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(23);
    });

    it('contains all 10 new pillar posts registered with matching relatedToolSlug and localized metadata', () => {
      const toolSlugs = BLOG_POSTS.map((p) => p.relatedToolSlug);

      REQUIRED_NEW_PILLAR_POSTS.forEach((slug) => {
        expect(toolSlugs).toContain(slug);

        const post = BLOG_POSTS.find((p) => p.relatedToolSlug === slug);
        expect(post).toBeDefined();
        expect(post!.slug.en.trim().length).toBeGreaterThan(0);
        expect(post!.slug.fr.trim().length).toBeGreaterThan(0);
        expect(post!.title.en.trim().length).toBeGreaterThan(0);
        expect(post!.title.fr.trim().length).toBeGreaterThan(0);
        expect(post!.description.en.trim().length).toBeGreaterThan(0);
        expect(post!.description.fr.trim().length).toBeGreaterThan(0);
        expect(post!.keywords.en.length).toBeGreaterThanOrEqual(3);
        expect(post!.keywords.fr.length).toBeGreaterThanOrEqual(3);
        expect(post!.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(post!.readingMinutes).toBeGreaterThan(0);
        expect(post!.content.en.length).toBeGreaterThanOrEqual(3);
        expect(post!.content.fr.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('ensures each of the 10 new pillar post files physically exists in src/config/blog-posts/', () => {
      REQUIRED_NEW_PILLAR_POSTS.forEach((slug) => {
        const filePath = path.join(POSTS_DIR, `${slug}.ts`);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });
  });

  describe('3. Post Modularity & Anti-Monolith LOC Limits', () => {
    it('enforces that every post file in src/config/blog-posts/*.ts is strictly < 150 LOC', () => {
      expect(fs.existsSync(POSTS_DIR)).toBe(true);
      const postFiles = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');

      expect(postFiles.length).toBeGreaterThanOrEqual(23);

      postFiles.forEach((file) => {
        const filePath = path.join(POSTS_DIR, file);
        const lines = fs.readFileSync(filePath, 'utf8').split('\n').length;
        expect(lines).toBeLessThan(150);
      });
    });

    it('enforces that blog-data.ts aggregator remains strictly lean < 150 LOC', () => {
      expect(fs.existsSync(BLOG_DATA_PATH)).toBe(true);
      const blogDataLines = fs.readFileSync(BLOG_DATA_PATH, 'utf8').split('\n').length;
      expect(blogDataLines).toBeLessThan(150);
    });
  });

  describe('4. Editorial Truthfulness & Anti-Slop Sanity', () => {
    it('contains strictly zero misleading client-only or browser-only claims across all posts', () => {
      const violations: { tool: string; pattern: string; text: string }[] = [];

      BLOG_POSTS.forEach((post) => {
        const allTexts: string[] = [
          post.title?.en ?? '',
          post.title?.fr ?? '',
          post.description?.en ?? '',
          post.description?.fr ?? '',
        ];

        ['en', 'fr'].forEach((lang) => {
          const blocks = post.content?.[lang as 'en' | 'fr'] || [];
          blocks.forEach((block) => {
            if ('text' in block && typeof block.text === 'string') {
              allTexts.push(block.text);
            }
            if ('items' in block && Array.isArray(block.items)) {
              allTexts.push(...block.items);
            }
          });
        });

        allTexts.forEach((text) => {
          FORBIDDEN_MISLEADING_PATTERNS.forEach((pattern) => {
            if (pattern.test(text)) {
              violations.push({ tool: post.relatedToolSlug, pattern: pattern.toString(), text });
            }
          });
        });
      });

      expect(violations).toEqual([]);
    }, 15_000);

    it('contains strictly zero AI em-dash "—" punctuation tics in post titles and descriptions', () => {
      BLOG_POSTS.forEach((post) => {
        expect(FORBIDDEN_AI_EM_DASH.test(post.title?.en ?? '')).toBe(false);
        expect(FORBIDDEN_AI_EM_DASH.test(post.title?.fr ?? '')).toBe(false);
        expect(FORBIDDEN_AI_EM_DASH.test(post.description?.en ?? '')).toBe(false);
        expect(FORBIDDEN_AI_EM_DASH.test(post.description?.fr ?? '')).toBe(false);
      });
    });
  });

  describe('5. Search & Taxonomy Filtering (filterBlogPosts)', () => {
    it('is exported as a function', () => {
      expect(filterBlogPosts).toBeDefined();
      expect(typeof filterBlogPosts).toBe('function');
    });

    it('filters by query across titles, descriptions, and keywords (case-insensitive)', () => {
      expect(typeof filterBlogPosts).toBe('function');
      const resultsEn = filterBlogPosts!(BLOG_POSTS, 'all', 'rotate', 'en');
      expect(resultsEn.some((p) => p.relatedToolSlug === 'pdf-rotate')).toBe(true);

      const resultsCase = filterBlogPosts!(BLOG_POSTS, 'all', 'ROTATE', 'en');
      expect(resultsCase.some((p) => p.relatedToolSlug === 'pdf-rotate')).toBe(true);
    });

    it('filters strictly by category when category != "all"', () => {
      expect(typeof filterBlogPosts).toBe('function');
      const imagePosts = filterBlogPosts!(BLOG_POSTS, 'image', '', 'en');
      expect(imagePosts.length).toBeGreaterThan(0);
      imagePosts.forEach((post) => {
        expect(post.category).toBe('image');
      });
    });

    it('returns empty array when query does not match any post', () => {
      expect(typeof filterBlogPosts).toBe('function');
      const results = filterBlogPosts!(BLOG_POSTS, 'pdf', 'nonexistentquery123', 'en');
      expect(results).toEqual([]);
    });

    it('returns empty array when post matches query but does not match selected category', () => {
      expect(typeof filterBlogPosts).toBe('function');
      // "rotate" is a pdf tool, filtering with category "security" must yield empty
      const results = filterBlogPosts!(BLOG_POSTS, 'security', 'rotate', 'en');
      expect(results.some((p) => p.relatedToolSlug === 'pdf-rotate')).toBe(false);
    });

    it('handles query trimming and French locale searches', () => {
      expect(typeof filterBlogPosts).toBe('function');
      const trimmedResults = filterBlogPosts!(BLOG_POSTS, 'all', '   rotate   ', 'en');
      expect(trimmedResults.some((p) => p.relatedToolSlug === 'pdf-rotate')).toBe(true);

      const frenchResults = filterBlogPosts!(BLOG_POSTS, 'all', 'pivoter', 'fr');
      expect(frenchResults.length).toBeGreaterThan(0);
    });

    it('returns all posts when category is "all" and query is empty', () => {
      expect(typeof filterBlogPosts).toBe('function');
      const allResults = filterBlogPosts!(BLOG_POSTS, 'all', '', 'en');
      expect(allResults.length).toBe(BLOG_POSTS.length);
    });

    it('adversarial: handles empty array input gracefully', () => {
      expect(typeof filterBlogPosts).toBe('function');
      const emptyResults = filterBlogPosts!([], 'all', 'rotate', 'en');
      expect(emptyResults).toEqual([]);
    });
  });

  describe('6. Category Post Count Invariants (getCategoryPostCount)', () => {
    it('is exported as a function', () => {
      expect(getCategoryPostCount).toBeDefined();
      expect(typeof getCategoryPostCount).toBe('function');
    });

    it('returns total post count when category is "all"', () => {
      expect(typeof getCategoryPostCount).toBe('function');
      expect(getCategoryPostCount!(BLOG_POSTS, 'all')).toBe(BLOG_POSTS.length);
    });

    it('returns accurate count per canonical category', () => {
      expect(typeof getCategoryPostCount).toBe('function');
      const pdfCount = getCategoryPostCount!(BLOG_POSTS, 'pdf');
      const expectedPdf = BLOG_POSTS.filter((p) => p.category === 'pdf').length;
      expect(pdfCount).toBe(expectedPdf);
      expect(pdfCount).toBeGreaterThan(0);

      const imageCount = getCategoryPostCount!(BLOG_POSTS, 'image');
      const expectedImage = BLOG_POSTS.filter((p) => p.category === 'image').length;
      expect(imageCount).toBe(expectedImage);
      expect(imageCount).toBeGreaterThan(0);

      const docCount = getCategoryPostCount!(BLOG_POSTS, 'documents');
      const expectedDoc = BLOG_POSTS.filter((p) => p.category === 'documents').length;
      expect(docCount).toBe(expectedDoc);

      const secCount = getCategoryPostCount!(BLOG_POSTS, 'security');
      const expectedSec = BLOG_POSTS.filter((p) => p.category === 'security').length;
      expect(secCount).toBe(expectedSec);
    });

    it('satisfies additive partition invariant: sum(categories) === count("all")', () => {
      expect(typeof getCategoryPostCount).toBe('function');
      const sum =
        getCategoryPostCount!(BLOG_POSTS, 'pdf') +
        getCategoryPostCount!(BLOG_POSTS, 'image') +
        getCategoryPostCount!(BLOG_POSTS, 'documents') +
        getCategoryPostCount!(BLOG_POSTS, 'security');

      expect(sum).toBe(getCategoryPostCount!(BLOG_POSTS, 'all'));
    });

    it('adversarial: handles empty array input gracefully without crashing', () => {
      expect(typeof getCategoryPostCount).toBe('function');
      expect(getCategoryPostCount!([], 'all')).toBe(0);
      expect(getCategoryPostCount!([], 'pdf')).toBe(0);
      expect(getCategoryPostCount!([], 'image')).toBe(0);
    });
  });
});
