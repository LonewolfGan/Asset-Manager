import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useMarkdownPreviewWorkflow } from '@/hooks/use-markdown-preview-workflow';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useMarkdownPreviewWorkflow Hook & Samples (TDD)', () => {
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

  it('provides workflow actions to load samples and compute metrics', async () => {
    let hook!: ReturnType<typeof useMarkdownPreviewWorkflow>;

    function Harness() {
      hook = useMarkdownPreviewWorkflow(true);
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

    expect(hook.hasContent).toBe(false);
    expect(hook.markdown).toBe('');
    expect(hook.metrics.words).toBe(0);

    await act(async () => {
      hook.handleLoadSample('welcomeDoc');
    });

    expect(hook.hasContent).toBe(true);
    expect(hook.markdown).toContain('# ');
    expect(hook.metrics.words).toBeGreaterThan(10);
    expect(hook.safeHtml).toContain('<h1');
  });

  it('throttles rapid typing in history while keeping latest markdown value', async () => {
    let hook!: ReturnType<typeof useMarkdownPreviewWorkflow>;

    function Harness() {
      hook = useMarkdownPreviewWorkflow(true);
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

    await act(async () => {
      hook.handleMarkdownChange('a');
      hook.handleMarkdownChange('ab');
      hook.handleMarkdownChange('abc');
    });

    expect(hook.markdown).toBe('abc');
    expect(hook.history.length).toBeLessThanOrEqual(1);
  });
});
