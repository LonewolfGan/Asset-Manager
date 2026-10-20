import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile, consumeHandoffText } from '@/lib/file-handoff';
import {
  type ConversionDirection,
  type ConversionInputMode,
  getCsvFormat,
  getJsonFormat,
  validateCsvJsonFile,
  convertCsvToJson,
  convertJsonToCsv,
  resolveConvertedFilename,
  parseCsvJsonPreview,
  readEncodedText,
} from '@/lib/csv-json-conversion-logic';

export interface CsvJsonResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  textOutput: string;
}

export function useCsvJsonWorkflow(
  isFr: boolean,
  initialDirection: ConversionDirection = 'csv-to-json'
) {
  const [direction, setDirection] = useState<ConversionDirection>(initialDirection);
  const [files, setFiles] = useState<File[]>([]);
  const [inputMode, setInputMode] = useState<ConversionInputMode>('upload');
  const [rawText, setRawText] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);
  const [delimiter, setDelimiter] = useState(',');
  const [encoding, setEncoding] = useState('utf-8');

  const previewData = useMemo(
    () => parseCsvJsonPreview(rawText, direction, delimiter),
    [rawText, direction, delimiter]
  );

  const [result, setResult] = useState<CsvJsonResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];
  const formatCsv = getCsvFormat(isFr);
  const formatJson = getJsonFormat(isFr);

  const sourceFormat = direction === 'csv-to-json' ? formatCsv : formatJson;
  const targetFormat = direction === 'csv-to-json' ? formatJson : formatCsv;

  const validateAndSetFile = useCallback(
    async (selectedFile: File) => {
      const validation = validateCsvJsonFile(selectedFile, direction);
      if (!validation.valid) {
        const isCsvTarget = direction === 'csv-to-json';
        const description = validation.error === 'unsupported_format'
          ? (isCsvTarget ? (isFr ? 'Veuillez sélectionner un fichier CSV (.csv) valide.' : 'Please select a valid CSV (.csv) file.')
                        : (isFr ? 'Veuillez sélectionner un fichier JSON (.json) valide.' : 'Please select a valid JSON (.json) file.'))
          : (isFr ? 'Le fichier dépasse la taille maximale autorisée de 25 Mo.' : 'The file exceeds the maximum allowed size of 25 MB.');
        toast({
          variant: 'destructive',
          title: validation.error === 'unsupported_format' ? (isFr ? 'Format non supporté' : 'Unsupported format') : (isFr ? 'Fichier trop volumineux' : 'File too large'),
          description,
        });
        return;
      }

      try {
        const text = await readEncodedText(selectedFile, encoding);
        setRawText(text);
        setFiles([selectedFile]);
        setResult(null);
      } catch {
        toast({
          variant: 'destructive',
          title: isFr ? 'Erreur de lecture' : 'Read error',
          description: isFr ? 'Impossible de lire le contenu du fichier sélectionné.' : 'Unable to read the selected file content.',
        });
      }
    },
    [direction, isFr, encoding]
  );

  useEffect(() => {
    if (inputMode !== 'upload' || !file) {
      return undefined;
    }
    let isCancelled = false;
    readEncodedText(file, encoding)
      .then((text) => {
        if (!isCancelled) setRawText(text);
      })
      .catch(() => {});
    return () => {
      isCancelled = true;
    };
  }, [file, encoding, inputMode]);

  const hasConsumedHandoffRef = useRef(false);
  useEffect(() => {
    if (hasConsumedHandoffRef.current) return;
    hasConsumedHandoffRef.current = true;
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
      return;
    }
    const stagedText = consumeHandoffText();
    if (stagedText) {
      setRawText(stagedText);
      setInputMode('paste');
      setIsPastedStaged(true);
      setResult(null);
    }
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

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
    setRawText('');
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setPreviewOpen(false);
    setIsNextActionOpen(false);
  }, []);

  const handleToggleDirection = useCallback(
    (newDir: ConversionDirection) => {
      if (newDir !== direction) {
        setDirection(newDir);
        handleReset();
      }
    },
    [direction, handleReset]
  );

  const handleConvert = useCallback(async () => {
    if (!rawText.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed(direction, 'documents');

      const isCsvToJson = direction === 'csv-to-json';
      const outputText = isCsvToJson
        ? convertCsvToJson(rawText, isFr, delimiter)
        : convertJsonToCsv(rawText, isFr, delimiter);

      const mimeType = isCsvToJson
        ? 'application/json;charset=utf-8'
        : 'text/csv;charset=utf-8';

      const filename = resolveConvertedFilename(inputMode, file, direction, isFr);
      const blob = new Blob([outputText], { type: mimeType });
      const sizeBefore =
        inputMode === 'upload' && file
          ? file.size
          : new TextEncoder().encode(rawText).length;

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore,
        textOutput: outputText,
      });
    } catch (err) {
      console.error('Conversion CSV/JSON error:', err);
      trackToolError(direction, 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : isFr
          ? 'Échec de la conversion des données. Veuillez vérifier la syntaxe source.'
          : 'Data conversion failed. Please check source syntax.';
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [rawText, isProcessing, direction, isFr, inputMode, file, delimiter]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setTimeout(() => setIsNextActionOpen(true), 450);
  }, [result]);

  const isStaged =
    (inputMode === 'upload' && Boolean(file)) ||
    (inputMode === 'paste' && isPastedStaged);

  const stagedFile =
    inputMode === 'upload' && file
      ? file
      : inputMode === 'paste' && isPastedStaged
      ? new File(
          [rawText],
          direction === 'csv-to-json'
            ? isFr
              ? 'donnees.csv'
              : 'data.csv'
            : isFr
            ? 'donnees.json'
            : 'data.json',
          { type: direction === 'csv-to-json' ? 'text/csv' : 'application/json' }
        )
      : null;

  return {
    direction,
    inputMode,
    setInputMode,
    files,
    rawText,
    setRawText,
    isPastedStaged,
    setIsPastedStaged,
    result,
    isProcessing,
    isDragging,
    previewOpen,
    setPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    file,
    sourceFormat,
    targetFormat,
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
    handleToggleDirection,
    handleConvert,
    handleDownload,
  };
}

export type CsvJsonWorkflow = ReturnType<typeof useCsvJsonWorkflow>;
