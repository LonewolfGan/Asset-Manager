import React from 'react';
import { FileText, Upload, FileCode, X, AlertCircle } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/base64-logic';
import type { Mode } from '@/hooks/use-base64-workflow';

export interface Base64SourcePaneProps {
  mode: Mode;
  input: string;
  inputBytes: number;
  wordWrap: boolean;
  onInputChange: (val: string) => void;
  fileInfo: { name: string; type: string; size: number } | null;
  onRemoveFile: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (file: File) => void;
  error: string;
  isFr: boolean;
}

export function Base64SourcePane({
  mode,
  input,
  inputBytes,
  wordWrap,
  onInputChange,
  fileInfo,
  onRemoveFile,
  fileInputRef,
  onFileUpload,
  error,
  isFr,
}: Base64SourcePaneProps) {
  return (
    <div className="flex flex-col">
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {mode === 'encode' ? (isFr ? 'Texte source' : 'Source text') : (isFr ? 'Chaîne Base64' : 'Base64 string')}
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            ({input.length} {isFr ? 'car.' : 'chars'} · {formatBytes(inputBytes, isFr)})
          </span>
        </div>

        {/* Import de fichier binaire */}
        <div className="flex items-center gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) onFileUpload(e.target.files[0]);
            }}
          />
          <ActionTooltip label={isFr ? "Importer une image, un PDF ou n'importe quel fichier" : "Import an image, PDF or any file"}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>{isFr ? 'Importer fichier' : 'Import file'}</span>
            </button>
          </ActionTooltip>
        </div>
      </div>

      {/* Si un fichier est actif, afficher son bandeau */}
      {fileInfo && (
        <div className="px-4 py-2.5 bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <FileCode className="w-4 h-4 text-[#FF6B35]" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{fileInfo.name}</span>
            <span className="text-zinc-400 text-[11px]">
              ({fileInfo.type} · {formatBytes(fileInfo.size, isFr)})
            </span>
          </div>
          <ActionTooltip label={isFr ? "Retirer le fichier" : "Remove file"}>
            <button
              type="button"
              onClick={onRemoveFile}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        </div>
      )}

      {/* Textarea source */}
      <div className="relative flex-1">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={
            mode === 'encode'
              ? (isFr ? 'Tapez ou collez votre texte ici, ou déposez un fichier...' : 'Type or paste your text here, or drop a file...')
              : (isFr ? 'Collez la chaîne Base64 ou le Data URI à décoder...' : 'Paste Base64 string or Data URI to decode...')
          }
          spellCheck={false}
          wrap={wordWrap ? 'soft' : 'off'}
          className={`w-full min-h-[380px] sm:min-h-[440px] p-4 bg-transparent resize-none outline-none text-zinc-900 dark:text-zinc-100 font-mono text-xs leading-relaxed overflow-auto ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
        />
      </div>

      {/* Erreur de validation inline si détection incorrecte */}
      {error && (
        <div className="p-3 border-t border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{isFr ? 'Erreur de décodage :' : 'Decode error:'} {error}</span>
        </div>
      )}
    </div>
  );
}
