import React from 'react';
import { Clock, Volume2 } from 'lucide-react';
import type { DetailedTextStats } from '@/lib/word-counter-logic';
import { formatDuration } from '@/lib/word-counter-export-logic';

interface WordCounterMetricRibbonProps {
  stats: DetailedTextStats;
  isFr: boolean;
}

export const WordCounterMetricRibbon: React.FC<WordCounterMetricRibbonProps> = ({
  stats,
  isFr,
}) => {
  return (
    <div className="px-4 sm:px-6 py-3 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/40 dark:bg-zinc-900/20 flex flex-wrap items-center justify-between gap-y-3 gap-x-6">
      {/* Métrique 1 : Mots */}
      <div className="flex flex-col">
        <span className="font-mono text-base sm:text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {stats.words.toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          {isFr ? 'Mots' : 'Words'}
        </span>
      </div>

      {/* Métrique 2 : Caractères (avec espaces) */}
      <div className="flex flex-col">
        <span className="font-mono text-base sm:text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {stats.characters.toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          {isFr ? 'Caractères' : 'Characters'}
        </span>
      </div>

      {/* Métrique 3 : Sans espaces */}
      <div className="flex flex-col">
        <span className="font-mono text-base sm:text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {stats.charactersNoSpaces.toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          {isFr ? 'Sans espaces' : 'No spaces'}
        </span>
      </div>

      {/* Métrique 4 : Phrases */}
      <div className="flex flex-col">
        <span className="font-mono text-base sm:text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {stats.sentences.toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          {isFr ? 'Phrases' : 'Sentences'}
        </span>
      </div>

      {/* Métrique 5 : Paragraphes */}
      <div className="flex flex-col">
        <span className="font-mono text-base sm:text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {stats.paragraphs.toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          {isFr ? 'Paragraphes' : 'Paragraphs'}
        </span>
      </div>

      {/* Séparateur vertical fin sur écrans larges */}
      <div className="hidden lg:block w-px h-8 bg-zinc-200 dark:bg-white/10" />

      {/* Métrique 6 : Temps de lecture (~220 mpm) */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
        <div className="flex flex-col">
          <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {formatDuration(stats.readingTimeSec)}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            {isFr ? 'Lecture (~220 mpm)' : 'Reading (~220 wpm)'}
          </span>
        </div>
      </div>

      {/* Métrique 7 : Temps de parole (~130 mpm) */}
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-zinc-400 shrink-0" />
        <div className="flex flex-col">
          <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {formatDuration(stats.speakingTimeSec)}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            {isFr ? 'Parole (~130 mpm)' : 'Speaking (~130 wpm)'}
          </span>
        </div>
      </div>
    </div>
  );
};
