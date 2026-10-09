import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useHtmlFormatterWorkflow } from '@/hooks/use-html-formatter-workflow';
import {
  HtmlFormatterTopBar,
  HtmlFormatterWorkbench,
} from '@/components/html-formatter';

export default function HtmlFormatter() {
  const { t, isFr } = useLocale();
  const title =
    t.tools['html-formatter']?.title ??
    (isFr ? 'Formateur & Minificateur HTML' : 'HTML Formatter & Minifier');
  const desc =
    t.tools['html-formatter']?.description ??
    (isFr
      ? 'Formatez ou minifiez votre code HTML avec nettoyage de la syntaxe, contrôle de l’indentation et prévisualisation directe.'
      : 'Format or minify HTML with syntax cleanup, indentation control, and live sandbox preview.');

  const {
    input,
    history,
    mode,
    setMode,
    indent,
    setIndent,
    stripComments,
    setStripComments,
    wordWrap,
    setWordWrap,
    outputView,
    setOutputView,
    deviceWidth,
    setDeviceWidth,
    editorHeight,
    isDragOver,
    setIsDragOver,
    output,
    highlightedOutput,
    metrics,
    hasContent,
    handleInputChange,
    handleUndo,
    handleMouseDownResize,
    handleDownload,
    handleClear,
    handleFileUpload,
  } = useHtmlFormatterWorkflow();

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="html-formatter"
    >
      <div className="w-full space-y-4">
        {/* Scoped Syntax Highlighting Styles pour le HTML */}
        <style>{`
          .html-hl .hljs-tag { color: #71717a; }
          .html-hl .hljs-name { color: #0284c7; font-weight: 500; }
          .html-hl .hljs-attr { color: #ea580c; }
          .html-hl .hljs-string { color: #059669; }
          .html-hl .hljs-comment { color: #a1a1aa; font-style: normal; }
          .html-hl .hljs-meta { color: #8b5cf6; font-weight: 600; }

          .dark .html-hl .hljs-tag { color: #a1a1aa; }
          .dark .html-hl .hljs-name { color: #38bdf8; font-weight: 500; }
          .dark .html-hl .hljs-attr { color: #fb923c; }
          .dark .html-hl .hljs-string { color: #34d399; }
          .dark .html-hl .hljs-comment { color: #71717a; font-style: normal; }
          .dark .html-hl .hljs-meta { color: #c084fc; font-weight: 600; }
        `}</style>

        {/* Barre de commande supérieure épurée */}
        <HtmlFormatterTopBar
          mode={mode}
          indent={indent}
          stripComments={stripComments}
          wordWrap={wordWrap}
          historyLength={history.length}
          hasContent={hasContent}
          output={output}
          onSetMode={setMode}
          onSetIndent={setIndent}
          onToggleStripComments={setStripComments}
          onToggleWordWrap={setWordWrap}
          onUndo={handleUndo}
          onClear={handleClear}
          onDownload={handleDownload}
        />

        {/* Atelier double volet */}
        <HtmlFormatterWorkbench
          input={input}
          hasContent={hasContent}
          wordWrap={wordWrap}
          editorHeight={editorHeight}
          isDragOver={isDragOver}
          mode={mode}
          outputView={outputView}
          deviceWidth={deviceWidth}
          output={output}
          highlightedOutput={highlightedOutput}
          metrics={metrics}
          onInputChange={handleInputChange}
          onFileUpload={handleFileUpload}
          onSetOutputView={setOutputView}
          onSetDeviceWidth={setDeviceWidth}
          onMouseDownResize={handleMouseDownResize}
          setIsDragOver={setIsDragOver}
        />
      </div>
    </ToolPageLayout>
  );
}
