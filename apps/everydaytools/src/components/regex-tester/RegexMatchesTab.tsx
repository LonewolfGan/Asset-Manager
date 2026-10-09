import React from 'react';
import { Search } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { MatchDisplayMode, MatchResult, TextChunk } from '@/lib/regex-tester-logic';

interface RegexMatchesTabProps {
  hasTestContent: boolean;
  matches: MatchResult[];
  isValid: boolean;
  matchDisplayMode: MatchDisplayMode;
  highlightedChunks: TextChunk[];
  selectedMatchIndex: number | null;
  onSelectMatchIndex: (idx: number | null) => void;
  wordWrap: boolean;
  isFr: boolean;
}

export function RegexMatchesTab({
  hasTestContent,
  matches,
  isValid,
  matchDisplayMode,
  highlightedChunks,
  selectedMatchIndex,
  onSelectMatchIndex,
  wordWrap,
  isFr,
}: RegexMatchesTabProps) {
  if (!hasTestContent) {
    return (
      <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center text-zinc-400">
        <Search className="w-10 h-10 mb-2 stroke-[1.2] opacity-40" />
        <p className="text-xs text-zinc-500">
          {isFr
            ? 'Collez ou déposez votre texte de test à gauche pour voir les correspondances'
            : 'Paste or drop test text on the left to see matches'}
        </p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center text-zinc-400">
        <Search className="w-10 h-10 mb-2 stroke-[1.2] opacity-40" />
        <p className="text-xs text-zinc-500">
          {isValid
            ? (isFr ? 'Aucune correspondance trouvée avec ce motif' : 'No matches found with this pattern')
            : (isFr ? 'Expression régulière invalide, veuillez corriger le motif' : 'Invalid regular expression, please fix the pattern')}
        </p>
      </div>
    );
  }

  if (matchDisplayMode === 'highlight') {
    return (
      <div className={`text-zinc-800 dark:text-zinc-200 ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
        {highlightedChunks.map((chunk, idx) => {
          if (!chunk.isMatch) return <span key={idx}>{chunk.text}</span>;
          const isSelected = selectedMatchIndex === chunk.matchIndex;
          return (
            <ActionTooltip key={idx} label={isFr ? `Correspondance #${chunk.matchIndex}` : `Match #${chunk.matchIndex}`} side="top">
              <mark
                onClick={() => onSelectMatchIndex(chunk.matchIndex ?? null)}
                className={`rounded-xs px-1 py-0.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#FF6B35] text-white font-semibold'
                    : 'bg-[#FF6B35]/20 text-zinc-950 dark:text-zinc-100 border-b border-[#FF6B35]'
                }`}
              >
                {chunk.text}
              </mark>
            </ActionTooltip>
          );
        })}
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200/60 dark:divide-white/10">
      {matches.map((m, idx) => {
        const matchNum = idx + 1;
        const isSelected = selectedMatchIndex === matchNum;
        return (
          <div
            key={idx}
            onClick={() => onSelectMatchIndex(matchNum)}
            className={`py-2 px-1 transition-colors cursor-pointer ${
              isSelected
                ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-zinc-100'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-zinc-400">#{matchNum}</span>
                <span className="font-bold select-all">{m.value}</span>
              </div>
              <span className="text-zinc-400 font-mono text-[10px]">
                {isFr ? `Position [${m.index} à ${m.index + m.length}]` : `Position [${m.index} to ${m.index + m.length}]`}
              </span>
            </div>

            {m.groups.length > 0 && (
              <div className="mt-1 pl-4 space-y-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                {m.groups.map((grp) => (
                  <div key={grp.index} className="flex items-center gap-1.5">
                    <span className="text-zinc-400 select-none">└</span>
                    <span className="text-[#FF6B35] font-medium">
                      {grp.name ? `$${grp.name}` : (isFr ? `Groupe ${grp.index}` : `Group ${grp.index}`)} :
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-200 select-all">"{grp.value}"</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
