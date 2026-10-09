import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { EncodingOption, EncodingSelectorProps } from './types';

export const DEFAULT_ENCODINGS: EncodingOption[] = [
  { id: 'utf-8', label: 'UTF-8', nameFr: 'UTF-8 (Universel)', nameEn: 'UTF-8 (Universal)' },
  { id: 'windows-1252', label: 'Windows-1252', nameFr: 'Windows-1252 (ANSI)', nameEn: 'Windows-1252 (ANSI)' },
  { id: 'iso-8859-1', label: 'ISO-8859-1', nameFr: 'ISO-8859-1 (Latin-1)', nameEn: 'ISO-8859-1 (Latin-1)' },
  { id: 'utf-16le', label: 'UTF-16 LE', nameFr: 'UTF-16 LE (Unicode)', nameEn: 'UTF-16 LE (Unicode)' },
  { id: 'ascii', label: 'ASCII', nameFr: 'ASCII (7-bit)', nameEn: 'ASCII (7-bit)' },
];

export const EncodingSelector: React.FC<EncodingSelectorProps> = ({
  value,
  onChange,
  options = DEFAULT_ENCODINGS,
  label,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full h-9 pl-3 pr-8 text-xs sm:text-sm bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg appearance-none text-zinc-900 dark:text-zinc-100 transition-colors focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {isFr && opt.nameFr ? opt.nameFr : opt.nameEn ? opt.nameEn : opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
