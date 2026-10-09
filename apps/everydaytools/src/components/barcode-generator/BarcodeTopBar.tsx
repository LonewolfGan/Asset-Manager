import React from 'react';
import {
  RotateCcw,
  Printer,
  Download,
  ChevronDown,
} from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { trackToolUsed } from '@/lib/analytics';
import { toast } from 'sonner';
import type { BarcodeSymbology, BarcodeValidationResult } from '@/lib/barcode-logic';

interface BarcodeTopBarProps {
  symbologies: BarcodeSymbology[];
  symbologyId: string;
  onSelectSymbology: (symbology: BarcodeSymbology) => void;
  historyLength: number;
  onUndo: () => void;
  validation: BarcodeValidationResult;
  onPrint: () => void;
  onCopyPng: () => Promise<void>;
  getSvgString: () => string;
  showDownloadMenu: boolean;
  onDownloadMenuChange: (show: boolean) => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  isFr: boolean;
}

export function BarcodeTopBar({
  symbologies,
  symbologyId,
  onSelectSymbology,
  historyLength,
  onUndo,
  validation,
  onPrint,
  onCopyPng,
  getSvgString,
  showDownloadMenu,
  onDownloadMenuChange,
  onDownloadPng,
  onDownloadSvg,
  isFr,
}: BarcodeTopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-white/10">
      {/* Sélecteur de Symbologies GS1 / Logistique */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pr-1">
          {isFr ? 'Symbologie :' : 'Symbology:'}
        </span>

        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/70 dark:bg-zinc-800/40">
          {symbologies.map((symb) => (
            <button
              key={symb.id}
              type="button"
              onClick={() => onSelectSymbology(symb)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium cursor-pointer ${
                symbologyId === symb.id
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {symb.name}
            </button>
          ))}
        </div>
      </div>

      {/* Actions : Annuler, Imprimer, Copier, Télécharger */}
      <div className="flex items-center gap-2 ml-auto">
        {historyLength > 0 && (
          <ActionTooltip label={isFr ? 'Annuler (Ctrl+Z)' : 'Undo (Ctrl+Z)'}>
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {validation.isValid && (
          <>
            <ActionTooltip label={isFr ? "Imprimer l'étiquette (1 page)" : 'Print label (1 page)'}>
              <button
                type="button"
                onClick={onPrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-zinc-500" />
                <span>{isFr ? 'Imprimer' : 'Print'}</span>
              </button>
            </ActionTooltip>

            <CopyButton
              copyFn={onCopyPng}
              label={isFr ? 'Copier PNG' : 'Copy PNG'}
              copiedLabel={isFr ? 'PNG copié !' : 'PNG copied!'}
              variant="default"
              size="sm"
              disabled={!validation.isValid}
              toastMessage={isFr ? 'Image PNG copiée dans le presse-papier' : 'PNG image copied to clipboard'}
              className="text-zinc-800 dark:text-zinc-200"
            />

            <CopyButton
              text={getSvgString}
              label={isFr ? 'Copier SVG' : 'Copy SVG'}
              copiedLabel={isFr ? 'SVG copié !' : 'SVG copied!'}
              variant="default"
              size="sm"
              disabled={!validation.isValid}
              onCopy={() => {
                trackToolUsed('barcode-generator', 'copy-svg');
                toast.success(
                  isFr
                    ? 'Code vectoriel SVG copié dans le presse-papier'
                    : 'Vector SVG code copied to clipboard'
                );
              }}
              className="text-zinc-800 dark:text-zinc-200"
            />

            <Popover open={showDownloadMenu} onOpenChange={onDownloadMenuChange}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Télécharger' : 'Download'}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      showDownloadMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-56 p-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xl space-y-0.5"
              >
                <button
                  type="button"
                  onClick={() => {
                    onDownloadMenuChange(false);
                    onDownloadPng();
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between cursor-pointer whitespace-nowrap"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{isFr ? 'Image PNG' : 'PNG Image'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    .png
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDownloadMenuChange(false);
                    onDownloadSvg();
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between cursor-pointer whitespace-nowrap"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{isFr ? 'Fichier SVG' : 'SVG File'}</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    .svg
                  </span>
                </button>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
