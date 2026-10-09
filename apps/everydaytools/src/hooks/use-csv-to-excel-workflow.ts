import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateCsvFile,
  buildExcelFilename,
  convertCsvToExcel,
} from '@/lib/csv-to-excel-logic';

export interface CsvToExcelResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export function useCsvToExcelWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.csvToExcel;

  const sourceFormat = useMemo(() => getSourceFormat(isFr), [isFr]);
  const targetFormat = useMemo(() => getTargetFormat(), []);

  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [csvText, setCsvText] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);
  const [delimiter, setDelimiter] = useState(',');
  const [encoding, setEncoding] = useState('utf-8');
  const [previewData, setPreviewData] = useState<{ headers: string[]; rows: any[][] }>({
    headers: [],
    rows: [],
  });

  const [result, setResult] = useState<CsvToExcelResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  useEffect(() => {
    let isCancelled = false;
    async function loadPreview() {
      const text = mode === 'upload' && file ? await file.text() : csvText;
      if (!text.trim()) {
        if (!isCancelled) setPreviewData({ headers: [], rows: [] });
        return;
      }
      try {
        const PapaModule = await import('papaparse');
        const Papa = PapaModule.default ?? PapaModule;
        const parsed = Papa.parse(text, {
          preview: 6,
          delimiter: delimiter || undefined,
          skipEmptyLines: true,
        });
        const headers = (parsed.data[0] as string[]) || [];
        const rows = (parsed.data.slice(1) as any[][]) || [];
        if (!isCancelled) setPreviewData({ headers, rows });
      } catch {
        if (!isCancelled) setPreviewData({ headers: [], rows: [] });
      }
    }
    loadPreview();
    return () => {
      isCancelled = true;
    };
  }, [file, csvText, mode, delimiter]);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateCsvFile(selectedFile, isFr);
      if (!validation.isValid) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format ou taille invalide' : 'Invalid format or size',
          description: validation.error,
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
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleReset = useCallback(() => {
    setFiles([]);
    setCsvText('');
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (mode === 'upload' && !file) return;
    if (mode === 'paste' && !csvText.trim()) return;
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      trackToolUsed('csv-to-excel', 'documents');

      const text = mode === 'upload' && file ? await file.text() : csvText;
      const sizeBefore =
        mode === 'upload' && file ? file.size : new TextEncoder().encode(text).length;

      const [blob] = await Promise.all([
        convertCsvToExcel(text, isFr, delimiter),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);

      const filename = buildExcelFilename(mode, file, isFr);

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore,
      });
    } catch (err) {
      console.error('CSV to Excel conversion error:', err);
      trackToolError('csv-to-excel', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion du fichier CSV en classeur Excel.'
              : 'Failed to convert CSV file to Excel workbook.');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [mode, file, csvText, isProcessing, isFr, tc.error]);

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

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [result]);

  const isStaged = (mode === 'upload' && Boolean(file)) || (mode === 'paste' && isPastedStaged);

  const stagedFile =
    mode === 'upload' && file
      ? file
      : mode === 'paste' && isPastedStaged
        ? new File([csvText], isFr ? 'donnees-saisies.csv' : 'pasted-data.csv', { type: 'text/csv' })
        : null;

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    files,
    file,
    mode,
    setMode,
    csvText,
    setCsvText,
    isPastedStaged,
    setIsPastedStaged,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    isStaged,
    stagedFile,
    delimiter,
    setDelimiter,
    encoding,
    setEncoding,
    previewData,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  };
}
