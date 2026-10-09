import { describe, it, expect } from 'vitest';
import {
  formatCss,
  minifyCss,
  formatHtml,
  minifyHtml,
  CODE_SAMPLES,
} from '@/lib/code-formatter-logic';

describe('CSS & HTML Code Formatter Logic', () => {
  it('formats minified CSS into indented readable blocks', () => {
    const formatted = formatCss(CODE_SAMPLES.css, 2);
    expect(formatted).toContain(' {\n  background-color: #2563eb;');
    expect(formatted).toContain('\n}\n');
  });

  it('minifies CSS by stripping comments and extraneous spaces', () => {
    const raw = `
      /* Header banner */
      .header {
        color: red;
        margin: 0px;
      }
    `;
    const min = minifyCss(raw);
    expect(min).not.toContain('/* Header banner */');
    expect(min).toBe('.header{color:red;margin:0px}');
  });

  it('formats HTML into a clean hierarchy matching tags and void elements', () => {
    const raw = '<div><p>Hello <span>World</span></p><img src="test.png"><br></div>';
    const formatted = formatHtml(raw, 2);
    expect(formatted).toContain('<div>\n  <p>');
    expect(formatted).toContain('  <img src="test.png">');
  });

  it('minifies HTML by collapsing whitespace and comments', () => {
    const raw = `
      <!-- Navigation -->
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nav>
    `;
    const min = minifyHtml(raw);
    expect(min).not.toContain('<!-- Navigation -->');
    expect(min).toBe('<nav><ul><li><a href="/">Home</a></li></ul></nav>');
  });

  it('formats minified JS/TS into indented readable code', async () => {
    const { formatJs, minifyJs, CODE_SAMPLES } = await import('@/lib/code-formatter-logic');
    const formatted = formatJs(CODE_SAMPLES.js, 2);
    expect(formatted).toContain('async function fetchUserData(userId,options={}) {\n  try {');
    expect(formatted).toContain('return {\n');

    const min = minifyJs('function test( a, b ) { /* note */ return a + b; }');
    expect(min).not.toContain('/* note */');
    expect(min).toContain('function test(a,b){return a+b;}');
  });
});
