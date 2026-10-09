import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';
import { ALGORITHMS } from '@/lib/hash-generator-export';
import type { SupportedHashAlgo } from '@/lib/hash-logic';
import type { InputMode } from '@/hooks/use-hash-generator-workflow';
import { HashAlgorithmPills } from '@workspace/ui/controls';

interface HashResultsMatrixProps {
  hashes: Record<SupportedHashAlgo, string>;
  isCalculating: boolean;
  isUppercase: boolean;
  enableHmac: boolean;
  inputMode: InputMode;
  compareResult: { matched: boolean; algorithm?: string };
}

export function HashResultsMatrix({
  hashes,
  isCalculating,
  isUppercase,
  enableHmac,
  inputMode,
  compareResult,
}: HashResultsMatrixProps) {
  const { isFr } = useLocale();
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');

  const filteredAlgorithms = ALGORITHMS.filter((algo) => {
    if (selectedFilter === 'all') return true;
    return algo.id.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="bg-white dark:bg-zinc-950">
      <div className="px-4 sm:px-6 py-3 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30">
        <HashAlgorithmPills
          selectedAlgorithm={selectedFilter}
          onSelectAlgorithm={(algoId) =>
            setSelectedFilter(algoId === selectedFilter ? 'all' : algoId)
          }
          algorithms={[
            { id: 'all', name: isFr ? 'Tous les algorithmes' : 'All algorithms' },
            { id: 'SHA-256', name: 'SHA-256', bits: 256, recommended: true },
            { id: 'SHA-512', name: 'SHA-512', bits: 512, recommended: true },
            { id: 'SHA-384', name: 'SHA-384', bits: 384 },
            { id: 'SHA-1', name: 'SHA-1', bits: 160, legacy: true },
            { id: 'MD5', name: 'MD5', bits: 128, legacy: true },
          ]}
          label={isFr ? 'Filtrer par algorithme' : 'Filter by algorithm'}
          isFr={isFr}
        />
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-white/10">
        {filteredAlgorithms.map(({ id, label, bits, hexLength }) => {
        const rawHash = hashes[id];
        const isMatch = compareResult.matched && compareResult.algorithm === id;
        const displayHash = rawHash
          ? isUppercase
            ? rawHash.toUpperCase()
            : rawHash.toLowerCase()
          : '';

        return (
          <div
            key={id}
            className={`px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
              isMatch
                ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-l-4 border-l-emerald-500'
                : 'hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20'
            }`}
          >
            {/* Colonne Gauche : Identifiant de l'Algorithme & Métadonnées */}
            <div className="w-full md:w-48 shrink-0 flex items-center md:flex-col md:items-start justify-between md:justify-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {enableHmac && inputMode === 'text' && id !== 'MD5'
                    ? `HMAC-${label}`
                    : label}
                </span>
                {isMatch && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{isFr ? 'Concordant' : 'Match'}</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {bits} bits · {hexLength} {isFr ? 'car.' : 'chars'}
              </span>
            </div>

            {/* Colonne Centrale : Valeur Monospace de l'Empreinte */}
            <div className="flex-1 min-w-0">
              {isCalculating ? (
                <div className="h-9 w-full max-w-2xl bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
              ) : displayHash ? (
                <div
                  className={`font-mono text-xs sm:text-sm tracking-wider break-all select-all px-3 py-2 rounded-lg border transition-colors ${
                    isMatch
                      ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-semibold shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900/50 text-zinc-800 dark:text-zinc-200 border-zinc-200/60 dark:border-white/5'
                  }`}
                >
                  {displayHash}
                </div>
              ) : (
                <div className="px-3 py-2 rounded-lg bg-zinc-50/40 dark:bg-zinc-900/20 text-xs font-mono text-zinc-400 select-none">
                  {isFr ? 'En attente de saisie...' : 'Waiting for input...'}
                </div>
              )}
            </div>

            {/* Colonne Droite : Bouton de Copie Individuel */}
            <div className="shrink-0 flex items-center justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <CopyButton
                      text={
                        displayHash && !displayHash.startsWith('HMAC non')
                          ? displayHash
                          : ''
                      }
                      label={isFr ? 'Copier' : 'Copy'}
                      copiedLabel={isFr ? 'Copié' : 'Copied'}
                      size="sm"
                      className={
                        !displayHash || displayHash.startsWith('HMAC non')
                          ? 'opacity-30 pointer-events-none'
                          : ''
                      }
                      toastMessage={
                        isFr
                          ? `Empreinte ${label} copiée`
                          : `${label} hash copied`
                      }
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>
                    {isFr
                      ? `Copier l'empreinte ${label}`
                      : `Copy ${label} hash`}
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
