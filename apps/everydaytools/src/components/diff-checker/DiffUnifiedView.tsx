import React from 'react';
import { type DiffLine } from '@/lib/diff-checker-logic';

interface DiffUnifiedViewProps {
  diffLines: DiffLine[];
  editorHeight: number;
  wordWrap: boolean;
  changeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isFr: boolean;
}

export function DiffUnifiedView({
  diffLines,
  editorHeight,
  wordWrap,
  changeRefs,
  scrollContainerRef,
  isFr,
}: DiffUnifiedViewProps) {
  return (
    <div className="flex flex-col">
      <div className="h-9 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 select-none">
        <span>{isFr ? 'Rapport Unifié (Format Patch)' : 'Unified Report (Patch Format)'}</span>
        <span className="font-mono text-zinc-400">
          {diffLines.length} {isFr ? 'lignes traitées' : 'lines processed'}
        </span>
      </div>

      <div
        ref={scrollContainerRef}
        style={{ height: `${editorHeight - 36}px` }}
        className="overflow-auto font-mono text-xs select-text divide-y divide-zinc-100 dark:divide-white/5"
      >
        {diffLines.map((line, idx) => {
          if (line.type === 'modify') {
            return (
              <div
                key={idx}
                ref={(el) => {
                  changeRefs.current[idx] = el;
                }}
                className="space-y-0"
              >
                {/* Ligne supprimée */}
                <div className="flex items-start bg-red-500/10 dark:bg-red-950/25 border-l-2 border-red-500">
                  <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none">
                    {line.lineA ?? ''}
                  </div>
                  <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none border-r border-zinc-200/60 dark:border-white/5" />
                  <div className="w-6 shrink-0 py-1 text-center font-bold text-red-600 select-none">-</div>
                  <div
                    className={`flex-1 py-1 px-2 ${
                      wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                    }`}
                  >
                    {line.tokensA ? (
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
                      <span className="text-red-800 dark:text-red-300">{line.textA}</span>
                    )}
                  </div>
                </div>

                {/* Ligne ajoutée */}
                <div className="flex items-start bg-emerald-500/10 dark:bg-emerald-950/25 border-l-2 border-emerald-500">
                  <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none" />
                  <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none border-r border-zinc-200/60 dark:border-white/5">
                    {line.lineB ?? ''}
                  </div>
                  <div className="w-6 shrink-0 py-1 text-center font-bold text-emerald-600 select-none">+</div>
                  <div
                    className={`flex-1 py-1 px-2 ${
                      wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                    }`}
                  >
                    {line.tokensB ? (
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
                      <span className="text-emerald-800 dark:text-emerald-300">{line.textB}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          const isDel = line.type === 'delete';
          const isAdd = line.type === 'insert';

          return (
            <div
              key={idx}
              ref={(el) => {
                changeRefs.current[idx] = el;
              }}
              className={`flex items-start ${
                isDel
                  ? 'bg-red-500/10 dark:bg-red-950/25 border-l-2 border-red-500'
                  : isAdd
                  ? 'bg-emerald-500/10 dark:bg-emerald-950/25 border-l-2 border-emerald-500'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/30'
              }`}
            >
              <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none">
                {line.lineA ?? ''}
              </div>
              <div className="w-12 shrink-0 py-1 pr-2 text-right text-[11px] font-mono text-zinc-400 select-none border-r border-zinc-200/60 dark:border-white/5">
                {line.lineB ?? ''}
              </div>
              <div className="w-6 shrink-0 py-1 text-center font-bold select-none text-zinc-400">
                {isDel ? '-' : isAdd ? '+' : ' '}
              </div>
              <div
                className={`flex-1 py-1 px-2 ${
                  wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                }`}
              >
                <span
                  className={
                    isDel
                      ? 'text-red-800 dark:text-red-300'
                      : isAdd
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-zinc-800 dark:text-zinc-200'
                  }
                >
                  {line.textA ?? line.textB ?? ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
