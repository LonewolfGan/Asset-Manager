import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '@/i18n/translations';
import { tools as allTools } from '@/config/tools.config';
import {
  SLUG_MAP_EN_TO_INTERNAL,
  SLUG_MAP_FR_TO_INTERNAL,
} from '@/config/tools-seo-data';

describe('i18n Audit — 1. Translations & Slugs Completeness', () => {
  const toolSlugs = allTools.map((t) => t.slug);

  it('all tools defined in tools.config.ts have translations in EN', () => {
    const missingInEn: string[] = [];
    for (const slug of toolSlugs) {
      if (!TRANSLATIONS.EN.tools[slug]) {
        missingInEn.push(slug);
      }
    }
    expect(missingInEn, `Missing tools in TRANSLATIONS.EN: ${missingInEn.join(', ')}`).toEqual([]);
  });

  it('all tools defined in tools.config.ts have translations in FR', () => {
    const missingInFr: string[] = [];
    for (const slug of toolSlugs) {
      if (!TRANSLATIONS.FR.tools[slug]) {
        missingInFr.push(slug);
      }
    }
    expect(missingInFr, `Missing tools in TRANSLATIONS.FR: ${missingInFr.join(', ')}`).toEqual([]);
  });

  it('recursive structural parity between EN and FR catalogs', () => {
    const findMismatches = (enObj: any, frObj: any, path: string = ''): { missingInFr: string[]; missingInEn: string[]; typeMismatches: string[]; emptyStrings: string[] } => {
      const missingInFr: string[] = [];
      const missingInEn: string[] = [];
      const typeMismatches: string[] = [];
      const emptyStrings: string[] = [];

      const enKeys = Object.keys(enObj);
      const frKeys = Object.keys(frObj);

      for (const k of enKeys) {
        const currentPath = path ? `${path}.${k}` : k;
        if (!(k in frObj)) {
          missingInFr.push(currentPath);
        } else {
          const enVal = enObj[k];
          const frVal = frObj[k];
          const enType = typeof enVal;
          const frType = typeof frVal;

          if (enType !== frType) {
            typeMismatches.push(`${currentPath} (EN: ${enType}, FR: ${frType})`);
          } else if (enType === 'object' && enVal !== null && frVal !== null && !Array.isArray(enVal)) {
            const nested = findMismatches(enVal, frVal, currentPath);
            missingInFr.push(...nested.missingInFr);
            missingInEn.push(...nested.missingInEn);
            typeMismatches.push(...nested.typeMismatches);
            emptyStrings.push(...nested.emptyStrings);
          } else if (enType === 'string') {
            if (enVal.trim() === '') emptyStrings.push(`EN:${currentPath}`);
            if (frVal.trim() === '') emptyStrings.push(`FR:${currentPath}`);
          }
        }
      }

      for (const k of frKeys) {
        const currentPath = path ? `${path}.${k}` : k;
        if (!(k in enObj)) {
          missingInEn.push(currentPath);
        }
      }

      return { missingInFr, missingInEn, typeMismatches, emptyStrings };
    };

    const result = findMismatches(TRANSLATIONS.EN, TRANSLATIONS.FR);
    expect(result.missingInFr, `Keys present in EN but missing in FR: ${result.missingInFr.slice(0, 10).join(', ')}`).toEqual([]);
    expect(result.missingInEn, `Keys present in FR but missing in EN: ${result.missingInEn.slice(0, 10).join(', ')}`).toEqual([]);
    expect(result.typeMismatches, `Type mismatches between EN and FR: ${result.typeMismatches.join(', ')}`).toEqual([]);
    expect(result.emptyStrings, `Empty translation strings: ${result.emptyStrings.join(', ')}`).toEqual([]);
  });
});

