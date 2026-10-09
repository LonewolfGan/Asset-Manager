import { describe, it, expect } from 'vitest';
import {
  tokenizeJs,
  beautifyJs,
  minifyJs,
  computeJsMetrics,
} from '../../../src/lib/js-formatter-logic';

describe('js-formatter-logic', () => {
  const sampleCode = `function test(a,b){const c=a+b;return c;}`;

  describe('tokenizeJs', () => {
    it('tokenizes code into symbols, words, and operators', () => {
      const tokens = tokenizeJs(sampleCode);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens.some((t) => t.type === 'word' && t.value === 'function')).toBe(true);
      expect(tokens.some((t) => t.type === 'symbol' && t.value === '{')).toBe(true);
    });

    it('extracts comments correctly', () => {
      const withComments = `// Single comment\nconst x = 1; /* Multi */`;
      const tokens = tokenizeJs(withComments, false);
      expect(tokens.some((t) => t.type === 'comment-single')).toBe(true);
      expect(tokens.some((t) => t.type === 'comment-multi')).toBe(true);
    });

    it('strips comments when option is set', () => {
      const withComments = `// Single comment\nconst x = 1; /* Multi */`;
      const tokens = tokenizeJs(withComments, true);
      expect(tokens.some((t) => t.type.startsWith('comment'))).toBe(false);
    });
  });

  describe('beautifyJs', () => {
    it('formats code with 2-space indentation by default', () => {
      const formatted = beautifyJs(sampleCode, 2);
      expect(formatted).toContain('  const c = a + b;');
      expect(formatted).toContain('  return c;');
    });

    it('formats code with 4-space indentation', () => {
      const formatted = beautifyJs(sampleCode, 4);
      expect(formatted).toContain('    const c = a + b;');
    });

    it('formats code with tab indentation', () => {
      const formatted = beautifyJs(sampleCode, 'tab');
      expect(formatted).toContain('\tconst c = a + b;');
    });

    it('enforces quote styles', () => {
      const codeWithQuotes = `const s = "hello"; const d = 'world';`;
      const single = beautifyJs(codeWithQuotes, 2, false, true, 'single');
      expect(single).toContain("'hello'");
      expect(single).toContain("'world'");

      const double = beautifyJs(codeWithQuotes, 2, false, true, 'double');
      expect(double).toContain('"hello"');
      expect(double).toContain('"world"');
    });

    it('respects semicolon options', () => {
      const formattedWithSemi = beautifyJs(sampleCode, 2, false, true);
      expect(formattedWithSemi).toContain(';');

      const formattedNoSemi = beautifyJs(sampleCode, 2, false, false);
      expect(formattedNoSemi).not.toContain(';');
    });
  });

  describe('minifyJs', () => {
    it('minifies javascript removing extraneous whitespace and comments', () => {
      const unminified = `
        // Calculator function
        function add(a, b) {
          /* returns sum */
          return a + b;
        }
      `;
      const minified = minifyJs(unminified, true);
      expect(minified).not.toContain('// Calculator function');
      expect(minified).not.toContain('/* returns sum */');
      expect(minified).toContain('return a+b');
    });

    it('preserves string contents accurately during minification', () => {
      const code = `const greeting = "hello   world";`;
      const minified = minifyJs(code);
      expect(minified).toContain('"hello   world"');
    });
  });

  describe('computeJsMetrics', () => {
    it('computes character, byte, function, and variable metrics correctly', () => {
      const input = `const a = 1; let b = 2; function sum(x, y) { return x + y; } const multiply = (p, q) => p * q;`;
      const output = minifyJs(input);
      const metrics = computeJsMetrics(input, output);

      expect(metrics.totalFunctions).toBe(2);
      expect(metrics.totalVariables).toBe(3);
      expect(metrics.inputBytes).toBeGreaterThan(0);
      expect(metrics.outputBytes).toBeLessThan(metrics.inputBytes);
      expect(metrics.savingsPercent).toBeGreaterThan(0);
    });
  });
});
