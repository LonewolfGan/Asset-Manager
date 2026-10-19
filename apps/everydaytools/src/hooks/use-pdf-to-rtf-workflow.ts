import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getPdfSourceFormat,
  getRtfTargetFormat,
  validatePdfDocumentFile,
  convertPdfToDoc,
  triggerDownload,
  type PdfExportConvertResult,
} from '@/lib/pdf-export-converter-logic';

export function usePdfToRtfWorkflow() {
  const { t, isFr } = useLocale();
  const tc = (t as any).pdfToRtf ?? {};
  const sourceFormat = getPdfSourceFormat(isFr);
  const targetFormat = getRtfTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<PdfExportConvertResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validatePdfDocumentFile(selectedFile, isFr);
      if (!validation.isValid) {
        toast({
          variant: 'destructive',
          title: validation.errorTitle,
          description: validation.errorDesc,
        });
        return;
      }
      setFiles([selectedFile]);
      setResult(null);
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
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        validateAndSetFile(droppedFile);
      }
    },
    [validateAndSetFile]
  );

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setIsProcessing(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;

    setIsProcessing(true);
    trackToolUsed('pdf-to-rtf', 'documents');

    try {
      const res = await convertPdfToDoc(file, 'rtf', {
        isFr,
        errorFallback: tc.error,
      });
      setResult(res);
      toast({
        title: isFr ? 'Conversion réussie' : 'Conversion successful',
        description: isFr
          ? 'Votre document RTF est prêt.'
          : 'Your RTF document is ready.',
      });
    } catch (err: any) {
      trackToolError('pdf-to-rtf', 'conversion_error');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: err.message ?? tc.error,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, isFr, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
  }, [result]);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    result,
    isProcessing,
    isDragging,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  };
}
