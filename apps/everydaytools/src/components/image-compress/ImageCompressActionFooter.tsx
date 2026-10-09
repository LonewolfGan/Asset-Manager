import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { CompressionPreset } from '@/lib/image-compress-logic';

export interface ImageCompressActionFooterProps {
  selectedPreset: CompressionPreset | undefined;
  isFr: boolean;
  onReset: () => void;
  onCompress: () => void;
}

export const ImageCompressActionFooter: React.FC<ImageCompressActionFooterProps> = ({
  selectedPreset,
  isFr,
  onReset,
  onCompress,
}) => {
  return (
    <div className="pt-8 border-t border-black/[0.08] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
        {isFr ? 'Compression sélectionnée :' : 'Selected compression:'}{' '}
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
          {selectedPreset?.name}
        </span>{' '}
        ({selectedPreset?.gainLabel} {isFr ? 'estimé' : 'estimated'})
      </div>

      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 sm:flex-initial h-12 px-6 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98] transition-all cursor-pointer"
        >
          {isFr ? 'Annuler' : 'Cancel'}
        </button>

        <button
          type="button"
          onClick={onCompress}
          className="group flex-1 sm:flex-initial h-12 px-8 rounded-xl bg-[#FF6B35] hover:bg-[#E85A24] text-white text-sm font-semibold active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>{isFr ? "Compresser l'image" : 'Compress image'}</span>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
            <ArrowRight size={12} strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </div>
  );
};
