import React from 'react';
import type { CheatSheetCategory } from '@/lib/regex-tester-logic';

interface RegexCheatsheetTabProps {
  cheatSheet: CheatSheetCategory[];
  onInsertToken: (token: string) => void;
  isFr: boolean;
}

export function RegexCheatsheetTab({
  cheatSheet,
  onInsertToken,
  isFr,
}: RegexCheatsheetTabProps) {
  return (
    <div className="space-y-4 font-sans text-xs">
      <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
        {isFr
          ? 'Cliquez sur un jeton pour l’ajouter automatiquement à votre expression régulière :'
          : 'Click a token to insert it into your regular expression:'}
      </p>
      {cheatSheet.map((cat) => (
        <div key={cat.title} className="space-y-1">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            {cat.title}
          </div>
          <div className="divide-y divide-zinc-200/60 dark:divide-white/10">
            {cat.items.map((item) => (
              <div
                key={item.token}
                onClick={() => onInsertToken(item.token)}
                className="flex items-center justify-between py-1.5 px-1 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF6B35]">
                    {item.token}
                  </span>
                  <span className="text-zinc-500 text-[11px]">{item.desc}</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400">{item.example}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
