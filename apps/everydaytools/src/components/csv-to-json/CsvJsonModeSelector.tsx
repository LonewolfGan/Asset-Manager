import React from 'react';
import { FileSpreadsheet, FileCode, AlignLeft } from 'lucide-react';
import type {
  ConversionDirection,
  ConversionInputMode,
} from '@/lib/csv-json-conversion-logic';

interface CsvJsonModeSelectorProps {
  inputMode: ConversionInputMode;
  direction: ConversionDirection;
  onSetInputMode: (mode: ConversionInputMode) => void;
  isFr: boolean;
}

export function CsvJsonModeSelector({
  inputMode,
  direction,
  onSetInputMode,
  isFr,
}: CsvJsonModeSelectorProps) {
  const isCsvSource = direction === 'csv-to-json';

  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-inner">
        <button
          type="button"
          aria-pressed={inputMode === 'upload'}
          onClick={() => onSetInputMode('upload')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-colors duration-150 cursor-pointer ${
            inputMode === 'upload'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          {isCsvSource ? <FileSpreadsheet size={14} /> : <FileCode size={14} />}
          <span>
            {isFr ? 'Fichier' : 'File'} {isCsvSource ? '.csv' : '.json'}
          </span>
        </button>
        <button
          type="button"
          aria-pressed={inputMode === 'paste'}
          onClick={() => onSetInputMode('paste')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-medium transition-colors duration-150 cursor-pointer ${
            inputMode === 'paste'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <AlignLeft size={14} />
          <span>{isFr ? 'Saisie directe' : 'Direct input'}</span>
        </button>
      </div>
    </div>
  );
}
