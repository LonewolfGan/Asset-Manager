import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { DecodedJwt } from '@/lib/jwt-logic';
import { JwtTokenStats } from '@/lib/jwt-export-logic';

interface JwtInputPaneProps {
  isFr: boolean;
  tokenInput: string;
  hasToken: boolean;
  decoded: DecodedJwt;
  stats: JwtTokenStats;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onUpdateToken: (val: string) => void;
  onFileUpload: (file: File) => void;
}

export const JwtInputPane: React.FC<JwtInputPaneProps> = ({
  isFr,
  tokenInput,
  hasToken,
  decoded,
  stats,
  isDragging,
  setIsDragging,
  onUpdateToken,
  onFileUpload,
}) => {
  return (
    <div
      className={`flex flex-col relative min-h-[580px] transition-colors ${
        isDragging ? 'ring-2 ring-inset ring-zinc-500/40 bg-zinc-500/5' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileUpload(file);
      }}
    >
      {/* Barre d'en-tête volet gauche */}
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
          {isFr ? 'Jeton Encodé' : 'Encoded Token'}
        </span>

        <div className="flex items-center gap-3">
          {hasToken && (
            <span className="text-[11px] font-mono text-zinc-400">
              {stats.chars} {isFr ? 'car.' : 'chars'} · {stats.bytes}{' '}
              {isFr ? 'octets' : 'bytes'}
            </span>
          )}

          <label className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-[#FF6B35]/50 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] text-zinc-600 dark:text-zinc-400 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>{isFr ? 'Importer .jwt' : 'Import .jwt'}</span>
            <input
              type="file"
              accept=".jwt,.txt"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && onFileUpload(e.target.files[0])
              }
            />
          </label>
        </div>
      </div>

      {/* Saisie brute monospace avec autofocus direct */}
      <textarea
        value={tokenInput}
        onChange={(e) => onUpdateToken(e.target.value)}
        placeholder={
          isFr
            ? 'Collez ou déposez votre jeton JWT ici (ex: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)...'
            : 'Paste or drop your JWT token here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)...'
        }
        spellCheck={false}
        autoFocus
        className="w-full flex-1 p-4 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none"
      />

      {/* Message d'erreur de structure ancré sans carte flottante */}
      {!decoded.valid && hasToken && (
        <div className="px-4 py-2.5 border-t border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 text-xs text-rose-600 dark:text-rose-400 font-mono flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{decoded.error}</span>
        </div>
      )}
    </div>
  );
};
