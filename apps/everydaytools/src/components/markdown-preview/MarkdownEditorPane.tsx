import React, { RefObject } from 'react';
import { FileText, Upload } from 'lucide-react';

export interface MarkdownEditorPaneProps {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  markdown: string;
  onMarkdownChange: (val: string) => void;
  onScroll: () => void;
  onSelect: () => void;
  wordWrap: boolean;
  editorHeight: number;
  hasContent: boolean;
  metrics: {
    lines: number;
    words: number;
  };
  onFileUpload: (file: File) => void;
  isFr: boolean;
}

export function MarkdownEditorPane({
  editorRef,
  markdown,
  onMarkdownChange,
  onScroll,
  onSelect,
  wordWrap,
  editorHeight,
  hasContent,
  metrics,
  onFileUpload,
  isFr,
}: MarkdownEditorPaneProps) {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {isFr ? 'Éditeur Markdown' : 'Markdown Editor'}
          </span>
          {hasContent && (
            <span className="text-[11px] font-mono text-zinc-400">
              ({metrics.lines} {isFr ? 'lignes' : 'lines'} · {metrics.words} {isFr ? 'mots' : 'words'})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1">
            <Upload className="w-3 h-3" />
            <span>{isFr ? 'Importer' : 'Import'}</span>
            <input
              type="file"
              accept=".md,.markdown,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      <textarea
        ref={editorRef}
        value={markdown}
        onChange={(e) => onMarkdownChange(e.target.value)}
        onScroll={onScroll}
        onSelect={onSelect}
        onKeyUp={onSelect}
        onMouseUp={onSelect}
        placeholder={isFr ? "Rédigez ou collez votre document Markdown ici..." : "Write or paste your Markdown document here..."}
        spellCheck={false}
        wrap={wordWrap ? 'soft' : 'off'}
        style={{ height: `${editorHeight}px` }}
        className={`w-full p-4 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed overflow-auto ${
          wordWrap ? 'whitespace-pre-wrap break-words [overflow-wrap:anywhere]' : 'whitespace-pre overflow-x-auto'
        }`}
      />
    </div>
  );
}
