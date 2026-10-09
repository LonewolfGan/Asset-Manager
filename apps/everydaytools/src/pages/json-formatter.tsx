import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { DocumentNextActionModal } from '@/components/conversion';
import { useJsonFormatterWorkflow } from '@/hooks/use-json-formatter-workflow';
import {
  JsonFormatterToolbar,
  JsonErrorBanner,
  JsonFormatterWorkbench,
} from '@/components/json-formatter';

export default function JsonFormatter() {
  const { t, isFr } = useLocale();
  const title = t.tools['json-formatter']?.title ?? (isFr ? 'Formateur JSON' : 'JSON Formatter');
  const desc =
    t.tools['json-formatter']?.description ??
    (isFr
      ? 'Formatez, validez et minifiez vos données JSON instantanément dans votre navigateur.'
      : 'Format, validate, and minify JSON instantly in your browser.');

  const {
    rawInput,
    setRawInput,
    indentSize,
    isMinified,
    viewTab,
    setViewTab,
    wordWrap,
    setWordWrap,
    yamlMode,
    setYamlMode,
    historyStack,
    treeSearch,
    setTreeSearch,
    treeExpandAll,
    setTreeExpandAll,
    isDragging,
    setIsDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadResult,
    parseResult,
    outputCode,
    highlightedOutput,
    stats,
    handleUndo,
    handleAutoRepair,
    handleSortKeys,
    handleFormat,
    handleMinify,
    handleEscapeToggle,
    handleClear,
    handleDownload,
    handleFileUpload,
  } = useJsonFormatterWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.textCode, title]}
      title={title}
      description={desc}
      seoSlug="json-formatter"
    >
      <div className="w-full space-y-4">
        {/* Scoped Syntax Highlighting Styles */}
        <style>{`
          .json-hl .hljs-attr { color: #0284c7; font-weight: 500; }
          .json-hl .hljs-string { color: #059669; }
          .json-hl .hljs-number { color: #2563eb; }
          .json-hl .hljs-literal, .json-hl .hljs-keyword { color: #ea580c; font-weight: 600; }
          .json-hl .hljs-punctuation { color: #71717a; }
          .dark .json-hl .hljs-attr { color: #38bdf8; font-weight: 500; }
          .dark .json-hl .hljs-string { color: #34d399; }
          .dark .json-hl .hljs-number { color: #60a5fa; }
          .dark .json-hl .hljs-literal, .dark .json-hl .hljs-keyword { color: #fb923c; font-weight: 600; }
          .dark .json-hl .hljs-punctuation { color: #a1a1aa; }
        `}</style>

        {/* Barre de commande supérieure épurée */}
        <JsonFormatterToolbar
          viewTab={viewTab}
          onViewTabChange={setViewTab}
          yamlMode={yamlMode}
          onToggleYamlMode={() => setYamlMode(!yamlMode)}
          isParseOk={parseResult.ok}
          hasData={parseResult.data !== null}
          isArrayRoot={stats.isArrayRoot}
          arrayLength={stats.arrayLength}
          isMinified={isMinified}
          indentSize={indentSize}
          onFormat={handleFormat}
          onMinify={handleMinify}
          onSortKeys={handleSortKeys}
          onEscapeToggle={handleEscapeToggle}
          onFileUpload={handleFileUpload}
          canUndo={historyStack.length > 0}
          onUndo={handleUndo}
          canClear={Boolean(rawInput)}
          onClear={handleClear}
          outputCode={outputCode}
          onDownload={handleDownload}
          isFr={isFr}
        />

        {/* Bandeau d'alerte syntaxe chirurgical */}
        {!parseResult.ok && parseResult.error && (
          <JsonErrorBanner
            error={parseResult.error}
            onAutoRepair={handleAutoRepair}
            isFr={isFr}
          />
        )}

        {/* Atelier Studio */}
        <JsonFormatterWorkbench
          rawInput={rawInput}
          onRawInputChange={setRawInput}
          wordWrap={wordWrap}
          onToggleWordWrap={setWordWrap}
          rawBytes={stats.rawBytes}
          outBytes={stats.outBytes}
          compressionRatio={stats.compressionRatio}
          parseResult={parseResult}
          viewTab={viewTab}
          yamlMode={yamlMode}
          isMinified={isMinified}
          outputCode={outputCode}
          highlightedOutput={highlightedOutput}
          treeSearch={treeSearch}
          onTreeSearchChange={setTreeSearch}
          treeExpandAll={treeExpandAll}
          onToggleTreeExpandAll={() => setTreeExpandAll(!treeExpandAll)}
          isDragging={isDragging}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          isFr={isFr}
        />

        {/* Continuum Modal */}
        <DocumentNextActionModal
          toolId="json-formatter"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={downloadResult?.blob}
          resultFilename={downloadResult?.filename}
          formatType={downloadResult?.formatType || 'json'}
        />
      </div>
    </ToolPageLayout>
  );
}
