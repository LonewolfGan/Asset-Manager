import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { JsonDiffInputWorkbench } from '@/components/json-diff/JsonDiffInputWorkbench';
import { JsonDiffResultsWorkbench } from '@/components/json-diff/JsonDiffResultsWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('JsonDiff Workbench Components (TDD)', () => {
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

  it('JsonDiffInputWorkbench renders sample button when empty and calls onLoadSample', async () => {
    const onLoadSample = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: dummyLocale },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(JsonDiffInputWorkbench, {
              inputLeft: '',
              onInputLeftChange: vi.fn(),
              inputRight: '',
              onInputRightChange: vi.fn(),
              editorHeight: 340,
              onMouseDownResize: vi.fn(),
              onFileUploadA: vi.fn(),
              onFileUploadB: vi.fn(),
              onLoadSample,
              isFr: true,
            })
          )
        )
      );
    });

    const sampleBtn = container.querySelector('button[data-sample="load-default"]');
    expect(sampleBtn).not.toBeNull();
    expect(sampleBtn?.textContent).toContain('Charger un exemple');

    await act(async () => {
      sampleBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onLoadSample).toHaveBeenCalledTimes(1);
  });

  it('JsonDiffResultsWorkbench renders identical banner when isIdentical is true', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: dummyLocale },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(JsonDiffResultsWorkbench, {
              viewMode: 'split',
              metrics: { added: 0, removed: 0, modified: 0, total: 0, isIdentical: true },
              deltas: [],
              alignedLines: [],
              unifiedLines: [],
              wordWrap: true,
              onToggleWordWrap: vi.fn(),
              isFr: true,
            })
          )
        )
      );
    });

    expect(container.textContent).toContain('Objets JSON 100% Identiques');
  });

  it('JsonDiffResultsWorkbench renders deltas metrics when diff exists', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: dummyLocale },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(JsonDiffResultsWorkbench, {
              viewMode: 'split',
              metrics: { added: 2, removed: 1, modified: 3, total: 6, isIdentical: false },
              deltas: [{ path: 'test', type: 'add', newValue: 123 }],
              alignedLines: [],
              unifiedLines: [],
              wordWrap: true,
              onToggleWordWrap: vi.fn(),
              isFr: true,
            })
          )
        )
      );
    });

    expect(container.textContent).toContain('+2 ajouts');
    expect(container.textContent).toContain('-1 suppression');
    expect(container.textContent).toContain('~3 modifications');
  });

  it('JsonDiffResultsWorkbench renders split view rows in synchronised grid columns', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleContext.Provider,
          { value: dummyLocale },
          React.createElement(
            TooltipProvider,
            null,
            React.createElement(JsonDiffResultsWorkbench, {
              viewMode: 'split',
              metrics: { added: 1, removed: 0, modified: 0, total: 1, isIdentical: false },
              deltas: [{ path: 'foo', type: 'add', newValue: 'bar' }],
              alignedLines: [
                {
                  lineNumLeft: 1,
                  lineNumRight: 1,
                  textLeft: '{"a": 1}',
                  textRight: '{"a": 1, "foo": "bar"}',
                  typeLeft: 'same',
                  typeRight: 'modify',
                },
              ],
              unifiedLines: [],
              wordWrap: true,
              onToggleWordWrap: vi.fn(),
              isFr: true,
            })
          )
        )
      );
    });

    const gridRows = container.querySelectorAll('.grid-cols-1');
    expect(gridRows.length).toBeGreaterThan(0);
    expect(container.textContent).toContain('{"a": 1}');
    expect(container.textContent).toContain('"foo": "bar"');
  });
});
