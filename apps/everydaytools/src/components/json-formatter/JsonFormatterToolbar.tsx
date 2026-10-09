import React from 'react';
import { Upload, RotateCcw, Trash2, Download } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { CopyButton } from '@/components/ui/copy-button';
import { trackToolUsed } from '@/lib/analytics';
import type { ViewTab, IndentSize } from '@/lib/json-repair-logic';
import { JsonViewModeSelector } from './JsonViewModeSelector';
import { JsonTransformActions } from './JsonTransformActions';

export interface JsonFormatterToolbarProps {
  viewTab: ViewTab;
  onViewTabChange: (tab: ViewTab) => void;
  yamlMode: boolean;
  onToggleYamlMode: () => void;
  isParseOk: boolean;
  hasData: boolean;
  isArrayRoot: boolean;
  arrayLength: number;
  isMinified: boolean;
  indentSize: IndentSize;
  onFormat: (indent?: IndentSize) => void;
  onMinify: () => void;
  onSortKeys: () => void;
  onEscapeToggle: () => void;
  onFileUpload: (file: File) => void;
  canUndo: boolean;
  onUndo: () => void;
  canClear: boolean;
  onClear: () => void;
  outputCode: string;
  onDownload: () => void;
  isFr: boolean;
}

export function JsonFormatterToolbar({
  viewTab,
  onViewTabChange,
  yamlMode,
  onToggleYamlMode,
  isParseOk,
  hasData,
  isArrayRoot,
  arrayLength,
  isMinified,
  indentSize,
  onFormat,
  onMinify,
  onSortKeys,
  onEscapeToggle,
  onFileUpload,
  canUndo,
  onUndo,
  canClear,
  onClear,
  outputCode,
  onDownload,
  isFr,
}: JsonFormatterToolbarProps) {
  const isActionDisabled = !isParseOk || !hasData;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-white/10">
      <JsonViewModeSelector
        viewTab={viewTab}
        onViewTabChange={onViewTabChange}
        yamlMode={yamlMode}
        onToggleYamlMode={onToggleYamlMode}
        isActionDisabled={isActionDisabled}
        isArrayRoot={isArrayRoot}
        arrayLength={arrayLength}
        isFr={isFr}
      />

      <JsonTransformActions
        isMinified={isMinified}
        yamlMode={yamlMode}
        indentSize={indentSize}
        isActionDisabled={isActionDisabled}
        onFormat={onFormat}
        onMinify={onMinify}
        onSortKeys={onSortKeys}
        onEscapeToggle={onEscapeToggle}
        isFr={isFr}
      />

      {/* Groupe Droite : Fichiers, Historique & Export */}
      <div className="flex items-center gap-1.5 ml-auto">
        <ActionTooltip
          label={isFr ? 'Importer un fichier .json' : 'Import a .json file'}
          side="bottom"
        >
          <label className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{isFr ? 'Importer' : 'Import'}</span>
            <input
              type="file"
              accept=".json,.txt,application/json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </ActionTooltip>

        {canUndo && (
          <ActionTooltip
            label={isFr ? 'Annuler la dernière modification' : 'Undo last change'}
            side="bottom"
          >
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {canClear && (
          <ActionTooltip
            label={isFr ? "Effacer le contenu de l'atelier" : 'Clear workspace content'}
            side="bottom"
          >
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        <CopyButton
          text={outputCode}
          label={isFr ? 'Copier' : 'Copy'}
          copiedLabel={isFr ? 'Copié !' : 'Copied!'}
          variant="default"
          size="sm"
          disabled={!outputCode}
          onCopy={() => trackToolUsed('json-formatter', 'copy')}
        />

        <button
          onClick={onDownload}
          disabled={!outputCode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>
            {yamlMode
              ? isFr
                ? 'Télécharger .yaml'
                : 'Download .yaml'
              : isFr
                ? 'Télécharger .json'
                : 'Download .json'}
          </span>
        </button>
      </div>
    </div>
  );
}
