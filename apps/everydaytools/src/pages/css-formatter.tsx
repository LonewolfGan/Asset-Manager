import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useCssFormatterWorkflow } from '@/hooks/use-css-formatter-workflow';
import { CssFormatterToolbar } from '@/components/css-formatter/CssFormatterToolbar';
import { CssFormatterWorkbench } from '@/components/css-formatter/CssFormatterWorkbench';

export default function CssFormatter() {
  const { t, isFr } = useLocale();
  const title =
    t.tools['css-formatter']?.title ??
    (isFr ? 'Formateur & Minificateur CSS' : 'CSS Formatter & Minifier');
  const desc =
    t.tools['css-formatter']?.description ??
    (isFr
      ? 'Minifiez vos feuilles de style pour un chargement rapide ou formatez votre CSS compressé en blocs lisibles.'
      : 'Minify stylesheets for fast loading or format compressed CSS into clean, readable style blocks.');

  const {
    input,
    setInput,
    output,
    highlightedOutput,
    history,
    mode,
    setMode,
    indent,
    setIndent,
    stripComments,
    setStripComments,
    sortProperties,
    setSortProperties,
    wordWrap,
    setWordWrap,
    outputView,
    setOutputView,
    deviceWidth,
    setDeviceWidth,
    editorHeight,
    isDragOver,
    setIsDragOver,
    metrics,
    hasContent,
    sandboxHtml,
    handleInputChange,
    handleUndo,
    handleClear,
    handleFileUpload,
    handleDownload,
    handleMouseDownResize,
  } = useCssFormatterWorkflow({ isFr });

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="css-formatter"
    >
      <div className="w-full space-y-4">
        {/* Scoped Syntax Highlighting Styles pour le CSS */}
        <style>{`
          .css-hl .hljs-keyword { color: #9333ea; font-weight: 600; }
          .css-hl .hljs-selector-tag { color: #ea580c; font-weight: 500; }
          .css-hl .hljs-selector-id { color: #7c3aed; font-weight: 600; }
          .css-hl .hljs-selector-class { color: #0284c7; font-weight: 500; }
          .css-hl .hljs-selector-pseudo { color: #d97706; }
          .css-hl .hljs-attribute { color: #2563eb; font-weight: 500; }
          .css-hl .hljs-number { color: #059669; }
          .css-hl .hljs-string { color: #059669; }
          .css-hl .hljs-built_in { color: #0284c7; }
          .css-hl .hljs-comment { color: #71717a; font-style: normal; }

          .dark .css-hl .hljs-keyword { color: #c084fc; font-weight: 600; }
          .dark .css-hl .hljs-selector-tag { color: #fb923c; font-weight: 500; }
          .dark .css-hl .hljs-selector-id { color: #a78bfa; font-weight: 600; }
          .dark .css-hl .hljs-selector-class { color: #38bdf8; font-weight: 500; }
          .dark .css-hl .hljs-selector-pseudo { color: #f59e0b; }
          .dark .css-hl .hljs-attribute { color: #60a5fa; font-weight: 500; }
          .dark .css-hl .hljs-number { color: #34d399; }
          .dark .css-hl .hljs-string { color: #34d399; }
          .dark .css-hl .hljs-built_in { color: #38bdf8; }
          .dark .css-hl .hljs-comment { color: #a1a1aa; font-style: normal; }
        `}</style>

        {/* Barre de commande supérieure épurée */}
        <CssFormatterToolbar
          mode={mode}
          setMode={setMode}
          indent={indent}
          setIndent={setIndent}
          sortProperties={sortProperties}
          setSortProperties={setSortProperties}
          stripComments={stripComments}
          setStripComments={setStripComments}
          wordWrap={wordWrap}
          setWordWrap={setWordWrap}
          hasHistory={history.length > 0}
          hasContent={hasContent}
          output={output}
          isFr={isFr}
          onUndo={handleUndo}
          onClear={handleClear}
          onDownload={handleDownload}
        />

        {/* Atelier double volet (Source CSS & Résultat / Sandbox) */}
        <CssFormatterWorkbench
          input={input}
          setInput={handleInputChange}
          wordWrap={wordWrap}
          editorHeight={editorHeight}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          metrics={metrics}
          hasContent={hasContent}
          outputView={outputView}
          setOutputView={setOutputView}
          mode={mode}
          deviceWidth={deviceWidth}
          setDeviceWidth={setDeviceWidth}
          highlightedOutput={highlightedOutput}
          sandboxHtml={sandboxHtml}
          isFr={isFr}
          onFileUpload={handleFileUpload}
          onMouseDownResize={handleMouseDownResize}
        />
      </div>
    </ToolPageLayout>
  );
}
