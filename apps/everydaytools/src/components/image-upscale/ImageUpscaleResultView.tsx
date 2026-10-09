import React from 'react';
import { CompareReveal } from '@/components/ui/compare-reveal';
import type { UpscaleDimensions } from '@/lib/image-upscale-logic';

export interface ImageUpscaleResultViewProps {
  viewMode: 'split' | 'side-by-side' | 'single';
  previewUrl: string | null;
  resultUrl: string | null;
  origDims: { w: number; h: number } | null;
  targetDims: UpscaleDimensions;
  scale: 2 | 4;
  isFr: boolean;
}

export function ImageUpscaleResultView({
  viewMode,
  previewUrl,
  resultUrl,
  origDims,
  targetDims,
  scale,
  isFr,
}: ImageUpscaleResultViewProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-[#f8f9fa] dark:bg-[#101012] p-6 min-h-[480px] sm:min-h-[560px] lg:min-h-[620px] flex items-center justify-center overflow-hidden">
      {/* Mode A : Curseur Split-Screen Draggable avec CompareReveal */}
      {viewMode === 'split' && previewUrl && resultUrl && (
        <div className="w-full flex items-center justify-center">
          <CompareReveal
            className="w-full aspect-[16/10] min-h-[520px] sm:min-h-[600px] max-h-[720px] rounded-xl shadow-lg border border-black/10 dark:border-white/10"
            before={{ src: previewUrl, alt: isFr ? 'Avant' : 'Before' }}
            after={{
              src: resultUrl,
              alt: isFr ? `Après (${scale}x)` : `After (${scale}x)`,
            }}
            labels={[
              isFr ? 'Avant' : 'Before',
              isFr ? `Après (${scale}x)` : `After (${scale}x)`,
            ]}
            defaultPosition={50}
            introSweep={true}
            snapOnDoubleClick={50}
          />
        </div>
      )}

      {/* Mode B : Côte à côte */}
      {viewMode === 'side-by-side' && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 text-center">
            <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              {isFr ? 'Original' : 'Original'} ({origDims?.w} × {origDims?.h} px)
            </div>
            <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 aspect-[4/3] flex items-center justify-center p-3">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-full max-h-full max-w-full object-contain rounded"
                />
              )}
            </div>
          </div>

          <div className="space-y-2 text-center">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {isFr ? `Agrandie ${scale}x` : `Upscaled ${scale}x`} ({targetDims.targetW} × {targetDims.targetH} px)
            </div>
            <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 aspect-[4/3] flex items-center justify-center p-3">
              {resultUrl && (
                <img
                  src={resultUrl}
                  alt={isFr ? 'Agrandie' : 'Upscaled'}
                  className="w-full h-full max-h-full max-w-full object-contain rounded"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode C : Image Finale Simple */}
      {viewMode === 'single' && (
        <div className="w-full flex items-center justify-center">
          {resultUrl && (
            <img
              src={resultUrl}
              alt={isFr ? 'Résultat Final' : 'Final Result'}
              className="max-h-[600px] sm:max-h-[680px] w-auto max-w-full object-contain rounded-lg drop-shadow-sm select-none"
            />
          )}
        </div>
      )}
    </div>
  );
}
