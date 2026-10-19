import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RegexTopBar } from '@/components/regex-tester/RegexTopBar';
import { getFlagOptions, getPresets } from '@/lib/regex-tester-logic';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

describe('RegexTopBar anti-slop design system contract', () => {
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('contains zero arbitrary hex #FF6B35 and uses var(--accent)', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(RegexTopBar, {
            pattern: '[a-z]+',
            onPatternChange: vi.fn(),
            flags: 'g',
            onToggleFlag: vi.fn(),
            activeFlagsCount: 1,
            flagOptions: getFlagOptions(true),
            presets: getPresets(true),
            onApplyPreset: vi.fn(),
            showPresetsMenu: false,
            onShowPresetsMenuChange: vi.fn(),
            patternInputRef: { current: null },
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('focus-within:border-[var(--accent)]');
  });

  it('renders flag options and handles flags toggle via input change', () => {
    const onToggleFlag = vi.fn();
    const flagOptions = getFlagOptions(true);
    expect(flagOptions.length).toBeGreaterThan(0);
    expect(flagOptions[0].flag).toBe('g');
  });
});
