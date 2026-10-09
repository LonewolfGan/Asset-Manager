import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { JsFormatterWorkbench } from '@/components/js-formatter/JsFormatterWorkbench';
import { computeJsMetrics } from '@/lib/js-formatter-logic';

describe('js-formatter components', () => {
  const dummyMetrics = computeJsMetrics('const x = 1;', 'const x = 1;');
  const dummyLocaleValue = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('renders workbench with empty state', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocaleValue },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JsFormatterWorkbench, {
            input: '',
            onInputChange: () => {},
            historyLength: 0,
            onUndo: () => {},
            mode: 'format',
            setMode: () => {},
            language: 'javascript',
            setLanguage: () => {},
            indent: 2,
            setIndent: () => {},
            semicolons: true,
            setSemicolons: () => {},
            quotes: 'preserve',
            setQuotes: () => {},
            stripComments: false,
            setStripComments: () => {},
            wordWrap: true,
            setWordWrap: () => {},
            outputView: 'code',
            setOutputView: () => {},
            executionLogs: [],
            setExecutionLogs: () => {},
            executionTime: null,
            setExecutionTime: () => {},
            editorHeight: 460,
            isDragOver: false,
            setIsDragOver: () => {},
            output: '',
            highlightedOutput: '',
            metrics: dummyMetrics,
            hasContent: false,
            onMouseDownResize: () => {},
            onRunCode: () => {},
            onDownload: () => {},
            onClear: () => {},
            onFileUpload: () => {},
          })
        )
      )
    );

    expect(html).toContain('Formater');
    expect(html).toContain('Minifier');
    expect(html).toContain('JS');
    expect(html).toContain('TS');
  });

  it('renders drag overlay with CodeWorkspaceSplit', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocaleValue },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(JsFormatterWorkbench, {
            input: 'const x = 1;',
            onInputChange: () => {},
            historyLength: 0,
            onUndo: () => {},
            mode: 'format',
            setMode: () => {},
            language: 'javascript',
            setLanguage: () => {},
            indent: 2,
            setIndent: () => {},
            semicolons: true,
            setSemicolons: () => {},
            quotes: 'preserve',
            setQuotes: () => {},
            stripComments: false,
            setStripComments: () => {},
            wordWrap: true,
            setWordWrap: () => {},
            outputView: 'code',
            setOutputView: () => {},
            executionLogs: [],
            setExecutionLogs: () => {},
            executionTime: null,
            setExecutionTime: () => {},
            editorHeight: 460,
            isDragOver: true,
            setIsDragOver: () => {},
            output: 'const x = 1;',
            highlightedOutput: '',
            metrics: dummyMetrics,
            hasContent: true,
            onMouseDownResize: () => {},
            onRunCode: () => {},
            onDownload: () => {},
            onClear: () => {},
            onFileUpload: () => {},
          })
        )
      )
    );

    expect(html).toContain('data-testid="code-drag-overlay"');
  });
});
