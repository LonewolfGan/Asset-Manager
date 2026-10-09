import type { ConversionFormat } from '@/components/conversion';
import { runAsyncDocumentConversion } from '@/lib/async-conversion';

export interface ExcelToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
}

export interface ExcelFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (_isFr = false): ConversionFormat => ({
  name: 'Excel',
  extension: 'xlsx',
  icon: '/icons/excel.svg',
  color: '#107C41',
  subLabel: 'Microsoft Excel',
});

export const getTargetFormat = (_isFr = false): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

const MAX_EXCEL_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export function validateExcelFile(
  selectedFile: File,
  isFr = false
): ExcelFileValidationResult {
  const isExcel =
    selectedFile.name.toLowerCase().endsWith('.xlsx') ||
    selectedFile.name.toLowerCase().endsWith('.xls') ||
    selectedFile.name.toLowerCase().endsWith('.ods') ||
    selectedFile.name.toLowerCase().endsWith('.csv') ||
    selectedFile.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    selectedFile.type === 'application/vnd.ms-excel';

  if (!isExcel) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner une feuille de calcul Excel (.xlsx ou .xls) valide.'
        : 'Please select a valid Excel spreadsheet (.xlsx or .xls).',
    };
  }

  if (selectedFile.size > MAX_EXCEL_SIZE_BYTES) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Fichier trop volumineux' : 'File too large',
      errorDesc: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'The file exceeds the maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export async function parseExcelSheets(file: File): Promise<string[]> {
  try {
    const buf = await file.arrayBuffer();
    const XLSX = (await import('xlsx')).default;
    const wb = XLSX.read(buf, { type: 'buffer' });
    if (wb.SheetNames && wb.SheetNames.length > 0) {
      return wb.SheetNames;
    }
  } catch {
    // Soft fail on parsing sheet names; backend handles conversion
  }
  return [];
}

export async function convertExcelToPdf(
  file: File,
  selectedSheet?: string
): Promise<ExcelToPdfResult> {
  const res = await runAsyncDocumentConversion({
    taskType: 'excel-to-pdf',
    file,
    targetFormat: 'pdf',
    fallbackSyncUrl: '/api/tools/excel-to-pdf',
    extraFields: selectedSheet ? { sheet: selectedSheet } : undefined,
  });

  return {
    blob: res.blob,
    filename: res.filename,
    sizeAfter: res.sizeAfter || res.blob.size,
    sizeBefore: file.size,
  };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function openPdfPreview(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
