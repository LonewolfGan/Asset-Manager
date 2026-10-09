import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { UnifiedLine } from '@/lib/json-diff-aligned-logic';

export interface JsonDiffUnifiedViewProps {
  unifiedLines: UnifiedLine[];
  wordWrap: boolean;
}

export function JsonDiffUnifiedView({ unifiedLines, wordWrap }: JsonDiffUnifiedViewProps) {
  return (
    <div className="w-full font-mono text-xs overflow-auto max-h-[580px]">
      {unifiedLines.map((line, idx) => {
        let bg = 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40';
        let textColor = 'text-zinc-800 dark:text-zinc-200';
        let icon = null;

        if (line.type === 'add') {
          bg = 'bg-emerald-500/10 dark:bg-emerald-500/15';
          textColor = 'text-emerald-700 dark:text-emerald-300 font-medium';
          icon = <Plus className="w-3 h-3 text-emerald-500 inline" />;
        } else if (line.type === 'remove') {
          bg = 'bg-rose-500/10 dark:bg-rose-500/15';
          textColor = 'text-rose-700 dark:text-rose-300 font-medium';
          icon = <Minus className="w-3 h-3 text-rose-500 inline" />;
        }

        return (
          <div
            key={idx}
            className={`flex items-start px-3 py-0.5 border-b border-zinc-100 dark:border-white/5 ${bg}`}
          >
            <span className="w-9 shrink-0 text-right pr-2 select-none text-[11px] text-zinc-400">
              {line.lineNumLeft ?? ''}
            </span>
            <span className="w-9 shrink-0 text-right pr-2 select-none text-[11px] text-zinc-400">
              {line.lineNumRight ?? ''}
            </span>
            <span className="w-4 shrink-0 text-center select-none font-bold">
              {icon}
            </span>
            <span
              className={`flex-1 ${textColor} ${
                wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
              }`}
            >
              {line.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
