import React from 'react';
import { FileText, Binary, KeyRound } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';
import { formatBytes } from '@/lib/hash-generator-export';
import type { InputMode, FileData } from '@/hooks/use-hash-generator-workflow';

interface HashGeneratorHeaderProps {
  inputMode: InputMode;
  inputText: string;
  textByteLength: number;
  fileInfo: FileData | null;
  enableHmac: boolean;
  hmacSecret: string;
  onSelectMode: (mode: InputMode) => void;
  onToggleHmac: () => void;
  onHmacSecretChange: (val: string) => void;
}

export function HashGeneratorHeader({
  inputMode,
  inputText,
  textByteLength,
  fileInfo,
  enableHmac,
  hmacSecret,
  onSelectMode,
  onToggleHmac,
  onHmacSecretChange,
}: HashGeneratorHeaderProps) {
  const { isFr } = useLocale();

  return (
    <div className="h-12 px-4 sm:px-6 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40 flex items-center justify-between gap-4">
      {/* Sélecteur de mode Texte / Fichier */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800/80">
        <button
          type="button"
          onClick={() => onSelectMode('text')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            inputMode === 'text'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isFr ? 'Texte UTF-8' : 'UTF-8 Text'}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('file')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            inputMode === 'file'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          <span>{isFr ? 'Fichier Binaire' : 'Binary File'}</span>
        </button>
      </div>

      {/* Métadonnées & Contrôles Source contextuels */}
      <div className="flex items-center gap-3">
        {inputMode === 'text' ? (
          <>
            {/* Compteur temps-réel */}
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
              {inputText.length} {isFr ? 'car.' : 'chars'} ·{' '}
              {formatBytes(textByteLength, isFr)}
            </span>

            {/* Contrôle HMAC */}
            <div className="flex items-center gap-1.5">
              <ActionTooltip
                label={
                  isFr
                    ? 'Activer la signature avec clé secrète HMAC'
                    : 'Enable HMAC secret key signature'
                }
                side="bottom"
              >
                <button
                  type="button"
                  onClick={onToggleHmac}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    enableHmac
                      ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold'
                      : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <KeyRound className="w-3 h-3" />
                  <span>HMAC</span>
                </button>
              </ActionTooltip>

              {enableHmac && (
                <input
                  type="text"
                  value={hmacSecret}
                  onChange={(e) => onHmacSecretChange(e.target.value)}
                  placeholder={
                    isFr ? 'Clé secrète (secret)...' : 'Secret key...'
                  }
                  spellCheck={false}
                  className="w-36 sm:w-48 h-7 px-2.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 placeholder:text-zinc-400 transition-colors"
                />
              )}
            </div>
          </>
        ) : (
          fileInfo && (
            <span className="text-[11px] font-mono text-zinc-400">
              {fileInfo.name} · {formatBytes(fileInfo.size, isFr)}
            </span>
          )
        )}
      </div>
    </div>
  );
}
