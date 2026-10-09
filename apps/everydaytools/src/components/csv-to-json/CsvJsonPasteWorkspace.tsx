import React from 'react';
import { ArrowRight } from 'lucide-react';
import CodeWorkspace from '@/components/ui/code-workspace';
import type { ConversionFormat } from '@/components/conversion';
import {
  type ConversionDirection,
  SAMPLE_CSV_TEXT,
  SAMPLE_JSON_TEXT,
} from '@/lib/csv-json-conversion-logic';

interface CsvJsonPasteWorkspaceProps {
  rawText: string;
  onTextChange: (val: string) => void;
  onSubmit: () => void;
  direction: ConversionDirection;
  sourceFormat: ConversionFormat;
  isFr: boolean;
}

export function CsvJsonPasteWorkspace({
  rawText,
  onTextChange,
  onSubmit,
  direction,
  sourceFormat,
  isFr,
}: CsvJsonPasteWorkspaceProps) {
  const isCsv = direction === 'csv-to-json';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <CodeWorkspace
        mode="input"
        value={rawText}
        onChange={onTextChange}
        format={isCsv ? 'csv' : 'json'}
        formatLabel={sourceFormat.name}
        formatIcon={sourceFormat.icon}
        placeholder={
          isCsv
            ? isFr
              ? 'Veuillez saisir vos données CSV...'
              : 'Please enter your CSV data...'
            : isFr
            ? 'Veuillez saisir vos données JSON...'
            : 'Please enter your JSON data...'
        }
        sampleText={isCsv ? SAMPLE_CSV_TEXT : SAMPLE_JSON_TEXT}
        onSubmit={() => {
          if (rawText.trim()) onSubmit();
        }}
        minHeight="280px"
      />

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          disabled={!rawText.trim()}
          onClick={onSubmit}
          className="h-11 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>{isFr ? 'Valider et configurer' : 'Validate and proceed'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
