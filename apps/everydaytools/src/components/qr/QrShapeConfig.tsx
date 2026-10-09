import React from 'react';
import { DotStyle, EyeStyle } from '@/lib/qr-code-logic';

export interface QrShapeConfigProps {
  isFr: boolean;
  dotStyle: DotStyle;
  setDotStyle: (v: DotStyle) => void;
  eyeStyle: EyeStyle;
  setEyeStyle: (v: EyeStyle) => void;
}

export function QrShapeConfig({
  isFr,
  dotStyle,
  setDotStyle,
  eyeStyle,
  setEyeStyle,
}: QrShapeConfigProps) {
  return (
    <>
      {/* Module Style Segmented */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {isFr ? 'Forme des modules' : 'Module Shape'}
          </span>
          <span className="text-[11px] font-mono text-zinc-400 capitalize">{dotStyle}</span>
        </div>
        <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-white/10">
          {[
            { id: 'square', labelFr: 'Carrés', labelEn: 'Squares' },
            { id: 'dots', labelFr: 'Points', labelEn: 'Dots' },
            { id: 'rounded', labelFr: 'Arrondis', labelEn: 'Rounded' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setDotStyle(s.id as DotStyle)}
              className={`py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                dotStyle === s.id
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {isFr ? s.labelFr : s.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Corner Eye Style Segmented */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {isFr ? "Forme des repères d'angles" : 'Corner Eyes Style'}
          </span>
          <span className="text-[11px] font-mono text-zinc-400 capitalize">{eyeStyle}</span>
        </div>
        <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-white/10">
          {[
            { id: 'square', labelFr: 'Carré', labelEn: 'Square' },
            { id: 'circle', labelFr: 'Cercle', labelEn: 'Circle' },
            { id: 'rounded', labelFr: 'Adouci', labelEn: 'Soft' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setEyeStyle(s.id as EyeStyle)}
              className={`py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                eyeStyle === s.id
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {isFr ? s.labelFr : s.labelEn}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
