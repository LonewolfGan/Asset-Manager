import React from 'react';
import type { HashAlgorithmItem, HashAlgorithmPillsProps } from './types';

export const DEFAULT_HASH_ALGORITHMS: HashAlgorithmItem[] = [
  { id: 'sha-256', name: 'SHA-256', bits: 256, recommended: true },
  { id: 'sha-512', name: 'SHA-512', bits: 512, recommended: true },
  { id: 'sha-1', name: 'SHA-1', bits: 160, legacy: true },
  { id: 'md5', name: 'MD5', bits: 128, legacy: true },
  { id: 'crc32', name: 'CRC32', bits: 32 },
];

export const HashAlgorithmPills: React.FC<HashAlgorithmPillsProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
  algorithms = DEFAULT_HASH_ALGORITHMS,
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
            {selectedAlgorithm}
          </span>
        </div>
      )}

      <div
        className="flex flex-wrap items-center gap-1.5"
        role="radiogroup"
        aria-label={label || (isFr ? 'Algorithme de hachage' : 'Hash algorithm')}
      >
        {algorithms.map((algo) => {
          const isActive = selectedAlgorithm.toLowerCase() === algo.id.toLowerCase();

          return (
            <button
              key={algo.id}
              type="button"
              disabled={disabled}
              data-algorithm={algo.id}
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelectAlgorithm(algo.id)}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 disabled:opacity-40 disabled:pointer-events-none ${
                isActive
                  ? 'bg-[#FF6B35] text-white shadow-sm ring-1 ring-[#FF6B35]'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <span>{algo.name}</span>
              {algo.bits && (
                <span
                  className={`text-[10px] font-mono px-1 py-0.2 rounded transition-colors ${
                    isActive
                      ? 'bg-black/20 text-white/90'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {algo.bits}b
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
