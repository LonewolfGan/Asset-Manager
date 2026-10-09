import React from 'react';
import type { QualitySliderFieldProps } from './types';

export const QualitySliderField: React.FC<QualitySliderFieldProps> = ({
  value,
  onChange,
  label,
  min = 1,
  max = 100,
  step = 1,
  presets = [],
  estimatedLabel,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  const displayLabel = label || (isFr ? 'Qualité' : 'Quality');

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* En-tête : Libellé + Estimation + Pourcentage */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {displayLabel}
          </span>
          {estimatedLabel && (
            <span className="font-mono text-[11px] text-[#FF6B35] font-semibold">
              {estimatedLabel}
            </span>
          )}
        </div>
        <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {value}%
        </span>
      </div>

      {/* Curseur Slider */}
      <div className="relative flex items-center">
        <input
          type="range"
          data-testid="quality-slider"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF6B35] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Préréglages rapides */}
      {presets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {presets.map((preset) => {
            const isSelected = value === preset.value;
            return (
              <button
                key={preset.id}
                type="button"
                data-preset-id={preset.id}
                disabled={disabled}
                onClick={() => onChange(preset.value)}
                className={`h-7 px-2 rounded-md border text-[11px] font-mono transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-white/20 text-[#FF6B35] font-semibold shadow-2xs'
                    : 'border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
