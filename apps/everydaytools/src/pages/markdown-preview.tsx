import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { DocumentNextActionModal } from '@/components/conversion';
import { useMarkdownPreviewWorkflow } from '@/hooks/use-markdown-preview-workflow';
import {
  MarkdownToolbarLayout,
  MarkdownFormattingBar,
  MarkdownWorkbench,
} from '@/components/markdown-preview';

export default function MarkdownPreview() {
  const { t, isFr } = useLocale();
  const title = t.tools['markdown-preview']?.title ?? 'Markdown Live Editor';
  const desc =
    t.tools['markdown-preview']?.description ??
    'Live split-screen Markdown editor with real-time HTML preview and export.';

  const {
    markdown,
    history,
    redoStack,
    viewLayout,
    setViewLayout,
    rightPaneView,
    setRightPaneView,
    wordWrap,
    setWordWrap,
    syncScroll,
    setSyncScroll,
    isNextActionOpen,
    setIsNextActionOpen,
    editorHeight,
    editorRef,
    previewRef,
    htmlViewRef,
    isDragOver,
    setIsDragOver,
    updateSelection,
    handleMarkdownChange,
    handleUndo,
    handleRedo,
    handleMouseDownResize,
    handleEditorScroll,
    handlePreviewScroll,
    applyFormat,
    safeHtml,
    highlightedHtmlSource,
    metrics,
    handleDownloadMd,
    handleDownloadHtml,
    handleClear,
    handleFileUpload,
    hasContent,
  } = useMarkdownPreviewWorkflow(isFr);

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Text & Code', title]}
      title={title}
      description={desc}
      seoSlug="markdown-preview"
    >
      <div className="w-full space-y-3">
        {/* Scoped Styles pour le Rendu Markdown (Typographie Professionnelle) */}
        <style>{`
          .md-preview h1 { font-size: 1.85rem; font-weight: 700; letter-spacing: -0.025em; margin-top: 1.5rem; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(0, 0, 0, 0.08); }
          .dark .md-preview h1 { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
          .md-preview h2 { font-size: 1.45rem; font-weight: 600; letter-spacing: -0.02em; margin-top: 1.4rem; margin-bottom: 0.6rem; padding-bottom: 0.35rem; border-bottom: 1px solid rgba(0, 0, 0, 0.08); }
          .dark .md-preview h2 { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
          .md-preview h3 { font-size: 1.2rem; font-weight: 600; margin-top: 1.2rem; margin-bottom: 0.5rem; }
          .md-preview h4 { font-size: 1.05rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.4rem; }
          .md-preview p { margin-top: 0; margin-bottom: 1rem; line-height: 1.7; }
          .md-preview a { color: #FF6B35; text-decoration: underline; text-underline-offset: 3px; font-weight: 500; }
          .md-preview ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .md-preview ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
          .md-preview li { margin-bottom: 0.35rem; line-height: 1.6; }
          .md-preview table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.85rem; }
          .md-preview th, .md-preview td { padding: 0.65rem 0.9rem; border: 1px solid rgba(0, 0, 0, 0.08); }
          .dark .md-preview th, .dark .md-preview td { border: 1px solid rgba(255, 255, 255, 0.1); }
          .md-preview th { font-weight: 600; background: rgba(0, 0, 0, 0.03); text-align: left; }
          .dark .md-preview th { background: rgba(255, 255, 255, 0.04); }
          .md-preview tr:nth-child(even) { background: rgba(0, 0, 0, 0.015); }
          .dark .md-preview tr:nth-child(even) { background: rgba(255, 255, 255, 0.015); }
          .md-preview hr { border: 0; border-top: 1px solid rgba(0, 0, 0, 0.08); margin: 2rem 0; }
          .dark .md-preview hr { border-top: 1px solid rgba(255, 255, 255, 0.1); }
          .md-preview img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
          .md-preview code:not(pre code) { padding: 0.15rem 0.35rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.85em; background: rgba(0, 0, 0, 0.05); color: #ea580c; }
          .dark .md-preview code:not(pre code) { background: rgba(255, 255, 255, 0.08); color: #fb923c; }
          .md-preview kbd { padding: 0.15rem 0.4rem; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0.25rem; font-family: monospace; font-size: 0.8em; background: rgba(0, 0, 0, 0.04); box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1); }
          .dark .md-preview kbd { border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.05); box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1); }
          .md-preview mark { background: #fef08a; padding: 0.1rem 0.3rem; border-radius: 0.2rem; }
          .dark .md-preview mark { background: #854d0e; color: #fef9c3; }
          .md-preview input[type="checkbox"] { margin-right: 0.5rem; accent-color: #FF6B35; }
          .md-preview details { margin: 1rem 0; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid rgba(0, 0, 0, 0.08); background: rgba(0, 0, 0, 0.015); }
          .dark .md-preview details { border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.02); }
          .md-preview summary { font-weight: 600; cursor: pointer; }

          /* Coloration syntaxique HTML pour la vue Code HTML */
          .html-src .hljs-tag { color: #71717a; }
          .html-src .hljs-name { color: #0284c7; font-weight: 500; }
          .html-src .hljs-attr { color: #ea580c; }
          .html-src .hljs-string { color: #059669; }
          .dark .html-src .hljs-tag { color: #a1a1aa; }
          .dark .html-src .hljs-name { color: #38bdf8; font-weight: 500; }
          .dark .html-src .hljs-attr { color: #fb923c; }
          .dark .html-src .hljs-string { color: #34d399; }
        `}</style>

        {/* Barre de commande supérieure épurée */}
        <MarkdownToolbarLayout
          viewLayout={viewLayout}
          onViewLayoutChange={setViewLayout}
          syncScroll={syncScroll}
          onToggleSyncScroll={() => setSyncScroll(!syncScroll)}
          wordWrap={wordWrap}
          onToggleWordWrap={(next) => setWordWrap(next)}
          canUndo={history.length > 0}
          onUndo={handleUndo}
          canRedo={redoStack.length > 0}
          onRedo={handleRedo}
          hasContent={hasContent}
          markdown={markdown}
          safeHtml={safeHtml}
          onClear={handleClear}
          onDownloadMd={handleDownloadMd}
          onDownloadHtml={handleDownloadHtml}
          isFr={isFr}
        />

        {/* Barre d'outils de rédaction studio complète */}
        <MarkdownFormattingBar
          applyFormat={applyFormat}
          hasContent={hasContent}
          metrics={metrics}
          isFr={isFr}
        />

        {/* Atelier studio (double volet ou plein écran) */}
        <MarkdownWorkbench
          viewLayout={viewLayout}
          rightPaneView={rightPaneView}
          onRightPaneViewChange={setRightPaneView}
          markdown={markdown}
          onMarkdownChange={handleMarkdownChange}
          editorRef={editorRef}
          previewRef={previewRef}
          htmlViewRef={htmlViewRef}
          onEditorScroll={handleEditorScroll}
          onPreviewScroll={handlePreviewScroll}
          onSelect={updateSelection}
          wordWrap={wordWrap}
          editorHeight={editorHeight}
          onMouseDownResize={handleMouseDownResize}
          hasContent={hasContent}
          safeHtml={safeHtml}
          highlightedHtmlSource={highlightedHtmlSource}
          metrics={metrics}
          isDragOver={isDragOver}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload(file);
          }}
          onFileUpload={handleFileUpload}
          isFr={isFr}
        />

        <DocumentNextActionModal
          toolId="markdown-preview"
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={new Blob([markdown], { type: 'text/markdown;charset=utf-8' })}
          resultFilename="document.md"
          formatType="md"
        />
      </div>
    </ToolPageLayout>
  );
}
