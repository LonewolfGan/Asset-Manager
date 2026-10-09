import React from 'react';
import { NumberStepper } from '@/components/ui/number-stepper';
import { PositionPlacementGrid } from '@workspace/ui/controls';
import type {
  PdfNumberPosition,
  PositionOption,
  FormatOption,
} from '@/lib/pdf-page-numbers-logic';

export interface PdfPageNumbersControlsProps {
  position: PdfNumberPosition;
  setPosition: (pos: PdfNumberPosition) => void;
  format: string;
  setFormat: (format: string) => void;
  startNum: number;
  setStartNum: (num: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  skipFirst: boolean;
  onToggleSkipFirst: () => void;
  positionOptions: PositionOption[];
  formatOptions: FormatOption[];
  isFr: boolean;
  tc: Record<string, any>;
}

export const PdfPageNumbersControls: React.FC<PdfPageNumbersControlsProps> = ({
  position,
  setPosition,
  format,
  setFormat,
  startNum,
  setStartNum,
  fontSize,
  setFontSize,
  skipFirst,
  onToggleSkipFirst,
  positionOptions,
  formatOptions,
  isFr,
  tc,
}) => {
  return (
    <div className="space-y-8">
      {/* SECTION 1 : EMPLACEMENT GÉOMÉTRIQUE */}
      <PositionPlacementGrid
        position={position as any}
        onSelectPosition={(pos) => setPosition(pos as PdfNumberPosition)}
        label={isFr ? 'Emplacement sur le feuillet' : 'Placement on page'}
        isFr={isFr}
      />


      {/* SECTION 2 : FORMAT D'AFFICHAGE */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold">
            {isFr ? 'Format de numérotation' : 'Numbering format'}
          </span>
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            {isFr ? 'Format dynamique' : 'Dynamic format'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {formatOptions.map((opt) => {
            const isSelected = format === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormat(opt.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono transition-all text-center cursor-pointer select-none active:scale-[0.97] ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 ring-1 ring-zinc-700 shadow-sm font-semibold'
                    : 'bg-black/[0.015] dark:bg-white/[0.02] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] ring-1 ring-black/[0.06] dark:ring-white/10 font-normal'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3 : PARAMÈTRES TYPOGRAPHIQUES & DÉPART */}
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Numéro initial */}
          <div className="space-y-2">
            <label
              htmlFor="pdf-start-number"
              className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold block"
            >
              {isFr ? 'Premier numéro' : 'First number'}
            </label>
            <NumberStepper
              id="pdf-start-number"
              value={startNum}
              onChange={setStartNum}
              min={1}
            />
          </div>

          {/* Taille de police */}
          <div className="space-y-2">
            <label
              htmlFor="pdf-font-size"
              className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold block"
            >
              {isFr ? 'Corps typographique' : 'Font size'}
            </label>
            <NumberStepper
              id="pdf-font-size"
              value={fontSize}
              onChange={setFontSize}
              min={8}
              max={24}
              suffix="pt"
            />
          </div>
        </div>

        {/* Switch : Ignorer la première page (Couverture) */}
        <div
          onClick={onToggleSkipFirst}
          className="flex items-center justify-between py-3.5 px-3.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer group select-none ring-1 ring-black/[0.06] dark:ring-white/10"
        >
          <div className="min-w-0 pr-4">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {tc.skipFirstCover ?? (isFr ? 'Ignorer la première page' : 'Skip first page')}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {tc.skipFirstCoverDesc ??
                (isFr
                  ? 'Préserve la page de couverture sans apposer de numéro'
                  : 'Preserves the cover page without stamping a page number')}
            </p>
          </div>
          <div
            className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
              skipFirst ? 'bg-[#FF6B35]' : 'bg-black/10 dark:bg-white/15'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                skipFirst ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
