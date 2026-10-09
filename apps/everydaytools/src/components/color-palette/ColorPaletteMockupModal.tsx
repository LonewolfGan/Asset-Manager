import React from 'react';
import { Palette, BookOpen, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActionTooltip } from '@/components/ui/tooltip';
import { describeColor, type PaletteColor } from '@/lib/color-palette-logic';
import { PosterTriptychMockup } from './mockups/PosterTriptychMockup';
import { BrandManualMockup } from './mockups/BrandManualMockup';
import { LuxuryStationeryMockup } from './mockups/LuxuryStationeryMockup';

interface ColorPaletteMockupModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  palette: PaletteColor[];
  isFr: boolean;
}

export function ColorPaletteMockupModal({
  isOpen,
  onOpenChange,
  palette,
  isFr,
}: ColorPaletteMockupModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[1100px] max-w-[95vw] h-[720px] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-[#FAF9F6] dark:bg-[#09090b] border border-zinc-200/90 dark:border-white/10 rounded-2xl shadow-2xl">
        <Tabs defaultValue="poster" className="flex flex-col h-full w-full">
          {/* EN-TÊTE FIXE DU MODAL */}
          <DialogHeader className="h-16 px-6 border-b border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {isFr ? 'Mises en situation chromatiques' : 'Chromatic Mockups'}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5 hidden sm:block">
                {isFr
                  ? "Triptyque d'art contemporain, charte de marque de prestige et papeterie tactile."
                  : 'Contemporary art posters, brand manual and luxury stationery mockups.'}
              </DialogDescription>
            </div>

            <TabsList className="mr-6 bg-zinc-100 dark:bg-zinc-800 h-9 p-0.5">
              <TabsTrigger value="poster" className="gap-1.5 text-xs px-3.5 cursor-pointer">
                <Palette className="w-3.5 h-3.5" />
                <span>{isFr ? "Triptyque d'Affiches" : 'Art Posters'}</span>
              </TabsTrigger>
              <TabsTrigger value="brand" className="gap-1.5 text-xs px-3.5 cursor-pointer">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isFr ? 'Planche de Marque' : 'Brand Manual'}</span>
              </TabsTrigger>
              <TabsTrigger value="stationery" className="gap-1.5 text-xs px-3.5 cursor-pointer">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isFr ? 'Papeterie Luxe' : 'Luxury Stationery'}</span>
              </TabsTrigger>
            </TabsList>
          </DialogHeader>

          {/* ZONE DE CANVAS À HAUTEUR FIXE */}
          <div className="flex-1 h-[590px] w-full p-4 sm:p-6 flex items-center justify-center overflow-hidden bg-zinc-100/40 dark:bg-zinc-950/40 relative">
            <div
              className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <TabsContent
              value="poster"
              className="h-full w-full flex items-center justify-center m-0 data-[state=inactive]:hidden relative z-10"
            >
              <PosterTriptychMockup palette={palette} isFr={isFr} />
            </TabsContent>

            <TabsContent
              value="brand"
              className="h-full w-full flex items-center justify-center m-0 data-[state=inactive]:hidden relative z-10"
            >
              <BrandManualMockup palette={palette} isFr={isFr} />
            </TabsContent>

            <TabsContent
              value="stationery"
              className="h-full w-full flex items-center justify-center m-0 data-[state=inactive]:hidden relative z-10"
            >
              <LuxuryStationeryMockup palette={palette} isFr={isFr} />
            </TabsContent>
          </div>

          {/* PIED DE PAGE FIXE DU MODAL */}
          <div className="h-14 px-6 border-t border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                {isFr ? 'Palette active :' : 'Active palette:'}
              </span>
              <div className="flex items-center gap-1.5">
                {palette.map((c) => (
                  <ActionTooltip key={c.id} label={`${describeColor(c.hex, isFr)} (${c.hex})`} side="top">
                    <div
                      style={{ backgroundColor: c.hex }}
                      className="w-5 h-5 rounded-md border border-black/10 dark:border-white/10 shadow-2xs cursor-default"
                    />
                  </ActionTooltip>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {isFr ? "Fermer l'aperçu" : 'Close preview'}
            </button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
