import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('ColorPaletteSwatchColumn anti-slop & styling contract', () => {
  const filePath = path.resolve(__dirname, '../../../src/components/color-palette/ColorPaletteSwatchColumn.tsx');
  const sourceCode = fs.readFileSync(filePath, 'utf-8');

  it('strictly avoids transition-all and uses targeted transitions', () => {
    expect(sourceCode).not.toContain('transition-all');
  });

  it('preserves Anti-Monolith constraint under 300 LOC', () => {
    const lines = sourceCode.split('\n').length;
    expect(lines).toBeLessThan(300);
  });
});

describe('LuxuryStationeryMockup anti-slop contract', () => {
  const filePath = path.resolve(__dirname, '../../../src/components/color-palette/mockups/LuxuryStationeryMockup.tsx');
  const sourceCode = fs.readFileSync(filePath, 'utf-8');

  it('strictly avoids transition-all and uses targeted transitions', () => {
    expect(sourceCode).not.toContain('transition-all');
  });

  it('preserves Anti-Monolith constraint under 300 LOC', () => {
    const lines = sourceCode.split('\n').length;
    expect(lines).toBeLessThan(300);
  });
});
