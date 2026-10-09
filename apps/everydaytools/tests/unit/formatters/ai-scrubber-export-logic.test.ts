import { describe, it, expect } from 'vitest';
import {
  executeTextScrubbing,
  formatAnomaliesSummary,
} from '@/lib/ai-scrubber-export-logic';
import { analyzeText } from '@/lib/ai-scrubber-logic';

describe('AI Text Scrubber Export and Execution Logic', () => {
  it('executes full pipeline cleaning when all options are active', () => {
    const raw = "Hello\u200B world—this is a tapestry of ideas.  \n\n✦ Great point!";
    const result = executeTextScrubbing(raw, {
      invisibles: true,
      emDashes: true,
      stylistic: true,
      symbols: true,
      whitespace: true,
    });

    expect(result.outputText).not.toContain('\u200B');
    expect(result.outputText).not.toContain('—');
    expect(result.outputText).not.toContain('✦');
    expect(result.totalModified).toBeGreaterThan(0);
    expect(result.invCount).toBe(1);
    expect(result.emCount).toBe(1);
  });

  it('respects selective option toggles', () => {
    const raw = "Hello\u200B world—test";
    // Only remove invisibles, keep emDashes
    const resOnlyInv = executeTextScrubbing(raw, {
      invisibles: true,
      emDashes: false,
      stylistic: false,
      symbols: false,
      whitespace: false,
    });

    expect(resOnlyInv.outputText).not.toContain('\u200B');
    expect(resOnlyInv.outputText).toContain('—');
    expect(resOnlyInv.emCount).toBe(0);
  });

  it('formats human-readable summary of anomalies', () => {
    const textWithAnomalies = "Hello\u200B world—delve into ✦ this";
    const analysis = analyzeText(textWithAnomalies);
    const summaryFr = formatAnomaliesSummary(analysis, true);
    expect(summaryFr).toContain('inv.');
    expect(summaryFr).toContain('tirets');

    const summaryEn = formatAnomaliesSummary(analysis, false);
    expect(summaryEn).toContain('dashes');
  });
});
