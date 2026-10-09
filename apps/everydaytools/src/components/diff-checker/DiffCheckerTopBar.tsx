import React from 'react';
import {
  Edit3,
  Columns2,
  AlignLeft,
  ChevronUp,
  ChevronDown,
  Undo2,
  ArrowLeftRight,
  Trash2,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { WrapButton } from '@/components/ui/wrap-button';
import { CopyButton } from '@/components/ui/copy-button';
import { trackToolUsed } from '@/lib/analytics';
import { type DiffViewMode } from '@/lib/diff-checker-logic';
import { DiffDownloadMenu } from './DiffDownloadMenu';

interface DiffCheckerTopBarProps {
  viewMode: DiffViewMode;
  onViewModeChange: (mode: DiffViewMode) => void;
  ignoreWhitespace: boolean;
  onToggleIgnoreWhitespace: () => void;
  ignoreCase: boolean;
  onToggleIgnoreCase: () => void;
  wordWrap: boolean;
  onToggleWordWrap: (next: boolean) => void;
  hasDiffs: boolean;
  activeChangeIndex: number;
  totalChanges: number;
  onScrollToChange: (index: number) => void;
  canUndo: boolean;
  onUndo: () => void;
  hasContent: boolean;
  onSwap: () => void;
  onClear: () => void;
  unifiedPatchText: string;
  onDownloadPatch: () => void;
  onDownloadOriginal: () => void;
  onDownloadModified: () => void;
  isFr: boolean;
}

export function DiffCheckerTopBar({
  viewMode,
  onViewModeChange,
  ignoreWhitespace,
  onToggleIgnoreWhitespace,
  ignoreCase,
  onToggleIgnoreCase,
  wordWrap,
  onToggleWordWrap,
  hasDiffs,
  activeChangeIndex,
  totalChanges,
  onScrollToChange,
  canUndo,
  onUndo,
  hasContent,
  onSwap,
  onClear,
  unifiedPatchText,
  onDownloadPatch,
  onDownloadOriginal,
  onDownloadModified,
  isFr,
}: DiffCheckerTopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-white/10">
      {/* Groupe 1 : Onglets d'affichage et réglages de comparaison */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/50">
          <ActionTooltip label={isFr ? 'Édition directe des deux textes' : 'Direct editing of both texts'} side="bottom">
            <button
              type="button"
              onClick={() => onViewModeChange('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-zinc-200/90 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Édition' : 'Edit'}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label={isFr ? 'Affichage des différences côte à côte (2 colonnes)' : 'Side-by-side differences display (2 columns)'} side="bottom">
            <button
              type="button"
              onClick={() => onViewModeChange('split')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-zinc-200/90 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Côte à côte' : 'Side-by-side'}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label={isFr ? 'Affichage des différences unifié (style GitHub patch)' : 'Unified differences display (GitHub patch style)'} side="bottom">
            <button
              type="button"
              onClick={() => onViewModeChange('unified')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                viewMode === 'unified'
                  ? 'bg-zinc-200/90 dark:bg-zinc-700 text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Unifié' : 'Unified'}</span>
            </button>
          </ActionTooltip>
        </div>

        {/* Bascule Ignorer les Espaces */}
        <ActionTooltip label={isFr ? "Ignorer les différences d'espaces et d'indentation" : 'Ignore whitespace and indentation differences'} side="bottom">
          <button
            type="button"
            onClick={onToggleIgnoreWhitespace}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              ignoreWhitespace
                ? 'bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>{isFr ? 'Ignorer espaces' : 'Ignore whitespace'}</span>
          </button>
        </ActionTooltip>

        {/* Bascule Ignorer la Casse */}
        <ActionTooltip label={isFr ? 'Ignorer la casse (minuscules et majuscules considérées équivalentes)' : 'Ignore case (case-insensitive comparison)'} side="bottom">
          <button
            type="button"
            onClick={onToggleIgnoreCase}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              ignoreCase
                ? 'bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>{isFr ? 'Ignorer casse' : 'Ignore case'}</span>
          </button>
        </ActionTooltip>

        {/* Toggle Retour à la ligne */}
        <WrapButton
          wrapped={wordWrap}
          onToggle={onToggleWordWrap}
          label="Wrap"
          size="sm"
        />

        {/* Navigation dans les différences */}
        {viewMode !== 'edit' && hasDiffs && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/60 text-xs">
            <span className="text-[11px] font-mono text-zinc-500 pr-1">
              Diff {activeChangeIndex + 1}/{totalChanges}
            </span>
            <ActionTooltip label={isFr ? 'Aller à la différence précédente' : 'Go to previous difference'} side="bottom">
              <button
                type="button"
                onClick={() => onScrollToChange(activeChangeIndex - 1)}
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            </ActionTooltip>
            <ActionTooltip label={isFr ? 'Aller à la différence suivante' : 'Go to next difference'} side="bottom">
              <button
                type="button"
                onClick={() => onScrollToChange(activeChangeIndex + 1)}
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-pointer"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </ActionTooltip>
          </div>
        )}
      </div>

      {/* Groupe 2 : Actions Sémantiques */}
      <div className="flex items-center gap-1.5 ml-auto flex-wrap">
        {canUndo && (
          <ActionTooltip label={isFr ? 'Annuler (Ctrl+Z)' : 'Undo (Ctrl+Z)'} side="bottom">
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasContent && (
          <ActionTooltip label={isFr ? 'Intervertir le texte original et le texte modifié' : 'Swap original and modified text'} side="bottom">
            <button
              type="button"
              onClick={onSwap}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isFr ? 'Intervertir' : 'Swap'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasContent && (
          <CopyButton
            text={unifiedPatchText}
            label={isFr ? 'Copier Patch' : 'Copy Patch'}
            copiedLabel={isFr ? 'Patch copié !' : 'Patch copied!'}
            variant="default"
            size="sm"
            onCopy={() => trackToolUsed('diff-checker', 'copy-patch')}
          />
        )}

        {hasContent && (
          <ActionTooltip label={isFr ? 'Effacer les deux textes' : 'Clear both texts'} side="bottom">
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Menu Déroulant Télécharger */}
        {hasContent && (
          <DiffDownloadMenu
            onDownloadPatch={onDownloadPatch}
            onDownloadOriginal={onDownloadOriginal}
            onDownloadModified={onDownloadModified}
            isFr={isFr}
          />
        )}
      </div>
    </div>
  );
}
