import React, { useState } from 'react';
import { Search, X, Tag } from 'lucide-react';
import type { MetadataViewerGridProps } from './types';

export const MetadataViewerGrid: React.FC<MetadataViewerGridProps> = ({
  data,
  allowSearch = false,
  allowRemove = false,
  onRemoveTag,
  label,
  isFr = false,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const entries = Object.entries(data).filter(([key, val]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchKey = key.toLowerCase().includes(q);
    const matchVal = String(val ?? '').toLowerCase().includes(q);
    return matchKey || matchVal;
  });

  return (
    <div className={`space-y-2.5 ${className}`}>
      {(label || allowSearch) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {label && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Tag className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{label}</span>
              <span className="text-xs font-mono text-zinc-400">
                ({entries.length})
              </span>
            </div>
          )}

          {allowSearch && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="metadata-search"
                placeholder={isFr ? 'Filtrer les balises...' : 'Filter tags...'}
                className="w-full sm:w-48 h-7.5 pl-8 pr-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-lg focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="py-8 text-center text-xs sm:text-sm font-mono text-zinc-400">
          {isFr ? 'Aucune métadonnée trouvée' : 'No metadata found'}
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-white/5">
          {entries.map(([key, val]) => (
            <div
              key={key}
              data-testid="metadata-item"
              className="flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2 min-w-0 max-w-[45%]">
                <span className="font-mono text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate">
                  {key}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                <span className="font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 truncate select-all">
                  {val !== null && val !== undefined ? String(val) : '—'}
                </span>

                {allowRemove && onRemoveTag && (
                  <button
                    type="button"
                    onClick={() => onRemoveTag(key)}
                    data-testid={`remove-tag-${key}`}
                    title={isFr ? `Supprimer ${key}` : `Remove ${key}`}
                    className="p-0.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors focus:outline-none cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
