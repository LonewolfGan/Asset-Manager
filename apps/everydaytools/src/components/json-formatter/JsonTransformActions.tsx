import React from 'react';
import { Minimize2, ArrowUpDown, Quote } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { IndentSize } from '@/lib/json-repair-logic';

export interface JsonTransformActionsProps {
  isMinified: boolean;
  yamlMode: boolean;
  indentSize: IndentSize;
  isActionDisabled: boolean;
  onFormat: (indent?: IndentSize) => void;
  onMinify: () => void;
  onSortKeys: () => void;
  onEscapeToggle: () => void;
  isFr: boolean;
}

export function JsonTransformActions({
  isMinified,
  yamlMode,
  indentSize,
  isActionDisabled,
  onFormat,
  onMinify,
  onSortKeys,
  onEscapeToggle,
  isFr,
}: JsonTransformActionsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Formater avec sélection claire 2 / 4 / Tab */}
      <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50 p-0.5">
        <button
          onClick={() => onFormat()}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            !isMinified && !yamlMode
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          {isFr ? 'Formater' : 'Format'}
        </button>
        <div className="flex items-center gap-0.5 px-1 border-l border-zinc-300 dark:border-zinc-700 ml-1">
          {([2, 4, 'tab'] as IndentSize[]).map((n) => (
            <button
              key={n}
              onClick={() => onFormat(n)}
              className={`px-1.5 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                indentSize === n && !isMinified && !yamlMode
                  ? 'bg-[#FF6B35] text-white font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {n === 'tab' ? 'Tab' : n}
            </button>
          ))}
        </div>
      </div>

      {/* Minifier */}
      <button
        onClick={onMinify}
        className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
          isMinified && !yamlMode
            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 font-semibold'
            : 'border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <Minimize2 className="w-3.5 h-3.5" />
        <span>{isFr ? 'Minifier' : 'Minify'}</span>
      </button>

      {/* Trier A-Z */}
      <ActionTooltip
        label={
          isFr
            ? 'Trier alphabétiquement les clés de chaque objet'
            : 'Sort keys alphabetically in each object'
        }
        side="bottom"
      >
        <button
          onClick={onSortKeys}
          disabled={isActionDisabled}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{isFr ? 'Trier A-Z' : 'Sort A-Z'}</span>
        </button>
      </ActionTooltip>

      {/* Échapper */}
      <ActionTooltip
        label={
          isFr
            ? 'Échapper le JSON en chaîne ou déséchapper'
            : 'Escape JSON as string or unescape'
        }
        side="bottom"
      >
        <button
          onClick={onEscapeToggle}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Quote className="w-3.5 h-3.5" />
          <span>{isFr ? 'Échapper' : 'Escape'}</span>
        </button>
      </ActionTooltip>
    </div>
  );
}
