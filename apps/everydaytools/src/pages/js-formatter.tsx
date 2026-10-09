import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useJsFormatterWorkflow } from '@/hooks/use-js-formatter-workflow';
import { JsFormatterWorkbench } from '@/components/js-formatter/JsFormatterWorkbench';

export default function JsFormatter() {
  const { t, isFr } = useLocale();
  const title = t.tools['js-formatter']?.title ?? (isFr ? 'Embellisseur JS & TS' : 'JS / TS Beautifier');
  const desc =
    t.tools['js-formatter']?.description ??
    (isFr
      ? 'Formatez et nettoyez le code source JavaScript et TypeScript avec une indentation et un espacement standardisés.'
      : 'Format and clean JavaScript and TypeScript source code with standardized indentation and spacing.');

  const {
    input,
    history,
    mode,
    setMode,
    language,
    setLanguage,
    indent,
    setIndent,
    semicolons,
    setSemicolons,
    quotes,
    setQuotes,
    stripComments,
    setStripComments,
    wordWrap,
    setWordWrap,
    outputView,
    setOutputView,
    executionLogs,
    setExecutionLogs,
    executionTime,
    setExecutionTime,
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
    handleRunCode,
    handleDownload,
    handleClear,
    handleFileUpload,
  } = useJsFormatterWorkflow();

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="js-formatter"
    >
      <div className="w-full space-y-4">
        {/* Scoped Syntax Highlighting Styles pour JavaScript & TypeScript */}
        <style>{`
          .js-hl .hljs-keyword { color: #9333ea; font-weight: 600; }
          .js-hl .hljs-built_in { color: #0284c7; }
          .js-hl .hljs-title { color: #d97706; font-weight: 500; }
          .js-hl .hljs-title.class_ { color: #7c3aed; font-weight: 600; }
          .js-hl .hljs-title.function_ { color: #d97706; }
          .js-hl .hljs-attr { color: #2563eb; }
          .js-hl .hljs-string { color: #059669; }
          .js-hl .hljs-number { color: #059669; }
          .js-hl .hljs-comment { color: #71717a; font-style: normal; }
          .js-hl .hljs-params { color: #475569; }

          .dark .js-hl .hljs-keyword { color: #c084fc; font-weight: 600; }
          .dark .js-hl .hljs-built_in { color: #38bdf8; }
          .dark .js-hl .hljs-title { color: #f59e0b; font-weight: 500; }
          .dark .js-hl .hljs-title.class_ { color: #a78bfa; font-weight: 600; }
          .dark .js-hl .hljs-title.function_ { color: #f59e0b; }
          .dark .js-hl .hljs-attr { color: #60a5fa; }
          .dark .js-hl .hljs-string { color: #34d399; }
          .dark .js-hl .hljs-number { color: #34d399; }
          .dark .js-hl .hljs-comment { color: #a1a1aa; font-style: normal; }
          .dark .js-hl .hljs-params { color: #94a3b8; }
        `}</style>

        <JsFormatterWorkbench
          input={input}
          onInputChange={handleInputChange}
          historyLength={history.length}
          onUndo={handleUndo}
          mode={mode}
          setMode={setMode}
          language={language}
          setLanguage={setLanguage}
          indent={indent}
          setIndent={setIndent}
          semicolons={semicolons}
          setSemicolons={setSemicolons}
          quotes={quotes}
          setQuotes={setQuotes}
          stripComments={stripComments}
          setStripComments={setStripComments}
          wordWrap={wordWrap}
          setWordWrap={setWordWrap}
          outputView={outputView}
          setOutputView={setOutputView}
          executionLogs={executionLogs}
          setExecutionLogs={setExecutionLogs}
          executionTime={executionTime}
          setExecutionTime={setExecutionTime}
          editorHeight={editorHeight}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          output={output}
          highlightedOutput={highlightedOutput}
          metrics={metrics}
          hasContent={hasContent}
          onMouseDownResize={handleMouseDownResize}
          onRunCode={handleRunCode}
          onDownload={handleDownload}
          onClear={handleClear}
          onFileUpload={handleFileUpload}
        />
      </div>
    </ToolPageLayout>
  );
}
