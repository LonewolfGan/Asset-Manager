import { useState, useCallback, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile, consumeHandoffText } from '@/lib/file-handoff';
import { detectDelimiter } from '@/lib/csv-data-logic';
import {
  SAMPLE_CSV_FR,
  SAMPLE_CSV_EN,
  formatTabularFileSize,
} from '@/lib/csv-viewer-samples';

export interface UseCsvViewerWorkflowOptions {
  isFr: boolean;
  onResetView?: () => void;
}

export function useCsvViewerWorkflow({
  isFr,
  onResetView,
}: UseCsvViewerWorkflowOptions) {
  const onResetViewRef = useRef(onResetView);
  useEffect(() => {
    onResetViewRef.current = onResetView;
  }, [onResetView]);

  const [inputMode, setInputMode] = useState<'file' | 'paste'>('file');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [documentName, setDocumentName] = useState<string>(isFr ? 'donnees' : 'data');
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [isExcel, setIsExcel] = useState<boolean>(false);
  const [detectedDelimiter, setDetectedDelimiter] = useState<string>(',');
  const [isReady, setIsReady] = useState<boolean>(false);

  const [rawText, setRawText] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parseCsvString = useCallback(
    (content: string, fileName = isFr ? 'donnees.csv' : 'data.csv', sizeStr?: string) => {
      setError(null);
      try {
        const trimmed = content.trim();
        if (!trimmed) {
          throw new Error(isFr ? 'Le texte est vide.' : 'The text is empty.');
        }

        const delim = detectDelimiter(trimmed);
        setDetectedDelimiter(delim);
        setIsExcel(false);
        setFileSizeBytes(new Blob([content]).size);

        Papa.parse(trimmed, {
          delimiter: delim,
          skipEmptyLines: 'greedy',
          complete: (res) => {
            if (res.data && res.data.length > 0) {
              const raw = res.data as string[][];
              const extractedHeaders = raw[0].map((h, i) =>
                h && String(h).trim() ? String(h).trim() : `Col ${i + 1}`
              );
              const rawData = raw.slice(1).map((r) => {
                const row = [];
                for (let i = 0; i < extractedHeaders.length; i++) {
                  row.push(String(r[i] ?? ''));
                }
                return row;
              });

              setHeaders(extractedHeaders);
              setRows(rawData);
              setDocumentName(fileName.replace(/\.[^/.]+$/, '') || (isFr ? 'donnees' : 'data'));
              if (sizeStr) setFileSize(sizeStr);
              setIsReady(true);
              onResetViewRef.current?.();
              trackToolUsed('csv-viewer', 'documents');
            } else {
              throw new Error(
                isFr ? 'Aucune ligne lisible détectée dans ce fichier.' : 'No readable rows detected in this file.'
              );
            }
          },
          error: (err: Error) => {
            throw err;
          },
        });
      } catch (err) {
        trackToolError('csv-viewer', 'parse-error');
        setError(
          err instanceof Error
            ? err.message
            : isFr ? 'Erreur de lecture du fichier CSV.' : 'Error reading CSV file.'
        );
      }
    },
    [isFr]
  );

  const processUploadedFile = useCallback(
    (file: File) => {
      const lowerName = file.name.toLowerCase();
      const isExcelFile =
        lowerName.endsWith('.xlsx') ||
        lowerName.endsWith('.xls') ||
        file.type.includes('spreadsheet') ||
        file.type.includes('excel');

      const formattedSize = formatTabularFileSize(file.size, isFr);
      setFileSizeBytes(file.size);
      setIsExcel(isExcelFile);

      if (isExcelFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const raw = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
              header: 1,
              defval: '',
              blankrows: false,
            });

            if (raw.length > 0) {
              const extractedHeaders = (raw[0] as unknown[]).map((h, i) => String(h || `Col ${i + 1}`));
              const rawData = raw.slice(1).map((r) => {
                const row = [];
                const typedRow = r as unknown[];
                for (let i = 0; i < extractedHeaders.length; i++) {
                  row.push(String(typedRow[i] ?? ''));
                }
                return row;
              });

              setHeaders(extractedHeaders);
              setRows(rawData);
              setDocumentName(file.name.replace(/\.[^/.]+$/, '') || (isFr ? 'donnees' : 'data'));
              setFileSize(formattedSize);
              setDetectedDelimiter('Excel (.xlsx)');
              setIsReady(true);
              onResetViewRef.current?.();
              trackToolUsed('csv-viewer', 'documents');
            } else {
              throw new Error(isFr ? 'La feuille Excel est vide.' : 'The Excel sheet is empty.');
            }
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : isFr ? 'Impossible de lire ce fichier Excel.' : 'Unable to read this Excel file.'
            );
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        if (typeof file.text === 'function') {
          file
            .text()
            .then((text) => {
              parseCsvString(text, file.name, formattedSize);
            })
            .catch((err) => {
              setError(
                err instanceof Error
                  ? err.message
                  : isFr
                  ? 'Impossible de lire ce fichier CSV.'
                  : 'Unable to read this CSV file.'
              );
            });
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = (e.target?.result as string) || '';
            parseCsvString(text, file.name, formattedSize);
          };
          reader.readAsText(file);
        }
      }
    },
    [isFr, parseCsvString]
  );

  const hasConsumedHandoffRef = useRef(false);
  useEffect(() => {
    if (hasConsumedHandoffRef.current) return;
    hasConsumedHandoffRef.current = true;

    const stagedFile = consumeHandoffFile();
    if (stagedFile) {
      processUploadedFile(stagedFile);
      return;
    }
    const stagedText = consumeHandoffText();
    if (stagedText) {
      parseCsvString(stagedText, isFr ? 'presse_papier.csv' : 'clipboard.csv');
    }
  }, [isFr, parseCsvString, processUploadedFile]);

  const handleLoadSample = useCallback(() => {
    const sample = isFr ? SAMPLE_CSV_FR : SAMPLE_CSV_EN;
    const name = isFr ? 'equipe_et_performances.csv' : 'team_and_performance.csv';
    parseCsvString(sample, name, isFr ? '1.2 Ko' : '1.2 KB');
  }, [isFr, parseCsvString]);

  const handlePasteSubmit = useCallback(() => {
    if (!rawText.trim()) {
      setError(
        isFr ? 'Veuillez coller du texte CSV avant de visualiser.' : 'Please paste CSV text before viewing.'
      );
      return;
    }
    parseCsvString(rawText, isFr ? 'donnees_collees.csv' : 'pasted_data.csv');
  }, [isFr, rawText, parseCsvString]);

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
        processUploadedFile(droppedFiles[0]);
      }
    },
    [processUploadedFile]
  );

  const handleReset = useCallback(() => {
    setRows([]);
    setHeaders([]);
    setRawText('');
    setError(null);
    setFileSize(null);
    setFileSizeBytes(0);
    setIsExcel(false);
    setIsReady(false);
    onResetViewRef.current?.();
  }, []);

  return {
    inputMode,
    setInputMode,
    headers,
    rows,
    documentName,
    fileSize,
    fileSizeBytes,
    isExcel,
    detectedDelimiter,
    isReady,
    rawText,
    setRawText,
    isDragging,
    error,
    processUploadedFile,
    handleLoadSample,
    handlePasteSubmit,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
  };
}
