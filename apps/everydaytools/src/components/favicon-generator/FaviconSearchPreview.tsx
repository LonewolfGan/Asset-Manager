import React from 'react';

interface FaviconSearchPreviewProps {
  compositedUrl: string;
  isFr: boolean;
}

export function FaviconSearchPreview({ compositedUrl, isFr }: FaviconSearchPreviewProps) {
  return (
    <div className="w-full max-w-xl bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 space-y-3 shadow-md select-none">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1 flex items-center justify-center shrink-0 border border-zinc-200/80 dark:border-white/10">
          {compositedUrl && (
            <img src={compositedUrl} alt="Favicon SERP" className="w-full h-full object-contain" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {isFr ? 'Mon Application' : 'My Application'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-mono">
            https://mon-domaine.com
          </p>
        </div>
      </div>

      <p className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
        {isFr ? 'Mon Application — Le site officiel' : 'My Application — Official Website'}
      </p>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {isFr
          ? 'Découvrez nos solutions et services en ligne. Accès rapide, universel et sécurisé depuis tous vos navigateurs et appareils mobiles.'
          : 'Discover our online solutions and services. Fast, universal, and secure access across all your browsers and mobile devices.'}
      </p>
    </div>
  );
}
