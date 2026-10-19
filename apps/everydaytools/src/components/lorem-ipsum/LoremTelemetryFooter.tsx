import React from 'react';

interface LoremTelemetryFooterProps {
  words: number;
  chars: number;
  lines?: number;
  format?: string;
  isFr: boolean;
}

export function LoremTelemetryFooter({
  words,
  chars,
  lines,
  format,
  isFr,
}: LoremTelemetryFooterProps) {
  const wordsLabel = isFr
    ? words > 1
      ? 'mots'
      : 'mot'
    : words > 1
    ? 'words'
    : 'word';

  const charsLabel = isFr ? 'signes' : 'characters';
  const linesLabel = isFr ? 'lignes' : 'lines';

  return (
    <div className="px-5 py-2.5 border-t border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {words.toLocaleString()} {wordsLabel}
        </span>
        <span>·</span>
        <span>
          {chars.toLocaleString()} {charsLabel}
        </span>
        {lines !== undefined && lines > 0 && (
          <>
            <span>·</span>
            <span>
              {lines.toLocaleString()} {linesLabel}
            </span>
          </>
        )}
        {format && (
          <>
            <span>·</span>
            <span className="uppercase text-[10px] font-semibold tracking-wider text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              {format}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        <span className="hidden sm:inline">
          {isFr ? 'Appuyez sur la touche' : 'Press the'}
        </span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold shadow-2xs">
          {isFr ? 'Espace' : 'Space'}
        </kbd>
        <span>{isFr ? 'pour régénérer' : 'to regenerate'}</span>
      </div>
    </div>
  );
}
