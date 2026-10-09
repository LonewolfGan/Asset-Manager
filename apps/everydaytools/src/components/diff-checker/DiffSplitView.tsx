import React from 'react';
import { type DiffLine } from '@/lib/diff-checker-logic';

interface DiffSplitViewProps {
  diffLines: DiffLine[];
  textA: string;
  textB: string;
  editorHeight: number;
  wordWrap: boolean;
  changeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isFr: boolean;
}

export function DiffSplitView({
  diffLines,
  textA,
  textB,
  editorHeight,
  wordWrap,
  changeRefs,
  scrollContainerRef,
  isFr,
}: DiffSplitViewProps) {
  return (
    <div className="flex flex-col">
      {/* En-tête des deux colonnes */}
      <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-white/10 h-9 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/50 text-[11px] font-semibold select-none">
        <div className="px-4 flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>{isFr ? 'Texte Original' : 'Original Text'}</span>
          <span className="font-mono text-zinc-400">
            {textA.split('\n').length} {isFr ? 'lignes' : 'lines'}
          </span>
        </div>
        <div className="px-4 flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>{isFr ? 'Texte Modifié' : 'Modified Text'}</span>
          <span className="font-mono text-zinc-400">
            {textB.split('\n').length} {isFr ? 'lignes' : 'lines'}
          </span>
        </div>
      </div>

      {/* Lignes du Diff côte à côte */}
      <div
        ref={scrollContainerRef}
        style={{ height: `${editorHeight - 36}px` }}
        className="overflow-auto font-mono text-xs select-text divide-y divide-zinc-100 dark:divide-white/5"
      >
        {diffLines.map((line, idx) => (
          <div
            key={idx}
            ref={(el) => {
              changeRefs.current[idx] = el;
            }}
            className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-white/10 group transition-colors"
          >
            {/* Volet Original */}
            <div
              className={`flex items-start min-h-[24px] ${
                line.type === 'delete'
                  ? 'bg-red-500/10 dark:bg-red-950/25 border-l-2 border-red-500'
                  : line.type === 'modify'
                  ? 'bg-red-500/5 dark:bg-red-950/15 border-l-2 border-red-400'
                  : line.type === 'insert'
                  ? 'bg-zinc-100/40 dark:bg-zinc-900/20 opacity-50'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/30'
              }`}
            >
              <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none border-r border-zinc-200/60 dark:border-white/5">
                {line.lineA ?? ''}
              </div>
              <div
                className={`flex-1 py-1 px-3 ${
                  wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                }`}
              >
                {line.type === 'modify' && line.tokensA ? (
                  line.tokensA.map((tok, tIdx) => (
                    <span
                      key={tIdx}
                      className={
                        tok.type === 'delete'
                          ? 'bg-red-500/25 dark:bg-red-500/30 text-red-900 dark:text-red-200 rounded px-0.5 line-through decoration-red-500/60'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }
                    >
                      {tok.text}
                    </span>
                  ))
                ) : (
                  <span
                    className={
                      line.type === 'delete'
                        ? 'text-red-800 dark:text-red-300'
                        : 'text-zinc-800 dark:text-zinc-200'
                    }
                  >
                    {line.textA ?? ''}
                  </span>
                )}
              </div>
            </div>

            {/* Volet Modifié */}
            <div
              className={`flex items-start min-h-[24px] ${
                line.type === 'insert'
                  ? 'bg-emerald-500/10 dark:bg-emerald-950/25 border-l-2 border-emerald-500'
                  : line.type === 'modify'
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/15 border-l-2 border-emerald-400'
                  : line.type === 'delete'
                  ? 'bg-zinc-100/40 dark:bg-zinc-900/20 opacity-50'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/30'
              }`}
            >
              <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none border-r border-zinc-200/60 dark:border-white/5">
                {line.lineB ?? ''}
              </div>
              <div
                className={`flex-1 py-1 px-3 ${
                  wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                }`}
              >
                {line.type === 'modify' && line.tokensB ? (
                  line.tokensB.map((tok, tIdx) => (
                    <span
                      key={tIdx}
                      className={
                        tok.type === 'insert'
                          ? 'bg-emerald-500/25 dark:bg-emerald-500/30 text-emerald-900 dark:text-emerald-200 rounded px-0.5 font-semibold'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }
                    >
                      {tok.text}
                    </span>
                  ))
                ) : (
                  <span
                    className={
                      line.type === 'insert'
                        ? 'text-emerald-800 dark:text-emerald-300'
                        : 'text-zinc-800 dark:text-zinc-200'
                    }
                  >
                    {line.textB ?? ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
