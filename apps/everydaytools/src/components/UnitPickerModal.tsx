import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import { UnitDef } from '@/config/units.config';
import { useLocale } from '@/hooks/use-locale';

interface UnitPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: UnitDef[];
  selectedUnit: string;
  onSelect: (unitId: string) => void;
  title: string;
}

export default function UnitPickerModal({
  isOpen,
  onClose,
  units,
  selectedUnit,
  onSelect,
  title,
}: UnitPickerModalProps) {
  const { t, isFr } = useLocale();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredUnits = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return units;

    return units.filter((u) => {
      const localizedName = t.unitConverter?.unitNames?.[u.id] ?? u.name;
      const symbolMatch = u.symbol.toLowerCase().includes(q);
      const idMatch = u.id.toLowerCase().includes(q);
      const nameMatch = u.name.toLowerCase().includes(q);
      const localMatch = localizedName.toLowerCase().includes(q);

      return symbolMatch || idMatch || nameMatch || localMatch;
    });
  }, [units, search, t]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl overflow-hidden scale-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unit-picker-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <h3 id="unit-picker-title" className="text-base font-semibold tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label={isFr ? "Fermer" : "Close"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border/60 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isFr ? "Rechercher une unité ou un symbole..." : "Search unit or symbol..."}
              className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border/80 rounded-xl placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 p-1 text-muted-foreground hover:text-foreground"
                aria-label={isFr ? "Effacer la recherche" : "Clear search"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Units list */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/30">
          {filteredUnits.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              {isFr ? `Aucune unité trouvée pour « ${search} »` : `No units found for "${search}"`}
            </div>
          ) : (
            filteredUnits.map((u) => {
              const isSelected = u.id === selectedUnit;
              const localizedName = t.unitConverter?.unitNames?.[u.id] ?? u.name;

              return (
                <button
                  key={u.id}
                  onClick={() => onSelect(u.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800/90 text-foreground font-medium'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-7 rounded-lg font-mono font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-border/60 flex items-center justify-center shrink-0">
                      {u.symbol}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {localizedName}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {u.name}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
