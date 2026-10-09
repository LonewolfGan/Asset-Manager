import React from 'react';
import { FileSpreadsheet, FileCode } from 'lucide-react';
import type {
  ConversionDirection,
  ConversionInputMode,
} from '@/lib/csv-json-conversion-logic';

interface CsvJsonDirectionToolbarProps {
  direction: ConversionDirection;
  inputMode: ConversionInputMode;
  onToggleDirection: (dir: ConversionDirection) => void;
  onSetInputMode: (mode: ConversionInputMode) => void;
  isFr: boolean;
}

export function CsvJsonDirectionToolbar({
  direction,
  inputMode,
  onToggleDirection,
  onSetInputMode,
  isFr,
}: CsvJsonDirectionToolbarProps) {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      {/* Direction Switcher */}
      <div className="inline-flex p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-inner">
        <button
          type="button"
          onClick={() => onToggleDirection('csv-to-json')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            direction === 'csv-to-json'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileSpreadsheet size={14} className="text-emerald-500" />
          <span>CSV → JSON</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleDirection('json-to-csv')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            direction === 'json-to-csv'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileCode size={14} className="text-amber-500" />
          <span>JSON → CSV</span>
        </button>
      </div>

      {/* Input Mode Selector */}
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => onSetInputMode('upload')}
          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            inputMode === 'upload'
              ? 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          {isFr ? 'Fichier' : 'File'} {direction === 'csv-to-json' ? '.csv' : '.json'}
        </button>
        <span className="text-zinc-400 dark:text-zinc-600">·</span>
        <button
          type="button"
          onClick={() => onSetInputMode('paste')}
          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            inputMode === 'paste'
              ? 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          {isFr ? 'Saisie directe' : 'Direct input'}
        </button>
      </div>
    </div>
  );
}
