import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleContext } from '@/contexts/locale-context';
import { TRANSLATIONS } from '@/i18n/translations';
import { MarkdownWorkbench } from '@/components/markdown-preview/MarkdownWorkbench';

describe('MarkdownWorkbench component (TDD)', () => {
  const dummyMetrics = {
    lines: 1,
    words: 2,
    headings: 1,
    readMinutes: 1,
  };

  const dummyLocale = {
    locale: 'FR' as const,
    setLocale: () => {},
    t: TRANSLATIONS.FR,
    isFr: true,
  };

  it('renders workbench with editor and preview panes in split layout', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(MarkdownWorkbench, {
            viewLayout: 'split',
            rightPaneView: 'preview',
            onRightPaneViewChange: () => {},
            markdown: '# Titre',
            onMarkdownChange: () => {},
            editorRef: { current: null },
            previewRef: { current: null },
            htmlViewRef: { current: null },
            onEditorScroll: () => {},
            onPreviewScroll: () => {},
            onSelect: () => {},
            wordWrap: true,
            editorHeight: 540,
            onMouseDownResize: () => {},
            hasContent: true,
            safeHtml: '<h1>Titre</h1>',
            highlightedHtmlSource: '',
            metrics: dummyMetrics,
            isDragOver: false,
            onDragOver: () => {},
            onDragLeave: () => {},
            onDrop: () => {},
            onFileUpload: () => {},
            isFr: true,
          })
        )
      )
    );

    expect(html).toContain('Éditeur Markdown');
    expect(html).toContain('Aperçu');
    expect(html).toContain('<h1>Titre</h1>');
  });

  it('renders sample buttons when empty and onLoadSample is provided', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(MarkdownWorkbench, {
            viewLayout: 'split',
            rightPaneView: 'preview',
            onRightPaneViewChange: () => {},
            markdown: '',
            onMarkdownChange: () => {},
            editorRef: { current: null },
            previewRef: { current: null },
            htmlViewRef: { current: null },
            onEditorScroll: () => {},
            onPreviewScroll: () => {},
            onSelect: () => {},
            wordWrap: true,
            editorHeight: 540,
            onMouseDownResize: () => {},
            hasContent: false,
            safeHtml: '',
            highlightedHtmlSource: '',
            metrics: { lines: 0, words: 0, headings: 0, readMinutes: 0 },
            isDragOver: false,
            onDragOver: () => {},
            onDragLeave: () => {},
            onDrop: () => {},
            onFileUpload: () => {},
            onLoadSample: () => {},
            isFr: true,
          })
        )
      )
    );

    expect(html).toContain('Modèles :');
    expect(html).toContain('Démarrage');
    expect(html).toContain('README');
    expect(html).toContain('Spécification');
  });

  it('renders drag overlay with zero arbitrary hex #FF6B35', () => {
    const html = renderToString(
      React.createElement(
        LocaleContext.Provider,
        { value: dummyLocale },
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(MarkdownWorkbench, {
            viewLayout: 'split',
            rightPaneView: 'preview',
            onRightPaneViewChange: () => {},
            markdown: '',
            onMarkdownChange: () => {},
            editorRef: { current: null },
            previewRef: { current: null },
            htmlViewRef: { current: null },
            onEditorScroll: () => {},
            onPreviewScroll: () => {},
            onSelect: () => {},
            wordWrap: true,
            editorHeight: 540,
            onMouseDownResize: () => {},
            hasContent: false,
            safeHtml: '',
            highlightedHtmlSource: '',
            metrics: { lines: 0, words: 0, headings: 0, readMinutes: 0 },
            isDragOver: true,
            onDragOver: () => {},
            onDragLeave: () => {},
            onDrop: () => {},
            onFileUpload: () => {},
            isFr: true,
          })
        )
      )
    );

    expect(html).not.toContain('#FF6B35');
    expect(html).toContain('var(--accent)');
    expect(html).toContain('Déposez votre fichier Markdown');
  });
});
