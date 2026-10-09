import React from 'react';
import { Code2, FolderTree, Table as TableIcon, FileCode } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { ViewTab } from '@/lib/json-repair-logic';

export interface JsonViewModeSelectorProps {
  viewTab: ViewTab;
  onViewTabChange: (tab: ViewTab) => void;
  yamlMode: boolean;
  onToggleYamlMode: () => void;
  isActionDisabled: boolean;
  isArrayRoot: boolean;
  arrayLength: number;
  isFr: boolean;
}

export function JsonViewModeSelector({
  viewTab,
  onViewTabChange,
  yamlMode,
  onToggleYamlMode,
  isActionDisabled,
  isArrayRoot,
  arrayLength,
  isFr,
}: JsonViewModeSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => {
          onViewTabChange('code');
          if (yamlMode) onToggleYamlMode();
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
          viewTab === 'code' && !yamlMode
            ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
        }`}
      >
        <Code2 className="w-3.5 h-3.5" />
        <span>{isFr ? 'Code JSON' : 'JSON Code'}</span>
      </button>

      <button
        onClick={() => onViewTabChange('tree')}
        disabled={isActionDisabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
          viewTab === 'tree'
            ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
        }`}
      >
        <FolderTree className="w-3.5 h-3.5" />
        <span>{isFr ? 'Arborescence' : 'Tree View'}</span>
      </button>

      <ActionTooltip
        label={
          !isArrayRoot
            ? isFr
              ? "Nécessite un tableau d'objets à la racine"
              : 'Requires an array of objects at root'
            : isFr
              ? 'Vue tabulaire'
              : 'Table view'
        }
        side="bottom"
      >
        <button
          onClick={() => onViewTabChange('table')}
          disabled={isActionDisabled || !isArrayRoot}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
            viewTab === 'table'
              ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>{isFr ? 'Tableau' : 'Table'}</span>
          {isArrayRoot && (
            <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono">
              {arrayLength}
            </span>
          )}
        </button>
      </ActionTooltip>

      <button
        onClick={() => {
          onToggleYamlMode();
          onViewTabChange('code');
        }}
        disabled={isActionDisabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
          yamlMode
            ? 'bg-[#FF6B35] text-white font-semibold'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
        }`}
      >
        <FileCode className="w-3.5 h-3.5" />
        <span>YAML</span>
      </button>
    </div>
  );
}
