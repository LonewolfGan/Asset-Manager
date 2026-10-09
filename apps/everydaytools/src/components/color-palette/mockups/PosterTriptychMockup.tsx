import React from 'react';
import type { PaletteColor } from '@/lib/color-palette-logic';

interface PosterTriptychMockupProps {
  palette: PaletteColor[];
  isFr: boolean;
}

export function PosterTriptychMockup({ palette, isFr }: PosterTriptychMockupProps) {
  return (
    <div className="relative w-full max-w-[960px] h-[520px] flex items-center justify-center select-none">
      {/* AFFICHE DE GAUCHE */}
      <div className="absolute -translate-x-36 sm:-translate-x-44 rotate-[-6deg] z-10 w-[300px] h-[440px] bg-[#F5F4F0] text-zinc-950 rounded-lg shadow-xl p-5 border border-black/10 flex flex-col justify-between transition-transform duration-300 hover:rotate-[-3deg] hover:z-30 hover:scale-105">
        <div className="border-b border-zinc-900 pb-2 flex items-start justify-between font-mono text-[8px] uppercase tracking-wider">
          <span className="font-bold text-zinc-950">KUNSTHALLE ZÜRICH</span>
          <span className="text-zinc-500">{isFr ? 'SALLE 01 · GAUCHE' : 'ROOM 01 · LEFT'}</span>
        </div>

        <div className="relative my-auto w-full h-[200px] flex items-center justify-center">
          <div
            style={{ backgroundColor: palette[1]?.hex || palette[0]?.hex }}
            className="absolute left-3 top-2 w-32 h-32 rounded-full shadow-sm"
          />
          <div
            style={{ backgroundColor: palette[2]?.hex || palette[0]?.hex }}
            className="absolute right-3 bottom-2 w-28 h-36 rounded-sm shadow-sm mix-blend-multiply opacity-90"
          />
          <div
            style={{ backgroundColor: palette[3]?.hex || palette[1]?.hex }}
            className="absolute w-36 h-6 -rotate-12 rounded-full shadow-2xs"
          />
        </div>

        <div className="border-t border-zinc-900 pt-2 font-mono text-[8px] uppercase">
          <h4 className="font-extrabold text-base tracking-tighter leading-none mb-1 text-zinc-950">
            VARIATION 01
          </h4>
          <div className="flex justify-between text-zinc-500">
            <span>{isFr ? 'RYTHME & GÉOMÉTRIE' : 'RHYTHM & GEOMETRY'}</span>
            <span>SERIES N° A</span>
          </div>
        </div>
      </div>

      {/* AFFICHE CENTRALE */}
      <div className="relative z-20 w-[300px] h-[440px] bg-[#FBFBFA] text-zinc-950 rounded-lg shadow-2xl p-6 border border-black/15 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]">
        <div className="border-b border-zinc-950 pb-2.5 flex items-start justify-between font-mono text-[8px] uppercase tracking-wider leading-relaxed">
          <div>
            <span className="block font-bold text-zinc-950">KUNSTHALLE BASEL</span>
            <span className="text-zinc-500">{isFr ? 'EXPOSITION INTERNATIONALE' : 'INTERNATIONAL EXHIBITION'}</span>
          </div>
          <div className="text-right">
            <span className="block font-bold text-zinc-950">26.09 — 15.11</span>
            <span className="text-zinc-500">AUTUMN 2026</span>
          </div>
        </div>

        <div className="relative my-auto w-full h-[210px] flex items-center justify-center">
          <div
            style={{ backgroundColor: palette[0]?.hex }}
            className="absolute left-2 top-2 w-36 h-36 rounded-sm shadow-md"
          />
          <div
            style={{ backgroundColor: palette[1]?.hex }}
            className="absolute right-2 top-8 w-32 h-32 rounded-full shadow-md mix-blend-multiply opacity-90"
          />
          <div
            style={{ backgroundColor: palette[2]?.hex || palette[0]?.hex }}
            className="absolute -bottom-1 left-8 w-28 h-12 rounded-sm shadow-sm"
          />
          <div
            style={{ backgroundColor: palette[3]?.hex || palette[1]?.hex }}
            className="absolute right-8 bottom-3 w-10 h-10 rounded-full border border-black/10"
          />
        </div>

        <div className="border-t border-zinc-950 pt-2.5">
          <h1 className="text-xl font-extrabold tracking-tighter uppercase leading-none text-zinc-950">
            {isFr ? "L'ÉQUILIBRE DU CONTRASTE" : 'THE BALANCE OF CONTRAST'}
          </h1>
          <div className="flex items-center justify-between mt-1.5 font-mono text-[7px] uppercase text-zinc-500">
            <span>{isFr ? 'ÉDITION LIMITÉE N° 26' : 'LIMITED EDITION N° 26'}</span>
            <span>47°33'38" N · 7°35'26" E</span>
            <span className="font-bold text-zinc-900">CHF 25.—</span>
          </div>
        </div>
      </div>

      {/* AFFICHE DE DROITE */}
      <div className="absolute translate-x-36 sm:translate-x-44 rotate-[6deg] z-10 w-[300px] h-[440px] bg-[#111113] text-white rounded-lg shadow-xl p-5 border border-white/10 flex flex-col justify-between transition-transform duration-300 hover:rotate-[3deg] hover:z-30 hover:scale-105">
        <div className="border-b border-white/30 pb-2 flex items-start justify-between font-mono text-[8px] uppercase tracking-wider">
          <span className="font-bold text-white">BAUHAUS ARCHIV</span>
          <span className="text-zinc-400">{isFr ? 'SALLE 02 · DROITE' : 'ROOM 02 · RIGHT'}</span>
        </div>

        <div className="relative my-auto w-full h-[200px] flex items-center justify-center">
          <div
            style={{ backgroundColor: palette[0]?.hex }}
            className="absolute inset-x-3 top-3 h-20 rounded-md opacity-90"
          />
          <div
            style={{ backgroundColor: palette[palette.length - 1]?.hex || palette[1]?.hex }}
            className="absolute bottom-2 left-4 w-28 h-28 rounded-full border-2 border-white/20 shadow-md"
          />
          <div
            style={{ backgroundColor: palette[2]?.hex || palette[0]?.hex }}
            className="absolute right-4 top-14 w-16 h-16 rounded-sm shadow-md"
          />
        </div>

        <div className="border-t border-white/30 pt-2 font-mono text-[8px] uppercase">
          <h4 className="font-extrabold text-base tracking-tighter leading-none mb-1 text-white">
            VARIATION 02
          </h4>
          <div className="flex justify-between text-zinc-400">
            <span>{isFr ? 'LUMIÈRE & MATIÈRE' : 'LIGHT & MATTER'}</span>
            <span>SERIES N° B</span>
          </div>
        </div>
      </div>
    </div>
  );
}
