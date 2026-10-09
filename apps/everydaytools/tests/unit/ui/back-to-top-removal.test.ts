import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('BackToTop Widget Full Removal (TDD RED Phase)', () => {
  it('ensures BackToTop component and JSX usages are completely removed from App.tsx', () => {
    const appFilePath = path.resolve(__dirname, '../../../src/App.tsx');
    const content = fs.readFileSync(appFilePath, 'utf-8');

    expect(content).not.toContain('function BackToTop');
    expect(content).not.toContain('<BackToTop');
    expect(content).not.toContain('aria-label="Back to top"');
  });
});
