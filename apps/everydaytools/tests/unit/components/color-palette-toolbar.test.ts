import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('ColorPaletteToolbar anti-slop & token adherence', () => {
  const filePath = path.resolve(__dirname, '../../../src/components/color-palette/ColorPaletteToolbar.tsx');
  const sourceCode = fs.readFileSync(filePath, 'utf-8');

  it('strictly avoids arbitrary orange hex codes (#FF6B35, #e85a24, #e85a26)', () => {
    expect(sourceCode).not.toContain('#FF6B35');
    expect(sourceCode).not.toContain('#e85a24');
    expect(sourceCode).not.toContain('#e85a26');
  });

  it('strictly avoids transition-all and uses targeted transitions', () => {
    expect(sourceCode).not.toContain('transition-all');
  });

  it('uses var(--accent) for accent elements and buttons', () => {
    expect(sourceCode).toContain('var(--accent)');
  });

  it('preserves Anti-Monolith constraint under 300 LOC', () => {
    const lines = sourceCode.split('\n').length;
    expect(lines).toBeLessThan(300);
  });
});
