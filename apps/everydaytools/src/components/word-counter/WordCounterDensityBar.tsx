import React from 'react';

interface WordCounterDensityBarProps {
  topKeywords: Array<{ word: string; count: number; percentage: number }>;
  lines: number;
  avgWordLength: number;
  isFr: boolean;
}

export const WordCounterDensityBar: React.FC<WordCounterDensityBarProps> = ({
  topKeywords,
  lines,
  avgWordLength,
  isFr,
}) => {
  return (
    <div className="px-4 sm:px-6 py-3 border-t border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Densité des mots-clés les plus fréquents */}
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
          {isFr ? 'Mots fréquents :' : 'Top keywords:'}
        </span>
        {topKeywords.length > 0 ? (
          topKeywords.map((k) => (
            <span
              key={k.word}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-white/5 text-zinc-700 dark:text-zinc-300 font-mono text-[11px]"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{k.word}</span>
              <span className="text-zinc-400">· {k.count} ({k.percentage}%)</span>
            </span>
          ))
        ) : (
          <span className="text-[11px] font-mono text-zinc-400">
            {isFr ? 'Aucun mot significatif détecté' : 'No significant words detected'}
          </span>
        )}
      </div>

      {/* Télémétrie secondaire */}
      <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 shrink-0">
        <span>{isFr ? 'Lignes :' : 'Lines:'} {lines}</span>
        <span>{isFr ? 'Long. moy. :' : 'Avg. len.:'} {avgWordLength} {isFr ? 'car.' : 'chars'}</span>
      </div>
    </div>
  );
};
