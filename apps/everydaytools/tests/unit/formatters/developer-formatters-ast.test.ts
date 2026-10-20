import { describe, it, expect } from 'vitest';
import * as jsonRepair from '@/lib/json-repair-logic';
import {
  formatJson,
  minifyJson,
  parseJsonErrorLocation,
} from '@/lib/json-formatter-logic';
import {
  formatHtml,
  minifyHtml,
  detectHtmlIssues,
} from '@/lib/html-formatter-logic';
import {
  formatCssAdvanced,
  minifyCssAdvanced,
  detectCssIssues,
} from '@/lib/css-formatter-logic';
import {
  tokenizeJs,
  beautifyJs,
  minifyJs,
  detectJsIssues,
} from '@/lib/js-formatter-logic';

describe('Developer Formatters — Pure Logic & AST Integrity', () => {
  describe('json-formatter (#75)', () => {
    const rawJson = '{"b":2,"a":1,"nested":{"z":9,"y":8}}';

    it('formats JSON with various indentations (2, 4, tab)', () => {
      const res2 = formatJson(rawJson, 2);
      expect(res2.output).toContain('  "a": 1');

      const res4 = formatJson(rawJson, 4);
      expect(res4.output).toContain('    "a": 1');

      const resTab = formatJson(rawJson, '\t');
      expect(resTab.output).toContain('\t"a": 1');
    });

    it('minifies JSON into a single line without whitespace', () => {
      const formatted = '{\n  "name": "EverydayTools",\n  "active": true\n}';
      const min = minifyJson(formatted);
      expect(min.output).toBe('{"name":"EverydayTools","active":true}');
    });

    it('sorts object keys recursively in alphabetical order', () => {
      const sortFn =
        (jsonRepair as any).sortJsonKeysRecursively ||
        jsonRepair.sortObjectKeysRecursively;
      expect(typeof sortFn).toBe('function');

      const sorted = sortFn({ z: 1, a: 2, m: { y: 3, b: 4 } });
      expect(Object.keys(sorted)).toEqual(['a', 'm', 'z']);
      expect(Object.keys(sorted.m)).toEqual(['b', 'y']);
    });

    it('detects syntax error location with line and column', () => {
      const invalidJson = '{\n  "title": "bad",\n  invalid\n}';
      const loc = parseJsonErrorLocation(
        'Unexpected token i in JSON at position 28',
        invalidJson
      );
      expect(loc.line).toBeDefined();
      expect(loc.column).toBeDefined();
    });
  });

  describe('html-formatter (#76)', () => {
    it('formats HTML preserving indentation and void tags', () => {
      const rawHtml =
        '<div class="container"><img src="hero.png"><br><p>Hello</p></div>';
      const formatted = formatHtml(rawHtml, 2);
      expect(formatted).toContain('<img src="hero.png">');
      expect(formatted).toContain('<br>');
      expect(formatted).not.toContain('</img>');
    });

    it('minifies HTML while preserving verbatim blocks', () => {
      const rawHtml =
        '<div>  <span>Title</span>  <pre>  code intact  </pre></div>';
      const minified = minifyHtml(rawHtml);
      expect(minified).toContain('<pre>  code intact  </pre>');
      expect(minified).toContain('<div><span>Title</span>');
    });

    it('detects unclosed and mismatched HTML tags', () => {
      const brokenHtml = '<section><div><p>Broken</section>';
      const issues = detectHtmlIssues(brokenHtml);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => i.type === 'mismatched-tag' || i.type === 'unclosed-tag')).toBe(true);
    });
  });

  describe('css-formatter (#103)', () => {
    it('formats CSS advanced with indentation and rules', () => {
      const rawCss = '.btn{color:red;padding:8px;}';
      const formatted = formatCssAdvanced(rawCss, 2);
      expect(formatted).toContain('.btn {');
      expect(formatted).toContain('  color: red;');
    });

    it('minifies CSS while preserving strings and calc() expressions', () => {
      const rawCss = '.box { width: calc(100% - 20px); content: "Hello World"; }';
      const minified = minifyCssAdvanced(rawCss);
      expect(minified).toContain('width:calc(100% - 20px)');
      expect(minified).toContain('content:"Hello World"');
    });

    it('detects unclosed CSS braces and comments', () => {
      const brokenCss = '.box { color: blue; /* unclosed comment';
      const issues = detectCssIssues(brokenCss);
      expect(issues.some((i) => i.type === 'unclosed-comment' || i.type === 'unclosed-block')).toBe(true);
    });
  });

  describe('js-formatter (#104)', () => {
    it('tokenizes JavaScript source code into structured tokens', () => {
      const code = 'const answer = 42;';
      const tokens = tokenizeJs(code);
      expect(tokens.some((t) => t.type === 'word' && t.value === 'const')).toBe(true);
      expect(tokens.some((t) => t.type === 'symbol' && t.value === ';')).toBe(true);
    });

    it('beautifies JavaScript with correct indentation and spacing', () => {
      const code = 'function add(a,b){return a+b;}';
      const formatted = beautifyJs(code, 2);
      expect(formatted).toContain('function add(a, b) {');
      expect(formatted).toContain('  return a + b;');
    });

    it('minifies JavaScript stripping comments and redundant whitespace', () => {
      const code = '// calculate\nconst x = 10;\n/* log */ console.log(x);';
      const minified = minifyJs(code);
      expect(minified).not.toContain('calculate');
      expect(minified).toContain('const x=10;console.log(x)');
    });

    it('detects syntax issues like unclosed braces or strings', () => {
      const brokenJs = 'function oops() { const str = "unclosed;';
      const issues = detectJsIssues(brokenJs);
      expect(issues.length).toBeGreaterThan(0);
    });
  });
});
