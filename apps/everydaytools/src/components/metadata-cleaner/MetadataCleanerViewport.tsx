import React from 'react';
import { Loader2 } from 'lucide-react';
import type { ConversionFormat } from '@/components/conversion';

interface MetadataCleanerViewportProps {
  previewUrl: string | null;
  isPreviewLoading: boolean;
  targetFormat: ConversionFormat;
  telemetryDetails: string;
  fileName: string;
  isFr: boolean;
}

export const MetadataCleanerViewport: React.FC<MetadataCleanerViewportProps> = ({
  previewUrl,
  isPreviewLoading,
  targetFormat,
  telemetryDetails,
  fileName,
  isFr,
}) => {
  if (isPreviewLoading) {
    return (
      <div className="h-[360px] flex flex-col items-center justify-center text-center gap-3 border border-zinc-200/80 dark:border-white/10 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
        <span className="text-xs font-mono text-zinc-400">
          {isFr ? "Génération de l'aperçu..." : 'Generating preview...'}
        </span>
      </div>
    );
  }

  if (previewUrl) {
    return (
      <div className="rounded-xl overflow-hidden border border-zinc-200/80 dark:border-white/10 bg-zinc-100/30 dark:bg-zinc-900/20 flex items-center justify-center p-3 sm:p-4 min-h-[280px] max-h-[440px]">
        <img
          src={previewUrl}
          alt={isFr ? 'Aperçu' : 'Preview'}
          className="w-auto h-auto max-h-[380px] max-w-full object-contain mx-auto rounded shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/5"
        />
      </div>
    );
  }

  return (
    <div className="py-24 flex flex-col items-center justify-center text-center gap-3 border border-zinc-200/80 dark:border-white/10 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
      <img
        src={targetFormat.icon}
        alt={isFr ? 'Document' : 'Document'}
        className="w-16 h-16 object-contain"
      />
      <span className="text-xs font-mono text-zinc-500">
        {telemetryDetails || fileName}
      </span>
    </div>
  );
};
