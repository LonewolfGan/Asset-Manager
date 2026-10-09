import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Search, X, LayoutGrid } from 'lucide-react';
import { LibraryIcon } from '@/lib/qr-icons';
import { IconCategory } from '@/hooks/use-qr-icon-picker';

export interface QrIconPickerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isFr: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  category: IconCategory;
  setCategory: (c: IconCategory) => void;
  icons: LibraryIcon[];
  activePresetId: string | null;
  onSelectIcon: (id: string) => void;
}

export function QrIconPickerModal({
  isOpen,
  onOpenChange,
  isFr,
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  icons,
  activePresetId,
  onSelectIcon,
}: QrIconPickerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6 gap-5 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xl">
        <DialogHeader className="flex flex-col gap-1 pb-1">
          <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#FF6B35]" />
              <span>{isFr ? "Bibliothèque d'icônes vectorielles" : 'Vector Icon Library'}</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-400 font-normal">
              {icons.length} {isFr ? 'icônes' : 'icons'}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {isFr
              ? "Sélectionnez une icône pour l'insérer au centre de votre code QR."
              : 'Select a vector icon to center in your QR code.'}
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar & Category Filter Pills */}
        <div className="flex flex-col gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isFr
                  ? 'Rechercher une icône (ex: WhatsApp, Instagram, Wi-Fi, Boutique, Star...)'
                  : 'Search icons (e.g. WhatsApp, Instagram, Wi-Fi, Store, Star...)'
              }
              className="h-10 w-full pl-10 pr-9 rounded-xl font-mono text-xs bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: isFr ? 'Toutes' : 'All' },
              { id: 'social', label: isFr ? 'Réseaux & Messages' : 'Social & Chat' },
              { id: 'web', label: isFr ? 'Web & Contact' : 'Web & Contact' },
              { id: 'business', label: isFr ? 'Commerce & Pro' : 'Business' },
              { id: 'symbols', label: isFr ? 'Symboles & Médias' : 'Symbols & Media' },
            ].map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as IconCategory)}
                  className={`h-7 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 min-h-[300px] max-h-[460px]">
          {icons.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-12 text-center">
              <p className="text-xs font-mono text-zinc-400">
                {isFr ? 'Aucune icône trouvée pour cette recherche.' : 'No icons found matching your search.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {icons.map((item) => {
                const isCurrent = activePresetId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectIcon(item.id);
                      onOpenChange(false);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer text-center group ${
                      isCurrent
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]'
                        : 'border-zinc-200/70 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 mb-1.5 transition-transform group-hover:scale-110"
                      dangerouslySetInnerHTML={{ __html: item.path }}
                    />
                    <span className="text-[11px] font-mono leading-tight truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
