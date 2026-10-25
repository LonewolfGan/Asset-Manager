import { useState, useCallback, useMemo } from 'react';

export interface UsePdfUnlockOptionsParams {
  isFr?: boolean;
}

export function usePdfUnlockOptions(params?: UsePdfUnlockOptionsParams) {
  const isFr = params?.isFr ?? false;

  const [password, setPasswordState] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const error = useMemo<string | null>(() => {
    if (customError) return customError;
    if (password.length > 128) {
      return isFr
        ? 'Le mot de passe ne doit pas dépasser 128 caractères.'
        : 'Password must not exceed 128 characters.';
    }
    return null;
  }, [customError, password, isFr]);

  const isValid = useMemo<boolean>(() => {
    return password.length <= 128 && !customError;
  }, [password, customError]);

  const setPassword = useCallback((val: string) => {
    setPasswordState(val);
    setCustomError(null);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const resetOptions = useCallback(() => {
    setPasswordState('');
    setShowPassword(false);
    setCustomError(null);
  }, []);

  return {
    password,
    showPassword,
    error,
    isValid,
    setPassword,
    setShowPassword,
    toggleShowPassword,
    setError: setCustomError,
    resetOptions,
  };
}
