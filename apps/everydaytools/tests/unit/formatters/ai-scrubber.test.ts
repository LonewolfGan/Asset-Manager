import { describe, it, expect } from 'vitest';
import {
  detectAndScrubInvisibles,
  scrubStylisticPatterns,
} from '../../../src/lib/ai-scrubber-logic';

describe('ai-scrubber-logic', () => {
  it('detects and removes zero-width and invisible unicode characters', () => {
    // text with zero-width space (U+200B) and byte order mark (U+FEFF)
    const tainted = `Hello\u200B World!\uFEFF Clean me up.`;
    const res = detectAndScrubInvisibles(tainted);

    expect(res.count).toBe(2);
    expect(res.cleanedText).toBe('Hello World! Clean me up.');
    expect(res.detections[0].codePoint).toBe('U+200B');
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
});
