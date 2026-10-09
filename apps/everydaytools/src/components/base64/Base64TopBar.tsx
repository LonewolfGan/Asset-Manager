import React, { useState } from 'react';
import { ArrowRightLeft, Settings2, ChevronDown, Undo2, Trash2, Download } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ActionTooltip } from '@/components/ui/tooltip';
import { CopyButton } from '@/components/ui/copy-button';
import type { Mode } from '@/hooks/use-base64-workflow';
import type { ChunkSize, DetectedBase64Binary } from '@/lib/base64-logic';

export interface Base64TopBarProps {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onSwap: () => void;
  urlSafe: boolean;
  onUrlSafeChange: (val: boolean) => void;
  stripPadding: boolean;
  onStripPaddingChange: (val: boolean) => void;
  dataUriPrefix: boolean;
  onDataUriPrefixChange: (val: boolean) => void;
  chunkSize: ChunkSize;
  onChunkSizeChange: (val: ChunkSize) => void;
  historyLength: number;
  onUndo: () => void;
  hasContent: boolean;
  onClear: () => void;
  output: string;
  onDownload: () => void;
  detectedBinary: DetectedBase64Binary | null;
  isFr: boolean;
}

export function Base64TopBar({
  mode,
  onModeChange,
  onSwap,
  urlSafe,
  onUrlSafeChange,
  stripPadding,
  onStripPaddingChange,
  dataUriPrefix,
  onDataUriPrefixChange,
  chunkSize,
  onChunkSizeChange,
  historyLength,
  onUndo,
  hasContent,
  onClear,
  output,
  onDownload,
  detectedBinary,
  isFr,
}: Base64TopBarProps) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-white/10">
      {/* Groupe 1 : Sélecteur de Mode (Encoder / Décoder) + Bouton Inverser */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/40">
          <button
            type="button"
            onClick={() => onModeChange('encode')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer ${
              mode === 'encode'
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {isFr ? 'Encoder (Texte → Base64)' : 'Encode (Text → Base64)'}
          </button>
          <button
            type="button"
            onClick={() => onModeChange('decode')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer ${
              mode === 'decode'
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {isFr ? 'Décoder (Base64 → Texte)' : 'Decode (Base64 → Text)'}
          </button>
        </div>

        {/* Bouton Inverser (Swap) */}
        <ActionTooltip label={isFr ? "Permuter l’entrée et la sortie (Inverser le sens)" : "Swap input and output (Reverse direction)"}>
          <button
            type="button"
            onClick={onSwap}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">{isFr ? 'Inverser' : 'Swap'}</span>
          </button>
        </ActionTooltip>

        {/* Menu Options d'encodage via shadcn Popover */}
        <Popover open={showOptionsMenu} onOpenChange={setShowOptionsMenu}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                urlSafe || stripPadding || dataUriPrefix || chunkSize > 0
                  ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Options' : 'Options'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showOptionsMenu ? 'rotate-180' : ''}`} />
            </button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-72 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xl space-y-1">
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              {isFr ? 'Paramètres RFC 4648' : 'RFC 4648 Settings'}
            </div>

            <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => onUrlSafeChange(e.target.checked)}
                className="mt-0.5 accent-[#FF6B35]"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  URL-Safe (RFC 4648 §5)
                </span>
                <span className="text-[11px] text-zinc-500">
                  {isFr ? 'Remplace + par - et / par _ (idéal pour JWT & URLs)' : 'Replaces + with - and / with _ (ideal for JWT & URLs)'}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={stripPadding}
                onChange={(e) => onStripPaddingChange(e.target.checked)}
                className="mt-0.5 accent-[#FF6B35]"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {isFr ? 'Supprimer le remplissage (=)' : 'Strip padding (=)'}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {isFr ? 'Élimine les caractères de padding en fin de chaîne' : 'Removes trailing padding characters'}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={dataUriPrefix}
                onChange={(e) => onDataUriPrefixChange(e.target.checked)}
                className="mt-0.5 accent-[#FF6B35]"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {isFr ? 'Préfixe Data URI' : 'Data URI prefix'}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {isFr ? 'Ajoute data:text/plain;charset=utf-8;base64,' : 'Adds data:text/plain;charset=utf-8;base64,'}
                </span>
              </div>
            </label>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                {isFr ? 'Découpage par ligne' : 'Line chunking'}
              </span>
              <div className="grid grid-cols-3 gap-1 px-1">
                {[
                  { size: 0, label: isFr ? 'Continu' : 'Continuous' },
                  { size: 64, label: '64 (PEM)' },
                  { size: 76, label: '76 (MIME)' },
                ].map(({ size, label }) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onChunkSizeChange(size as ChunkSize)}
                    className={`py-1 text-xs rounded-md border font-medium transition-colors cursor-pointer ${
                      chunkSize === size
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold'
                        : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Groupe 2 : Actions (Annuler, Vider, Copier, Télécharger) */}
      <div className="flex items-center gap-2 ml-auto">
        {historyLength > 0 && (
          <ActionTooltip label={isFr ? "Annuler (Ctrl+Z)" : "Undo (Ctrl+Z)"}>
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasContent && (
          <ActionTooltip label={isFr ? "Effacer le contenu" : "Clear content"}>
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        {output && (
          <>
            <CopyButton
              text={output}
              label={isFr ? "Copier" : "Copy"}
              copiedLabel={isFr ? "Copié !" : "Copied!"}
              size="sm"
              toastMessage={isFr ? "Résultat Base64 copié" : "Base64 result copied"}
            />

            <ActionTooltip label={isFr ? "Télécharger le résultat" : "Download output"}>
              <button
                type="button"
                onClick={onDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {mode === 'decode' && detectedBinary?.dataUrl
                    ? (isFr ? `Télécharger (${detectedBinary.extension.toUpperCase()})` : `Download (${detectedBinary.extension.toUpperCase()})`)
                    : (isFr ? 'Télécharger (.txt)' : 'Download (.txt)')}
                </span>
              </button>
            </ActionTooltip>
          </>
        )}
      </div>
    </div>
  );
}
