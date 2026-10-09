import { describe, it, expect } from 'vitest';
import {
  formatHtml,
  minifyHtml,
  calculateHtmlMetrics,
} from '@/lib/html-formatter-logic';

describe('HTML Formatter Logic (Phase RED -> GREEN)', () => {
  describe('formatHtml', () => {
    it('returns empty string for empty input', () => {
      expect(formatHtml('', 2)).toBe('');
      expect(formatHtml('   ', 4)).toBe('');
    });

    it('formats nested HTML tags with 2 spaces indent', () => {
      const input = '<div><p>Hello <span>world</span></p></div>';
      const output = formatHtml(input, 2);
      expect(output).toBe('<div>\n  <p>\n    Hello\n    <span>\n      world\n    </span>\n  </p>\n</div>');
    });

    it('handles void tags like br, img, input without incrementing indent level', () => {
      const input = '<div><img src="pic.jpg"><br><input type="text"></div>';
      const output = formatHtml(input, 2);
      expect(output).toContain('<div>');
      expect(output).toContain('  <img src="pic.jpg">');
      expect(output).toContain('  <br>');
      expect(output).toContain('  <input type="text">');
      expect(output).toContain('</div>');
    });

    it('preserves verbatim content inside script and style tags', () => {
      const input = '<div><script>const x = 1;\nif (x < 2) alert("hi");</script></div>';
      const output = formatHtml(input, 2);
      expect(output).toContain('<script>');
      expect(output).toContain('const x = 1;\nif (x < 2) alert("hi");');
      expect(output).toContain('</script>');
    });

    it('strips comments when stripComments is true', () => {
      const input = '<div><!-- comment --><span>test</span></div>';
      const outputWithComments = formatHtml(input, 2, false);
      expect(outputWithComments).toContain('<!-- comment -->');

      const outputStripped = formatHtml(input, 2, true);
      expect(outputStripped).not.toContain('<!-- comment -->');
      expect(outputStripped).toContain('<span>');
    });

    it('supports tab indentation', () => {
      const input = '<div><p>Tab</p></div>';
      const output = formatHtml(input, 'tab');
      expect(output).toBe('<div>\n\t<p>\n\t\tTab\n\t</p>\n</div>');
    });
  });

  describe('minifyHtml', () => {
    it('returns empty string for empty input', () => {
      expect(minifyHtml('')).toBe('');
      expect(minifyHtml('   ')).toBe('');
    });

    it('collapses whitespaces between tags and reduces multiple spaces', () => {
      const input = '<div> \n  <p>   Hello   world   </p>  \n </div>';
      const minified = minifyHtml(input);
      expect(minified).toBe('<div><p> Hello world </p></div>');
    });

    it('removes comments when stripComments is true', () => {
      const input = '<div><!-- Secret Comment --><p>Content</p></div>';
      expect(minifyHtml(input, true)).toBe('<div><p>Content</p></div>');
      expect(minifyHtml(input, false)).toContain('<!-- Secret Comment -->');
    });
  });

  describe('calculateHtmlMetrics', () => {
    it('computes byte savings and tag count accurately', () => {
      const input = '<div>   <p>Hello</p>   </div>';
      const output = '<div><p>Hello</p></div>';
      const metrics = calculateHtmlMetrics(input, output);

      expect(metrics.totalTags).toBe(2);
      expect(metrics.inputBytes).toBeGreaterThan(metrics.outputBytes);
      expect(metrics.savingsBytes).toBe(metrics.inputBytes - metrics.outputBytes);
      expect(metrics.savingsPercent).toBeGreaterThan(0);
    });
  });
});
