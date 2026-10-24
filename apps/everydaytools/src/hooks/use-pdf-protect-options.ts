import { useState, useCallback, useMemo } from 'react';
import {
  generateRandomPassword,
  getPasswordStrength,
  type PasswordStrength,
  type PasswordStrengthLabels,
} from '@/lib/pdf-protect-logic';

export interface UsePdfProtectOptionsParams {
  isFr?: boolean;
  strengthLabels?: PasswordStrengthLabels;
}

export function usePdfProtectOptions(params?: UsePdfProtectOptionsParams) {
  const isFr = params?.isFr ?? false;

  const [userPassword, setUserPasswordState] = useState<string>('');
  const [ownerPassword, setOwnerPasswordState] = useState<string>('');
  const [allowPrinting, setAllowPrinting] = useState<boolean>(true);
  const [allowCopying, setAllowCopying] = useState<boolean>(true);
  const [allowModifying, setAllowModifying] = useState<boolean>(false);
  const [showUserPassword, setShowUserPassword] = useState<boolean>(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const passwordError = useMemo<string | null>(() => {
    if (customError) return customError;
    if (userPassword && ownerPassword && userPassword === ownerPassword) {
      return isFr
        ? 'Le mot de passe utilisateur et le mot de passe propriétaire ne peuvent pas être identiques.'
        : 'User password and owner password cannot be identical.';
    }
    return null;
  }, [customError, userPassword, ownerPassword, isFr]);

  const isValid = useMemo<boolean>(() => {
    const hasPassword = Boolean(userPassword.trim() || ownerPassword.trim());
    const isDistinct = !userPassword || !ownerPassword || userPassword !== ownerPassword;
    return hasPassword && isDistinct && !customError;
  }, [userPassword, ownerPassword, customError]);

  const strength: PasswordStrength | null = useMemo(() => {
    return getPasswordStrength(userPassword, params?.strengthLabels);
  }, [userPassword, params?.strengthLabels]);

  const setUserPassword = useCallback((val: string) => {
    setUserPasswordState(val);
    setCustomError(null);
  }, []);

  const setOwnerPassword = useCallback((val: string) => {
    setOwnerPasswordState(val);
    setCustomError(null);
  }, []);

  const toggleAllowPrinting = useCallback(() => {
    setAllowPrinting((prev) => !prev);
  }, []);

  const toggleAllowCopying = useCallback(() => {
    setAllowCopying((prev) => !prev);
  }, []);

  const toggleAllowModifying = useCallback(() => {
    setAllowModifying((prev) => !prev);
  }, []);

  const toggleShowUserPassword = useCallback(() => {
    setShowUserPassword((prev) => !prev);
  }, []);

  const toggleShowOwnerPassword = useCallback(() => {
    setShowOwnerPassword((prev) => !prev);
  }, []);

  const toggleShowAdvanced = useCallback(() => {
    setShowAdvanced((prev) => !prev);
  }, []);

  const handleGeneratePassword = useCallback(() => {
    const pwd = generateRandomPassword(14);
    setUserPasswordState(pwd);
    setShowUserPassword(true);
    setCustomError(null);
  }, []);

  const resetOptions = useCallback(() => {
    setUserPasswordState('');
    setOwnerPasswordState('');
    setAllowPrinting(true);
    setAllowCopying(true);
    setAllowModifying(false);
    setShowUserPassword(false);
    setShowOwnerPassword(false);
    setShowAdvanced(false);
    setCustomError(null);
  }, []);

  return {
    userPassword,
    ownerPassword,
    allowPrinting,
    allowCopying,
    allowModifying,
    showUserPassword,
    showOwnerPassword,
    showAdvanced,
    isValid,
    passwordError,
    strength,
    setUserPassword,
    setOwnerPassword,
    toggleAllowPrinting,
    toggleAllowCopying,
    toggleAllowModifying,
    toggleShowUserPassword,
    toggleShowOwnerPassword,
    toggleShowAdvanced,
    handleGeneratePassword,
    resetOptions,
    setPasswordError: setCustomError,
  };
}
