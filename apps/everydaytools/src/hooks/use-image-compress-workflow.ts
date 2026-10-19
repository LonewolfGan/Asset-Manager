import { useState, useEffect, useCallback } from 'react';
import { apiUrl } from '@/lib/apiBase';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import {
  type Level,
  type CompressionPreset,
  generateCompressedFilename,
} from '@/lib/image-compress-logic';

export interface CompressResultData {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  gain: number;
}

export function useImageCompressWorkflow(
  file: File | undefined,
  presets: CompressionPreset[],
  isFr: boolean
) {
  const [level, setLevel] = useState<Level>('balanced');
  const [result, setResult] = useState<CompressResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveBytes, setLiveBytes] = useState<number>(0);

  // Keep liveBytes reactive to selected file
  useEffect(() => {
    if (file) {
      setLiveBytes(file.size);
    } else {
      setLiveBytes(0);
    }
  }, [file]);

  const resetWorkflow = useCallback(() => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setLiveBytes(0);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file || isProcessing) return false;
    setError(null);
    setIsProcessing(true);
    setLiveBytes(file.size);

    const selectedPreset = presets.find((p) => p.id === level) ?? presets[1];

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('quality', selectedPreset.quality.toString());
      fd.append('stripMeta', 'true');
      fd.append('resizeMode', 'none');

      const res = await fetch(apiUrl('/api/tools/image-compress'), {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(
          err.message ?? err.error ?? (isFr ? 'Échec de la compression.' : 'Compression failed.')
        );
      }

      const blob = await res.blob();
      const originalSize = parseInt(res.headers.get('X-Original-Size') ?? String(file.size), 10);
      const compressedSize = parseInt(res.headers.get('X-Compressed-Size') ?? String(blob.size), 10);
      const gainHeader = res.headers.get('X-Compression-Gain');
      const calculatedGain = Math.max(0, Math.round((1 - compressedSize / originalSize) * 100));
      const gain = gainHeader ? parseInt(gainHeader, 10) : calculatedGain;

      trackToolUsed('image-compress', 'images');
      setResult({
        blob,
        filename: generateCompressedFilename(file.name),
        sizeBefore: originalSize,
        sizeAfter: compressedSize,
        gain,
      });
      return true;
    } catch (e) {
      trackToolError('image-compress', 'general-error');
      setError(
        e instanceof Error
          ? e.message
          : isFr
          ? 'La compression a échoué. Vérifiez votre image et réessayez.'
          : 'Compression failed. Check your image and try again.'
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, presets, level, isFr]);

  return {
    level,
    setLevel,
    result,
    setResult,
    error,
    setError,
    isProcessing,
    liveBytes,
    resetWorkflow,
    handleCompress,
  };
}
