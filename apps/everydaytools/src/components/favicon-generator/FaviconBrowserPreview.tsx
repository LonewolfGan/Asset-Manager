import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaviconBrowserPreviewProps {
  compositedUrl: string;
  browserTheme: 'light' | 'dark';
  isFr: boolean;
}

export function FaviconBrowserPreview({
  compositedUrl,
  browserTheme,
  isFr,
}: FaviconBrowserPreviewProps) {
  return (
    <div
      className={cn(
        'w-full max-w-2xl rounded-xl border transition-colors overflow-hidden shadow-md',
        browserTheme === 'light'
          ? 'bg-[#EAEAEA] border-zinc-300 text-zinc-900'
          : 'bg-[#222225] border-zinc-700/80 text-zinc-100'
      )}
    >
      {/* Barre d'onglets */}
      <div className="px-3.5 pt-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Onglet actif avec le favicon en situation */}
        <div
          className={cn(
            'px-3.5 py-2 rounded-t-lg text-xs sm:text-sm flex items-center gap-2.5 max-w-[260px] select-none border-t border-x',
            browserTheme === 'light'
              ? 'bg-white border-zinc-300 text-zinc-900 shadow-xs font-medium'
              : 'bg-[#2e2e32] border-zinc-700 text-zinc-100 font-medium'
          )}
        >
          {compositedUrl ? (
            <img src={compositedUrl} alt="Favicon" className="w-5 h-5 object-contain shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-xs bg-zinc-300 dark:bg-zinc-700 shrink-0" />
          )}
          <span className="truncate">{isFr ? 'Mon Application Web' : 'My Web Application'}</span>
          <span className="text-xs opacity-40 ml-auto hover:opacity-100 cursor-pointer">×</span>
        </div>

        <span className="text-xs opacity-40 truncate hidden sm:inline pl-1 select-none">
          {isFr ? 'Documentation API' : 'API Documentation'}
        </span>
      </div>

      {/* Barre d'adresse */}
      <div
        className={cn(
          'px-3.5 py-2.5 border-t flex items-center justify-center',
          browserTheme === 'light' ? 'bg-white border-zinc-200' : 'bg-[#2e2e32] border-zinc-700/60'
        )}
      >
        <div
          className={cn(
            'w-full py-1.5 px-4 rounded-md text-xs font-mono flex items-center justify-center gap-2 select-none',
            browserTheme === 'light'
              ? 'bg-zinc-100 text-zinc-700 border border-zinc-200/60'
              : 'bg-[#1b1b1d] text-zinc-300 border border-zinc-700/60'
          )}
        >
          <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>https://mon-domaine.com</span>
        </div>
      </div>

      {/* Surface intérieure d'onglet : Vitrine d'accueil avec grand aperçu Speed Dial */}
      <div
        className={cn(
          'py-10 px-6 select-none flex flex-col items-center justify-center gap-6',
          browserTheme === 'light' ? 'bg-zinc-50/60' : 'bg-[#18181b]'
        )}
      >
        <div className="flex flex-col items-center gap-2.5">
          <div
            className={cn(
              'w-16 h-16 p-2 rounded-2xl flex items-center justify-center shadow-xs border transition-transform hover:scale-105',
              browserTheme === 'light'
                ? 'bg-white border-zinc-200 shadow-zinc-200/50'
                : 'bg-zinc-900 border-zinc-700/80 shadow-black/40'
            )}
          >
            {compositedUrl ? (
              <img src={compositedUrl} alt="Favicon 64px" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full rounded-md bg-zinc-200 dark:bg-zinc-700" />
            )}
          </div>
          <div className="text-center">
            <p
              className={cn(
                'text-xs font-semibold',
                browserTheme === 'light' ? 'text-zinc-800' : 'text-zinc-200'
              )}
            >
              {isFr ? 'Mon Application Web' : 'My Web Application'}
            </p>
            <p
              className={cn(
                'text-[10px] font-mono',
                browserTheme === 'light' ? 'text-zinc-500' : 'text-zinc-400'
              )}
            >
              {isFr ? 'Aperçu Speed Dial (64×64 px)' : 'Speed Dial Preview (64×64 px)'}
            </p>
          </div>
        </div>

        {/* Barre de favoris simulée (16px) */}
        <div
          className={cn(
            'px-3 py-1.5 rounded-md flex items-center gap-2 border text-xs',
            browserTheme === 'light'
              ? 'bg-white border-zinc-200 text-zinc-700'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          )}
        >
          {compositedUrl ? (
            <img src={compositedUrl} alt="Favicon 16px" className="w-4 h-4 object-contain shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-xs bg-zinc-300 dark:bg-zinc-700 shrink-0" />
          )}
          <span className="truncate text-[11px] font-medium">
            {isFr ? 'Favori : Mon Application' : 'Bookmark: My Application'}
          </span>
        </div>
      </div>
    </div>
  );
}
