import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { CopyButton } from '@/components/ui/copy-button';
import { WrapButton } from '@/components/ui/wrap-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  Download,
  Trash2,
  Undo2,
  ChevronDown,
  FileText,
  FileJson,
  ArrowRightLeft,
} from 'lucide-react';
import { UrlEncodeMode, UrlDetails } from '@/lib/url-logic';
import { UrlMode } from '@/hooks/use-url-encoder-workflow';
import { buildUrlComponentsJsonPayload } from '@/lib/url-export-logic';
import { toast } from 'sonner';

interface UrlCommandBarProps {
  isFr: boolean;
  mode: UrlMode;
  setMode: (mode: UrlMode) => void;
  encodeMode: UrlEncodeMode;
  setEncodeMode: (mode: UrlEncodeMode) => void;
  wordWrap: boolean;
  setWordWrap: (wrap: boolean) => void;
  historyLength: number;
  onUndo: () => void;
  hasOutput: boolean;
  output: string;
  hasInput: boolean;
  onClear: () => void;
  hasParams: boolean;
  urlInspection: UrlDetails;
  onDownload: (content: string, filename: string, mimeType: string) => void;
  copiedLabel: string;
  onSwap?: () => void;
}

export const UrlCommandBar: React.FC<UrlCommandBarProps> = ({
  isFr,
  mode,
  setMode,
  encodeMode,
  setEncodeMode,
  wordWrap,
  setWordWrap,
  historyLength,
  onUndo,
  hasOutput,
  output,
  hasInput,
  onClear,
  hasParams,
  urlInspection,
  onDownload,
  copiedLabel,
  onSwap,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-white/10">
      {/* Gauche : Bascule d'onglets Encoder / Décoder & Options d'encodage */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Bascule Principale : Encoder / Décoder */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              mode === 'encode'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span>{isFr ? 'Encoder' : 'Encode'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              mode === 'decode'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span>{isFr ? 'Décoder' : 'Decode'}</span>
          </button>
        </div>

        {/* Bouton Inverser (Swap) */}
        {onSwap && (
          <ActionTooltip
            label={
              isFr
                ? 'Permuter l’entrée et la sortie (Inverser le sens)'
                : 'Swap input and output (Reverse direction)'
            }
          >
            <button
              type="button"
              onClick={onSwap}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-[0.98] cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">{isFr ? 'Inverser' : 'Swap'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Sélecteur de type d'encodage (quand le mode est 'encode') */}
        {mode === 'encode' && (
          <div className="flex items-center gap-1 px-1 border-l border-zinc-200 dark:border-zinc-800 ml-0.5">
            {(
              [
                { id: 'component', label: isFr ? 'Composant' : 'Component' },
                { id: 'full', label: isFr ? 'URL Entière' : 'Full URL' },
                { id: 'form', label: isFr ? 'Formulaire (+)' : 'Form (+)' },
              ] as Array<{ id: UrlEncodeMode; label: string }>
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEncodeMode(opt.id)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  encodeMode === opt.id
                    ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Toggle Retour à la ligne avec libellé explicite "Wrap" */}
        <WrapButton
          wrapped={wordWrap}
          onToggle={(next) => {
            setWordWrap(next);
            toast.info(
              next
                ? isFr
                  ? 'Retour à la ligne activé'
                  : 'Word wrap enabled'
                : isFr
                ? 'Retour à la ligne désactivé'
                : 'Word wrap disabled'
            );
          }}
          label="Wrap"
          size="sm"
        />
      </div>

      {/* Droite : Ordre Strict Règle 25 (... -> Annuler -> Copier -> Vider -> Exporter) */}
      <div className="flex items-center gap-1.5 ml-auto flex-wrap">
        {historyLength > 0 && (
          <ActionTooltip
            label={isFr ? 'Annuler (Ctrl+Z)' : 'Undo (Ctrl+Z)'}
            side="bottom"
          >
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasOutput && (
          <CopyButton
            text={output}
            label={isFr ? 'Copier Résultat' : 'Copy Result'}
            copiedLabel={copiedLabel}
            size="sm"
          />
        )}

        {hasInput && (
          <ActionTooltip
            label={isFr ? 'Vider les champs' : 'Clear fields'}
            side="bottom"
          >
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Menu Exporter (Permanent à droite, Règle 25 - Bouton Orange Signature) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={!hasOutput}>
            <button
              type="button"
              disabled={!hasOutput}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-colors active:scale-[0.98] shadow-xs cursor-pointer outline-none disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? 'Exporter' : 'Export'}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          >
            <DropdownMenuItem
              onClick={() => onDownload(output, 'url-converted.txt', 'text/plain')}
              className="text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-zinc-400" />
              <span>{isFr ? 'Résultat texte (.txt)' : 'Text result (.txt)'}</span>
            </DropdownMenuItem>

            {hasParams && (
              <DropdownMenuItem
                onClick={() =>
                  onDownload(
                    buildUrlComponentsJsonPayload(urlInspection),
                    'url-components.json',
                    'application/json'
                  )
                }
                className="text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <FileJson className="w-4 h-4 mr-2 text-zinc-400" />
                <span>
                  {isFr ? 'Paramètres JSON (.json)' : 'JSON parameters (.json)'}
                </span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
