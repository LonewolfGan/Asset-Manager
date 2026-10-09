import React from 'react';
import type { PasswordStrength } from '@/lib/pdf-protect-logic';
import { PdfProtectPasswordSection } from './PdfProtectPasswordSection';
import { PdfProtectPermissionsSection } from './PdfProtectPermissionsSection';
import { PdfProtectMasterPasswordSection } from './PdfProtectMasterPasswordSection';

interface PdfProtectFormProps {
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
  isProcessing: boolean;
  onUserPasswordChange: (val: string) => void;
  onOwnerPasswordChange: (val: string) => void;
  onToggleShowUserPassword: () => void;
  onToggleShowOwnerPassword: () => void;
  onToggleShowAdvanced: () => void;
  onToggleAllowPrinting: () => void;
  onToggleAllowCopying: () => void;
  onToggleAllowModifying: () => void;
  onGeneratePassword: () => void;
  onSubmit: () => void;
}

export function PdfProtectForm({
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
  isProcessing,
  onUserPasswordChange,
  onOwnerPasswordChange,
  onToggleShowUserPassword,
  onToggleShowOwnerPassword,
  onToggleShowAdvanced,
  onToggleAllowPrinting,
  onToggleAllowCopying,
  onToggleAllowModifying,
  onGeneratePassword,
  onSubmit,
}: PdfProtectFormProps) {
  return (
    <div
      className={`py-8 space-y-10 transition-opacity duration-200 ${
        isProcessing ? 'opacity-40 pointer-events-none select-none' : ''
      }`}
    >
      <PdfProtectPasswordSection
        userPassword={userPassword}
        showUserPassword={showUserPassword}
        passwordError={passwordError}
        strength={strength}
        passwordInputRef={passwordInputRef}
        onUserPasswordChange={onUserPasswordChange}
        onToggleShowUserPassword={onToggleShowUserPassword}
        onGeneratePassword={onGeneratePassword}
        onSubmit={onSubmit}
      />

      <PdfProtectPermissionsSection
        allowPrinting={allowPrinting}
        allowCopying={allowCopying}
        allowModifying={allowModifying}
        onToggleAllowPrinting={onToggleAllowPrinting}
        onToggleAllowCopying={onToggleAllowCopying}
        onToggleAllowModifying={onToggleAllowModifying}
      />

      <PdfProtectMasterPasswordSection
        ownerPassword={ownerPassword}
        showOwnerPassword={showOwnerPassword}
        showAdvanced={showAdvanced}
        onOwnerPasswordChange={onOwnerPasswordChange}
        onToggleShowOwnerPassword={onToggleShowOwnerPassword}
        onToggleShowAdvanced={onToggleShowAdvanced}
      />
    </div>
  );
}
