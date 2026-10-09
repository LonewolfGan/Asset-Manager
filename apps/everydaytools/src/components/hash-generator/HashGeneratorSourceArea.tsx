import React from 'react';
import { Upload, RefreshCw, X, FileCode } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';
import { formatBytes } from '@/lib/hash-generator-export';
import type { InputMode, FileData } from '@/hooks/use-hash-generator-workflow';

interface HashGeneratorSourceAreaProps {
  inputMode: InputMode;
  inputText: string;
  fileInfo: FileData | null;
  isDragOver: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTextChange: (val: string) => void;
  onProcessFile: (file: File) => void;
  onClearFile: () => void;
  setIsDragOver: (drag: boolean) => void;
}

export function HashGeneratorSourceArea({
  inputMode,
  inputText,
  fileInfo,
  isDragOver,
  textareaRef,
  fileInputRef,
  onTextChange,
  onProcessFile,
  onClearFile,
  setIsDragOver,
}: HashGeneratorSourceAreaProps) {
  const { isFr } = useLocale();

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-zinc-950">
      {inputMode === 'text' ? (
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={
            isFr
              ? 'Tapez ou collez une chaîne de caractères pour calculer instantanément ses empreintes cryptographiques...'
              : 'Type or paste characters to instantly compute cryptographic hashes...'
          }
          spellCheck={false}
          className="w-full min-h-[140px] sm:min-h-[160px] p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/80 dark:border-white/10 resize-y outline-none font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
        />
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) onProcessFile(file);
          }}
          className={`min-h-[160px] rounded-xl border-2 transition-colors flex flex-col items-center justify-center p-6 ${
            isDragOver
              ? 'border-[#FF6B35] bg-[#FF6B35]/5'
              : 'border-dashed border-zinc-200 dark:border-white/10 bg-zinc-50/40 dark:bg-zinc-900/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) onProcessFile(e.target.files[0]);
            }}
          />

          {fileInfo ? (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {fileInfo.name}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {fileInfo.type} · {formatBytes(fileInfo.size, isFr)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isFr ? 'Remplacer' : 'Replace'}</span>
                </button>
                <ActionTooltip
                  label={isFr ? 'Retirer le fichier' : 'Remove file'}
                  side="top"
                >
                  <button
                    type="button"
                    onClick={onClearFile}
                    className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </ActionTooltip>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mb-1">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {isFr
                  ? 'Glissez-déposez un fichier ici ou cliquez pour parcourir'
                  : 'Drag and drop a file here or click to browse'}
              </span>
              <span className="text-[11px] text-zinc-400">
                {isFr
                  ? 'Calcul 100% local via SubtleCrypto dans le navigateur · Confidentialité garantie'
                  : '100% client-side via SubtleCrypto in browser · Zero server upload'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
