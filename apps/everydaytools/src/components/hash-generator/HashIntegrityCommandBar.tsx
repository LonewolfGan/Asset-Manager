import React from 'react';
import {
  Search,
  X,
  CheckCircle2,
  ShieldAlert,
  Undo2,
  Trash2,
  Download,
  Copy,
  FileJson,
  ChevronDown,
} from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/hooks/use-locale';
import type { InputMode } from '@/hooks/use-hash-generator-workflow';

interface HashIntegrityCommandBarProps {
  compareHash: string;
  compareResult: { matched: boolean; algorithm?: string };
  isUppercase: boolean;
  inputMode: InputMode;
  historyLength: number;
  hasData: boolean;
  manifestContent: string;
  onCompareHashChange: (val: string) => void;
  onClearCompareHash: () => void;
  onToggleUppercase: (upper: boolean) => void;
  onUndo: () => void;
  onClear: () => void;
  onCopyAll: () => void;
  onDownloadManifest: () => void;
  onExportJson: () => void;
}

export function HashIntegrityCommandBar({
  compareHash,
  compareResult,
  isUppercase,
  inputMode,
  historyLength,
  hasData,
  manifestContent,
  onCompareHashChange,
  onClearCompareHash,
  onToggleUppercase,
  onUndo,
  onClear,
  onCopyAll,
  onDownloadManifest,
  onExportJson,
}: HashIntegrityCommandBarProps) {
  const { isFr } = useLocale();

  return (
    <div className="border-t border-b border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-900/60 px-4 sm:px-6 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Vérificateur d'intégrité (Checksum Compare) */}
      <div className="flex-1 max-w-xl flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={compareHash}
            onChange={(e) => onCompareHashChange(e.target.value)}
            placeholder={
              isFr
                ? "Coller un hash attendu pour vérifier l'intégrité..."
                : 'Paste expected hash to verify integrity...'
            }
            spellCheck={false}
            className="w-full h-8 pl-8 pr-8 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200/80 dark:border-white/10 text-xs font-mono outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
          {compareHash && (
            <ActionTooltip label={isFr ? 'Effacer' : 'Clear'} side="top">
              <button
                type="button"
                onClick={onClearCompareHash}
                className="absolute right-2.5 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </ActionTooltip>
          )}
        </div>

        {/* Badge d'état de concordance */}
        {compareHash.trim() && (
          <div>
            {compareResult.matched ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {isFr
                    ? `Concordance ${compareResult.algorithm}`
                    : `${compareResult.algorithm} match`}
                </span>
              </div>
            ) : (
              compareHash.trim().length >= 32 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium whitespace-nowrap">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isFr ? 'Aucune concordance' : 'No match'}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Barre d'actions & Format (Ordre strict Règle 25 : Casse -> Annuler -> Vider -> Copier -> Exporter) */}
      <div className="flex items-center justify-end gap-2 shrink-0">
        {/* Bascule de Casse (Minuscules / Majuscules) */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-xs">
          <ActionTooltip
            label={
              isFr
                ? 'Minuscules (standard Linux sha256sum)'
                : 'Lowercase (Linux sha256sum standard)'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={() => onToggleUppercase(false)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
                !isUppercase
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              abc
            </button>
          </ActionTooltip>

          <ActionTooltip
            label={
              isFr
                ? 'Majuscules (standard Windows CertUtil)'
                : 'Uppercase (Windows CertUtil standard)'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={() => onToggleUppercase(true)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[11px] ${
                isUppercase
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              ABC
            </button>
          </ActionTooltip>
        </div>

        {/* Bouton Annuler (Ctrl+Z) */}
        {inputMode === 'text' && historyLength > 0 && (
          <ActionTooltip
            label={isFr ? 'Annuler la saisie (Ctrl+Z)' : 'Undo input (Ctrl+Z)'}
            side="bottom"
          >
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3 h-3" />
              <span>{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Bouton Vider */}
        {hasData && (
          <ActionTooltip
            label={isFr ? "Vider l'atelier" : 'Clear workspace'}
            side="bottom"
          >
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasData && (
          <CopyButton
            text={manifestContent}
            label={isFr ? 'Copier tout' : 'Copy all'}
            copiedLabel={isFr ? 'Copié !' : 'Copied!'}
            size="sm"
            variant="default"
            toastMessage={
              isFr ? 'Manifeste complet copié' : 'Full manifest copied'
            }
          />
        )}

        {/* Menu Exporter (Bouton Signature Orange #FF6B35 permanent à droite) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={!hasData}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? 'Exporter' : 'Export'}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onCopyAll}>
              <Copy className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>
                {isFr ? 'Copier le manifeste (.txt)' : 'Copy manifest (.txt)'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadManifest}>
              <Download className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>
                {isFr ? 'Télécharger checksums.txt' : 'Download checksums.txt'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportJson}>
              <FileJson className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Copier au format JSON' : 'Copy as JSON'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
