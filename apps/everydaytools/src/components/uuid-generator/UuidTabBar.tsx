import React from 'react';
import { Fingerprint, Search } from 'lucide-react';
import type { TabMode } from '@/hooks/use-uuid-generator-workflow';

interface UuidTabBarProps {
  activeTab: TabMode;
  isFr: boolean;
  onTabChange: (tab: TabMode) => void;
}

export const UuidTabBar: React.FC<UuidTabBarProps> = ({
  activeTab,
  isFr,
  onTabChange,
}) => {
  return (
    <div className="h-12 px-4 sm:px-6 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40 flex items-center justify-between gap-4">
      <div className="flex items-center gap-1 p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800/80">
        <button
          type="button"
          onClick={() => onTabChange('generator')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>{isFr ? 'Générateur' : 'Generator'}</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('inspector')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'inspector'
              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>{isFr ? 'Inspecteur' : 'Inspector'}</span>
        </button>
      </div>
    </div>
  );
};
