import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { UrlMode } from '@/hooks/use-url-encoder-workflow';
import { UrlEncodeMode } from '@/lib/url-logic';
import { UrlByteStats } from '@/lib/url-export-logic';

interface UrlOutputPaneProps {
  isFr: boolean;
  output: string;
  mode: UrlMode;
  encodeMode: UrlEncodeMode;
  wordWrap: boolean;
  hasInput: boolean;
  hasOutput: boolean;
  outputStats: UrlByteStats;
  copiedLabel: string;
}

export const UrlOutputPane: React.FC<UrlOutputPaneProps> = ({
  isFr,
  output,
  mode,
  encodeMode,
  wordWrap,
  hasInput,
  hasOutput,
  outputStats,
  copiedLabel,
}) => {
  return (
    <div className="flex flex-col relative min-h-[460px] bg-zinc-50/30 dark:bg-zinc-900/10">
      {/* Barre d'en-tête volet droit */}
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
            {mode === 'encode'
              ? isFr
                ? 'Résultat Encodé'
                : 'Encoded Result'
              : isFr
              ? 'Résultat Décodé'
              : 'Decoded Result'}
          </span>
          {mode === 'encode' && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF6B35]/10 text-[#FF6B35] font-semibold border border-[#FF6B35]/20">
              {encodeMode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasOutput && (
            <span className="text-[11px] font-mono text-zinc-400">
              {outputStats.chars} {isFr ? 'car.' : 'chars'} · {outputStats.bytes}{' '}
              {isFr ? 'octets' : 'bytes'}
            </span>
          )}

          {hasOutput && (
            <CopyButton
              text={output}
              label={isFr ? 'Copier' : 'Copy'}
              copiedLabel={copiedLabel}
              variant="ghost"
              size="sm"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            />
          )}
        </div>
      </div>

      {/* Zone de lecture seule */}
      <textarea
        readOnly
        value={output}
        placeholder={
          hasInput
            ? ''
            : isFr
            ? '(En attente de saisie...)'
            : '(Waiting for input...)'
        }
        spellCheck={false}
        className={`w-full flex-1 p-4 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 select-text ${
          wordWrap
            ? 'whitespace-pre-wrap break-all'
            : 'whitespace-pre overflow-x-auto'
        }`}
      />
    </div>
  );
};
