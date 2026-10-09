import React from 'react';
import { Binary, Eye, Image as ImageIcon } from 'lucide-react';
import { WrapButton } from '@/components/ui/wrap-button';
import { formatBytes, type DetectedBase64Binary } from '@/lib/base64-logic';
import type { Mode } from '@/hooks/use-base64-workflow';

export interface Base64ResultPaneProps {
  mode: Mode;
  output: string;
  outputBytes: number;
  wordWrap: boolean;
  onWordWrapToggle: (val: boolean) => void;
  outputTab: 'text' | 'preview';
  onOutputTabChange: (tab: 'text' | 'preview') => void;
  detectedBinary: DetectedBase64Binary | null;
  isFr: boolean;
}

export function Base64ResultPane({
  mode,
  output,
  outputBytes,
  wordWrap,
  onWordWrapToggle,
  outputTab,
  onOutputTabChange,
  detectedBinary,
  isFr,
}: Base64ResultPaneProps) {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Binary className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {mode === 'encode' ? (isFr ? 'Résultat Base64' : 'Base64 result') : (isFr ? 'Texte décodé' : 'Decoded text')}
          </span>
          {output && (
            <span className="text-[11px] font-mono text-zinc-400">
              ({output.length} {isFr ? 'car.' : 'chars'} · {formatBytes(outputBytes, isFr)}
              {mode === 'encode' ? ' · +33%' : ''})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Onglets Aperçu Image si un format graphique est détecté */}
          {detectedBinary?.isImage && (
            <div className="flex items-center p-0.5 rounded border border-zinc-200 dark:border-white/10 bg-zinc-100/60 dark:bg-zinc-800/40 text-xs mr-1">
              <button
                type="button"
                onClick={() => onOutputTabChange('text')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  outputTab === 'text'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => onOutputTabChange('preview')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  outputTab === 'preview'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{isFr ? 'Aperçu' : 'Preview'}</span>
              </button>
            </div>
          )}

          {/* Bouton Retour à la ligne */}
          <WrapButton
            wrapped={wordWrap}
            onToggle={onWordWrapToggle}
            label={<span className="hidden sm:inline">Wrap</span>}
            size="xs"
          />
        </div>
      </div>

      {/* Corps de Résultat : Textarea ou Plateau d'Aperçu Graphique */}
      <div className="relative flex-1 flex flex-col">
        {outputTab === 'preview' && detectedBinary?.dataUrl ? (
          <div className="flex-1 min-h-[380px] sm:min-h-[440px] p-6 flex flex-col items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/40 overflow-auto">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-xs flex flex-col items-center gap-3 max-w-full">
              <img
                src={detectedBinary.dataUrl}
                alt={isFr ? 'Aperçu Base64 décodé' : 'Decoded Base64 preview'}
                className="max-h-[300px] max-w-full object-contain rounded"
              />
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>{isFr ? 'Format détecté :' : 'Detected format:'} {detectedBinary.mimeType}</span>
              </div>
            </div>
          </div>
        ) : (
          <textarea
            readOnly
            value={output}
            placeholder={isFr ? 'Le résultat encodé ou décodé apparaîtra ici en temps réel...' : 'Encoded or decoded result will appear here in real time...'}
            spellCheck={false}
            wrap={wordWrap ? 'soft' : 'off'}
            className={`w-full min-h-[380px] sm:min-h-[440px] p-4 bg-transparent resize-none outline-none text-zinc-900 dark:text-zinc-100 font-mono text-xs leading-relaxed overflow-auto select-all ${
              wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
            }`}
          />
        )}
      </div>
    </div>
  );
}
