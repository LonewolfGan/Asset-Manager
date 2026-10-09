import React from 'react';
import { Grid3X3, Maximize2 } from 'lucide-react';
import { NumberStepper } from '@/components/ui/number-stepper';
import { ColorPickerField } from '@workspace/ui/controls';
import {
  AVAILABLE_ANGLES,
  type WatermarkPattern,
  type WatermarkPagesScope,
  type WatermarkAngle,
} from '@/lib/pdf-watermark-logic';

export interface PdfWatermarkControlsProps {
  text: string;
  setText: (val: string) => void;
  presetTexts: readonly string[];
  pattern: WatermarkPattern;
  setPattern: (p: WatermarkPattern) => void;
  colorHex: string;
  setColorHex: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  opacity: number;
  setOpacity: (op: number) => void;
  angle: WatermarkAngle;
  setAngle: (angle: WatermarkAngle) => void;
  pagesScope: WatermarkPagesScope;
  setPagesScope: (scope: WatermarkPagesScope) => void;
  isFr: boolean;
  tc: Record<string, any>;
}

export const PdfWatermarkControls: React.FC<PdfWatermarkControlsProps> = ({
  text,
  setText,
  presetTexts,
  pattern,
  setPattern,
  colorHex,
  setColorHex,
  fontSize,
  setFontSize,
  opacity,
  setOpacity,
  angle,
  setAngle,
  pagesScope,
  setPagesScope,
  isFr,
  tc,
}) => {
  return (
    <div className="space-y-8">
      {/* SECTION 1 : TEXTE DU FILIGRANE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="pdf-watermark-text"
            className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold"
          >
            {tc.watermarkText ?? (isFr ? 'Texte du filigrane' : 'Watermark text')}
          </label>
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            {text.length}/100 {isFr ? 'caractères' : 'characters'}
          </span>
        </div>

        <div className="relative">
          <input
            id="pdf-watermark-text"
            type="text"
            maxLength={100}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isFr ? 'Ex : CONFIDENTIEL, SPÉCIMEN...' : 'Ex: CONFIDENTIAL, SAMPLE...'}
            className="w-full px-4 py-3 text-sm font-mono font-semibold uppercase tracking-wider bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/15 rounded-xl text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
          />
        </div>

        {/* Raccourcis de texte sobres */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mr-1">
            {tc.presets ?? (isFr ? 'Préréglages :' : 'Presets:')}
          </span>
          {presetTexts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setText(preset)}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-all cursor-pointer active:scale-[0.96] ${
                text === preset
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 ring-1 ring-zinc-700 font-semibold'
                  : 'bg-black/[0.02] dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] ring-1 ring-black/[0.06] dark:ring-white/10 font-medium'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2 : DISPOSITION & COULEUR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {/* Disposition : Motif répété vs Centre unique */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold block">
            {isFr ? 'Disposition sur le feuillet' : 'Layout on page'}
          </label>
          <div className="h-10 flex items-center p-1 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] ring-1 ring-black/[0.08] dark:ring-white/15 gap-1">
            <button
              type="button"
              onClick={() => setPattern('repeat')}
              className={`flex-1 h-full rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.97] ${
                pattern === 'repeat'
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 ring-1 ring-zinc-700 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] font-medium'
              }`}
            >
              <Grid3X3 size={13} />
              <span>{isFr ? 'Motif répété' : 'Tiled pattern'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPattern('single')}
              className={`flex-1 h-full rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.97] ${
                pattern === 'single'
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 ring-1 ring-zinc-700 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] font-medium'
              }`}
            >
              <Maximize2 size={13} />
              <span>{isFr ? 'Centre unique' : 'Centered'}</span>
            </button>
          </div>
        </div>

        {/* Sélecteur de couleur */}
        <div className="space-y-2">
          <ColorPickerField
            label={tc.color ?? (isFr ? 'Teinte du marquage' : 'Watermark color')}
            value={colorHex}
            onChange={setColorHex}
            isFr={isFr}
            className="w-full"
          />
        </div>
      </div>

      {/* SECTION 3 : GÉOMÉTRIE (CORPS, OPACITÉ, ANGLE) */}
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {/* Corps de police */}
          <div className="space-y-2">
            <label
              htmlFor="pdf-watermark-font-size"
              className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold block"
            >
              {isFr ? 'Corps (Taille)' : 'Font size'}
            </label>
            <NumberStepper
              id="pdf-watermark-font-size"
              value={fontSize}
              onChange={setFontSize}
              min={16}
              max={90}
              step={2}
              suffix="pt"
            />
          </div>

          {/* Opacité */}
          <div className="space-y-2">
            <label
              htmlFor="pdf-watermark-opacity"
              className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold block"
            >
              {isFr ? 'Opacité' : 'Opacity'}
            </label>
            <NumberStepper
              id="pdf-watermark-opacity"
              value={Math.round(opacity * 100)}
              onChange={(val) => setOpacity(val / 100)}
              min={5}
              max={90}
              step={5}
              suffix="%"
            />
          </div>

          {/* Inclinaison */}
          <div className="space-y-2">
            <label
              htmlFor="pdf-watermark-angle"
              className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold block"
            >
              {tc.rotation ?? (isFr ? 'Angle' : 'Angle')}
            </label>
            <div className="h-10 flex items-center p-1 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] ring-1 ring-black/[0.08] dark:ring-white/15 gap-1">
              {AVAILABLE_ANGLES.map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setAngle(deg)}
                  className={`flex-1 h-full rounded-lg text-xs font-mono transition-all flex items-center justify-center cursor-pointer select-none active:scale-[0.96] ${
                    angle === deg
                      ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 ring-1 ring-zinc-700 shadow-xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] font-medium'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4 : CIBLE DES PAGES (PORTÉE) */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold block">
            {tc.pagesScope ?? (isFr ? 'Portée du filigrane' : 'Watermark scope')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'all' as const,
                title: tc.pagesScopeAll ?? (isFr ? 'Toutes les pages' : 'All pages'),
                desc: isFr
                  ? 'Protection intégrale sur tout le document'
                  : 'Full protection across whole document',
              },
              {
                id: 'first' as const,
                title: tc.pagesScopeFirst ?? (isFr ? 'Première page uniquement' : 'First page only'),
                desc: isFr ? 'Page de couverture ou garde seule' : 'Cover page only',
              },
            ].map((opt) => {
              const isSelected = pagesScope === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPagesScope(opt.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl transition-all text-left cursor-pointer select-none active:scale-[0.98] ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 ring-1.5 ring-zinc-950 dark:ring-white shadow-xs font-semibold'
                      : 'bg-black/[0.015] dark:bg-white/[0.02] text-zinc-600 dark:text-zinc-400 ring-1 ring-black/[0.06] dark:ring-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] font-normal'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-mono font-medium">{opt.title}</p>
                    <p className="text-[11px] opacity-70 mt-0.5">{opt.desc}</p>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 dark:border-white dark:bg-white'
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-950" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
