import React from 'react';

interface FaviconMobilePreviewProps {
  compositedUrl: string;
  isFr: boolean;
}

export function FaviconMobilePreview({ compositedUrl, isFr }: FaviconMobilePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-6 select-none">
      <div className="w-36 h-36 flex items-center justify-center drop-shadow-xl transition-all">
        {compositedUrl ? (
          <img
            src={compositedUrl}
            alt={isFr ? 'Icône Mobile' : 'Mobile Icon'}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 rounded-[22%]" />
        )}
      </div>
      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {isFr ? 'Mon Application' : 'My Application'}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          {isFr ? 'Apple Touch Icon (180×180 px) & Manifest Android PWA' : 'Apple Touch Icon (180×180 px) & Android PWA Manifest'}
        </p>
      </div>
    </div>
  );
}
