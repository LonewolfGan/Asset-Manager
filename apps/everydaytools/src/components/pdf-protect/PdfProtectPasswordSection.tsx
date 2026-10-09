import React from 'react';
import { PasswordSecureField } from '@workspace/ui';
import { useLocale } from '@/hooks/use-locale';
import type { PasswordStrength } from '@/lib/pdf-protect-logic';

interface PdfProtectPasswordSectionProps {
  userPassword: string;
  showUserPassword: boolean;
  passwordError: string | null;
  strength: PasswordStrength | null;
  passwordInputRef: React.RefObject<HTMLInputElement | null>;
  onUserPasswordChange: (val: string) => void;
  onToggleShowUserPassword: () => void;
  onGeneratePassword: () => void;
  onSubmit: () => void;
}

export function PdfProtectPasswordSection({
  userPassword,
  passwordError,
  onUserPasswordChange,
  onGeneratePassword,
}: PdfProtectPasswordSectionProps) {
  const { t, isFr } = useLocale();
  const tc = t.pdfProtect;

  return (
    <div className="space-y-3">
      <PasswordSecureField
        value={userPassword}
        onChange={onUserPasswordChange}
        label={tc.userPasswordLabel ?? "Mot de passe d'ouverture (requis)"}
        placeholder={
          tc.userPasswordPlaceholder ??
          (isFr
            ? 'Entrez le mot de passe requis pour ouvrir le PDF...'
            : 'Enter required password to open the PDF...')
        }
        showStrength={true}
        allowGenerate={true}
        onGenerate={onGeneratePassword}
        allowCopy={true}
        error={passwordError ?? undefined}
        isFr={isFr}
        required
      />
    </div>
  );
}
