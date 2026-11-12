import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(__dirname, '../../../src');

const FORBIDDEN_FALSE_CLAIMS = [
  /runs entirely in (the|your) browser — no image is sent to any server/i,
  /runs entirely in (the|your) browser, with no upload to any server/i,
  /runs entirely in (the|your) browser — no server involved/i,
  /never sent to a server/i,
  /sans envoi à un serveur/i,
  /no image is sent to any server/i,
  /aucune image n'est envoyée à un serveur/i,
];

describe('Global Architectural Truth & Anti-Misleading Copy (TDD Phase RED)', () => {
  it('ensures tools-seo-data.ts contains strictly zero false serverless/browser-only claims', () => {
    const content = fs.readFileSync(path.join(SRC_DIR, 'config/tools-seo-data.ts'), 'utf8');
    FORBIDDEN_FALSE_CLAIMS.forEach((pattern) => {
      expect(pattern.test(content)).toBe(false);
    });
  });

  it('ensures tools.config.ts contains zero false claims', () => {
    const content = fs.readFileSync(path.join(SRC_DIR, 'config/tools.config.ts'), 'utf8');
    FORBIDDEN_FALSE_CLAIMS.forEach((pattern) => {
      expect(pattern.test(content)).toBe(false);
    });
  });

  it('ensures home-human-desc.ts contains zero false claims', () => {
    const content = fs.readFileSync(path.join(SRC_DIR, 'lib/home-human-desc.ts'), 'utf8');
    FORBIDDEN_FALSE_CLAIMS.forEach((pattern) => {
      expect(pattern.test(content)).toBe(false);
    });
  });

  it('ensures translations.ts wordToPdf does not claim to run in-browser without server upload', () => {
    const content = fs.readFileSync(path.join(SRC_DIR, 'i18n/translations.ts'), 'utf8');
    expect(/wordToPdf:[^}]+runs entirely in your browser/s.test(content)).toBe(false);
    expect(/wordToPdf:[^}]+s'exécute entièrement dans votre navigateur/s.test(content)).toBe(false);
  });
});
