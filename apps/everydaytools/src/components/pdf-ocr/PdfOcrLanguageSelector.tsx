import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import type { SupportedLanguage } from '@/lib/pdf-ocr-logic';

interface PdfOcrLanguageSelectorProps {
  lang: string;
  onLangChange: (lang: string) => void;
  disabled?: boolean;
  supportedLanguages: SupportedLanguage[];
  ariaLabel?: string;
}

export function PdfOcrLanguageSelector({
  lang,
  onLangChange,
  disabled = false,
  supportedLanguages,
  ariaLabel = 'Langue du document',
}: PdfOcrLanguageSelectorProps) {
  return (
    <div className="flex items-center justify-center pt-1 pb-2">
      <div className="relative inline-flex items-center">
        <Globe
          size={13}
          className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none"
        />
        <select
          value={lang}
          onChange={(e) => onLangChange(e.target.value)}
          disabled={disabled}
          aria-label={ariaLabel}
          className="h-10 pl-9 pr-8 rounded-full text-xs font-medium bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.09] text-zinc-700 dark:text-zinc-300 border border-black/[0.08] dark:border-white/10 hover:border-black/15 dark:hover:border-white/20 transition-all cursor-pointer appearance-none focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 disabled:opacity-50 disabled:pointer-events-none"
        >
          {supportedLanguages.map((l) => (
            <option
              key={l.code}
              value={l.code}
              className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
            >
              {l.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-3 text-zinc-400 dark:text-zinc-500 pointer-events-none"
        />
      </div>
    </div>
  );
}
