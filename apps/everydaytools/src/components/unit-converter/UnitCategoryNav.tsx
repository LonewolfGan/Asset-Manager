import React from 'react';
import { Ruler } from 'lucide-react';
import { UNIT_CATEGORIES } from '@/config/units.config';
import { CATEGORY_ICONS } from '@/lib/unit-converter-logic';

interface UnitCategoryNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  categoryNames?: Record<string, string>;
}

export function UnitCategoryNav({
  activeCategory,
  onSelectCategory,
  categoryNames,
}: UnitCategoryNavProps) {
  return (
    <div className="w-full flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
      {UNIT_CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICONS[c.id] || Ruler;
        const isActive = activeCategory === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectCategory(c.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 active:scale-95 cursor-pointer ${
              isActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{categoryNames?.[c.id] ?? c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
