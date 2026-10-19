import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JsonFormatterToolbar } from '@/components/json-formatter/JsonFormatterToolbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('JsonFormatterToolbar Component (TDD)', () => {
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

  const renderToolbar = async (props: Partial<Parameters<typeof JsonFormatterToolbar>[0]> = {}) => {
    const defaultProps = {
      viewTab: 'code' as const,
      onViewTabChange: vi.fn(),
      yamlMode: false,
      onToggleYamlMode: vi.fn(),
      isParseOk: true,
      hasData: true,
      isArrayRoot: false,
      arrayLength: 0,
      isMinified: false,
      indentSize: 2 as const,
      onFormat: vi.fn(),
      onMinify: vi.fn(),
      onSortKeys: vi.fn(),
      onEscapeToggle: vi.fn(),
      onFileUpload: vi.fn(),
      canUndo: true,
      onUndo: vi.fn(),
      canClear: true,
      onClear: vi.fn(),
      outputCode: '{\n  "name": "EverydayTools"\n}',
      onDownload: vi.fn(),
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: dummyLocale },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(JsonFormatterToolbar, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders toolbar buttons and handles download click', async () => {
    const props = await renderToolbar();

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);

    const downloadBtn = Array.from(buttons).find((b) =>
      b.textContent?.includes('Télécharger .json')
    );
    expect(downloadBtn).toBeDefined();
    expect(downloadBtn?.disabled).toBe(false);

    await act(async () => {
      downloadBtn?.click();
    });

    expect(props.onDownload).toHaveBeenCalledTimes(1);
  });

  it('disables download button when outputCode is empty', async () => {
    await renderToolbar({ outputCode: '' });

    const buttons = container.querySelectorAll('button');
    const downloadBtn = Array.from(buttons).find((b) =>
      b.textContent?.includes('Télécharger .json')
    );
    expect(downloadBtn).toBeDefined();
    expect(downloadBtn?.disabled).toBe(true);
  });

  it('shows YAML download label in yamlMode', async () => {
    await renderToolbar({ yamlMode: true });

    const buttons = container.querySelectorAll('button');
    const downloadBtn = Array.from(buttons).find((b) =>
      b.textContent?.includes('Télécharger .yaml')
    );
    expect(downloadBtn).toBeDefined();
  });

  it('uses design system token var(--accent) instead of arbitrary hex #FF6B35', async () => {
    await renderToolbar({ yamlMode: true, indentSize: 2 });
    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).toContain('var(--accent)');
  });
});
