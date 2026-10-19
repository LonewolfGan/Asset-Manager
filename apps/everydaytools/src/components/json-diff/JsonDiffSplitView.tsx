import React from 'react';
import { Minus, Plus, PenLine } from 'lucide-react';
import type { AlignedLine } from '@/lib/json-diff-aligned-logic';

export interface JsonDiffSplitViewProps {
  alignedLines: AlignedLine[];
  wordWrap: boolean;
}

export function JsonDiffSplitView({ alignedLines, wordWrap }: JsonDiffSplitViewProps) {
  return (
    <div className="w-full divide-y divide-zinc-100 dark:divide-white/5 font-mono text-xs overflow-auto max-h-[580px]">
      {alignedLines.map((line, idx) => {
        let bgLeft = 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40';
        let textColorLeft = 'text-zinc-800 dark:text-zinc-200';
        if (line.typeLeft === 'remove') {
          bgLeft = 'bg-rose-500/10 dark:bg-rose-500/15';
          textColorLeft = 'text-rose-700 dark:text-rose-300 font-medium';
        } else if (line.typeLeft === 'modify') {
          bgLeft = 'bg-amber-500/10 dark:bg-amber-500/15';
          textColorLeft = 'text-amber-700 dark:text-amber-300 font-medium';
        } else if (line.typeLeft === 'empty') {
          bgLeft = 'bg-zinc-100/40 dark:bg-zinc-900/20 opacity-40 select-none';
        }

        let bgRight = 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40';
        let textColorRight = 'text-zinc-800 dark:text-zinc-200';
        if (line.typeRight === 'add') {
          bgRight = 'bg-emerald-500/10 dark:bg-emerald-500/15';
          textColorRight = 'text-emerald-700 dark:text-emerald-300 font-medium';
        } else if (line.typeRight === 'modify') {
          bgRight = 'bg-amber-500/10 dark:bg-amber-500/15';
          textColorRight = 'text-amber-700 dark:text-amber-300 font-medium';
        } else if (line.typeRight === 'empty') {
          bgRight = 'bg-zinc-100/40 dark:bg-zinc-900/20 opacity-40 select-none';
        }

        return (
          <div
            key={idx}
            className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10"
          >
            {/* Cellule Gauche (Original) */}
            <div className={`flex items-start px-2 py-0.5 ${bgLeft}`}>
              <span className="w-9 shrink-0 text-right pr-2 select-none text-[11px] text-zinc-400 font-mono">
                {line.lineNumLeft ?? ''}
              </span>
              <span className="w-4 shrink-0 text-center select-none font-bold">
                {line.typeLeft === 'remove' && (
                  <Minus className="w-3 h-3 text-rose-500 inline" />
                )}
                {line.typeLeft === 'modify' && (
                  <PenLine className="w-3 h-3 text-amber-500 inline" />
                )}
              </span>
              <span
                className={`flex-1 ${textColorLeft} ${
                  wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
                }`}
              >
                {line.textLeft ?? ' '}
              </span>
            </div>

            {/* Cellule Droite (Modifié) */}
            <div className={`flex items-start px-2 py-0.5 ${bgRight}`}>
              <span className="w-9 shrink-0 text-right pr-2 select-none text-[11px] text-zinc-400 font-mono">
                {line.lineNumRight ?? ''}
              </span>
              <span className="w-4 shrink-0 text-center select-none font-bold">
                {line.typeRight === 'add' && (
                  <Plus className="w-3 h-3 text-emerald-500 inline" />
                )}
                {line.typeRight === 'modify' && (
                  <PenLine className="w-3 h-3 text-amber-500 inline" />
                )}
              </span>
              <span
                className={`flex-1 ${textColorRight} ${
                  wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
                }`}
              >
                {line.textRight ?? ' '}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
