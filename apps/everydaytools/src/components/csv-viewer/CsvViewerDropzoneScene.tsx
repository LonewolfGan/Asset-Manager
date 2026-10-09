import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import {
  ConversionDropzone,
  type ConversionFormat,
} from '@/components/conversion';
import { CodeWorkspace } from '@/components/ui/code-workspace';
import { SAMPLE_CSV_FR, SAMPLE_CSV_EN } from '@/lib/csv-viewer-samples';

export interface CsvViewerDropzoneSceneProps {
  inputMode: 'file' | 'paste';
  setInputMode: (mode: 'file' | 'paste') => void;
  isFr: boolean;
  error: string | null;
  sourceFormat: ConversionFormat;
  isDragging: boolean;
  onFileSelected: (file: File) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onLoadSample: () => void;
  rawText: string;
  setRawText: (val: string) => void;
  onPasteSubmit: () => void;
}

export const CsvViewerDropzoneScene: React.FC<CsvViewerDropzoneSceneProps> = ({
  inputMode,
  setInputMode,
  isFr,
  error,
  sourceFormat,
  isDragging,
  onFileSelected,
  onDragOver,
  onDragLeave,
  onDrop,
  onLoadSample,
  rawText,
  setRawText,
  onPasteSubmit,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" key="dropzone-scene">
      {/* Sélecteur de méthode d'importation */}
      <div className="flex items-center justify-center p-1 rounded-xl bg-neutral-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 w-fit mx-auto">
        <button
          type="button"
          onClick={() => setInputMode('file')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            inputMode === 'file'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          {isFr ? 'Fichier tableur' : 'Spreadsheet file'}
        </button>
        <button
          type="button"
          onClick={() => setInputMode('paste')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            inputMode === 'paste'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          {isFr ? 'Coller du texte brut' : 'Paste raw text'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-mono text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Mode 1 : Dépôt de fichier */}
      {inputMode === 'file' && (
        <div className="space-y-4">
          <ConversionDropzone
            sourceFormat={sourceFormat}
            accept=".csv, .tsv, .txt, .xlsx, .xls, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            title={
              isFr
                ? 'Glissez-déposez votre fichier CSV ou tableur'
                : 'Drag & drop your CSV or spreadsheet file'
            }
            description={
              isFr
                ? 'ou cliquez pour parcourir (.csv, .tsv, .xlsx, .xls) et explorer vos données instantanément.'
                : 'or click to browse (.csv, .tsv, .xlsx, .xls) and explore your data instantly.'
            }
            buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
            isDragging={isDragging}
            onFileSelected={onFileSelected}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          />

          <div className="flex items-center justify-center pt-1">
            <button
              type="button"
              onClick={onLoadSample}
              className="h-11 px-5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-all flex items-center gap-2.5 cursor-pointer active:scale-[0.98] shadow-sm"
            >
              <FileSpreadsheet size={16} className="text-zinc-500 dark:text-zinc-400" />
              <span>{isFr ? "Charger des données d'exemple" : 'Load sample data'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2 : Coller du texte brut */}
      {inputMode === 'paste' && (
        <div className="space-y-4">
          <CodeWorkspace
            mode="input"
            value={rawText}
            onChange={setRawText}
            format="csv"
            formatLabel={
              isFr
                ? 'Données tabulaires (CSV, TSV, Délimité)'
                : 'Tabular data (CSV, TSV, Delimited)'
            }
            placeholder={
              isFr
                ? 'Veuillez saisir vos données CSV ou tabulaires...'
                : 'Enter your CSV or tabular data here...'
            }
            sampleText={isFr ? SAMPLE_CSV_FR : SAMPLE_CSV_EN}
            onSubmit={onPasteSubmit}
            minHeight="240px"
            maxHeight="420px"
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onPasteSubmit}
              disabled={!rawText.trim()}
              className="h-10 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-semibold transition-all cursor-pointer active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              {isFr ? 'Visualiser le tableau' : 'View spreadsheet'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
