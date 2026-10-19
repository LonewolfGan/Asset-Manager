import React from 'react';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';
import { UrlMode } from '@/hooks/use-url-encoder-workflow';
import { UrlByteStats, getConversionPlaceholder } from '@/lib/url-export-logic';
import type { UrlSample } from '@/lib/url-samples';

interface UrlInputPaneProps {
  isFr: boolean;
  input: string;
  onUpdateInput: (val: string) => void;
  mode: UrlMode;
  wordWrap: boolean;
  error: string | null;
  hasInput: boolean;
  inputStats: UrlByteStats;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onFileUpload: (file: File) => void;
  samples?: UrlSample[];
  onLoadSample?: (sample: UrlSample) => void;
}

export const UrlInputPane: React.FC<UrlInputPaneProps> = ({
  isFr,
  input,
  onUpdateInput,
  mode,
  wordWrap,
  error,
  hasInput,
  inputStats,
  isDragging,
  setIsDragging,
  onFileUpload,
  samples,
  onLoadSample,
}) => {
  return (
    <div
      className={`flex flex-col relative min-h-[460px] transition-colors ${
        isDragging ? 'ring-2 ring-inset ring-zinc-500/40 bg-zinc-500/5' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileUpload(file);
      }}
    >
      {/* Barre d'en-tête volet gauche */}
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
          {mode === 'encode'
            ? isFr
              ? 'Texte / URL Source'
              : 'Source Text / URL'
            : isFr
            ? 'URL Encodée'
            : 'Encoded URL'}
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          {hasInput && (
            <span className="text-[11px] font-mono text-zinc-400">
              {inputStats.chars} {isFr ? 'car.' : 'chars'} · {inputStats.bytes}{' '}
              {isFr ? 'octets' : 'bytes'}
            </span>
          )}

          <label className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)]/50 hover:text-[var(--accent)] dark:hover:text-[var(--accent)] text-zinc-600 dark:text-zinc-400 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{isFr ? 'Importer .txt' : 'Import .txt'}</span>
            <input
              type="file"
              accept=".txt,.url"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onFileUpload(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Saisie brute monospace avec autofocus direct */}
      <textarea
        value={input}
        onChange={(e) => onUpdateInput(e.target.value)}
        placeholder={getConversionPlaceholder(mode, isFr)}
        spellCheck={false}
        autoFocus
        className={`w-full flex-1 p-4 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none ${
          wordWrap
            ? 'whitespace-pre-wrap break-all'
            : 'whitespace-pre overflow-x-auto'
        }`}
      />

      {/* Boutons d'échantillons rapides en état vide */}
      {!hasInput && onLoadSample && samples && samples.length > 0 && (
        <div className="p-3 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/20 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
            <span>{isFr ? 'Exemples :' : 'Samples:'}</span>
          </span>
          {samples.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onLoadSample(s)}
              className="px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {isFr ? s.titleFr : s.titleEn}
            </button>
          ))}
        </div>
      )}

      {/* Alerte d'erreur de décodage ancrée sans boîte flottante */}
      {error && hasInput && (
        <div className="px-4 py-2.5 border-t border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 text-xs text-rose-600 dark:text-rose-400 font-mono flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
