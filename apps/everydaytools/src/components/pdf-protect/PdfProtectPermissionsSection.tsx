import React from 'react';
import { Printer, Copy, FileEdit } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface PdfProtectPermissionsSectionProps {
  allowPrinting: boolean;
  allowCopying: boolean;
  allowModifying: boolean;
  onToggleAllowPrinting: () => void;
  onToggleAllowCopying: () => void;
  onToggleAllowModifying: () => void;
}

export function PdfProtectPermissionsSection({
  allowPrinting,
  allowCopying,
  allowModifying,
  onToggleAllowPrinting,
  onToggleAllowCopying,
  onToggleAllowModifying,
}: PdfProtectPermissionsSectionProps) {
  const { t, isFr } = useLocale();
  const tc = t.pdfProtect;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.08] dark:border-white/10">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-950 dark:text-zinc-50 font-semibold">
            {tc.permissionsTitle ??
              (isFr
                ? 'Droits et restrictions accordés aux lecteurs'
                : 'Permissions and restrictions granted to readers')}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {isFr
              ? 'Configurez les actions possibles après ouverture du document'
              : 'Configure allowed actions after opening the document'}
          </p>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          PDF 2.0
        </span>
      </div>

      <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
        {/* Ligne 1 : Impression */}
        <div
          onClick={onToggleAllowPrinting}
          className="flex items-center justify-between py-3.5 hover:bg-black/[0.015] dark:hover:bg-white/[0.015] px-2 rounded-lg transition-colors cursor-pointer group select-none"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <Printer
              size={16}
              className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {tc.allowPrinting ?? (isFr ? "Autoriser l'impression" : 'Allow printing')}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {isFr
                  ? "Permet l'impression physique et virtuelle du document"
                  : 'Allows physical and virtual printing of the document'}
              </p>
            </div>
          </div>

          <div
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ml-4 ${
              allowPrinting ? 'bg-[#FF6B35]' : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                allowPrinting ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Ligne 2 : Extraction */}
        <div
          onClick={onToggleAllowCopying}
          className="flex items-center justify-between py-3.5 hover:bg-black/[0.015] dark:hover:bg-white/[0.015] px-2 rounded-lg transition-colors cursor-pointer group select-none"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <Copy
              size={16}
              className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {tc.allowCopying ??
                  (isFr ? "Autoriser la copie & l'extraction" : 'Allow copying & extraction')}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {isFr
                  ? "Permet la sélection de texte et l'extraction d'images"
                  : 'Allows text selection and image extraction'}
              </p>
            </div>
          </div>

          <div
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ml-4 ${
              allowCopying ? 'bg-[#FF6B35]' : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                allowCopying ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Ligne 3 : Modification */}
        <div
          onClick={onToggleAllowModifying}
          className="flex items-center justify-between py-3.5 hover:bg-black/[0.015] dark:hover:bg-white/[0.015] px-2 rounded-lg transition-colors cursor-pointer group select-none"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <FileEdit
              size={16}
              className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {tc.allowModifying ?? (isFr ? 'Autoriser les modifications' : 'Allow modifications')}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {isFr
                  ? 'Permet le remplissage de formulaires, annotations et modifications de pages'
                  : 'Allows form filling, annotations, and page modifications'}
              </p>
            </div>
          </div>

          <div
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ml-4 ${
              allowModifying ? 'bg-[#FF6B35]' : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                allowModifying ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
