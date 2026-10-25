import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { PdfUnlockForm } from './PdfUnlockForm';

export interface PdfUnlockWorkflow {
  file: File | null;
  password: string;
  showPassword?: boolean;
  isProcessing: boolean;
  isSuccess?: boolean;
  unlockedBlob?: Blob | null;
  error: string | null;
  passwordInputRef?: React.RefObject<HTMLInputElement | null>;
  setPassword: (password: string) => void;
  setShowPassword?: (show: boolean) => void;
  handleReset: () => void;
  handleConvert: () => void;
  handleDownload?: () => void;
  setError?: (err: string | null) => void;
}

interface PdfUnlockWorkbenchProps {
  workflow: PdfUnlockWorkflow;
  isFr: boolean;
  unlockBtnLabel?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  passwordHelp?: string;
  unlockingLabel?: string;
}

export function PdfUnlockWorkbench({
  workflow,
  isFr,
  unlockBtnLabel,
  passwordLabel,
  passwordPlaceholder,
  passwordHelp,
  unlockingLabel,
}: PdfUnlockWorkbenchProps) {
  const { file, isProcessing, handleReset, handleConvert } = workflow;

  if (!file) return null;

  return (
    <motion.div
      key="staging-unlock-workbench"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-4 sm:py-8 flex flex-col max-w-4xl mx-auto"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file.name),
        }}
        onReset={handleReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        primaryAction={{
          label: unlockBtnLabel ?? (isFr ? 'Déverrouiller le PDF' : 'Unlock PDF'),
          loadingLabel: unlockingLabel ?? (isFr ? 'Déverrouillage en cours...' : 'Unlocking...'),
          onClick: handleConvert,
          isDisabled: isProcessing,
          isLoading: isProcessing,
          icon: ArrowRight,
        }}
      />

      <PdfUnlockForm
        workflow={workflow}
        isFr={isFr}
        passwordLabel={passwordLabel}
        passwordPlaceholder={passwordPlaceholder}
        passwordHelp={passwordHelp}
        unlockingLabel={unlockingLabel}
      />
    </motion.div>
  );
}
