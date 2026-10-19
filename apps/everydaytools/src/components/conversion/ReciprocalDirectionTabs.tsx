import React from 'react';
import { useLocation } from 'wouter';
import {
  FileSpreadsheet,
  FileCode,
  FileText,
  FileImage,
  Presentation,
} from 'lucide-react';
import {
  getReciprocalTabs,
  getReciprocalPath,
  type ReciprocalFormatType,
} from '@/lib/reciprocal-tools';
import { setHandoffFile, setHandoffText } from '@/lib/file-handoff';

export interface ReciprocalDirectionTabsProps {
  currentSlug: string;
  isFr: boolean;
  getCurrentFile?: () => File | null | undefined;
  getCurrentText?: () => string | null | undefined;
  onSelectDirection?: (slug: string) => void;
  className?: string;
}

function renderFormatIcon(format?: ReciprocalFormatType) {
  if (!format) return null;
  switch (format) {
    case 'csv':
      return <FileSpreadsheet size={14} aria-hidden="true" className="text-emerald-600 dark:text-emerald-400 shrink-0" />;
    case 'json':
      return <FileCode size={14} aria-hidden="true" className="text-amber-600 dark:text-amber-400 shrink-0" />;
    case 'excel':
      return <FileSpreadsheet size={14} aria-hidden="true" className="text-emerald-600 dark:text-emerald-400 shrink-0" />;
    case 'word':
      return <FileText size={14} aria-hidden="true" className="text-blue-600 dark:text-blue-400 shrink-0" />;
    case 'pdf':
      return <FileText size={14} aria-hidden="true" className="text-red-600 dark:text-red-400 shrink-0" />;
    case 'pptx':
      return <Presentation size={14} aria-hidden="true" className="text-orange-600 dark:text-orange-400 shrink-0" />;
    case 'markdown':
      return <FileText size={14} aria-hidden="true" className="text-zinc-600 dark:text-zinc-400 shrink-0" />;
    case 'html':
      return <FileCode size={14} aria-hidden="true" className="text-amber-600 dark:text-amber-400 shrink-0" />;
    case 'text':
      return <FileText size={14} aria-hidden="true" className="text-zinc-600 dark:text-zinc-400 shrink-0" />;
    case 'image':
      return <FileImage size={14} aria-hidden="true" className="text-purple-600 dark:text-purple-400 shrink-0" />;
    default:
      return null;
  }
}

export function ReciprocalDirectionTabs({
  currentSlug,
  isFr,
  getCurrentFile,
  getCurrentText,
  onSelectDirection,
  className = '',
}: ReciprocalDirectionTabsProps) {
  const [location, navigate] = useLocation();
  const tabs = getReciprocalTabs(currentSlug, isFr);

  if (!tabs) return null;

  const [tabA, tabB] = tabs;

  const handleSelectTab = (targetSlug: string) => {
    if (targetSlug === currentSlug) return;

    // 1. Stage file if active
    const file = getCurrentFile?.();
    if (file) {
      setHandoffFile(file, file.name);
    }

    // 2. Stage text if active
    const text = getCurrentText?.();
    if (text && text.trim()) {
      setHandoffText(text);
    }

    // 3. Optional in-page callback
    if (onSelectDirection) {
      onSelectDirection(targetSlug);
    }

    // 4. Seamless SPA navigation to target path
    const targetPath = getReciprocalPath(location, targetSlug);
    navigate(targetPath);
  };

  return (
    <div className={`flex justify-center mb-6 sm:mb-8 ${className}`}>
      <div
        role="tablist"
        aria-label={isFr ? 'Sens de conversion' : 'Conversion direction'}
        className="inline-flex p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-inner"
      >
        {[tabA, tabB].map((tab) => {
          const isActive = tab.isActive;
          return (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectTab(tab.slug)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors transition-transform cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 active:scale-[0.98]'
              }`}
            >
              {renderFormatIcon(tab.sourceFormat)}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

