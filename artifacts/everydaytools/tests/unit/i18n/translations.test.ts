import { describe, it, expect } from 'vitest';
import { TRANSLATIONS as translations, type Locale } from '@/i18n/translations';

const locales: Locale[] = ['EN', 'FR'];

describe('Translations — all locales present', () => {
  it('EN and FR both defined', () => {
    expect(translations.EN).toBeDefined();
    expect(translations.FR).toBeDefined();
  });
});

describe('Translations — structural completeness', () => {
  for (const locale of locales) {
    it(`${locale}: nav section`, () => {
      expect(translations[locale].nav.searchPlaceholder).toBeTruthy();
      expect(typeof translations[locale].nav.groups).toBe('object');
    });

    it(`${locale}: home section`, () => {
      expect(translations[locale].home.title).toBeTruthy();
      expect(translations[locale].home.subtitle).toBeTruthy();
      expect(typeof translations[locale].home.allToolsSubtitle).toBe('function');
    });

    it(`${locale}: ui section`, () => {
      expect(translations[locale].ui.dropzone).toBeTruthy();
      expect(typeof translations[locale].ui.dropzoneHint).toBe('function');
    });

    it(`${locale}: footer section`, () => {
      expect(translations[locale].footer.tagline).toBeTruthy();
      expect(translations[locale].footer.privacyPolicy).toBeTruthy();
    });

    it(`${locale}: tipCalc section`, () => {
      expect(translations[locale].tipCalc.billAmount).toBeTruthy();
      expect(translations[locale].tipCalc.numPeople).toBeTruthy();
    });
  }
});

describe('Translations — EN and FR diverge', () => {
  it('home subtitle differs between locales', () => {
    expect(translations.EN.home.subtitle).not.toBe(translations.FR.home.subtitle);
  });

  it('dropzone label differs between locales', () => {
    expect(translations.EN.ui.dropzone).not.toBe(translations.FR.ui.dropzone);
  });
});

describe('Translations — functions work correctly', () => {
  it('EN allToolsSubtitle(87) returns a string', () => {
    const s = translations.EN.home.allToolsSubtitle(87);
    expect(typeof s).toBe('string');
    expect(s.length).toBeGreaterThan(0);
  });

  it('EN dropzoneHint returns string with size info', () => {
    const s = translations.EN.ui.dropzoneHint('.pdf', 10);
    expect(typeof s).toBe('string');
    expect(s).toContain('10');
  });

  it('FR dropzoneHint returns non-empty string', () => {
    const s = translations.FR.ui.dropzoneHint('.pdf', 10);
    expect(s.length).toBeGreaterThan(0);
  });
});

describe('Translations — no empty tool translation keys', () => {
  const enTools = Object.entries(translations.EN.tools);
  it(`EN has tool translations`, () => {
    expect(enTools.length).toBeGreaterThan(10);
  });

  it('every EN tool entry has title and description', () => {
    for (const [slug, entry] of enTools) {
      expect(entry.title, `${slug} missing title`).toBeTruthy();
      expect(entry.description, `${slug} missing description`).toBeTruthy();
    }
  });

  it('FR has at least as many tool translations as EN', () => {
    const frCount = Object.keys(translations.FR.tools).length;
    const enCount = enTools.length;
    expect(frCount).toBeGreaterThanOrEqual(enCount);
  });
});
