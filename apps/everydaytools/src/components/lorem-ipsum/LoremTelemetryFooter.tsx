import React from 'react';

interface LoremTelemetryFooterProps {
  words: number;
  chars: number;
  isFr: boolean;
}

export function LoremTelemetryFooter({
  words,
  chars,
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

  return (
    <div className="px-6 py-3 border-t border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {words.toLocaleString()} {wordsLabel}
        </span>
        <span>·</span>
        <span>
          {chars.toLocaleString()} {charsLabel}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        <span className="hidden sm:inline">
          {isFr ? 'Appuyez sur la touche' : 'Press the'}
        </span>
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold">
          {isFr ? 'Espace' : 'Space'}
        </kbd>
        <span>{isFr ? 'pour régénérer le texte' : 'key to regenerate text'}</span>
      </div>
    </div>
  );
}
