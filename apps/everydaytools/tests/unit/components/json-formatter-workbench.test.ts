import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JsonFormatterWorkbench } from '@/components/json-formatter/JsonFormatterWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('JsonFormatterWorkbench with CodeWorkspaceSplit', () => {
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

  const renderWorkbench = async (props: Partial<Parameters<typeof JsonFormatterWorkbench>[0]> = {}) => {
    const defaultProps = {
      rawInput: '{"key": "value"}',
      onRawInputChange: vi.fn(),
      wordWrap: true,
      onToggleWordWrap: vi.fn(),
      rawBytes: 16,
      outBytes: 18,
      compressionRatio: 0,
      parseResult: {
        ok: true,
        data: { key: 'value' },
        empty: false,
        error: null,
      },
      viewTab: 'formatted' as const,
      yamlMode: false,
      isMinified: false,
      outputCode: '{\n  "key": "value"\n}',
      highlightedOutput: '<span>code</span>',
      treeSearch: '',
      onTreeSearchChange: vi.fn(),
      treeExpandAll: true,
      onToggleTreeExpandAll: vi.fn(),
      isDragging: false,
      onDragOver: vi.fn(),
      onDragLeave: vi.fn(),
      onDrop: vi.fn(),
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
            React.createElement(JsonFormatterWorkbench, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders source and output panels', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('Entrée');
    expect(container.textContent).toContain('Tableau');
  });

  it('renders drag overlay with CodeWorkspaceSplit', async () => {
    await renderWorkbench({ isDragging: true });

    const dragOverlay = container.querySelector('[data-testid="code-drag-overlay"]');
    expect(dragOverlay).not.toBeNull();
    expect(dragOverlay?.textContent).toContain('Déposez votre fichier .json ici');
  });
});
