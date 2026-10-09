import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from 'sonner';
import { verifyHashMatch, type SupportedHashAlgo } from '@/lib/hash-logic';
import {
  generateManifestContent,
  buildJsonExportPayload,
  formatBytes,
} from '@/lib/hash-generator-export';
import {
  calculateCurrentHashes,
  EMPTY_HASHES,
} from '@/lib/hash-calculator-service';

export type InputMode = 'text' | 'file';

export interface FileData {
  name: string;
  type: string;
  size: number;
  buffer: ArrayBuffer;
}

export function useHashGeneratorWorkflow() {
  const { isFr } = useLocale();

  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [inputText, setInputText] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [fileInfo, setFileInfo] = useState<FileData | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [enableHmac, setEnableHmac] = useState<boolean>(false);
  const [hmacSecret, setHmacSecret] = useState<string>('');
  const [compareHash, setCompareHash] = useState<string>('');

  const [hashes, setHashes] =
    useState<Record<SupportedHashAlgo, string>>(EMPTY_HASHES);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textByteLength = useMemo(() => {
    return new TextEncoder().encode(inputText).length;
  }, [inputText]);

  useEffect(() => {
    if (inputMode === 'text') {
      textareaRef.current?.focus();
    }
  }, [inputMode]);

  const calculateHashes = useCallback(async () => {
    try {
      setIsCalculating(true);
      const res = await calculateCurrentHashes({
        inputMode,
        inputText,
        fileBuffer: fileInfo?.buffer ?? null,
        enableHmac,
        hmacSecret,
        isFr,
      });
      setHashes(res.hashes);
      if (res.actionType) {
        trackToolUsed('hash-generator', res.actionType);
      }
    } catch (err) {
      console.error(err);
      trackToolError('hash-generator', 'calculation-error');
      toast.error(
        isFr ? 'Erreur lors du calcul des empreintes' : 'Error computing hashes'
      );
    } finally {
      setIsCalculating(false);
    }
  }, [inputMode, inputText, fileInfo, enableHmac, hmacSecret, isFr]);

  useEffect(() => {
    calculateHashes();
  }, [calculateHashes]);

  const handleTextChange = useCallback(
    (val: string) => {
      setHistory((prev) => [...prev.slice(-30), inputText]);
      setInputText(val);
    },
    [inputText]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setInputText(last);
    toast.info(isFr ? 'Saisie restaurée' : 'Input restored');
  }, [history, isFr]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (
          inputMode === 'text' &&
          document.activeElement?.tagName !== 'INPUT' &&
          history.length > 0
        ) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, history.length, inputMode]);

  const handleClear = useCallback(() => {
    if (inputMode === 'text') {
      if (inputText) {
        setHistory((prev) => [...prev.slice(-30), inputText]);
        setInputText('');
      }
    } else {
      setFileInfo(null);
    }
    setCompareHash('');
    toast.info(isFr ? 'Atelier réinitialisé' : 'Workspace reset');
  }, [inputMode, inputText, isFr]);

  const handleProcessFile = useCallback(
    async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        setFileInfo({
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          buffer,
        });
        setInputMode('file');
        toast.success(
          isFr
            ? `Fichier ${file.name} chargé (${formatBytes(file.size, isFr)})`
            : `File ${file.name} loaded (${formatBytes(file.size, isFr)})`
        );
      } catch {
        toast.error(
          isFr ? 'Échec de la lecture du fichier' : 'Failed to read file'
        );
      }
    },
    [isFr]
  );

  const compareResult = useMemo(() => {
    return verifyHashMatch(compareHash, hashes);
  }, [compareHash, hashes]);

  const manifestContent = useMemo(() => {
    const sourceLabel =
      inputMode === 'file' && fileInfo
        ? fileInfo.name
        : isFr
        ? 'Texte UTF-8'
        : 'UTF-8 Text';

    return generateManifestContent({
      sourceLabel,
      isFr,
      enableHmac,
      hmacSecret,
      isUppercase,
      hashes,
    });
  }, [inputMode, fileInfo, isFr, enableHmac, hmacSecret, isUppercase, hashes]);

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(manifestContent);
      toast.success(isFr ? 'Manifeste complet copié' : 'Full manifest copied');
      trackToolUsed('hash-generator', 'copy-manifest');
    } catch {
      toast.error(
        isFr
          ? 'Impossible de copier le manifeste'
          : 'Could not copy manifest'
      );
    }
  }, [manifestContent, isFr]);

  const handleDownloadManifest = useCallback(() => {
    const blob = new Blob([manifestContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      inputMode === 'file' && fileInfo
        ? `${fileInfo.name}.checksums.txt`
        : 'checksums.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(
      isFr
        ? 'Manifeste checksums téléchargé'
        : 'Checksums manifest downloaded'
    );
    trackToolUsed('hash-generator', 'download-manifest');
  }, [manifestContent, inputMode, fileInfo, isFr]);

  const handleExportJson = useCallback(async () => {
    const payload = buildJsonExportPayload({
      source: inputMode === 'file' && fileInfo ? fileInfo.name : 'text',
      isHmac: enableHmac && !!hmacSecret,
      isUppercase,
      hashes,
    });
    const jsonStr = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(jsonStr);
      toast.success(isFr ? 'Empreintes JSON copiées' : 'JSON hashes copied');
      trackToolUsed('hash-generator', 'export-json');
    } catch {
      toast.error(isFr ? 'Impossible de copier le JSON' : 'Could not copy JSON');
    }
  }, [inputMode, fileInfo, enableHmac, hmacSecret, isUppercase, hashes, isFr]);

  const hasData = inputMode === 'text' ? !!inputText : !!fileInfo;

  return {
    inputMode,
    setInputMode,
    inputText,
    handleTextChange,
    history,
    handleUndo,
    fileInfo,
    setFileInfo,
    isDragOver,
    setIsDragOver,
    isUppercase,
    setIsUppercase,
    enableHmac,
    setEnableHmac,
    hmacSecret,
    setHmacSecret,
    compareHash,
    setCompareHash,
    compareResult,
    hashes,
    isCalculating,
    fileInputRef,
    textareaRef,
    textByteLength,
    hasData,
    manifestContent,
    handleClear,
    handleProcessFile,
    handleCopyAll,
    handleDownloadManifest,
    handleExportJson,
  };
}
