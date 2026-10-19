import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  useCssFormatterWorkflow,
  escapeHtml,
} from '@/hooks/use-css-formatter-workflow';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useCssFormatterWorkflow Hook & Security (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('escapeHtml prevents DOM XSS injection by encoding sensitive entities', () => {
    const malicious = '<script>alert("XSS & \'pwned\'")</script>';
    const sanitized = escapeHtml(malicious);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');
    expect(sanitized).toContain('&lt;script&gt;');
    expect(sanitized).toContain('&quot;XSS &amp; &#039;pwned&#039;&quot;');
  });

  it('provides workflow actions to load samples, format, and detect issues', async () => {
    let hook!: ReturnType<typeof useCssFormatterWorkflow>;

    function Harness() {
      hook = useCssFormatterWorkflow({ isFr: true });
      return null;
    }

    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: dummyLocale },
          React.createElement(Harness)
        )
      );
    });

    expect(hook.mode).toBe('format');
    expect(hook.hasContent).toBe(false);
    expect(hook.issues).toEqual([]);

    await act(async () => {
      hook.handleLoadSample('modernCard');
    });

    expect(hook.hasContent).toBe(true);
    expect(hook.input).toContain('.card');
    expect(hook.output).toContain('.card');
    expect(hook.issues).toEqual([]);

    await act(async () => {
      hook.handleInputChange('.broken { color: red;');
    });

    expect(hook.issues.length).toBeGreaterThan(0);
  });
});
