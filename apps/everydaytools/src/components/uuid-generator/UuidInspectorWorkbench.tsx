import React from 'react';
import { Search, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { CopyButton } from '@/components/ui/copy-button';
import type { UuidParsedInfo } from '@/lib/uuid-logic';

interface UuidInspectorWorkbenchProps {
  inspectInput: string;
  inspectedData: UuidParsedInfo;
  isFr: boolean;
  copiedLabel: string;
  onInputChange: (val: string) => void;
  onClearInput: () => void;
}

export const UuidInspectorWorkbench: React.FC<UuidInspectorWorkbenchProps> = ({
  inspectInput,
  inspectedData,
  isFr,
  copiedLabel,
  onInputChange,
  onClearInput,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-950">
      {/* Champ de saisie / analyse en pleine largeur */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          value={inspectInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={
            isFr
              ? 'Coller ou saisir un UUID à décoder (avec ou sans tirets)...'
              : 'Paste or enter a UUID to decode (with or without hyphens)...'
          }
          spellCheck={false}
          className="w-full bg-transparent font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400"
        />
        {inspectInput && (
          <ActionTooltip label={isFr ? 'Effacer' : 'Clear'} side="top">
            <button
              type="button"
              onClick={onClearInput}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </ActionTooltip>
        )}
      </div>

      {/* Contenu de l'analyse */}
      {inspectInput.trim() ? (
        inspectedData.valid ? (
          <div className="divide-y divide-zinc-200/80 dark:divide-white/5">
            {/* Statut de conformité */}
            <div className="px-4 sm:px-6 py-3 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {isFr
                  ? 'Identifiant universel conforme aux spécifications RFC'
                  : 'Universally unique identifier compliant with RFC specifications'}
              </span>
            </div>

            {/* Version */}
            <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="w-48 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {isFr ? 'Version' : 'Version'}
              </span>
              <div className="flex-1 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {inspectedData.versionLabel}
              </div>
            </div>

            {/* Variante */}
            <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="w-48 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {isFr ? 'Variante' : 'Variant'}
              </span>
              <div className="flex-1 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200">
                {inspectedData.variant}
              </div>
            </div>

            {/* Horodatage extrait (si v7) */}
            {inspectedData.timestamp && (
              <>
                <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="w-48 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {isFr ? 'Horodatage UTC' : 'UTC Timestamp'}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200">
                    {inspectedData.timestamp.toISOString()}
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="w-48 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {isFr ? 'Horodatage Local' : 'Local Timestamp'}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200">
                    {inspectedData.timestamp.toLocaleString(isFr ? 'fr-FR' : 'en-US')}
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="w-48 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Unix Epoch ms
                  </span>
                  <div className="flex-1 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200">
                    {inspectedData.timestamp.getTime()} ms
                  </div>
                </div>
              </>
            )}

            {/* Représentation canonique */}
            <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="w-48 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {isFr ? 'Canonique (8-4-4-4-12)' : 'Canonical (8-4-4-4-12)'}
              </span>
              <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
                <span className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 select-all truncate">
                  {inspectedData.formatted}
                </span>
                <CopyButton
                  text={inspectedData.formatted}
                  label={isFr ? 'Copier' : 'Copy'}
                  copiedLabel={copiedLabel}
                  size="sm"
                />
              </div>
            </div>

            {/* Hexadécimal brut */}
            <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="w-48 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {isFr ? 'Brut (32 hex)' : 'Raw (32 hex)'}
              </span>
              <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
                <span className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 select-all truncate">
                  {inspectedData.cleanHex}
                </span>
                <CopyButton
                  text={inspectedData.cleanHex}
                  label={isFr ? 'Copier' : 'Copy'}
                  copiedLabel={copiedLabel}
                  size="sm"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-500/5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {isFr
                ? 'Format invalide : 32 caractères hexadécimaux requis.'
                : 'Invalid format: 32 hexadecimal characters required.'}
            </span>
          </div>
        )
      ) : (
        <div className="py-12 text-center text-xs text-zinc-400 font-mono">
          {isFr
            ? 'Saisissez ou collez un identifiant UUID pour inspecter sa structure.'
            : 'Enter or paste a UUID to inspect its structure.'}
        </div>
      )}
    </div>
  );
};
