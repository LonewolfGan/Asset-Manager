import React from 'react';
import { getContrastTextColor, type PaletteColor } from '@/lib/color-palette-logic';

interface LuxuryStationeryMockupProps {
  palette: PaletteColor[];
  isFr: boolean;
}

export function LuxuryStationeryMockup({ palette, isFr }: LuxuryStationeryMockupProps) {
  const curPalette = palette.slice(0, 5);

  return (
    <div className="relative w-full max-w-[960px] h-[460px] flex items-center justify-center select-none">
      {/* CARTE 01 (Gauche) : Carte de Visite Studio Recto */}
      <div
        style={{ backgroundColor: curPalette[0]?.hex }}
        className="absolute -translate-x-36 sm:-translate-x-44 -translate-y-3 rotate-[-6deg] w-[295px] h-[180px] rounded-xl p-5 shadow-2xl flex flex-col justify-between border border-black/10 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-30 cursor-default z-10"
      >
        <div className="flex items-center justify-between">
          <span
            style={{ color: getContrastTextColor(curPalette[0]?.hex || '#000000') }}
            className="font-mono text-[8px] tracking-widest uppercase font-semibold"
          >
            {isFr ? 'ATELIER CHROMATIQUE' : 'CHROMATIC ATELIER'}
          </span>
          <div
            style={{ backgroundColor: curPalette[1]?.hex }}
            className="w-3.5 h-3.5 rounded-full shadow-2xs"
          />
        </div>

        <div>
          <span
            style={{ color: getContrastTextColor(curPalette[0]?.hex || '#000000') }}
            className="text-xl font-bold tracking-tight block"
          >
            Studio Mercier
          </span>
          <span
            style={{ color: getContrastTextColor(curPalette[0]?.hex || '#000000'), opacity: 0.8 }}
            className="font-mono text-[9px] tracking-wider uppercase mt-0.5 block"
          >
            {isFr ? 'Direction Artistique · Design' : 'Art Direction · Design'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span
            style={{ color: getContrastTextColor(curPalette[0]?.hex || '#000000'), opacity: 0.6 }}
            className="font-mono text-[8px] uppercase tracking-widest"
          >
            PARIS · BASEL · TOKYO
          </span>
          <span
            style={{ color: getContrastTextColor(curPalette[0]?.hex || '#000000'), opacity: 0.4 }}
            className="font-mono text-[8px]"
          >
            COTTON PAPER 350G
          </span>
        </div>
      </div>

      {/* CARTE 02 (Centre) : Carte de Visite Verso */}
      <div
        style={{ backgroundColor: curPalette[curPalette.length - 1]?.hex || '#ffffff' }}
        className="relative z-20 translate-x-0 translate-y-1 rotate-0 w-[310px] h-[190px] rounded-xl p-5 shadow-2xl flex flex-col justify-between border border-black/15 transition-all duration-300 hover:scale-105 hover:z-30 cursor-default"
      >
        {(() => {
          const bg = curPalette[curPalette.length - 1]?.hex || '#ffffff';
          const text = getContrastTextColor(bg);
          return (
            <>
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
                <div>
                  <span style={{ color: text }} className="font-bold text-xs tracking-tight block">
                    Alexandre Mercier
                  </span>
                  <span style={{ color: text, opacity: 0.65 }} className="text-[10px]">
                    {isFr ? 'Directeur de Création' : 'Creative Director'}
                  </span>
                </div>
                <span
                  style={{
                    backgroundColor: curPalette[1]?.hex,
                    color: getContrastTextColor(curPalette[1]?.hex || '#ffffff'),
                  }}
                  className="px-2 py-0.5 rounded text-[8px] font-mono uppercase font-semibold"
                >
                  {isFr ? 'Associé' : 'Partner'}
                </span>
              </div>

              <div className="space-y-1 my-auto">
                <p style={{ color: text, opacity: 0.85 }} className="text-[10px] font-mono">
                  contact@atelier-mercier.design
                </p>
                <p style={{ color: text, opacity: 0.85 }} className="text-[10px] font-mono">
                  +33 (0)1 42 68 55 00
                </p>
                <p style={{ color: text, opacity: 0.6 }} className="text-[9px]">
                  14 Rue de Paradis, 75010 Paris
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                <span style={{ color: text, opacity: 0.6 }} className="font-mono text-[8px]">
                  atelier-mercier.design
                </span>
                <div className="flex items-center gap-1">
                  {curPalette.map((c) => (
                    <div
                      key={c.id}
                      style={{ backgroundColor: c.hex }}
                      className="w-2 h-2 rounded-full border border-black/10"
                    />
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* CARTE 03 (Droite) : Accréditation Privée Studio */}
      <div
        style={{ backgroundColor: curPalette[1]?.hex || curPalette[0]?.hex }}
        className="absolute translate-x-36 sm:translate-x-44 translate-y-6 rotate-[6deg] w-[295px] h-[180px] rounded-xl p-5 shadow-2xl flex flex-col justify-between border border-black/10 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-30 cursor-default z-10"
      >
        <div className="flex items-center justify-between">
          <span
            style={{ color: getContrastTextColor(curPalette[1]?.hex || '#000000') }}
            className="font-mono text-[8px] tracking-widest uppercase font-semibold"
          >
            {isFr ? 'MEMBRE PRIVILÈGE' : 'VIP MEMBER'}
          </span>
          <span
            style={{
              backgroundColor: 'rgba(0,0,0,0.15)',
              color: getContrastTextColor(curPalette[1]?.hex || '#000000'),
            }}
            className="px-2 py-0.5 rounded text-[8px] font-mono font-bold"
          >
            N° 0489
          </span>
        </div>

        <div>
          <span
            style={{ color: getContrastTextColor(curPalette[1]?.hex || '#000000') }}
            className="text-xl font-bold tracking-tight block"
          >
            {isFr ? "Pass Atelier d'Art" : 'Art Studio Pass'}
          </span>
          <span
            style={{ color: getContrastTextColor(curPalette[1]?.hex || '#000000'), opacity: 0.85 }}
            className="text-[10px] mt-0.5 block"
          >
            {isFr ? 'Accès Réservé aux Collections Privées' : 'Exclusive Access to Private Collections'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-black/10">
          <span
            style={{ color: getContrastTextColor(curPalette[1]?.hex || '#000000'), opacity: 0.6 }}
            className="font-mono text-[8px]"
          >
            {isFr ? 'ÉDITIONS LIMITÉES 2026' : 'LIMITED EDITIONS 2026'}
          </span>
          <span
            style={{ color: getContrastTextColor(curPalette[1]?.hex || '#000000'), opacity: 0.8 }}
            className="font-mono text-[8px] font-bold"
          >
            {isFr ? 'CERTIFIÉ' : 'CERTIFIED'}
          </span>
        </div>
      </div>
    </div>
  );
}
