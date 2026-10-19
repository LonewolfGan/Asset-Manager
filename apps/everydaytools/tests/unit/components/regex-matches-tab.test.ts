import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RegexMatchesTab } from '@/components/regex-tester/RegexMatchesTab';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('RegexMatchesTab anti-slop design system contract', () => {
  it('contains zero arbitrary hex #FF6B35 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RegexMatchesTab, {
          hasTestContent: true,
          matches: [
            {
              index: 0,
              length: 3,
              value: 'abc',
              groups: [{ index: 1, value: 'a' }],
            },
          ],
          isValid: true,
          highlightedChunks: [{ text: 'abc', isMatch: true, matchIndex: 1 }],
          matchDisplayMode: 'highlight',
          selectedMatchIndex: 1,
          onSelectMatchIndex: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('var(--accent)');
  });
});
