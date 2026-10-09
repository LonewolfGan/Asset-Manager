import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateExcelFile,
  parseExcelSheets,
  convertExcelToPdf,
  triggerDownload,
  openPdfPreview,
  type ExcelToPdfResult,
} from '@/lib/excel-to-pdf-logic';

export function useExcelToPdfWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.excelToPdf;

  const sourceFormat = useMemo(() => getSourceFormat(isFr), [isFr]);
  const targetFormat = useMemo(() => getTargetFormat(isFr), [isFr]);

  const [files, setFiles] = useState<File[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [result, setResult] = useState<ExcelToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    async (selectedFile: File) => {
      const validation = validateExcelFile(selectedFile, isFr);
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
      setSheets([]);
      setSelectedSheet('');

      const parsedSheets = await parseExcelSheets(selectedFile);
      if (parsedSheets.length > 0) {
        setSheets(parsedSheets);
        setSelectedSheet(parsedSheets[0] ?? '');
      }
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

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setIsProcessing(false);
    setSheets([]);
    setSelectedSheet('');
    setIsNextActionOpen(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed('excel-to-pdf', 'documents');
      const conversionResult = await convertExcelToPdf(file, selectedSheet);
      setResult(conversionResult);
    } catch (err) {
      console.error('Excel to PDF conversion error:', err);
      trackToolError('excel-to-pdf', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion en PDF. Veuillez réessayer.'
              : 'Failed to convert to PDF. Please try again.');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, isFr, selectedSheet, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
    setIsNextActionOpen(true);
  }, [result]);

  const handleOpenPreview = useCallback(() => {
    if (!result) return;
    openPdfPreview(result.blob);
  }, [result]);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    sheets,
    selectedSheet,
    setSelectedSheet,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
    handleOpenPreview,
  };
}
