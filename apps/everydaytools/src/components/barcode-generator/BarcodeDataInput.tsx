import React from 'react';
import { Barcode, AlertCircle } from 'lucide-react';
import type { BarcodeSymbology, BarcodeValidationResult } from '@/lib/barcode-logic';

interface BarcodeDataInputProps {
  activeSymbology: BarcodeSymbology;
  value: string;
  onValueChange: (val: string) => void;
  validation: BarcodeValidationResult;
  onApplyAutoFix: (fixedVal: string) => void;
  isFr: boolean;
}

export function BarcodeDataInput({
  activeSymbology,
  value,
  onValueChange,
  validation,
  onApplyAutoFix,
  isFr,
}: BarcodeDataInputProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-3 shrink-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Barcode className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {isFr
              ? `Données à encoder (${activeSymbology.name})`
              : `Data to encode (${activeSymbology.name})`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {validation.isValid && validation.country && (
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {isFr ? 'Origine :' : 'Origin:'}{' '}
              <strong className="text-zinc-700 dark:text-zinc-300">{validation.country}</strong>
            </span>
          )}
          <span className="text-[11px] font-mono text-zinc-400">
            {value.length}{' '}
            {activeSymbology.expectedLength ? `/ ${activeSymbology.expectedLength}` : ''}{' '}
            {isFr ? 'car.' : 'chars'}
          </span>
        </div>
      </div>

      {/* Saisie Typographique */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={activeSymbology.placeholder}
          spellCheck={false}
          className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 font-mono text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-[#FF6B35] transition-colors tracking-wider"
        />

        {/* Bouton de correction immédiate si clé de contrôle erronée */}
        {validation.autoFix && (
          <button
            type="button"
            onClick={() => onApplyAutoFix(validation.autoFix!)}
            className="absolute right-2 px-2.5 py-1 rounded-lg bg-[#FF6B35] text-white text-xs font-semibold hover:bg-[#e85a26] transition-colors shadow-xs cursor-pointer"
          >
            {isFr
              ? `Corriger la clé (${validation.expectedKey})`
              : `Fix checksum (${validation.expectedKey})`}
          </button>
        )}
      </div>

      {/* Feedback d'erreur inline si invalide */}
      {!validation.isValid && !validation.autoFix && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  );
}
