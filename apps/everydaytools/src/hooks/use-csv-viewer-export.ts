import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface UseCsvViewerExportOptions {
  headers: string[];
  rows: string[][];
  documentName: string;
  isFr: boolean;
}

export function useCsvViewerExport({
  headers,
  rows,
  documentName,
  isFr,
}: UseCsvViewerExportOptions) {
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState<boolean>(false);
  const [exportedFormat, setExportedFormat] = useState<'csv' | 'xlsx'>('csv');
  const [exportedBlob, setExportedBlob] = useState<Blob | undefined>(undefined);
  const [exportedFilename, setExportedFilename] = useState<string>('');

  const handleDownloadCsv = useCallback(
    (delimiter = ',') => {
      const csvContent = Papa.unparse({ fields: headers, data: rows }, { delimiter });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${documentName || (isFr ? 'donnees' : 'data')}.csv`;
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setShowExportMenu(false);

      setExportedFormat('csv');
      setExportedBlob(blob);
      setExportedFilename(filename);
      setTimeout(() => setIsNextActionOpen(true), 450);
    },
    [documentName, headers, isFr, rows]
  );

  const handleDownloadExcel = useCallback(() => {
    const worksheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, isFr ? 'Feuille1' : 'Sheet1');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const filename = `${documentName || (isFr ? 'donnees' : 'data')}.xlsx`;
    XLSX.writeFile(workbook, filename);
    setShowExportMenu(false);

    setExportedFormat('xlsx');
    setExportedBlob(excelBlob);
    setExportedFilename(filename);
    setTimeout(() => setIsNextActionOpen(true), 450);
  }, [documentName, headers, isFr, rows]);

  return {
    showExportMenu,
    setShowExportMenu,
    isNextActionOpen,
    setIsNextActionOpen,
    exportedFormat,
    exportedBlob,
    exportedFilename,
    handleDownloadCsv,
    handleDownloadExcel,
  };
}
