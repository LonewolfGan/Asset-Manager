import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { toast } from '@/hooks/use-toast';
import { formatBytes } from '@/lib/utils';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceImagesFormat,
  getTargetPdfFormat,
  filterValidImageFiles,
  validateImageFiles,
  buildCombinedPdfFilename,
  generatePdfFromImages,
} from '@/lib/image-to-pdf-logic';

export interface ImageToPdfResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore: number;
}

export function useImageToPdfWorkflow(isFr: boolean, errorMessageFallback?: string) {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<ImageToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const sourceFormat = getSourceImagesFormat();
  const targetPdfFormat = getTargetPdfFormat(isFr);

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddFiles = useCallback(
    (newFiles: File[]) => {
      const { validFiles, invalidCount } = filterValidImageFiles(newFiles);

      if (invalidCount > 0) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format non supporté' : 'Unsupported format',
          description: isFr
            ? 'Certains fichiers ont été ignorés car ils ne sont pas des images valides.'
            : 'Some files were ignored because they are not valid images.',
        });
      }

      setFiles((prev) => [...prev, ...validFiles]);
    },
    [isFr]
  );

  const handleFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      const { validFiles } = filterValidImageFiles(selectedFiles);

      const validation = validateImageFiles(validFiles);
      if (!validation.valid) {
        if (validation.error === 'no_files') {
          toast({
            variant: 'destructive',
            title: isFr ? 'Format non supporté' : 'Unsupported format',
            description: isFr
              ? 'Veuillez sélectionner des images valides (JPG, PNG, WebP, HEIC, AVIF, TIFF, BMP).'
              : 'Please select valid images (JPG, PNG, WebP, HEIC, AVIF, TIFF, BMP).',
          });
        } else if (validation.error === 'files_too_large') {
          toast({
            variant: 'destructive',
            title: isFr ? 'Fichiers trop volumineux' : 'Files too large',
            description: isFr
              ? 'La taille cumulée des images dépasse la limite de 100 Mo.'
              : 'Cumulative image size exceeds the 100 MB limit.',
          });
        }
        return;
      }

      setFiles(validFiles);
      setResult(null);
    },
    [isFr]
  );

  // Check for pending handoff file from previous workflow step
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFilesSelected([staged]);
    }
  }, [handleFilesSelected]);

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
        handleFilesSelected(Array.from(e.dataTransfer.files));
      }
    },
    [handleFilesSelected]
  );

  const handleConvert = useCallback(async () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);

    try {
      const convertEndpoint = apiUrl('/api/convert/image');
      const { blob, totalSizeBefore } = await generatePdfFromImages(
        files,
        convertEndpoint
      );

      trackToolUsed('image-to-pdf', 'images');
      const filename = buildCombinedPdfFilename(files, isFr);

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore: totalSizeBefore,
      });
    } catch (e) {
      trackToolError('image-to-pdf', 'general-error');
      const msg = e instanceof Error ? e.message : errorMessageFallback;
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: msg,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [files, isProcessing, isFr, errorMessageFallback]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsNextActionOpen(true);
  }, [result]);

  const stagedFile =
    files.length > 0
      ? new File(
          [new Blob([''], { type: 'text/plain' })],
          files.length === 1
            ? files[0].name
            : `${files.length} ${
                isFr ? 'images sélectionnées' : 'selected images'
              } (${formatBytes(totalSize)})`,
          { type: 'image/jpeg' }
        )
      : null;

  return {
    files,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    sourceFormat,
    targetPdfFormat,
    totalSize,
    stagedFile,
    handleReset,
    handleRemoveFile,
    handleAddFiles,
    handleFilesSelected,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleConvert,
    handleDownload,
  };
}

export type ImageToPdfWorkflow = ReturnType<typeof useImageToPdfWorkflow>;
