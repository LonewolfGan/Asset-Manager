import React, { RefObject } from 'react';
import { Upload } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { ViewLayout, RightPaneView } from '@/hooks/use-markdown-preview-workflow';
import { MarkdownEditorPane } from './MarkdownEditorPane';
import { MarkdownRightPane } from './MarkdownRightPane';

export interface MarkdownWorkbenchProps {
  viewLayout: ViewLayout;
  rightPaneView: RightPaneView;
  onRightPaneViewChange: (view: RightPaneView) => void;
  markdown: string;
  onMarkdownChange: (val: string) => void;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  previewRef: RefObject<HTMLDivElement | null>;
  htmlViewRef: RefObject<HTMLDivElement | null>;
  onEditorScroll: () => void;
  onPreviewScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onSelect: () => void;
  wordWrap: boolean;
  editorHeight: number;
  onMouseDownResize: (e: React.MouseEvent) => void;
  hasContent: boolean;
  safeHtml: string;
  highlightedHtmlSource: string;
  metrics: {
    lines: number;
    words: number;
    headings: number;
    readMinutes: number;
  };
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (file: File) => void;
  isFr: boolean;
}

export function MarkdownWorkbench({
  viewLayout,
  rightPaneView,
  onRightPaneViewChange,
  markdown,
  onMarkdownChange,
  editorRef,
  previewRef,
  htmlViewRef,
  onEditorScroll,
  onPreviewScroll,
  onSelect,
  wordWrap,
  editorHeight,
  onMouseDownResize,
  hasContent,
  safeHtml,
  highlightedHtmlSource,
  metrics,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileUpload,
  isFr,
}: MarkdownWorkbenchProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative z-10 w-full rounded-2xl border transition-colors bg-white dark:bg-zinc-950 overflow-hidden ${
        isDragOver
          ? 'border-zinc-500 ring-2 ring-zinc-400/30'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Overlay de glisser-déposer de fichier */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 shadow-lg">
            <Upload className="w-4 h-4 text-[#FF6B35]" />
            <span>{isFr ? 'Déposez votre fichier Markdown (.md, .txt)' : 'Drop your Markdown file (.md, .txt)'}</span>
          </div>
        </div>
      )}

      <div
        className={`grid divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10 ${
          viewLayout === 'editor'
            ? 'grid-cols-1'
            : viewLayout === 'preview'
            ? 'grid-cols-1'
            : 'grid-cols-1 lg:grid-cols-2'
        }`}
      >
        {/* VOLET GAUCHE : ÉDITEUR */}
        {(viewLayout === 'split' || viewLayout === 'editor') && (
          <MarkdownEditorPane
            editorRef={editorRef}
            markdown={markdown}
            onMarkdownChange={onMarkdownChange}
            onScroll={onEditorScroll}
            onSelect={onSelect}
            wordWrap={wordWrap}
            editorHeight={editorHeight}
            hasContent={hasContent}
            metrics={metrics}
            onFileUpload={onFileUpload}
            isFr={isFr}
          />
        )}

        {/* VOLET DROIT : APERÇU OU HTML */}
        {(viewLayout === 'split' || viewLayout === 'preview') && (
          <MarkdownRightPane
            rightPaneView={rightPaneView}
            onRightPaneViewChange={onRightPaneViewChange}
            previewRef={previewRef}
            htmlViewRef={htmlViewRef}
            onScroll={onPreviewScroll}
            editorHeight={editorHeight}
            wordWrap={wordWrap}
            hasContent={hasContent}
            safeHtml={safeHtml}
            highlightedHtmlSource={highlightedHtmlSource}
            metrics={metrics}
            isFr={isFr}
          />
        )}
      </div>

      {/* Poignée de redimensionnement vertical synchronisé */}
      <ActionTooltip label={isFr ? "Glisser verticalement pour ajuster la hauteur des éditeurs" : "Drag vertically to adjust editor height"} side="top">
        <div
          onMouseDown={onMouseDownResize}
          className="h-3.5 w-full bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-row-resize flex items-center justify-center border-t border-zinc-200 dark:border-white/10 select-none group transition-colors"
        >
          <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
        </div>
      </ActionTooltip>
    </div>
  );
}
