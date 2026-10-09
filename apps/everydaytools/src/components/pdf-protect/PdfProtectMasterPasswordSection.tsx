import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface PdfProtectMasterPasswordSectionProps {
  ownerPassword: string;
  showOwnerPassword: boolean;
  showAdvanced: boolean;
  onOwnerPasswordChange: (val: string) => void;
  onToggleShowOwnerPassword: () => void;
  onToggleShowAdvanced: () => void;
}

export function PdfProtectMasterPasswordSection({
  ownerPassword,
  showOwnerPassword,
  showAdvanced,
  onOwnerPasswordChange,
  onToggleShowOwnerPassword,
  onToggleShowAdvanced,
}: PdfProtectMasterPasswordSectionProps) {
  const { t, isFr } = useLocale();
  const tc = t.pdfProtect;

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={onToggleShowAdvanced}
        className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
      >
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
        />
        <span>
          {isFr
            ? 'Option avancée : définir un mot de passe maître (propriétaire)'
            : 'Advanced option: set a master (owner) password'}
        </span>
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden pt-4 space-y-2"
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
                <Key size={16} />
              </div>
              <input
                id="pdf-owner-password"
                type={showOwnerPassword ? 'text' : 'password'}
                placeholder={
                  tc.ownerPasswordPlaceholder ??
                  (isFr
                    ? 'Mot de passe maître pour modifier les permissions ultérieurement...'
                    : 'Master password to modify permissions later...')
                }
                value={ownerPassword}
                onChange={(e) => onOwnerPasswordChange(e.target.value)}
                className="w-full pl-11 pr-12 py-3 text-sm font-mono bg-transparent border border-black/[0.12] dark:border-white/15 rounded-xl text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
              />
              <button
                type="button"
                onClick={onToggleShowOwnerPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                aria-label={
                  isFr
                    ? 'Basculer la visibilité du mot de passe maître'
                    : 'Toggle master password visibility'
                }
              >
                {showOwnerPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
              {isFr
                ? "Le mot de passe maître permet aux administrateurs de réviser ou de lever les restrictions sans communiquer le mot de passe d'ouverture."
                : 'The master password allows administrators to review or lift restrictions without sharing the opening password.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
