import React from 'react';
import { toast } from 'sonner';
import { WrapButton } from '@/components/ui/wrap-button';
import type { JsonErrorInfo } from '@/lib/json-repair-logic';

export interface JsonSourcePanelProps {
  rawInput: string;
  onRawInputChange: (val: string) => void;
  wordWrap: boolean;
  onToggleWordWrap: (next: boolean) => void;
  rawBytes: number;
  errorInfo: JsonErrorInfo | null | undefined;
  isFr: boolean;
}

export function JsonSourcePanel({
  rawInput,
  onRawInputChange,
  wordWrap,
  onToggleWordWrap,
  rawBytes,
  errorInfo,
  isFr,
}: JsonSourcePanelProps) {
  const lineCount = rawInput ? rawInput.split('\n').length : 0;
  const lineList = rawInput ? rawInput.split('\n') : ['1'];

  return (
    <div className="flex flex-col min-h-[480px]">
      {/* En-tête sobre du volet gauche */}
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {isFr ? 'Entrée' : 'Input'}
          </span>
          {rawInput && (
            <span className="text-[11px] font-mono text-zinc-400">
              ({lineCount} {isFr ? 'lignes' : 'lines'} · {rawBytes} {isFr ? 'octets' : 'bytes'})
            </span>
          )}
        </div>
        <div className="flex items-center">
          <WrapButton
            wrapped={wordWrap}
            onToggle={(next) => {
              onToggleWordWrap(next);
              toast.info(
                next
                  ? isFr
                    ? 'Retour à la ligne activé'
                    : 'Line wrap enabled'
                  : isFr
                    ? 'Retour à la ligne désactivé'
                    : 'Line wrap disabled'
              );
            }}
            label={isFr ? 'Retour à la ligne' : 'Line wrap'}
            size="sm"
          />
        </div>
      </div>

      {/* Zone d'édition avec gouttière */}
      <div className="relative flex flex-1 font-mono text-xs overflow-hidden">
        <div className="w-11 select-none py-3 pr-2.5 pl-1.5 bg-zinc-50/50 dark:bg-zinc-900/30 text-right text-zinc-400 dark:text-zinc-600 border-r border-zinc-200/60 dark:border-white/5 text-[11px] leading-relaxed">
          {lineList.map((_, i) => (
            <div
              key={i}
              className={
                errorInfo?.line === i + 1
                  ? 'text-rose-500 font-bold bg-rose-500/10'
                  : ''
              }
            >
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          value={rawInput}
          onChange={(e) => onRawInputChange(e.target.value)}
          placeholder={
            isFr
              ? 'Collez votre JSON ici ou glissez-déposez un fichier .json...'
              : 'Paste your JSON here or drag and drop a .json file...'
          }
          spellCheck={false}
          className={`flex-1 p-3 bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed ${
            wordWrap
              ? 'whitespace-pre-wrap break-words'
              : 'whitespace-pre overflow-x-auto'
          }`}
        />
      </div>
    </div>
  );
}
