import { describe, it, expect } from 'vitest';
import {
  detectAndScrubInvisibles,
  scrubStylisticPatterns,
  scrubEmDashes,
  scrubAiSymbolsAndQuotes,
  scrubWhitespace,
  analyzeText,
  SAMPLE_AI_TEXT_FR,
  SAMPLE_AI_TEXT_EN,
} from '../../../src/lib/ai-scrubber-logic';

describe('ai-scrubber-logic', () => {
  it('detects and removes zero-width and invisible unicode characters', () => {
    // text with zero-width space (U+200B) and byte order mark (U+FEFF)
    const tainted = `Hello\u200B World!\uFEFF Clean me up.`;
    const res = detectAndScrubInvisibles(tainted);

    expect(res.count).toBe(2);
    expect(res.cleanedText).toBe('Hello World! Clean me up.');
    expect(res.detections[0]?.codePoint).toBe('U+200B');
  });

  it('replaces common English AI clichés with natural language', () => {
    const aiText = 'Furthermore, it is important to note that this is crucial. In conclusion, we are done.';
    const res = scrubStylisticPatterns(aiText);

    expect(res.replacedCount).toBeGreaterThanOrEqual(3);
    expect(res.cleanedText).not.toContain('Furthermore');
    expect(res.cleanedText).not.toContain('In conclusion');
  });

  it('replaces French AI clichés accurately', () => {
    const frText = 'En conclusion, force est de constater que le projet avance. De surcroît, tout fonctionne.';
    const res = scrubStylisticPatterns(frText);

    expect(res.replacedCount).toBeGreaterThanOrEqual(2);
    expect(res.cleanedText).not.toContain('En conclusion');
    expect(res.cleanedText).not.toContain('force est de constater que');
  });

  it('converts AI em-dashes and long incisions into natural punctuation', () => {
    const textWithDashes = 'L\'innovation — souvent perçue comme un défi — reste essentielle.\n— Première étape';
    const res = scrubEmDashes(textWithDashes);

    expect(res.count).toBe(3);
    expect(res.cleanedText).toContain('L\'innovation, souvent perçue comme un défi, reste essentielle.');
    expect(res.cleanedText).toContain('- Première étape');
    expect(res.cleanedText).not.toContain('—');
  });

  it('sanitizes AI decorative bullets and curly quotes', () => {
    const decorativeText = '✦ Point important avec “citation” et ‘terme’.';
    const res = scrubAiSymbolsAndQuotes(decorativeText);

    expect(res.count).toBeGreaterThanOrEqual(5);
    expect(res.cleanedText).toContain('- Point important avec "citation" et \'terme\'.');
    expect(res.cleanedText).not.toContain('✦');
    expect(res.cleanedText).not.toContain('“');
    expect(res.cleanedText).not.toContain('”');
  });

  it('normalizes redundant whitespaces and consecutive blank lines', () => {
    const redundant = 'Texte   avec   espaces.\n\n\n\nAutre ligne.';
    const res = scrubWhitespace(redundant);

    expect(res.cleanedText).toBe('Texte avec espaces.\n\nAutre ligne.');
  });

  it('analyzes text accurately and counts all anomalies', () => {
    const analysisFr = analyzeText(SAMPLE_AI_TEXT_FR);
    expect(analysisFr.wordCount).toBeGreaterThan(10);
    expect(analysisFr.charCount).toBeGreaterThan(50);
    expect(analysisFr.invisiblesCount).toBeGreaterThanOrEqual(2);
    expect(analysisFr.emDashesCount).toBeGreaterThanOrEqual(2);
    expect(analysisFr.symbolsCount).toBeGreaterThanOrEqual(2);
    expect(analysisFr.stylisticCount).toBeGreaterThanOrEqual(2);

    const analysisEn = analyzeText(SAMPLE_AI_TEXT_EN);
    expect(analysisEn.wordCount).toBeGreaterThan(10);
    expect(analysisEn.charCount).toBeGreaterThan(50);
    expect(analysisEn.invisiblesCount).toBeGreaterThanOrEqual(2);
    expect(analysisEn.emDashesCount).toBeGreaterThanOrEqual(2);
    expect(analysisEn.symbolsCount).toBeGreaterThanOrEqual(2);
    expect(analysisEn.stylisticCount).toBeGreaterThanOrEqual(2);
  });

  it('strictly preserves paragraph breaks (\\n\\n) during stylistic pattern scrubbing', () => {
    const multiParagraph = 'Premier paragraphe.\n\nDeuxième paragraphe avec furthermore important.\n\nTroisième paragraphe.';
    const res = scrubStylisticPatterns(multiParagraph);

    expect(res.cleanedText).toContain('Premier paragraphe.\n\n');
    expect(res.cleanedText).toContain('\n\nTroisième paragraphe.');
    expect(res.cleanedText.split('\n\n')).toHaveLength(3);
  });

  it('normalizes typographical fixed spaces (\\u2000-\\u200A) to standard space instead of fusing words', () => {
    // en-space (U+2002) and em-space (U+2003)
    const spaced = 'Mot1\u2002Mot2\u2003Mot3';
    const res = scrubWhitespace(spaced);

    expect(res.cleanedText).toBe('Mot1 Mot2 Mot3');
    expect(res.cleanedText).not.toBe('Mot1Mot2Mot3');
  });
});
