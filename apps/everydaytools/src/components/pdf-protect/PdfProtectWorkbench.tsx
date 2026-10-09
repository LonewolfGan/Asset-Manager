import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import type { PasswordStrength } from '@/lib/pdf-protect-logic';
import { PdfProtectProgress } from './PdfProtectProgress';
import { PdfProtectForm } from './PdfProtectForm';

export interface PdfProtectWorkbenchProps {
  file: File;
  isProcessing: boolean;
  isFr?: boolean;
  userPassword: string;
  ownerPassword: string;
  showUserPassword: boolean;
  showOwnerPassword: boolean;
  showAdvanced: boolean;
  allowPrinting: boolean;
  allowCopying: boolean;
  allowModifying: boolean;
  passwordError: string | null;
  strength: PasswordStrength | null;
  passwordInputRef: React.RefObject<HTMLInputElement | null>;
  onReset: () => void;
  onConvert: () => void;
  onUserPasswordChange: (val: string) => void;
  onOwnerPasswordChange: (val: string) => void;
  onToggleShowUserPassword: () => void;
  onToggleShowOwnerPassword: () => void;
  onToggleShowAdvanced: () => void;
  onToggleAllowPrinting: () => void;
  onToggleAllowCopying: () => void;
  onToggleAllowModifying: () => void;
  onGeneratePassword: () => void;
}

export function PdfProtectWorkbench({
  file,
  isProcessing,
  isFr = true,
  userPassword,
  ownerPassword,
  showUserPassword,
  showOwnerPassword,
  showAdvanced,
  allowPrinting,
  allowCopying,
  allowModifying,
  passwordError,
  strength,
  passwordInputRef,
  onReset,
  onConvert,
  onUserPasswordChange,
  onOwnerPasswordChange,
  onToggleShowUserPassword,
  onToggleShowOwnerPassword,
  onToggleShowAdvanced,
  onToggleAllowPrinting,
  onToggleAllowCopying,
  onToggleAllowModifying,
  onGeneratePassword,
}: PdfProtectWorkbenchProps) {
  return (
    <motion.div
      key="staging-protect-workbench"
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
        onReset={onReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        primaryAction={{
          label: isFr ? 'Protéger le document' : 'Protect document',
          loadingLabel: isFr ? 'Chiffrement en cours...' : 'Encrypting...',
          onClick: onConvert,
          isDisabled: isProcessing,
          isLoading: isProcessing,
          icon: ArrowRight,
        }}
      />

      <PdfProtectProgress isProcessing={isProcessing} />

      <PdfProtectForm
        userPassword={userPassword}
        ownerPassword={ownerPassword}
        showUserPassword={showUserPassword}
        showOwnerPassword={showOwnerPassword}
        showAdvanced={showAdvanced}
        allowPrinting={allowPrinting}
        allowCopying={allowCopying}
        allowModifying={allowModifying}
        passwordError={passwordError}
        strength={strength}
        passwordInputRef={passwordInputRef}
        isProcessing={isProcessing}
        onUserPasswordChange={onUserPasswordChange}
        onOwnerPasswordChange={onOwnerPasswordChange}
        onToggleShowUserPassword={onToggleShowUserPassword}
        onToggleShowOwnerPassword={onToggleShowOwnerPassword}
        onToggleShowAdvanced={onToggleShowAdvanced}
        onToggleAllowPrinting={onToggleAllowPrinting}
        onToggleAllowCopying={onToggleAllowCopying}
        onToggleAllowModifying={onToggleAllowModifying}
        onGeneratePassword={onGeneratePassword}
        onSubmit={onConvert}
      />
    </motion.div>
  );
}
