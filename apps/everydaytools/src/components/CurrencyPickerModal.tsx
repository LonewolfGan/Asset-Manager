import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import { CURRENCIES } from '@/config/currencies.config';
import CurrencyFlag from '@/components/CurrencyFlag';
import { getCurrencyMeta } from '@/lib/currency-meta';
import { useLocale } from '@/hooks/use-locale';

interface CurrencyPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onSelect: (code: string) => void;
  title: string;
  searchPlaceholder?: string;
}

const MAJOR_CURRENCIES = new Set([
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'CHF',
  'AUD',
  'CNY',
  'INR',
  'BRL',
  'SGD',
  'AED',
]);

export default function CurrencyPickerModal({
  isOpen,
  onClose,
  selectedCurrency,
  onSelect,
  title,
  searchPlaceholder,
}: CurrencyPickerModalProps) {
  const { isFr } = useLocale();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'major'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultPlaceholder = isFr ? 'Rechercher une devise ou un pays...' : 'Search currency or country...';
  const resolvedPlaceholder = searchPlaceholder || defaultPlaceholder;

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setActiveTab('all');
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCurrencies = useMemo(() => {
    const q = search.trim().toLowerCase();

    return CURRENCIES.filter((c) => {
      if (activeTab === 'major' && !MAJOR_CURRENCIES.has(c.code)) {
        return false;
      }
      if (!q) return true;

      const meta = getCurrencyMeta(c.code);
      const codeMatch = c.code.toLowerCase().includes(q);
      const nameMatch = c.name.toLowerCase().includes(q);
      const symbolMatch = c.symbol.toLowerCase().includes(q);
      const frNameMatch = meta?.nameFr.toLowerCase().includes(q) ?? false;
      const countryMatch =
        meta?.countriesFr.some((country) => country.toLowerCase().includes(q)) ?? false;

      return codeMatch || nameMatch || symbolMatch || frNameMatch || countryMatch;
    });
  }, [search, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl overflow-hidden scale-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="currency-picker-title"
      >
        {/* Header (Clean, without marketing filler text) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/60">
          <h3 id="currency-picker-title" className="text-base font-semibold tracking-tight">
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

        {/* Search Bar & Neutral Filter Tabs */}
        <div className="p-3 sm:p-4 space-y-2.5 border-b border-border/60 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={resolvedPlaceholder}
              className="w-full pl-9 pr-8 py-2.5 text-sm bg-background border border-border/80 rounded-xl placeholder:text-muted-foreground focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
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

          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isFr ? 'Toutes' : 'All'} ({CURRENCIES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('major')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'major'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isFr ? 'Majeures' : 'Major'}
            </button>
          </div>
        </div>

        {/* Currency List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-border/30">
          {filteredCurrencies.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {isFr ? `Aucune devise trouvée pour « ${search} »` : `No currencies found for "${search}"`}
            </div>
          ) : (
            filteredCurrencies.map((c) => {
              const isSelected = c.code === selectedCurrency;
              const meta = getCurrencyMeta(c.code);
              return (
                <button
                  key={c.code}
                  onClick={() => onSelect(c.code)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800/90 text-foreground font-medium'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CurrencyFlag code={c.code} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">
                          {c.code}
                        </span>
                        {c.symbol && (
                          <span className="font-mono text-xs text-muted-foreground/80">
                            ({c.symbol})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {isFr ? (meta?.nameFr || c.name) : c.name}
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
