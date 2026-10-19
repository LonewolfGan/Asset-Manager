import { describe, it, expect } from 'vitest';
import {
  tokenizeCss,
  parseCssTree,
  formatCssAdvanced,
  minifyCssAdvanced,
  calculateCssMetrics,
  generateCssSandboxHtml,
  detectCssIssues,
  CSS_SAMPLES,
} from '@/lib/css-formatter-logic';

describe('css-formatter-logic (TDD Phase RED)', () => {
  const sampleMinified = '.btn{background-color:#2563eb;color:#fff;padding:8px 16px;border-radius:4px}.card{padding:16px;border:1px solid #ccc}';

  describe('tokenizeCss and parseCssTree', () => {
    it('tokenizes CSS into comments, strings, delimiters, and text', () => {
      const raw = '/* test */ .btn { content: "hello;world"; color: red; }';
      const tokens = tokenizeCss(raw, false);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0]).toEqual({ type: 'comment', value: '/* test */' });

      const strippedTokens = tokenizeCss(raw, true);
      expect(strippedTokens.some((t) => t.type === 'comment')).toBe(false);
    });

    it('parses tokens into nested AST nodes', () => {
      const tokens = tokenizeCss(sampleMinified, false);
      const tree = parseCssTree(tokens);
      expect(tree.length).toBe(2); // .btn block and .card block
      expect(tree[0].type).toBe('block');
      expect(tree[0].selector).toBe('.btn');
      expect(tree[0].children?.length).toBe(4); // 4 declarations
    });
  });

  describe('formatCssAdvanced', () => {
    it('formats minified CSS with 2 spaces indentation', () => {
      const formatted = formatCssAdvanced(sampleMinified, 2, false, false);
      expect(formatted).toContain('.btn {\n  background-color: #2563eb;\n');
      expect(formatted).toContain('.card {\n  padding: 16px;\n');
    });

    it('supports 4 spaces and tab indentation', () => {
      const formatted4 = formatCssAdvanced(sampleMinified, 4, false, false);
      expect(formatted4).toContain('    background-color: #2563eb;');

      const formattedTab = formatCssAdvanced(sampleMinified, 'tab', false, false);
      expect(formattedTab).toContain('\tbackground-color: #2563eb;');
    });

    it('sorts CSS properties alphabetically when sortProps is true', () => {
      const raw = '.box { z-index: 10; border: 1px solid; align-items: center; }';
      const sorted = formatCssAdvanced(raw, 2, false, true);
      const alignIndex = sorted.indexOf('align-items');
      const borderIndex = sorted.indexOf('border');
      const zIndex = sorted.indexOf('z-index');

      expect(alignIndex).toBeLessThan(borderIndex);
      expect(borderIndex).toBeLessThan(zIndex);
    });

    it('strips comments when stripComments is true', () => {
      const raw = '/* author info */\n.box { color: red; }';
      const stripped = formatCssAdvanced(raw, 2, true, false);
      expect(stripped).not.toContain('/* author info */');
      expect(stripped).toContain('.box {');
    });
  });

  describe('minifyCssAdvanced', () => {
    it('minifies CSS into a single compact string', () => {
      const raw = `
        /* comment */
        .btn {
          color: #fff;
          background: red;
        }
      `;
      const minified = minifyCssAdvanced(raw, true);
      expect(minified).not.toContain('/* comment */');
      expect(minified).not.toContain('\n');
      expect(minified).toContain('.btn{color:#fff;background:red}');
    });

    it('preserves spaces within calc() expressions', () => {
      const raw = '.container { width: calc(100% - 40px); }';
      const minified = minifyCssAdvanced(raw, true);
      expect(minified).toContain('calc(100% - 40px)');
    });

    it('preserves string contents containing delimiters', () => {
      const raw = '.icon::before { content: " { special ; string } "; }';
      const minified = minifyCssAdvanced(raw, true);
      expect(minified).toContain('content:" { special ; string } "');
    });
  });

  describe('calculateCssMetrics', () => {
    it('calculates counts, bytes, and savings percentage', () => {
      const input = '.box { color: red; background: blue; }';
      const output = '.box{color:red;background:blue}';
      const metrics = calculateCssMetrics(input, output);

      expect(metrics.totalRules).toBe(1);
      expect(metrics.totalDeclarations).toBe(2);
      expect(metrics.inputBytes).toBeGreaterThan(metrics.outputBytes);
      expect(metrics.savingsPercent).toBeGreaterThan(0);
    });
  });

  describe('generateCssSandboxHtml', () => {
    it('generates an HTML document injecting user CSS and preview elements', () => {
      const html = generateCssSandboxHtml('.btn { color: red; }', true);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<style id="user-injected-css">');
      expect(html).toContain('.btn { color: red; }');
      expect(html).toContain('Bouton Principal');
    });

    it('neutralizes style tag breakouts in injected CSS', () => {
      const malicious = '.btn { color: red; } </style><script>alert(1)</script>';
      const html = generateCssSandboxHtml(malicious, false);
      expect(html).not.toContain('</style><script>');
    });
  });

  describe('detectCssIssues', () => {
    it('returns empty array on valid CSS', () => {
      const valid = '.card { padding: 16px; margin: 0 auto; } @media (max-width: 600px) { .card { padding: 8px; } }';
      expect(detectCssIssues(valid)).toEqual([]);
    });

    it('detects unclosed curly braces', () => {
      const invalid = '.card { padding: 16px;';
      const issues = detectCssIssues(invalid);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => i.type === 'unclosed-block')).toBe(true);
    });

    it('detects unexpected closing braces', () => {
      const invalid = '.card { padding: 16px; } }';
      const issues = detectCssIssues(invalid);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some((i) => i.type === 'unexpected-close')).toBe(true);
    });

    it('detects unclosed comments', () => {
      const invalid = '/* unclosed comment\n.card { color: red; }';
      const issues = detectCssIssues(invalid);
      expect(issues.some((i) => i.type === 'unclosed-comment')).toBe(true);
    });
  });

  describe('CSS_SAMPLES', () => {
    it('contains modern samples with valid CSS', () => {
      expect(CSS_SAMPLES.modernCard).toBeDefined();
      expect(CSS_SAMPLES.glassmorphism).toBeDefined();
      expect(CSS_SAMPLES.responsiveGrid).toBeDefined();
      expect(CSS_SAMPLES.modernCard).toContain('.card');
    });
  });
});
