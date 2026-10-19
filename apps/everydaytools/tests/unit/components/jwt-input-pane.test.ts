import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { JwtInputPane } from '@/components/jwt-decoder/JwtInputPane';
import { decodeJwt } from '@/lib/jwt-logic';
import { getJwtByteSize } from '@/lib/jwt-export-logic';

describe('JwtInputPane anti-slop design system contract', () => {
  it('contains zero arbitrary hex #FF6B35 and uses var(--accent)', () => {
    const decoded = decodeJwt('');
    const stats = getJwtByteSize('');
    const html = renderToString(
      React.createElement(JwtInputPane, {
        isFr: true,
        tokenInput: '',
        hasToken: false,
        decoded,
        stats,
        isDragging: false,
        setIsDragging: vi.fn(),
        onUpdateToken: vi.fn(),
        onFileUpload: vi.fn(),
      })
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('text-[var(--accent)]');
  });
});
