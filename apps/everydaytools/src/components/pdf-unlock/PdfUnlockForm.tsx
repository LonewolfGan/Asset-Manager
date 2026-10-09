import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PasswordSecureField } from '@workspace/ui/controls';
import type { PdfUnlockWorkflow } from '@/hooks/use-pdf-unlock-workflow';

interface PdfUnlockFormProps {
  workflow: PdfUnlockWorkflow;
  isFr: boolean;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  passwordHelp?: string;
  unlockingLabel?: string;
}

export function PdfUnlockForm({
  workflow,
  isFr,
  passwordLabel,
  passwordPlaceholder,
  passwordHelp,
  unlockingLabel,
}: PdfUnlockFormProps) {
  const {
    password,
    setPassword,
    error,
    setError,
    isProcessing,
    handleConvert,
  } = workflow;

  return (
    <>
      {/* Filet de télémétrie pendant le déverrouillage */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden pt-6 pb-2 space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Loader2 size={13} className="animate-spin text-[#FF6B35] shrink-0" />
                <span className="font-semibold">
                  {isFr ? 'Déverrouillage en cours' : 'Unlocking in progress'}
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {unlockingLabel ??
                    (isFr
                      ? 'Suppression du mot de passe et levée des restrictions'
                      : 'Removing password and lifting restrictions')}
                </span>
              </div>
              <span className="text-[11px] text-[#FF6B35] font-semibold tracking-wide">
                PDF Decrypt
              </span>
            </div>
            <div className="h-0.5 w-full bg-black/[0.06] dark:bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-[#FF6B35]"
                initial={{ x: '-100%', width: '40%' }}
                animate={{ x: '300%', width: '40%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulaire fluide sans boîtes ni cartes */}
      <div
        className={`py-12 sm:py-16 max-w-lg mx-auto w-full space-y-3 transition-opacity duration-200 ${
          isProcessing ? 'opacity-40 pointer-events-none select-none' : ''
        }`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleConvert();
          }
        }}
      >
        <PasswordSecureField
          label={
            passwordLabel ??
            (isFr
              ? 'Mot de passe du document (si requis)'
              : 'Document password (if required)')
          }
          placeholder={
            passwordPlaceholder ??
            (isFr
              ? 'Laissez vide si non protégé à l’ouverture'
              : 'Leave empty if not protected on open')
          }
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (error) setError(null);
          }}
          isFr={isFr}
          disabled={isProcessing}
          error={error ?? undefined}
          showStrength={false}
          allowGenerate={false}
          allowCopy={false}
        />
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
          {passwordHelp ??
            (isFr
              ? 'Laissez vide si le document a uniquement des restrictions d’impression ou d’édition.'
              : 'Leave blank if the document only has printing or editing restrictions.')}
        </p>
      </div>
    </>
  );
}

