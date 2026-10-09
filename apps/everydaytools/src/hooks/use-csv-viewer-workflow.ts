import { useState, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
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
  const [inputMode, setInputMode] = useState<'file' | 'paste'>('file');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [documentName, setDocumentName] = useState<string>(isFr ? 'donnees' : 'data');
  const [fileSize, setFileSize] = useState<string | null>(null);
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

        const firstLine = trimmed.split('\n')[0] || '';
        let delim = ',';
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        const tabCount = (firstLine.match(/\t/g) || []).length;
        const pipeCount = (firstLine.match(/\|/g) || []).length;

        if (semicolonCount > commaCount && semicolonCount >= tabCount) delim = ';';
        else if (tabCount > commaCount && tabCount >= semicolonCount) delim = '\t';
        else if (pipeCount > commaCount && pipeCount >= semicolonCount) delim = '|';

        setDetectedDelimiter(delim);

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
              onResetView?.();
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
    [isFr, onResetView]
  );

  const processUploadedFile = useCallback(
    (file: File) => {
      const isExcel =
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls') ||
        file.type.includes('spreadsheet') ||
        file.type.includes('excel');

      const formattedSize = formatTabularFileSize(file.size, isFr);

      if (isExcel) {
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
              onResetView?.();
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
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = (e.target?.result as string) || '';
          parseCsvString(text, file.name, formattedSize);
        };
        reader.readAsText(file);
      }
    },
    [isFr, onResetView, parseCsvString]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      processUploadedFile(staged);
    }
  }, [processUploadedFile]);

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
    setIsReady(false);
    onResetView?.();
  }, [onResetView]);



  return {
    inputMode,
    setInputMode,
    headers,
    rows,
    documentName,
    fileSize,
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
