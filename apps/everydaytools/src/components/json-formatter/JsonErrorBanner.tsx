import React from 'react';
import { AlertCircle, Wand2 } from 'lucide-react';
import type { JsonErrorInfo } from '@/lib/json-repair-logic';

export interface JsonErrorBannerProps {
  error: JsonErrorInfo;
  onAutoRepair: () => void;
  isFr: boolean;
}

export function JsonErrorBanner({ error, onAutoRepair, isFr }: JsonErrorBannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          {isFr ? 'Erreur de syntaxe JSON' : 'JSON syntax error'}
          {error.line && ` ${isFr ? 'à la ligne' : 'at line'} ${error.line}`}
          {error.column && `, ${isFr ? 'colonne' : 'column'} ${error.column}`} :
          <span className="font-mono ml-1 text-[11px] opacity-90">{error.message}</span>
        </span>
      </div>
      <button
        onClick={onAutoRepair}
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors shrink-0 active:scale-[0.98] cursor-pointer"
      >
        <Wand2 className="w-3 h-3" />
        <span>{isFr ? 'Corriger automatiquement' : 'Auto repair'}</span>
      </button>
    </div>
  );
}
