import React, { useState } from 'react';
import type { DelimiterOption, DelimiterRadioGroupProps } from './types';

export const DEFAULT_DELIMITERS: DelimiterOption[] = [
  { id: 'comma', labelFr: 'Virgule (,)', labelEn: 'Comma (,)', value: ',' },
  { id: 'semicolon', labelFr: 'Point-virgule (;)', labelEn: 'Semicolon (;)', value: ';' },
  { id: 'tab', labelFr: 'Tabulation (\\t)', labelEn: 'Tab (\\t)', value: '\t' },
  { id: 'pipe', labelFr: 'Pipe (|)', labelEn: 'Pipe (|)', value: '|' },
];

export const DelimiterRadioGroup: React.FC<DelimiterRadioGroupProps> = ({
  value,
  onChange,
  options = DEFAULT_DELIMITERS,
  allowCustom = false,
  label,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  const isStandard = options.some((opt) => opt.value === value);
  const isCustomActive = value === 'custom' || (!isStandard && value !== '');
  const [customVal, setCustomVal] = useState(isCustomActive && value !== 'custom' ? value : '');

  const handleCustomSelect = () => {
    onChange(customVal || 'custom');
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomVal(val);
    onChange(val || 'custom');
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
          <span className="text-[11px] font-mono text-zinc-400">
            {value === '\t' ? '\\t' : value}
          </span>
        </div>
      )}

      <div
        className="flex flex-wrap items-center gap-1.5"
        role="radiogroup"
        aria-label={label || (isFr ? 'Séparateur' : 'Delimiter')}
      >
        {options.map((opt) => {
          const isActive = value === opt.value;
          const displayLabel = isFr ? opt.labelFr : opt.labelEn;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              data-delimiter={opt.value}
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 disabled:opacity-40 disabled:pointer-events-none ${
                isActive
                  ? 'bg-[#FF6B35] text-white shadow-sm ring-1 ring-[#FF6B35]'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              {displayLabel}
            </button>
          );
        })}

        {allowCustom && (
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              disabled={disabled}
              data-delimiter="custom"
              role="radio"
              aria-checked={isCustomActive}
              onClick={handleCustomSelect}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 disabled:opacity-40 disabled:pointer-events-none ${
                isCustomActive
                  ? 'bg-[#FF6B35] text-white shadow-sm ring-1 ring-[#FF6B35]'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              {isFr ? 'Autre...' : 'Custom...'}
            </button>

            {isCustomActive && (
              <input
                type="text"
                maxLength={5}
                value={customVal === 'custom' ? '' : customVal}
                onChange={handleCustomInputChange}
                data-testid="custom-delimiter-input"
                placeholder="#"
                disabled={disabled}
                className="w-12 h-7 px-2 text-xs font-mono text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
