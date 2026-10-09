import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import {
  decodeJwt,
  verifyJwtHmac,
  cleanJwtToken,
  DecodedJwt,
} from '@/lib/jwt-logic';
import {
  getJwtByteSize,
  buildJwtExportPayload,
  triggerJwtDownload,
  JwtExportMode,
} from '@/lib/jwt-export-logic';

export interface VerificationState {
  status: 'idle' | 'valid' | 'invalid' | 'unsupported';
  message?: string;
}

export function useJwtDecoderWorkflow(isFr: boolean) {
  const [tokenInput, setTokenInput] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [isBase64Secret, setIsBase64Secret] = useState<boolean>(false);
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Undo history stack (up to 25 entries)
  const [history, setHistory] = useState<string[]>([]);

  // Verification state
  const [verificationResult, setVerificationResult] = useState<VerificationState>({
    status: 'idle',
  });

  // Reactive JWT decoding
  const decoded: DecodedJwt = useMemo(() => {
    return decodeJwt(tokenInput, isFr);
  }, [tokenInput, isFr]);

  // Update token with history tracking
  const handleUpdateToken = useCallback((newVal: string) => {
    setHistory((prev) => [...prev.slice(-25), tokenInput]);
    setTokenInput(newVal);
  }, [tokenInput]);

  // Undo action
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setTokenInput(last);
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  }, [history, isFr]);

  // Global Ctrl+Z keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (history.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, history.length]);

  // Clean 'Bearer ' prefix and whitespace
  const handleCleanToken = useCallback(() => {
    const cleaned = cleanJwtToken(tokenInput);
    if (cleaned !== tokenInput) {
      handleUpdateToken(cleaned);
      toast.success(isFr ? 'Jeton nettoyé' : 'Token cleaned');
    } else {
      toast.info(isFr ? 'Jeton déjà normalisé' : 'Token already normalized');
    }
  }, [tokenInput, handleUpdateToken, isFr]);

  // Reset workspace
  const handleClear = useCallback(() => {
    handleUpdateToken('');
    setSecretKey('');
    setVerificationResult({ status: 'idle' });
    toast.info(isFr ? 'Atelier réinitialisé' : 'Workspace reset');
  }, [handleUpdateToken, isFr]);

  // File upload reader (.jwt or .txt)
  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        handleUpdateToken(cleanJwtToken(content));
        toast.success(isFr ? `Fichier ${file.name} chargé` : `File ${file.name} loaded`);
      }
    };
    reader.readAsText(file);
  }, [handleUpdateToken, isFr]);

  // Native HMAC verification with Web Crypto API
  useEffect(() => {
    let isCancelled = false;

    if (!decoded.valid || !tokenInput.trim()) {
      setVerificationResult({ status: 'idle' });
      return;
    }

    const alg = decoded.algorithm;
    if (!alg) {
      setVerificationResult({ status: 'idle' });
      return;
    }

    if (!['HS256', 'HS384', 'HS512'].includes(alg)) {
      setVerificationResult({
        status: 'unsupported',
        message: `${alg} (${isFr ? 'Clé publique asymétrique requise' : 'Asymmetric public key required'})`,
      });
      return;
    }

    if (!secretKey.trim()) {
      setVerificationResult({
        status: 'idle',
        message: isFr ? 'Entrez une clé secrète' : 'Enter a secret key',
      });
      return;
    }

    verifyJwtHmac(tokenInput, secretKey, isBase64Secret, isFr).then((res) => {
      if (isCancelled) return;
      if (res.verified) {
        setVerificationResult({
          status: 'valid',
          message: isFr ? 'Signature authentique' : 'Valid signature',
        });
      } else {
        setVerificationResult({
          status: 'invalid',
          message: res.error || (isFr ? 'Signature non concordante' : 'Invalid signature'),
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [tokenInput, secretKey, isBase64Secret, decoded.valid, decoded.algorithm, isFr]);

  // File downloads
  const handleDownload = useCallback((mode: JwtExportMode | 'token') => {
    if (mode === 'token') {
      const cleaned = cleanJwtToken(tokenInput);
      triggerJwtDownload(cleaned, 'token.jwt', 'text/plain');
      toast.success(isFr ? 'token.jwt téléchargé' : 'token.jwt downloaded');
    } else {
      const content = buildJwtExportPayload(decoded, mode);
      const filename = mode === 'full' ? 'jwt-decoded.json' : `jwt-${mode}.json`;
      triggerJwtDownload(content, filename, 'application/json');
      toast.success(isFr ? `${filename} téléchargé` : `${filename} downloaded`);
    }
    trackToolUsed('jwt-decoder', 'download');
  }, [tokenInput, decoded, isFr]);

  const stats = useMemo(() => getJwtByteSize(tokenInput), [tokenInput]);
  const hasToken = tokenInput.trim().length > 0;

  return {
    tokenInput,
    secretKey,
    setSecretKey,
    isBase64Secret,
    setIsBase64Secret,
    showSecret,
    setShowSecret,
    isDragging,
    setIsDragging,
    history,
    verificationResult,
    decoded,
    hasToken,
    stats,
    handleUpdateToken,
    handleUndo,
    handleCleanToken,
    handleClear,
    handleFileUpload,
    handleDownload,
  };
}
