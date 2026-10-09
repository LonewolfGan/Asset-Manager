import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { parsePdfMetadata, savePdfMetadata } from '@/lib/pdf-metadata-logic';
import { usePdfMetadataForm } from './use-pdf-metadata-form';

export function usePdfMetadataWorkflow(isFr: boolean) {
  const form = usePdfMetadataForm();

  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [creationDate, setCreationDate] = useState<Date | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  const [result, setResult] = useState<{
    blob: Blob;
    filename: string;
    sizeAfter: number;
    sizeBefore: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState<boolean>(false);

  const file = files[0];

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setPdfBytes(null);
    setPageCount(null);
    setCreationDate(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
    form.resetForm();
  }, [form]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && files.length > 0 && !isProcessing) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files.length, isProcessing, handleReset]);

  const validateAndLoadFile = useCallback(
    async (selectedFile: File) => {
      const isPdf =
        selectedFile.type === 'application/pdf' ||
        selectedFile.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setError(
          isFr
            ? 'Veuillez sélectionner un document au format PDF valide.'
            : 'Please select a valid PDF document.'
        );
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        setError(
          isFr
            ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
            : 'The file exceeds the maximum allowed size of 50 MB.'
        );
        return;
      }

      setError(null);
      setResult(null);
      setFiles([selectedFile]);

      try {
        trackToolUsed('pdf-metadata', 'pdf');
        const buf = await selectedFile.arrayBuffer();
        const parsed = await parsePdfMetadata(buf);

        setPageCount(parsed.pageCount);
        setCreationDate(parsed.creationDate);
        setPdfBytes(parsed.pdfBytes);
        form.setFormData(parsed.form, parsed.initialValues);
      } catch (e) {
        trackToolError('pdf-metadata', 'load-error');
        setError(
          e instanceof Error
            ? e.message
            : isFr
              ? 'Impossible de lire les métadonnées de ce document PDF.'
              : 'Unable to read metadata from this PDF document.'
        );
      }
    },
    [form, isFr]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged && (staged.type === 'application/pdf' || staged.name.toLowerCase().endsWith('.pdf'))) {
      setFiles([staged]);
      validateAndLoadFile(staged);
    }
  }, [validateAndLoadFile]);

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
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        validateAndLoadFile(droppedFiles[0]);
      }
    },
    [validateAndLoadFile]
  );

  const handleSave = async () => {
    if (!pdfBytes || !file) return;
    setError(null);
    setIsProcessing(true);

    try {
      const formData = form.getFormData();
      const res = await savePdfMetadata(pdfBytes, formData, file.name, file.size);
      setResult(res);
    } catch (e) {
      trackToolError('pdf-metadata', 'save-error');
      setError(
        e instanceof Error
          ? e.message
          : isFr
            ? 'Impossible d’enregistrer les nouvelles métadonnées.'
            : 'Unable to save new metadata.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
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
  };

  return {
    file,
    files,
    pageCount,
    creationDate,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    form,
    handleReset,
    validateAndLoadFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSave,
    handleDownload,
  };
}
