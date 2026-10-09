import { useState, useEffect, useCallback } from 'react';
import { apiUrl } from '@/lib/apiBase';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { downloadBlob } from '@/lib/download';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type FileResult,
  extForMime,
  getFormatInfo,
  fileToCanvas,
  canvasToBlob,
  createZipPackage,
} from '@/lib/image-convert-logic';

export interface UseImageBatchConvertOptions {
  fromLabel: string;
  fromExts: string[];
  fromMimes: string[];
  toMime: string;
  slug: string;
  isFr: boolean;
  trackUsed?: (toolSlug: string, category: string) => void;
  trackError?: (toolSlug: string, errorType: string) => void;
}

export function useImageBatchConvert({
  fromLabel,
  fromExts,
  fromMimes,
  toMime,
  slug,
  isFr,
  trackUsed,
  trackError,
}: UseImageBatchConvertOptions) {
  const toExt = extForMime(toMime);
  const sourceFormat = getFormatInfo(fromExts[0] || fromLabel, fromLabel, isFr);
  const targetFormat = getFormatInfo(toMime, toExt.toUpperCase(), isFr);

  const [files, setFiles] = useState<FileResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(90);

  const isPdfOutput = toExt === 'pdf' || toMime === 'application/pdf';
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [downloadedPdf, setDownloadedPdf] = useState<{ blob: Blob; filename: string } | null>(null);
  const [downloadedImage, setDownloadedImage] = useState<{ blob: Blob; filename: string } | null>(null);

  const showQuality = ['image/jpeg', 'image/webp', 'image/avif'].includes(toMime);

  // Clean up object URLs on unmount or file list update
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        URL.revokeObjectURL(f.originalUrl);
        if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
      });
    };
  }, [files]);

  const validateAndAddFiles = useCallback(
    (incoming: FileList | File[]) => {
      const valid: FileResult[] = [];
      Array.from(incoming).forEach((f) => {
        const m = f.type.toLowerCase();
        const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
        const isValid =
          fromMimes.some((fm) => m === fm) ||
          fromExts.some((fe) => fe.replace('.', '').toLowerCase() === ext) ||
          f.type.startsWith('image/');

        if (!isValid) {
          toast({
            variant: 'destructive',
            title: isFr ? 'Format non supporté' : 'Unsupported format',
            description: isFr
              ? `Le fichier "${f.name}" n'est pas au format ${fromLabel}.`
              : `File "${f.name}" is not in ${fromLabel} format.`,
          });
          return;
        }
        if (f.size > 50 * 1024 * 1024) {
          toast({
            variant: 'destructive',
            title: isFr ? 'Fichier trop volumineux' : 'File too large',
            description: isFr
              ? `Le fichier "${f.name}" dépasse la limite maximale de 50 Mo.`
              : `File "${f.name}" exceeds the 50 MB limit.`,
          });
          return;
        }
        valid.push({
          id: crypto.randomUUID(),
          file: f,
          originalUrl: URL.createObjectURL(f),
          status: 'pending',
        });
      });

      if (valid.length > 0) {
        setFiles((prev) => [...prev, ...valid].slice(0, 20));
      }
    },
    [fromExts, fromLabel, fromMimes, isFr]
  );

  // Check for pending handoff file from previous workflow step
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndAddFiles([staged]);
    }
  }, [validateAndAddFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) {
        URL.revokeObjectURL(f.originalUrl);
        if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
      }
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const handleResetAll = useCallback(() => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.originalUrl);
      if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
    });
    setFiles([]);
    setIsProcessing(false);
    setIsNextActionOpen(false);
    setDownloadedPdf(null);
    setDownloadedImage(null);
  }, [files]);

  const isHeic = (file: File) => {
    const m = file.type.toLowerCase();
    return m === 'image/heic' || m === 'image/heif' || !!file.name.match(/\.(heic|heif)$/i);
  };

  const processFileBackend = async (entry: FileResult): Promise<Blob> => {
    const fd = new FormData();
    fd.append('file', entry.file);

    if (isHeic(entry.file)) {
      fd.append('format', toMime === 'image/svg+xml' ? 'image/png' : toMime);
      const res = await fetch(apiUrl('/api/convert/heic'), { method: 'POST', body: fd });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errData.message ?? 'HEIC conversion failed');
      }
      return res.blob();
    }

    if (toMime === 'application/pdf') {
      const res = await fetch(apiUrl('/api/convert/image-to-pdf'), { method: 'POST', body: fd });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }
      return res.blob();
    }

    fd.append('format', toMime);
    fd.append('quality', (quality / 100).toString());
    const res = await fetch(apiUrl('/api/convert/image'), { method: 'POST', body: fd });

    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as { error?: string; clientFallback?: boolean };
      if (errData.clientFallback) {
        const canvas = await fileToCanvas(entry.file);
        return canvasToBlob(canvas, toMime, quality / 100);
      }
      throw new Error(errData.error ?? 'Conversion failed');
    }
    return res.blob();
  };

  const processAll = async () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);
    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'done') continue;
      updated[i] = { ...updated[i], status: 'processing' };
      setFiles([...updated]);

      try {
        let blob: Blob;
        if (toMime === 'image/svg+xml') {
          try {
            blob = await processFileBackend(updated[i]);
          } catch {
            const canvas = await fileToCanvas(updated[i].file);
            blob = await canvasToBlob(canvas, toMime, quality / 100);
          }
        } else {
          blob = await processFileBackend(updated[i]);
        }
        const compressedUrl = URL.createObjectURL(blob);
        updated[i] = {
          ...updated[i],
          status: 'done',
          blob,
          compressedUrl,
          resultSize: blob.size,
        };
        if (trackUsed) trackUsed(slug, 'images');
        else trackToolUsed(slug, 'images');
      } catch (err) {
        if (trackError) trackError(slug, 'general-error');
        else trackToolError(slug, 'general-error');
        const msg = err instanceof Error ? err.message : (isFr ? 'Échec de la conversion' : 'Conversion failed');
        updated[i] = {
          ...updated[i],
          status: 'error',
          error: msg,
        };
        toast({
          variant: 'destructive',
          title: isFr ? 'Erreur de conversion' : 'Conversion error',
          description: msg,
        });
      }
      setFiles([...updated]);
    }
    setIsProcessing(false);
  };

  const downloadOne = useCallback((entry: FileResult) => {
    if (!entry.blob) return;
    if (trackUsed) trackUsed(slug, 'images');
    else trackToolUsed(slug, 'images');

    const filename = `${entry.file.name.replace(/\.[^.]+$/, '')}.${toExt}`;
    downloadBlob(entry.blob, filename);

    if (isPdfOutput) {
      setDownloadedPdf({ blob: entry.blob, filename });
      setTimeout(() => setIsNextActionOpen(true), 450);
    } else {
      setDownloadedImage({ blob: entry.blob, filename });
      setTimeout(() => setIsNextActionOpen(true), 450);
    }
  }, [trackUsed, slug, toExt, isPdfOutput]);

  const downloadAllZip = useCallback(async () => {
    if (trackUsed) trackUsed(slug, 'images');
    else trackToolUsed(slug, 'images');

    const done = files.filter((f): f is FileResult & { blob: Blob } => f.status === 'done' && !!f.blob);
    if (done.length === 0) return;

    if (done.length === 1) {
      downloadOne(done[0]);
      return;
    }

    const zipBlob = await createZipPackage(done, toExt);
    const filename = `${fromLabel.toLowerCase()}_to_${toExt}_converted.zip`;
    downloadBlob(zipBlob, filename);
  }, [files, fromLabel, toExt, trackUsed, slug, downloadOne]);

  const isSingle = files.length === 1;
  const singleFile = isSingle ? files[0] : null;
  const allDone = files.length > 0 && files.every((f) => f.status === 'done');
  const doneCount = files.filter((f) => f.status === 'done').length;

  return {
    toExt,
    sourceFormat,
    targetFormat,
    isPdfOutput,
    showQuality,
    files,
    isProcessing,
    quality,
    setQuality,
    isSingle,
    singleFile,
    allDone,
    doneCount,
    validateAndAddFiles,
    removeFile,
    handleResetAll,
    processAll,
    downloadOne,
    downloadAllZip,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadedPdf,
    downloadedImage,
  };
}
