import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HtmlFormatterWorkbench } from '@/components/html-formatter/HtmlFormatterWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { calculateHtmlMetrics } from '@/lib/html-formatter-logic';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('HtmlFormatterWorkbench with CodeWorkspaceSplit', () => {
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

  const dummyMetrics = calculateHtmlMetrics('<div>test</div>', '<div>\n  test\n</div>');
  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  const renderWorkbench = async (props: Partial<Parameters<typeof HtmlFormatterWorkbench>[0]> = {}) => {
    const defaultProps = {
      input: '<div>test</div>',
      hasContent: true,
      wordWrap: true,
      editorHeight: 460,
      isDragOver: false,
      mode: 'format' as const,
      outputView: 'code' as const,
      deviceWidth: 'desktop' as const,
      output: '<div>\n  test\n</div>',
      highlightedOutput: '<span>test</span>',
      metrics: dummyMetrics,
      onInputChange: vi.fn(),
      onFileUpload: vi.fn(),
      onSetOutputView: vi.fn(),
      onSetDeviceWidth: vi.fn(),
      onMouseDownResize: vi.fn(),
      setIsDragOver: vi.fn(),
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
            React.createElement(HtmlFormatterWorkbench, defaultProps)
          )
        )
      );
    });

    return defaultProps;
  };

  it('renders source and result panes with initial metrics', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('Source HTML');
    expect(container.textContent).toContain('Aperçu direct');
  });

  it('renders drag overlay and file drop handler', async () => {
    await renderWorkbench({ isDragOver: true });

    const dragOverlay = container.querySelector('[data-testid="code-drag-overlay"]');
    expect(dragOverlay).not.toBeNull();
    expect(dragOverlay?.textContent).toContain('Déposez votre fichier .html pour le formater');
  });

  it('calls onMouseDownResize when clicking resize bar', async () => {
    const onMouseDownResize = vi.fn();
    await renderWorkbench({ onMouseDownResize });

    const resizeHandle = container.querySelector('.cursor-row-resize') as HTMLDivElement;
    expect(resizeHandle).not.toBeNull();

    act(() => {
      resizeHandle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onMouseDownResize).toHaveBeenCalledTimes(1);
  });
});
