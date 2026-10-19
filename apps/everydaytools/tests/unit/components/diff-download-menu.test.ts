import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DiffDownloadMenu } from '@/components/diff-checker/DiffDownloadMenu';

describe('DiffDownloadMenu anti-slop design system contract', () => {
  it('contains zero arbitrary hex #FF6B35 or #e85a26 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(DiffDownloadMenu, {
        onDownloadPatch: vi.fn(),
        onDownloadOriginal: vi.fn(),
        onDownloadModified: vi.fn(),
        isFr: true,
      })
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).not.toContain('transition-all');
    expect(html).toContain('bg-[var(--accent)]');
    expect(html).toContain('transition-colors');
  });
});
