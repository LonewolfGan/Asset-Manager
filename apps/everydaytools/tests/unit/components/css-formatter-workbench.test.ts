import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { CssFormatterToolbar } from '@/components/css-formatter/CssFormatterToolbar';
import { CssSourcePanel } from '@/components/css-formatter/CssSourcePanel';
import { CssOutputPanel } from '@/components/css-formatter/CssOutputPanel';
import { CssFormatterWorkbench } from '@/components/css-formatter/CssFormatterWorkbench';
import { calculateCssMetrics } from '@/lib/css-formatter-logic';

describe('css-formatter components', () => {
  const dummyMetrics = calculateCssMetrics('.btn{color:red}', '.btn {\n  color: red;\n}');
  const dummyLocaleValue = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('renders toolbar with mode toggles and action controls', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocaleValue },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(CssFormatterToolbar, {
            mode: 'format',
            setMode: () => {},
            indent: 2,
            setIndent: () => {},
            sortProperties: false,
            setSortProperties: () => {},
            stripComments: false,
            setStripComments: () => {},
            wordWrap: true,
            setWordWrap: () => {},
            hasHistory: true,
            hasContent: true,
            output: '.btn { color: red; }',
            isFr: true,
            onUndo: () => {},
            onClear: () => {},
            onDownload: () => {},
          })
        )
      )
    );

    expect(html).toContain('Formater');
    expect(html).toContain('Minifier');
    expect(html).toContain('Indentation :');
    expect(html).toContain('Trier A-Z');
  });

  it('renders source panel with textarea and metrics', () => {
    const html = renderToString(
      React.createElement(CssSourcePanel, {
        input: '.btn { color: red; }',
        setInput: () => {},
        wordWrap: true,
        editorHeight: 460,
        metrics: dummyMetrics,
        hasContent: true,
        isFr: true,
        onFileUpload: () => {},
      })
    );

    expect(html).toContain('Source CSS');
    expect(html).toContain('règles');
  });

  it('renders output panel with syntax highlighted code or sandbox', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(CssOutputPanel, {
          outputView: 'code',
          setOutputView: () => {},
          mode: 'format',
          metrics: dummyMetrics,
          deviceWidth: 'desktop',
          setDeviceWidth: () => {},
          editorHeight: 460,
          wordWrap: true,
          hasContent: true,
          highlightedOutput: '<span class="hljs-selector-class">.btn</span>',
          sandboxHtml: '<html></html>',
          isFr: true,
        })
      )
    );

    expect(html).toContain('formaté');
    expect(html).toContain('Aperçu direct');
  });

  it('renders complete workbench container', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(CssFormatterWorkbench, {
          input: '.btn { color: red; }',
          setInput: () => {},
          wordWrap: true,
          editorHeight: 460,
          isDragOver: false,
          setIsDragOver: () => {},
          metrics: dummyMetrics,
          hasContent: true,
          outputView: 'code',
          setOutputView: () => {},
          mode: 'format',
          deviceWidth: 'desktop',
          setDeviceWidth: () => {},
          highlightedOutput: '<span class="hljs-selector-class">.btn</span>',
          sandboxHtml: '<html></html>',
          isFr: true,
          onFileUpload: () => {},
          onMouseDownResize: () => {},
        })
      )
    );

    expect(html).toContain('Source CSS');
    expect(html).toContain('Aperçu direct');
  });
});
