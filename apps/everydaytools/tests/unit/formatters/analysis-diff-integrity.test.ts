import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as downloadModule from '@/lib/download';
import {
  detectAndScrubInvisibles,
  scrubEmDashes,
  scrubStylisticPatterns,
} from '@/lib/ai-scrubber-logic';
import {
  executeTextScrubbing,
  downloadCleanedTextFile,
} from '@/lib/ai-scrubber-export-logic';
import {
  evaluateRegex,
  computeHighlightedChunks,
} from '@/lib/regex-tester-logic';
import {
  computeTextDiff,
  computeInlineDiff,
  generateUnifiedPatch,
} from '@/lib/diff-checker-logic';
import { downloadPatchFile } from '@/lib/diff-checker-downloads';
import { computeSemanticDeltas } from '@/lib/json-diff-aligned-logic';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

describe('Analysis, Diff & ReDoS Integrity Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ai-text-scrubber (#73)', () => {
    it('detects and purges invisible zero-width and control characters without corrupting text', () => {
      const dirty = 'Intro\u200B de texte\uFEFF avec caractères\u200C cachés\u200D ! Éléphant 🚀';
      const result = detectAndScrubInvisibles(dirty);

      expect(result.count).toBe(4);
      expect(result.detections).toHaveLength(4);
      expect(result.detections.map((d) => d.codePoint)).toEqual([
        'U+200B',
        'U+FEFF',
        'U+200C',
        'U+200D',
      ]);
      expect(result.cleanedText).toBe('Intro de texte avec caractères cachés ! Éléphant 🚀');
    });

    it('cleans clichés and em-dashes while preserving legitimate content', () => {
      const emInput = 'Premier point — deuxième point — conclusion.';
      const emResult = scrubEmDashes(emInput);
      expect(emResult.count).toBe(2);
      expect(emResult.cleanedText).toBe('Premier point, deuxième point, conclusion.');

      const stylisticInput = 'En conclusion, il est important de noter que ce système fonctionne.';
      const stylisticResult = scrubStylisticPatterns(stylisticInput);
      expect(stylisticResult.replacedCount).toBeGreaterThan(0);
      expect(stylisticResult.cleanedText).not.toContain('En conclusion');
    });

    it('executes full scrubbing pipeline idempotently and accurately counts modifications', () => {
      const fullInput = 'En conclusion,\u200B voici le résultat — optimal.\uFEFF';
      const result = executeTextScrubbing(fullInput, {
        invisibles: true,
        emDashes: true,
        stylistic: true,
        symbols: true,
        whitespace: true,
      });

      expect(result.invCount).toBe(2);
      expect(result.emCount).toBe(1);
      expect(result.stylCount).toBeGreaterThan(0);
      expect(result.totalModified).toBe(
        result.invCount + result.emCount + result.stylCount + result.symCount
      );
      expect(result.outputText).not.toContain('\u200B');
      expect(result.outputText).not.toContain('\uFEFF');
      expect(result.outputText).not.toContain('—');
    });
  });

  describe('regex-tester (#107)', () => {
    it('prevents infinite loops and freezes on zero-length matches (ReDoS safeguard)', () => {
      const zeroWidthRes = evaluateRegex('^', 'g', 'abc\ndef', '');
      expect(zeroWidthRes.isValid).toBe(true);
      expect(zeroWidthRes.errorMsg).toBe('');
      expect(zeroWidthRes.matches.length).toBeLessThanOrEqual(50);

      const emptyMatchRes = evaluateRegex('a*', 'g', 'bbb', 'X');
      expect(emptyMatchRes.isValid).toBe(true);
      expect(emptyMatchRes.matches.length).toBeGreaterThan(0);
      expect(emptyMatchRes.matches.length).toBeLessThan(3000);
    });

    it('extracts named and numbered capture groups accurately with replacement preview', () => {
      const pattern = '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})';
      const sample = 'Date: 2026-10-20';
      const res = evaluateRegex(pattern, '', sample, '$<day>/$<month>/$<year>');

      expect(res.isValid).toBe(true);
      expect(res.matches).toHaveLength(1);
      const match = res.matches[0];
      expect(match.value).toBe('2026-10-20');
      expect(match.groups).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'year', value: '2026' }),
          expect.objectContaining({ name: 'month', value: '10' }),
          expect.objectContaining({ name: 'day', value: '20' }),
        ])
      );
      expect(res.replacedText).toBe('Date: 20/10/2026');
    });

    it('computes highlighted chunks separating matched and unmatched text segments', () => {
      const matches = [{ index: 6, length: 5, value: 'world', groups: [] }];
      const chunks = computeHighlightedChunks('hello world!', matches);
      expect(chunks).toEqual([
        { text: 'hello ', isMatch: false },
        { text: 'world', isMatch: true, matchIndex: 1 },
        { text: '!', isMatch: false },
      ]);
    });
  });

  describe('diff-checker (#106)', () => {
    it('computes line-level LCS diff and generates inline tokens for modifications', () => {
      const textA = 'apple\nbanana pie\ncherry';
      const textB = 'apple\nbanana cake\ncherry\ndate';

      const diff = computeTextDiff(textA, textB);
      expect(diff.stats.additions).toBe(1);
      expect(diff.stats.modifications).toBe(1);
      expect(diff.stats.unchanged).toBe(2);
      expect(diff.stats.similarityPct).toBeGreaterThan(0);

      const modifiedLine = diff.lines.find((l) => l.type === 'modify');
      expect(modifiedLine).toBeDefined();
      expect(modifiedLine?.tokensA).toBeDefined();
      expect(modifiedLine?.tokensB).toBeDefined();

      const inlineDiff = computeInlineDiff('banana pie', 'banana cake');
      expect(inlineDiff.tokensA.some((t) => t.type === 'delete' && t.text.includes('pie'))).toBe(true);
      expect(inlineDiff.tokensB.some((t) => t.type === 'insert' && t.text.includes('cake'))).toBe(true);
    });

    it('generates a valid unified patch (.diff) format', () => {
      const textA = 'first line\nsecond line';
      const textB = 'first line\nsecond line updated';
      const diff = computeTextDiff(textA, textB);
      const patch = generateUnifiedPatch(textA, textB, diff.lines);

      expect(patch).toContain('--- original.txt');
      expect(patch).toContain('+++ modified.txt');
      expect(patch).toContain('@@ -1,2 +1,2 @@');
      expect(patch).toContain('-second line');
      expect(patch).toContain('+second line updated');
    });

    it('downloadPatchFile delegates directly to SSOT downloadText', () => {
      const downloadTextSpy = vi.spyOn(downloadModule, 'downloadText').mockImplementation(() => {});
      const patchContent = '--- original.txt\n+++ modified.txt\n@@ -1 +1 @@\n-old\n+new';

      downloadPatchFile(patchContent, true);

      expect(downloadTextSpy).toHaveBeenCalledTimes(1);
      expect(downloadTextSpy).toHaveBeenCalledWith(
        patchContent,
        'changes.diff',
        'text/plain;charset=utf-8'
      );
    });
  });

  describe('json-diff (#101)', () => {
    it('identifies structural deltas: additions, removals, modifications, and array items', () => {
      const objA = {
        name: 'EverydayTools',
        active: true,
        version: 1,
        tags: ['web', 'offline'],
        settings: { theme: 'dark' },
      };
      const objB = {
        name: 'EverydayTools Pro',
        version: 1,
        tags: ['web', 'offline', 'fast'],
        settings: { theme: 'system', mode: 'auto' },
        extra: 42,
      };

      const deltas = computeSemanticDeltas(objA, objB);

      const modifiedName = deltas.find((d) => d.path === 'name');
      expect(modifiedName).toEqual({ path: 'name', type: 'modify', oldValue: 'EverydayTools', newValue: 'EverydayTools Pro' });

      const removedActive = deltas.find((d) => d.path === 'active');
      expect(removedActive).toEqual({ path: 'active', type: 'remove', oldValue: true });

      const addedExtra = deltas.find((d) => d.path === 'extra');
      expect(addedExtra).toEqual({ path: 'extra', type: 'add', newValue: 42 });

      const addedTag = deltas.find((d) => d.path === 'tags[2]');
      expect(addedTag).toEqual({ path: 'tags[2]', type: 'add', newValue: 'fast' });

      const addedMode = deltas.find((d) => d.path === 'settings.mode');
      expect(addedMode).toEqual({ path: 'settings.mode', type: 'add', newValue: 'auto' });
    });
  });

  describe('SSOT Download Unification & Delay Eradication Gate', () => {
    it('downloadCleanedTextFile must delegate directly to downloadText (RED against legacy createElement/setTimeout)', () => {
      const downloadTextSpy = vi.spyOn(downloadModule, 'downloadText').mockImplementation(() => {});
      const createElementSpy = vi.spyOn(document, 'createElement');

      downloadCleanedTextFile('Cleaned output', 'output.txt');

      expect(downloadTextSpy).toHaveBeenCalledTimes(1);
      expect(downloadTextSpy).toHaveBeenCalledWith('Cleaned output', 'output.txt', expect.any(String));
      expect(createElementSpy).not.toHaveBeenCalledWith('a');
    });

    it('downloadCleanedTextFile must not introduce artificial setTimeout delays (>= 600ms)', () => {
      const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
      vi.spyOn(downloadModule, 'downloadText').mockImplementation(() => {});

      downloadCleanedTextFile('Zero delay content', 'test.txt');

      const longTimeouts = setTimeoutSpy.mock.calls.filter(
        ([, delay]) => typeof delay === 'number' && delay >= 600
      );
      expect(longTimeouts).toHaveLength(0);
    });
  });
});
