import React from 'react';
import {
  getContrastTextColor,
  getColorShades,
  describeColor,
  type PaletteColor,
} from '@/lib/color-palette-logic';

interface BrandManualMockupProps {
  palette: PaletteColor[];
  isFr: boolean;
}

export function BrandManualMockup({ palette, isFr }: BrandManualMockupProps) {
  const curPalette = palette.slice(0, 5);

  return (
    <div className="w-[880px] h-[510px] bg-[#FAF8F5] dark:bg-[#141416] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl flex select-none overflow-hidden relative">
      {/* Reliure centrale du livre */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/15 dark:bg-white/15 z-20 pointer-events-none" />

      {/* PAGE DE GAUCHE : L'EMBLÈME SCULPTURAL */}
      <div className="w-1/2 h-full p-8 pr-10 flex flex-col justify-between relative border-r border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
          <span>{isFr ? "MANUEL D'IDENTITÉ · VOL. 01" : 'BRAND MANUAL · VOL. 01'}</span>
          <span className="font-bold text-zinc-950 dark:text-zinc-50">PAGE 042</span>
        </div>

        <div className="flex flex-col items-center justify-center my-auto py-2 text-center">
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            <div
              style={{ backgroundColor: curPalette[0]?.hex }}
              className="w-28 h-28 rounded-full shadow-lg"
            />
            <div
              style={{ backgroundColor: curPalette[1]?.hex || curPalette[0]?.hex }}
              className="absolute -right-1 bottom-1 w-20 h-20 rounded-2xl shadow-md rotate-12 mix-blend-multiply dark:mix-blend-screen opacity-95"
            />
            <div
              style={{ backgroundColor: curPalette[2]?.hex || curPalette[0]?.hex }}
              className="absolute w-8 h-8 rounded-full shadow-sm border border-white/20"
            />
          </div>

          <h3 className="text-xl font-extrabold tracking-tight uppercase text-zinc-950 dark:text-zinc-50 leading-none">
            ATELIER CHROMA
          </h3>
          <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mt-1.5">
            {isFr ? 'SYSTÈME VISUEL N° 2026 · CHARTE OFFICIELLE' : 'VISUAL SYSTEM N° 2026 · BRAND GUIDELINES'}
          </p>
        </div>

        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-[8px] text-zinc-400 uppercase tracking-widest">
          <span>{isFr ? 'GÉOMÉTRIE & ÉCHELLE GRAPHIQUE' : 'GEOMETRY & GRAPHIC SCALE'}</span>
          <span>REF. 042-ID</span>
        </div>
      </div>

      {/* PAGE DE DROITE : NUANCIER ET ÉPREUVE */}
      <div className="w-1/2 h-full p-8 pl-10 flex flex-col justify-between relative">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
          <span className="font-bold text-zinc-950 dark:text-zinc-50">PAGE 043</span>
          <span>{isFr ? 'SYSTÈME CHROMATIQUE OFFICIEL' : 'OFFICIAL COLOR SYSTEM'}</span>
        </div>

        <div className="space-y-4 my-auto py-1">
          <div>
            <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-wider text-zinc-400 mb-2">
              <span>{isFr ? "NUANCIER D'ATELIER · G.F SMITH EXTRAMATT 350G" : 'STUDIO SWATCHES · G.F SMITH EXTRAMATT 350G'}</span>
              <span className="font-semibold text-zinc-500">{curPalette.length} {isFr ? 'NUANCES ÉDITÉES' : 'CURATED SHADES'}</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {curPalette.map((col, idx) => {
                const roles = isFr
                  ? ['DOMINANTE', 'ACCENT', 'SOUTIEN', 'SURFACE', 'CONTRASTE']
                  : ['PRIMARY', 'ACCENT', 'SECONDARY', 'SURFACE', 'CONTRAST'];
                const shades = getColorShades(col.hex);
                return (
                  <div
                    key={col.id || idx}
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-black/10 dark:border-white/10 overflow-hidden flex flex-col select-none"
                  >
                    <div
                      style={{ backgroundColor: col.hex }}
                      className="h-20 w-full relative p-1.5 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          style={{ color: getContrastTextColor(col.hex) }}
                          className="font-mono text-[8px] font-bold opacity-80"
                        >
                          0{idx + 1}
                        </span>
                      </div>

                      <div className="h-1 w-full rounded-full overflow-hidden flex opacity-85 shadow-2xs">
                        {shades.slice(1, 6).map((shadeHex, sIdx) => (
                          <div
                            key={sIdx}
                            style={{ backgroundColor: shadeHex }}
                            className="h-full flex-1"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-1.5 space-y-0.5 bg-white dark:bg-zinc-900 border-t border-black/5 dark:border-white/5">
                      <span className="font-mono font-bold text-[10px] text-zinc-900 dark:text-zinc-100 block truncate">
                        {col.hex}
                      </span>
                      <span className="text-[8px] text-zinc-500 dark:text-zinc-400 font-medium block truncate">
                        {describeColor(col.hex, isFr)}
                      </span>
                      <span className="font-mono text-[7px] text-zinc-400 uppercase tracking-tight block">
                        {roles[idx]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-black/5 dark:border-white/5">
            <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-400 block mb-1.5">
              {isFr ? 'ÉPREUVE DE COMPOSITION & DIALOGUE DES CONTRASTES' : 'COMPOSITION PROOF & CONTRAST INTERACTION'}
            </span>

            <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    backgroundColor: curPalette[0]?.hex,
                    color: getContrastTextColor(curPalette[0]?.hex),
                  }}
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl tracking-tighter shadow-2xs shrink-0"
                >
                  Aa
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-xs uppercase tracking-tight text-zinc-950 dark:text-zinc-50 block leading-tight">
                    {isFr ? 'SPÉCIMEN & HIÉRARCHIE' : 'SPECIMEN & HIERARCHY'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{
                        backgroundColor: curPalette[1]?.hex || curPalette[0]?.hex,
                        color: getContrastTextColor(curPalette[1]?.hex || curPalette[0]?.hex),
                      }}
                      className="px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase tracking-wider"
                    >
                      ACCENT
                    </span>
                    <span
                      style={{
                        backgroundColor: curPalette[2]?.hex || curPalette[0]?.hex,
                        color: getContrastTextColor(curPalette[2]?.hex || curPalette[0]?.hex),
                      }}
                      className="px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase tracking-wider"
                    >
                      {isFr ? 'SOUTIEN' : 'SECONDARY'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pl-3 border-l border-black/10 dark:border-white/10">
                <div className="text-right font-mono">
                  <span className="text-[7px] text-zinc-400 uppercase block">{isFr ? 'CANAL RVB' : 'RGB CHANNELS'}</span>
                  <span className="text-[9px] font-bold text-zinc-800 dark:text-zinc-200 block">
                    {curPalette[0]?.rgb.r}, {curPalette[0]?.rgb.g}, {curPalette[0]?.rgb.b}
                  </span>
                </div>
                <div
                  style={{ backgroundColor: curPalette[0]?.hex }}
                  className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 shadow-2xs flex items-center justify-center"
                >
                  <div
                    style={{ backgroundColor: curPalette[1]?.hex || '#FFFFFF' }}
                    className="w-2.5 h-2.5 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">
            {isFr ? 'CONFORMITÉ WCAG 2.1 AAA · ÉDITIONS DU STUDIO' : 'WCAG 2.1 AAA COMPLIANCE · STUDIO EDITIONS'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8px] text-zinc-400 mr-1">{isFr ? "REPÈRES D'ENCRAGE" : 'INK REGISTRATION'}</span>
            {curPalette.map((c) => (
              <div
                key={c.id}
                style={{ backgroundColor: c.hex }}
                className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-2xs"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
