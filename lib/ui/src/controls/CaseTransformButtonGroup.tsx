import React from 'react';
import type { CaseOption, CaseTransformButtonGroupProps, CaseTransformType } from './types';

export function transformCase(text: string, caseType: CaseTransformType): string {
  if (!text) return '';

  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/);

  switch (caseType) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    case 'camel':
      return words
        .map((w, idx) =>
          idx === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('');
    case 'snake':
      return words.map((w) => w.toLowerCase()).join('_');
    case 'kebab':
      return words.map((w) => w.toLowerCase()).join('-');
    default:
      return text;
  }
}

export const DEFAULT_CASE_OPTIONS: CaseOption[] = [
  { id: 'upper', labelFr: 'MAJUSCULES', labelEn: 'UPPERCASE', preview: 'AA' },
  { id: 'lower', labelFr: 'minuscules', labelEn: 'lowercase', preview: 'aa' },
  { id: 'title', labelFr: 'Titre', labelEn: 'Title Case', preview: 'Aa' },
  { id: 'camel', labelFr: 'camelCase', labelEn: 'camelCase', preview: 'aA' },
  { id: 'snake', labelFr: 'snake_case', labelEn: 'snake_case', preview: 'a_b' },
  { id: 'kebab', labelFr: 'kebab-case', labelEn: 'kebab-case', preview: 'a-b' },
];

export const CaseTransformButtonGroup: React.FC<CaseTransformButtonGroupProps> = ({
  value,
  onSelectCase,
  options = DEFAULT_CASE_OPTIONS,
  label,
  isFr = false,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <span className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
      )}

      <div
        className="flex flex-wrap items-center gap-1.5"
        role="group"
        aria-label={label || (isFr ? 'Casse' : 'Case')}
      >
        {options.map((opt) => {
          const isActive = value === opt.id;
          const displayLabel = isFr ? opt.labelFr : opt.labelEn;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              data-case={opt.id}
              onClick={() => onSelectCase(opt.id)}
              title={displayLabel}
              className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 disabled:opacity-40 disabled:pointer-events-none ${
                isActive
                  ? 'bg-[#FF6B35] text-white shadow-sm ring-1 ring-[#FF6B35]'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <span
                className={`font-mono text-[10px] font-bold px-1 rounded transition-colors ${
                  isActive
                    ? 'bg-black/20 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {opt.preview}
              </span>
              <span>{displayLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
