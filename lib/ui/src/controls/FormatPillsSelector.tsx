import React from 'react';
import type { FormatOption, FormatPillsSelectorProps } from './types';

export const DEFAULT_FORMATS: FormatOption[] = [
  { id: 'png', label: 'PNG', extension: '.png' },
  { id: 'jpg', label: 'JPG', extension: '.jpg' },
  { id: 'webp', label: 'WebP', extension: '.webp' },
  { id: 'pdf', label: 'PDF', extension: '.pdf' },
  { id: 'svg', label: 'SVG', extension: '.svg' },
];

export const FormatPillsSelector: React.FC<FormatPillsSelectorProps> = ({
  value,
  onChange,
  formats = DEFAULT_FORMATS,
  label,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
          <span className="text-[11px] font-mono text-zinc-400 uppercase">
            {value}
          </span>
        </div>
      )}

      <div
        className="flex flex-wrap items-center gap-1.5"
        role="radiogroup"
        aria-label={label || (isFr ? 'Format de sortie' : 'Output format')}
      >
        {formats.map((fmt) => {
          const isActive = value.toLowerCase() === fmt.id.toLowerCase();

          return (
            <button
              key={fmt.id}
              type="button"
              disabled={disabled}
              data-format={fmt.id}
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(fmt.id)}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 disabled:opacity-40 disabled:pointer-events-none ${
                isActive
                  ? 'bg-[#FF6B35] text-white shadow-sm ring-1 ring-[#FF6B35]'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <span className="uppercase font-semibold">{fmt.label}</span>
              {fmt.badge && (
                <span
                  className={`text-[10px] px-1 rounded transition-colors ${
                    isActive
                      ? 'bg-black/20 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {fmt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
