import React, { RefObject } from 'react';
import { FileText, Upload } from 'lucide-react';
import type { MARKDOWN_SAMPLES } from '@/lib/markdown-preview-parser';

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
  onLoadSample?: (key: keyof typeof MARKDOWN_SAMPLES) => void;
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
  onLoadSample,
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFileUpload(file);
                  e.target.value = '';
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="relative">
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

        {!hasContent && onLoadSample && (
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center justify-center p-4 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200 dark:border-white/10 shadow-sm backdrop-blur-sm pointer-events-auto">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                {isFr ? 'Modèles :' : 'Templates:'}
              </span>
              <button
                type="button"
                onClick={() => onLoadSample('welcomeDoc')}
                className="px-2 py-1 text-[11px] font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                {isFr ? 'Démarrage' : 'Quickstart'}
              </button>
              <button
                type="button"
                onClick={() => onLoadSample('readmeTemplate')}
                className="px-2 py-1 text-[11px] font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                README
              </button>
              <button
                type="button"
                onClick={() => onLoadSample('technicalSpec')}
                className="px-2 py-1 text-[11px] font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                {isFr ? 'Spécification' : 'Tech Spec'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
