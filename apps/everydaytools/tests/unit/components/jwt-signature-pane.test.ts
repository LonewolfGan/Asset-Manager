import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { JwtSignaturePane } from '@/components/jwt-decoder/JwtSignaturePane';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('JwtSignaturePane anti-slop design system contract', () => {
  it('contains zero arbitrary hex #FF6B35 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(JwtSignaturePane, {
          isFr: true,
          algorithm: 'HS256',
          verificationResult: { status: 'idle' },
          secretKey: 'secret',
          setSecretKey: vi.fn(),
          showSecret: false,
          setShowSecret: vi.fn(),
          isBase64Secret: false,
          setIsBase64Secret: vi.fn(),
        })
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('accent-[var(--accent)]');
  });
});
