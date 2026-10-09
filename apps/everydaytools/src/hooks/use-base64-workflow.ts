import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import {
  encodeBase64,
  decodeBase64,
  fileToBase64,
  base64ToBlob,
  applyLineBreaks,
  detectBase64Binary,
  formatBytes,
  type ChunkSize,
  type DetectedBase64Binary,
} from '@/lib/base64-logic';

export type Mode = 'encode' | 'decode';

export interface UseBase64WorkflowOptions {
  isFr: boolean;
}

export function useBase64Workflow({ isFr }: UseBase64WorkflowOptions) {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Options
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [stripPadding, setStripPadding] = useState<boolean>(false);
  const [dataUriPrefix, setDataUriPrefix] = useState<boolean>(false);
  const [chunkSize, setChunkSize] = useState<ChunkSize>(0);
  const [wordWrap, setWordWrap] = useState<boolean>(true);

  // File state
  const [fileInfo, setFileInfo] = useState<{ name: string; type: string; size: number } | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Tabs
  const [outputTab, setOutputTab] = useState<'text' | 'preview'>('text');
  const [history, setHistory] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectedBinary: DetectedBase64Binary | null = useMemo(() => {
    return detectBase64Binary(mode === 'encode' ? output : input);
  }, [mode, input, output]);

  useEffect(() => {
    if (detectedBinary?.isImage && mode === 'decode') {
      setOutputTab('preview');
    } else {
      setOutputTab('text');
    }
  }, [detectedBinary?.isImage, mode]);

  const processConversion = useCallback(() => {
    setError('');

    if (fileInfo) return;

    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        let b64 = encodeBase64(input, { urlSafe, stripPadding });
        if (dataUriPrefix) {
          b64 = `data:text/plain;charset=utf-8;base64,${b64}`;
        } else if (chunkSize > 0) {
          b64 = applyLineBreaks(b64, chunkSize);
        }
        setOutput(b64);
        trackToolUsed('base64', 'encode-text');
      } else {
        let rawToDecode = input.trim();
        const dataUriMatch = rawToDecode.match(/^data:([^;]+);base64,(.+)$/i);
        if (dataUriMatch) {
          rawToDecode = dataUriMatch[2];
        }
        rawToDecode = rawToDecode.replace(/[\r\n\s]+/g, '');

        const res = decodeBase64(rawToDecode);
        if (res.error) {
          setError(res.error);
          setOutput('');
          trackToolError('base64', 'decode-error');
        } else {
          setOutput(res.output);
          trackToolUsed('base64', 'decode-text');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : (isFr ? 'Erreur de conversion Base64' : 'Base64 conversion error');
      setError(msg);
      setOutput('');
      trackToolError('base64', 'general-error');
    }
  }, [input, mode, urlSafe, stripPadding, dataUriPrefix, chunkSize, fileInfo, isFr]);

  useEffect(() => {
    processConversion();
  }, [processConversion]);

  const handleInputChange = (val: string) => {
    setHistory((prev) => [...prev.slice(-30), input]);
    setFileInfo(null);
    setInput(val);
  };

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setInput(last);
    setFileInfo(null);
    toast.info(isFr ? 'Modification annulée' : 'Change undone');
  }, [history, isFr]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (document.activeElement?.tagName !== 'INPUT' && history.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, history.length]);

  const handleSwap = () => {
    if (!output && !input) {
      setMode(mode === 'encode' ? 'decode' : 'encode');
      return;
    }
    setHistory((prev) => [...prev.slice(-30), input]);
    const nextInput = output;
    const nextMode: Mode = mode === 'encode' ? 'decode' : 'encode';
    setFileInfo(null);
    setMode(nextMode);
    setInput(nextInput);
    toast.info(
      isFr
        ? `Basculé en mode ${nextMode === 'encode' ? 'Encodage' : 'Décodage'}`
        : `Switched to ${nextMode === 'encode' ? 'Encoding' : 'Decoding'} mode`
    );
  };

  const handleFileUpload = async (file: File) => {
    try {
      setHistory((prev) => [...prev.slice(-30), input]);
      setFileInfo({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
      });
      setMode('encode');
      setError('');

      const dataUrl = await fileToBase64(file);
      let b64 = dataUrl;

      if (!dataUriPrefix) {
        const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
        if (match) {
          b64 = match[1];
        }
      }

      if (urlSafe) {
        b64 = b64.replace(/\+/g, '-').replace(/\//g, '_');
      }
      if (stripPadding) {
        b64 = b64.replace(/=+$/, '');
      }
      if (chunkSize > 0) {
        b64 = applyLineBreaks(b64, chunkSize);
      }

      setOutput(b64);
      setInput(
        isFr
          ? `[Fichier importé : ${file.name} (${formatBytes(file.size, isFr)})]`
          : `[Imported file: ${file.name} (${formatBytes(file.size, isFr)})]`
      );
      toast.success(
        isFr ? `Fichier ${file.name} encodé en Base64` : `File ${file.name} encoded in Base64`
      );
      trackToolUsed('base64', 'file-encoded');
    } catch {
      toast.error(isFr ? 'Échec de la lecture du fichier' : 'Failed to read file');
    }
  };

  const handleClear = () => {
    setHistory((prev) => [...prev.slice(-30), input]);
    setInput('');
    setOutput('');
    setError('');
    setFileInfo(null);
    toast.info(isFr ? 'Plan de travail réinitialisé' : 'Workspace reset');
  };

  const handleDownload = () => {
    if (!output) return;
    trackToolUsed('base64', 'download-output');

    const isBinary = mode === 'decode' && detectedBinary?.dataUrl;
    const blob = isBinary
      ? base64ToBlob(input, detectedBinary!.mimeType)
      : new Blob([output], { type: 'text/plain;charset=utf-8' });
    const filename = isBinary
      ? `decoded-file.${detectedBinary!.extension}`
      : (mode === 'encode' ? 'encoded-base64.txt' : 'decoded-text.txt');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);

    toast.success(
      isBinary
        ? (isFr ? `Fichier téléchargé (${detectedBinary!.extension.toUpperCase()})` : `File downloaded (${detectedBinary!.extension.toUpperCase()})`)
        : (isFr ? 'Fichier texte téléchargé' : 'Text file downloaded')
    );
  };

  const inputBytes = useMemo(() => {
    if (fileInfo) return fileInfo.size;
    return new TextEncoder().encode(input).length;
  }, [input, fileInfo]);

  const outputBytes = useMemo(() => {
    return new TextEncoder().encode(output).length;
  }, [output]);

  return {
    mode,
    setMode,
    input,
    setInput,
    output,
    setOutput,
    error,
    urlSafe,
    setUrlSafe,
    stripPadding,
    setStripPadding,
    dataUriPrefix,
    setDataUriPrefix,
    chunkSize,
    setChunkSize,
    wordWrap,
    setWordWrap,
    fileInfo,
    setFileInfo,
    isDragOver,
    setIsDragOver,
    outputTab,
    setOutputTab,
    history,
    fileInputRef,
    detectedBinary,
    inputBytes,
    outputBytes,
    handleInputChange,
    handleUndo,
    handleSwap,
    handleFileUpload,
    handleClear,
    handleDownload,
  };
}
