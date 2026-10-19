import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useHtmlFormatterWorkflow, escapeHtml } from '@/hooks/use-html-formatter-workflow';
import { HTML_SAMPLES } from '@/lib/html-formatter-logic';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useHtmlFormatterWorkflow Hook & Security (TDD)', () => {
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

  it('provides workflow actions to load samples, format, minify and undo', async () => {
    let hook!: ReturnType<typeof useHtmlFormatterWorkflow>;

    function Harness() {
      hook = useHtmlFormatterWorkflow(true);
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

    expect(hook.input).toBe('');
    expect(hook.hasContent).toBe(false);

    // Load sample
    await act(async () => {
      hook.handleLoadSample('landingHero');
    });

    expect(hook.input).toBe(HTML_SAMPLES.landingHero);
    expect(hook.hasContent).toBe(true);
    expect(hook.output).toContain('<!DOCTYPE html>');

    // Minify
    await act(async () => {
      hook.setMode('minify');
    });
    expect(hook.mode).toBe('minify');
    expect(hook.output).not.toContain('\n');

    // Clear
    await act(async () => {
      hook.handleClear();
    });
    expect(hook.input).toBe('');

    // Undo restores previous
    await act(async () => {
      hook.handleUndo();
    });
    expect(hook.input).toBeTruthy();
  });
});
