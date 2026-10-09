import React from 'react';
import { FileText } from 'lucide-react';
import { CodeWorkspaceSplit } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';
import { type DiffLine, type DiffViewMode } from '@/lib/diff-checker-logic';
import { DiffEditorView } from './DiffEditorView';
import { DiffSplitView } from './DiffSplitView';
import { DiffUnifiedView } from './DiffUnifiedView';

interface DiffWorkbenchProps {
  viewMode: DiffViewMode;
  onViewModeChange: (mode: DiffViewMode) => void;
  textA: string;
  textB: string;
  onUpdateOriginal: (val: string) => void;
  onUpdateModified: (val: string) => void;
  onFileUpload: (file: File, target: 'original' | 'modified') => void;
  onSwap: () => void;
  hasContent: boolean;
  editorHeight: number;
  wordWrap: boolean;
  isDragOverOriginal: boolean;
  onDragOverOriginal: (isOver: boolean) => void;
  isDragOverModified: boolean;
  onDragOverModified: (isOver: boolean) => void;
  diffLines: DiffLine[];
  changeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onMouseDownResize: (e: React.MouseEvent) => void;
  isFr: boolean;
}

export function DiffWorkbench({
  viewMode,
  onViewModeChange,
  textA,
  textB,
  onUpdateOriginal,
  onUpdateModified,
  onFileUpload,
  onSwap,
  hasContent,
  editorHeight,
  wordWrap,
  isDragOverOriginal,
  onDragOverOriginal,
  isDragOverModified,
  onDragOverModified,
  diffLines,
  changeRefs,
  scrollContainerRef,
  onMouseDownResize,
  isFr,
}: DiffWorkbenchProps) {
  return (
    <CodeWorkspaceSplit
      className="relative z-10 shadow-xs"
      footerSlot={
        <ActionTooltip
          label={
            isFr
              ? 'Glisser verticalement pour ajuster la hauteur de la zone de comparaison'
              : 'Drag vertically to adjust comparison area height'
          }
          side="top"
        >
          <div
            onMouseDown={onMouseDownResize}
            className="h-3.5 w-full bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-row-resize flex items-center justify-center border-t border-zinc-200 dark:border-white/10 select-none group transition-colors"
          >
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
          </div>
        </ActionTooltip>
      }
    >
      {viewMode === 'edit' ? (
        <DiffEditorView
          textA={textA}
          textB={textB}
          onUpdateOriginal={onUpdateOriginal}
          onUpdateModified={onUpdateModified}
          onFileUpload={onFileUpload}
          onSwap={onSwap}
          onCompare={() => onViewModeChange('split')}
          hasContent={hasContent}
          editorHeight={editorHeight}
          wordWrap={wordWrap}
          isDragOverOriginal={isDragOverOriginal}
          onDragOverOriginal={onDragOverOriginal}
          isDragOverModified={isDragOverModified}
          onDragOverModified={onDragOverModified}
          isFr={isFr}
        />
      ) : !hasContent ? (
        /* État Vide */
        <div
          style={{ height: `${editorHeight}px` }}
          className="w-full flex flex-col items-center justify-center p-8 text-center text-zinc-400 dark:text-zinc-500"
        >
          <FileText className="w-12 h-12 mb-3 stroke-[1.2] opacity-40 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            {isFr ? 'Aucun texte à comparer pour le moment' : 'No text to compare yet'}
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mb-4">
            {isFr
              ? 'Collez vos textes originaux et modifiés pour visualiser instantanément les différences ligne par ligne.'
              : 'Paste your original and modified texts to instantly view line-by-line differences.'}
          </p>
          <button
            type="button"
            onClick={() => onViewModeChange('edit')}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {isFr ? 'Ouvrir les éditeurs de texte' : 'Open text editors'}
          </button>
        </div>
      ) : viewMode === 'split' ? (
        <DiffSplitView
          diffLines={diffLines}
          textA={textA}
          textB={textB}
          editorHeight={editorHeight}
          wordWrap={wordWrap}
          changeRefs={changeRefs}
          scrollContainerRef={scrollContainerRef}
          isFr={isFr}
        />
      ) : (
        <DiffUnifiedView
          diffLines={diffLines}
          editorHeight={editorHeight}
          wordWrap={wordWrap}
          changeRefs={changeRefs}
          scrollContainerRef={scrollContainerRef}
          isFr={isFr}
        />
      )}
    </CodeWorkspaceSplit>
  );
}
