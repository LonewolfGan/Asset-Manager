import React from 'react';
import { Upload, ArrowLeftRight } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';

interface DiffEditorViewProps {
  textA: string;
  textB: string;
  onUpdateOriginal: (val: string) => void;
  onUpdateModified: (val: string) => void;
  onFileUpload: (file: File, target: 'original' | 'modified') => void;
  onSwap: () => void;
  onCompare: () => void;
  hasContent: boolean;
  editorHeight: number;
  wordWrap: boolean;
  isDragOverOriginal: boolean;
  onDragOverOriginal: (isOver: boolean) => void;
  isDragOverModified: boolean;
  onDragOverModified: (isOver: boolean) => void;
  isFr: boolean;
}

export function DiffEditorView({
  textA,
  textB,
  onUpdateOriginal,
  onUpdateModified,
  onFileUpload,
  onSwap,
  onCompare,
  hasContent,
  editorHeight,
  wordWrap,
  isDragOverOriginal,
  onDragOverOriginal,
  isDragOverModified,
  onDragOverModified,
  isFr,
}: DiffEditorViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
      {/* Panneau Texte Original */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          onDragOverOriginal(true);
        }}
        onDragLeave={() => onDragOverOriginal(false)}
        onDrop={(e) => {
          e.preventDefault();
          onDragOverOriginal(false);
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) onFileUpload(droppedFile, 'original');
        }}
        className={`flex flex-col relative transition-colors ${
          isDragOverOriginal ? 'bg-[#FF6B35]/5' : ''
        }`}
      >
        <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {isFr ? 'Texte Original' : 'Original Text'}
            </span>
            {textA && (
              <span className="text-[11px] font-mono text-zinc-400">
                ({textA.split('\n').length} {isFr ? 'lignes' : 'lines'})
              </span>
            )}
          </div>

          <label className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1">
            <Upload className="w-3 h-3" />
            <span>{isFr ? 'Importer' : 'Import'}</span>
            <input
              type="file"
              accept=".txt,.md,.js,.ts,.json,.css,.html,.py,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0], 'original')}
            />
          </label>
        </div>

        <textarea
          value={textA}
          onChange={(e) => onUpdateOriginal(e.target.value)}
          placeholder={
            isFr
              ? 'Collez ou tapez votre texte original de référence ici...'
              : 'Paste or type your reference original text here...'
          }
          spellCheck={false}
          wrap={wordWrap ? 'soft' : 'off'}
          style={{ height: `${editorHeight}px` }}
          className={`w-full p-4 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed overflow-auto ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
        />
      </div>

      {/* Panneau Texte Modifié */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          onDragOverModified(true);
        }}
        onDragLeave={() => onDragOverModified(false)}
        onDrop={(e) => {
          e.preventDefault();
          onDragOverModified(false);
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) onFileUpload(droppedFile, 'modified');
        }}
        className={`flex flex-col relative transition-colors ${
          isDragOverModified ? 'bg-[#FF6B35]/5' : ''
        }`}
      >
        <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] inline-block" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {isFr ? 'Texte Modifié' : 'Modified Text'}
            </span>
            {textB && (
              <span className="text-[11px] font-mono text-zinc-400">
                ({textB.split('\n').length} {isFr ? 'lignes' : 'lines'})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ActionTooltip label={isFr ? 'Intervertir les deux textes' : 'Swap both texts'} side="bottom">
              <button
                type="button"
                onClick={onSwap}
                disabled={!hasContent}
                className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>{isFr ? 'Intervertir' : 'Swap'}</span>
              </button>
            </ActionTooltip>

            <label className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>{isFr ? 'Importer' : 'Import'}</span>
              <input
                type="file"
                accept=".txt,.md,.js,.ts,.json,.css,.html,.py,.csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0], 'modified')}
              />
            </label>

            {hasContent && (
              <button
                type="button"
                onClick={onCompare}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{isFr ? 'Comparer' : 'Compare'}</span>
                <span>➔</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          value={textB}
          onChange={(e) => onUpdateModified(e.target.value)}
          placeholder={
            isFr ? 'Collez ou tapez votre texte révisé ici...' : 'Paste or type your revised text here...'
          }
          spellCheck={false}
          wrap={wordWrap ? 'soft' : 'off'}
          style={{ height: `${editorHeight}px` }}
          className={`w-full p-4 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed overflow-auto ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
        />
      </div>
    </div>
  );
}
