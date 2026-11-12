import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { BLOG_POSTS, type BlogPost } from '@/config/blog-data';

const POSTS_DIR = path.resolve(__dirname, '../../../src/config/blog-posts');
const BLOG_DATA_PATH = path.resolve(__dirname, '../../../src/config/blog-data.ts');

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

// Anti-Slop: Zero AI em-dash '—' tics in titles and post descriptions
const FORBIDDEN_AI_EM_DASH = /—/;

describe('Blog Posts Truth & Architecture Integrity (TDD Phase RED)', () => {
  const REQUIRED_POST_FILES = [
    'pdf-to-word.ts',
    'pdf-compress.ts',
    'background-remover.ts',
    'heic-to-jpg.ts',
    'password-generator.ts',
    'webp-vs-jpeg-vs-png.ts',
    'pdf-merge.ts',
    'word-to-pdf.ts',
    'pdf-split.ts',
    'jpg-to-pdf.ts',
    'pdf-protect.ts',
    'ocr.ts',
    'images-convert.ts',
  ];

  it('has a modular directory structure under src/config/blog-posts with 1 file per post', () => {
    expect(fs.existsSync(POSTS_DIR)).toBe(true);
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
    expect(files.length).toBeGreaterThanOrEqual(13);
    REQUIRED_POST_FILES.forEach((postFile) => {
      expect(fs.existsSync(path.join(POSTS_DIR, postFile))).toBe(true);
    });
  });

  it('enforces Anti-Monolith gate: blog-data.ts is an aggregator < 100 LOC and each post file is < 200 LOC', () => {
    const blogDataContent = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
    const blogDataLines = blogDataContent.split('\n').length;
    expect(blogDataLines).toBeLessThan(100);

    if (fs.existsSync(POSTS_DIR)) {
      const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.ts'));
      files.forEach((file) => {
        const postPath = path.join(POSTS_DIR, file);
        const lines = fs.readFileSync(postPath, 'utf8').split('\n').length;
        expect(lines).toBeLessThan(200);
      });
    }
  });

  it('preserves all 13 core post slugs and languages without regression', () => {
    expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(13);
    const expectedEnSlugs = [
      'how-to-convert-pdf-to-word',
      'how-to-compress-pdf',
      'how-to-remove-image-background',
      'how-to-convert-heic-to-jpg',
      'how-to-generate-strong-password',
      'webp-vs-jpeg-vs-png',
      'how-to-merge-pdf-files',
      'how-to-convert-word-to-pdf',
      'how-to-split-a-pdf',
      'how-to-convert-jpg-to-pdf',
      'how-to-password-protect-a-pdf',
      'how-to-extract-text-from-an-image',
      'how-to-convert-images-online',
    ];

    const expectedFrSlugs = [
      'comment-convertir-pdf-en-word',
      'comment-compresser-un-pdf',
      'comment-supprimer-fond-image',
      'comment-convertir-heic-en-jpg',
      'comment-creer-mot-de-passe-fort',
      'webp-vs-jpeg-vs-png',
      'comment-fusionner-des-fichiers-pdf',
      'comment-convertir-word-en-pdf',
      'comment-diviser-un-fichier-pdf',
      'comment-convertir-jpg-en-pdf',
      'comment-proteger-un-pdf-par-mot-de-passe',
      'comment-extraire-texte-dune-image',
      'comment-convertir-des-images-en-ligne',
    ];

    const currentEnSlugs = BLOG_POSTS.map((p) => p.slug.en);
    expectedEnSlugs.forEach((slug) => {
      expect(currentEnSlugs).toContain(slug);
    });

    const currentFrSlugs = BLOG_POSTS.map((p) => p.slug.fr);
    expectedFrSlugs.forEach((slug) => {
      expect(currentFrSlugs).toContain(slug);
    });
  });

  it('contains strictly zero misleading client-only or browser-only claims across all posts', () => {
    const violations: { tool: string; pattern: string; text: string }[] = [];

    BLOG_POSTS.forEach((post: BlogPost) => {
      const allTexts: string[] = [
        post.title.en,
        post.title.fr,
        post.description.en,
        post.description.fr,
      ];

      ['en', 'fr'].forEach((lang) => {
        const blocks = post.content[lang as 'en' | 'fr'] || [];
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

  it('contains strictly zero AI em-dash punctuation tics in post titles and descriptions', () => {
    BLOG_POSTS.forEach((post: BlogPost) => {
      expect(FORBIDDEN_AI_EM_DASH.test(post.title.en)).toBe(false);
      expect(FORBIDDEN_AI_EM_DASH.test(post.title.fr)).toBe(false);
      expect(FORBIDDEN_AI_EM_DASH.test(post.description.en)).toBe(false);
      expect(FORBIDDEN_AI_EM_DASH.test(post.description.fr)).toBe(false);
    });
  });
});
