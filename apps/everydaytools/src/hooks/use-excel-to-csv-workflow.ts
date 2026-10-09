import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateExcelFile,
  parseWorkbookSheets,
  parseSheetPreview,
  convertExcelToCsv,
  triggerDownload,
  type ExcelToCsvResult,
} from '@/lib/excel-to-csv-logic';

export function useExcelToCsvWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.excelToCsv;

  const sourceFormat = useMemo(() => getSourceFormat(isFr), [isFr]);
  const targetFormat = useMemo(() => getTargetFormat(isFr), [isFr]);

  const [files, setFiles] = useState<File[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [previewData, setPreviewData] = useState<{ headers: string[]; rows: any[][] } | null>(null);
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [result, setResult] = useState<ExcelToCsvResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    async (selectedFile: File) => {
      const validation = validateExcelFile(selectedFile, isFr);
      if (!validation.isValid) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format non supporté' : 'Unsupported format',
          description: validation.error,
        });
        return;
      }

      setFiles([selectedFile]);
      setResult(null);
      setSheets([]);
      setSelectedSheet('');

      try {
        const buf = await selectedFile.arrayBuffer();
        setFileData(buf);
        const parsedSheets = await parseWorkbookSheets(buf);
        if (parsedSheets.length > 0) {
          setSheets(parsedSheets);
          setSelectedSheet(parsedSheets[0] ?? '');
        }
      } catch (err) {
        console.warn('Soft fail parsing sheets ahead of time:', err);
      }
    },
    [isFr]
  );

  useEffect(() => {
    if (!fileData) {
      setPreviewData(null);
      return;
    }
    let cancelled = false;
    parseSheetPreview(fileData, selectedSheet).then((data) => {
      if (!cancelled) {
        setPreviewData(data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [fileData, selectedSheet]);

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
    setSheets([]);
    setSelectedSheet('');
    setPreviewData(null);
    setFileData(null);
    setResult(null);
    setIsProcessing(false);
    setIsPreviewOpen(false);
    setIsNextActionOpen(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed('excel-to-csv', 'documents');

      const [{ blob, filename, textOutput }] = await Promise.all([
        convertExcelToCsv({ file, fileData, selectedSheet, delimiter }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore: file.size,
        textOutput,
      });
    } catch (err) {
      console.error('Excel to CSV conversion error:', err);
      trackToolError('excel-to-csv', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion en CSV. Veuillez réessayer.'
              : 'Failed to convert to CSV. Please try again.');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, fileData, selectedSheet, delimiter, tc.error, isFr]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
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
    delimiter,
    setDelimiter,
    previewData,
    result,
    isProcessing,
    isDragging,
    isPreviewOpen,
    setIsPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  };
}
