import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  validatePdfFile,
  generateRandomPassword,
  getPasswordStrength,
  type PasswordStrength,
} from '@/lib/pdf-protect-logic';

export interface ProtectResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore?: number;
}

export function usePdfProtectWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.pdfProtect;

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<ProtectResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState<boolean>(false);

  // Security parameters
  const [userPassword, setUserPassword] = useState<string>('');
  const [ownerPassword, setOwnerPassword] = useState<string>('');
  const [showUserPassword, setShowUserPassword] = useState<boolean>(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [allowPrinting, setAllowPrinting] = useState<boolean>(true);
  const [allowCopying, setAllowCopying] = useState<boolean>(true);
  const [allowModifying, setAllowModifying] = useState<boolean>(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const file = files[0];

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setPasswordError(null);
    setUserPassword('');
    setOwnerPassword('');
    setShowUserPassword(false);
    setShowOwnerPassword(false);
    setShowAdvanced(false);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && files.length > 0 && !isProcessing) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files.length, isProcessing, handleReset]);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const val = validatePdfFile(selectedFile, isFr);
      if (!val.isValid) {
        setError(val.error);
        return;
      }
      setError(null);
      setPasswordError(null);
      setResult(null);
      setFiles([selectedFile]);
    },
    [isFr]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
    }
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleGeneratePassword = useCallback(() => {
    const pwd = generateRandomPassword(14);
    setUserPassword(pwd);
    setShowUserPassword(true);
    setPasswordError(null);
    setError(null);
  }, []);

  const strength: PasswordStrength | null = getPasswordStrength(userPassword, {
    weak: tc.strengthWeak ?? 'Faible',
    medium: tc.strengthMedium ?? 'Bon',
    strong: tc.strengthStrong ?? 'Très fort',
  });

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;

    if (!userPassword.trim() && !ownerPassword.trim()) {
      setPasswordError(
        tc.errorNoPassword ?? "Veuillez définir un mot de passe d'ouverture."
      );
      passwordInputRef.current?.focus();
      return;
    }

    setError(null);
    setPasswordError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-protect', 'pdf');
      const formData = new FormData();
      formData.append('file', file);
      if (userPassword.trim()) {
        formData.append('userPassword', userPassword.trim());
      }
      if (ownerPassword.trim()) {
        formData.append('ownerPassword', ownerPassword.trim());
      }
      formData.append('allowPrinting', String(allowPrinting));
      formData.append('allowCopying', String(allowCopying));
      formData.append('allowModifying', String(allowModifying));

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pdf-protect'), {
          method: 'POST',
          body: formData,
        }),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: tc.error }));
        throw new Error(json.error ?? tc.error);
      }

      const blob = await res.blob();
      setResult({
        blob,
        filename: file.name.replace(/\.pdf$/i, '_protected.pdf'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (e) {
      trackToolError('pdf-protect', 'general-error');
      setError(e instanceof Error ? e.message : tc.error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    file,
    isProcessing,
    userPassword,
    ownerPassword,
    allowPrinting,
    allowCopying,
    allowModifying,
    tc.errorNoPassword,
    tc.error,
  ]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [result]);

  return {
    file,
    files,
    result,
    error,
    passwordError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    userPassword,
    ownerPassword,
    showUserPassword,
    showOwnerPassword,
    showAdvanced,
    allowPrinting,
    allowCopying,
    allowModifying,
    strength,
    passwordInputRef,
    setUserPassword,
    setOwnerPassword,
    setShowUserPassword,
    setShowOwnerPassword,
    setShowAdvanced,
    setAllowPrinting,
    setAllowCopying,
    setAllowModifying,
    setError,
    setPasswordError,
    setIsNextActionOpen,
    handleReset,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleGeneratePassword,
    handleConvert,
    handleDownload,
  };
}
