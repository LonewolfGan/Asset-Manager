import React from 'react';
import type { CropRatioItem, CropRatioSelectorProps } from './types';

export const DEFAULT_CROP_RATIOS: CropRatioItem[] = [
  { id: 'free', name: 'Libre', nameEn: 'Free', ratio: null },
  { id: '1:1', name: '1:1', nameEn: '1:1', ratio: 1 },
  { id: '16:9', name: '16:9', nameEn: '16:9', ratio: 16 / 9 },
  { id: '4:3', name: '4:3', nameEn: '4:3', ratio: 4 / 3 },
  { id: '9:16', name: '9:16', nameEn: '9:16', ratio: 9 / 16 },
  { id: '3:2', name: '3:2', nameEn: '3:2', ratio: 3 / 2 },
  { id: '2:3', name: '2:3', nameEn: '2:3', ratio: 2 / 3 },
];

export const CropRatioSelector: React.FC<CropRatioSelectorProps> = ({
  selectedRatio,
  onSelectRatio,
  ratios = DEFAULT_CROP_RATIOS,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {isFr ? 'Format de recadrage' : 'Crop aspect ratio'}
      </span>

      <div className="flex items-center gap-1.5 flex-wrap">
        {ratios.map((item) => {
          const isSelected = selectedRatio === item.id;
          const displayName = isFr ? item.name : item.nameEn;

          return (
            <button
              key={item.id}
              type="button"
              data-ratio-id={item.id}
              disabled={disabled}
              onClick={() => onSelectRatio(item)}
              className={`h-8 px-2.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-white/20 text-[#FF6B35] font-semibold shadow-2xs'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