describe('i18n Audit — 2. Placeholders & Functions Contract Parity', () => {
  it('functional translations return non-empty strings with expected arguments', () => {
    const fnChecks: [string, (...args: any[]) => string, (...args: any[]) => string, any[]][] = [
      ['home.allToolsSubtitle', TRANSLATIONS.EN.home.allToolsSubtitle, TRANSLATIONS.FR.home.allToolsSubtitle, [50]],
      ['home.toolCount', TRANSLATIONS.EN.home.toolCount, TRANSLATIONS.FR.home.toolCount, [12]],
      ['home.resultCount', TRANSLATIONS.EN.home.resultCount, TRANSLATIONS.FR.home.resultCount, [5]],
      ['home.noResults', TRANSLATIONS.EN.home.noResults, TRANSLATIONS.FR.home.noResults, ['pdf']],
      ['ui.dropzoneHint', TRANSLATIONS.EN.ui.dropzoneHint, TRANSLATIONS.FR.ui.dropzoneHint, ['.pdf', 25]],
      ['ui.fileExceedsSize', TRANSLATIONS.EN.ui.fileExceedsSize, TRANSLATIONS.FR.ui.fileExceedsSize, ['doc.pdf', 50]],
      ['ui.formatNotAccepted', TRANSLATIONS.EN.ui.formatNotAccepted, TRANSLATIONS.FR.ui.formatNotAccepted, ['doc.exe']],
      ['ui.uploadAriaLabel', TRANSLATIONS.EN.ui.uploadAriaLabel, TRANSLATIONS.FR.ui.uploadAriaLabel, ['Upload', 'PDF', 10]],
      ['ui.defaultUploadAriaLabel', TRANSLATIONS.EN.ui.defaultUploadAriaLabel, TRANSLATIONS.FR.ui.defaultUploadAriaLabel, ['PDF', 10]],
      ['ui.removeFileAria', TRANSLATIONS.EN.ui.removeFileAria, TRANSLATIONS.FR.ui.removeFileAria, ['file.png']],
    ];

    for (const [name, enFn, frFn, args] of fnChecks) {
      const enRes = enFn(...args);
      const frRes = frFn(...args);

      expect(typeof enRes).toBe('string');
      expect(enRes.length, `EN ${name} returned empty string`).toBeGreaterThan(0);
      expect(typeof frRes).toBe('string');
      expect(frRes.length, `FR ${name} returned empty string`).toBeGreaterThan(0);
    }
  });

  it('string templates preserve parameter placeholders between EN and FR', () => {
    const placeholderRegex = /\{([a-zA-Z0-9_-]+)\}/g;
    const extractPlaceholders = (str: string): string[] => {
      const matches: string[] = [];
      let m;
      while ((m = placeholderRegex.exec(str)) !== null) {
        matches.push(m[1]);
      }
      return matches.sort();
    };

    const checkPlaceholdersRecursively = (enObj: any, frObj: any, path: string = ''): string[] => {
      const errors: string[] = [];
      for (const k of Object.keys(enObj)) {
        const cur = path ? `${path}.${k}` : k;
        if (typeof enObj[k] === 'string' && typeof frObj[k] === 'string') {
          const enP = extractPlaceholders(enObj[k]);
          const frP = extractPlaceholders(frObj[k]);
          if (enP.join(',') !== frP.join(',')) {
            errors.push(`${cur}: EN has {${enP.join(',')}} but FR has {${frP.join(',')}}`);
          }
        } else if (typeof enObj[k] === 'object' && enObj[k] !== null && typeof frObj[k] === 'object' && frObj[k] !== null) {
          errors.push(...checkPlaceholdersRecursively(enObj[k], frObj[k], cur));
        }
      }
      return errors;
    };

    const errors = checkPlaceholdersRecursively(TRANSLATIONS.EN, TRANSLATIONS.FR);
    expect(errors, `Placeholder mismatches: ${errors.join('; ')}`).toEqual([]);
  });
});

describe('i18n Audit — 3. Fallbacks & SEO Routing', () => {
  it('all tool slugs have valid SEO routing mappings', () => {
    const toolSlugs = allTools.map((t) => t.slug);
    const unmappedSlugs: string[] = [];

    for (const slug of toolSlugs) {
      const enResolved = SLUG_MAP_EN_TO_INTERNAL[slug] ?? slug;
      const frResolved = SLUG_MAP_FR_TO_INTERNAL[slug] ?? slug;

      if (!enResolved || !frResolved) {
        unmappedSlugs.push(slug);
      }
    }

    expect(unmappedSlugs).toEqual([]);
  });
});
