import { describe, it, expect } from 'vitest';
import {
  tokenizeJs,
  beautifyJs,
  minifyJs,
  computeJsMetrics,
  detectJsIssues,
  JS_SAMPLES,
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

  describe('detectJsIssues', () => {
    it('detects unclosed curly braces', () => {
      const code = `function test() { const a = 1;`;
      const issues = detectJsIssues(code);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].type).toBe('unclosed-brace');
    });

    it('detects unexpected closing curly braces', () => {
      const code = `function test() {} }`;
      const issues = detectJsIssues(code);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].type).toBe('unexpected-brace');
    });

    it('detects unclosed parentheses and brackets', () => {
      const parenCode = `const arr = [1, 2, (3 + 4];`;
      const issues = detectJsIssues(parenCode);
      expect(issues.length).toBeGreaterThan(0);
    });

    it('detects unclosed strings and comments', () => {
      const unclosedStr = `const s = "hello world;`;
      const strIssues = detectJsIssues(unclosedStr);
      expect(strIssues.some((i) => i.type === 'unclosed-string')).toBe(true);

      const unclosedComment = `/* unfinished comment \n const x = 10;`;
      const commentIssues = detectJsIssues(unclosedComment);
      expect(commentIssues.some((i) => i.type === 'unclosed-comment')).toBe(true);
    });

    it('returns empty array for valid clean javascript', () => {
      const cleanCode = `const add = (a, b) => a + b;\nconsole.log(add(1, 2));`;
      const issues = detectJsIssues(cleanCode);
      expect(issues).toEqual([]);
    });
  });

  describe('JS_SAMPLES', () => {
    it('provides standard curated javascript samples', () => {
      expect(JS_SAMPLES.asyncFetch).toBeDefined();
      expect(JS_SAMPLES.asyncFetch.length).toBeGreaterThan(20);
      expect(JS_SAMPLES.dataProcessing).toBeDefined();
      expect(JS_SAMPLES.debounceUtility).toBeDefined();
    });
  });
});

