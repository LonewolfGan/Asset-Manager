import type { ConversionFormat } from '@/components/conversion';

export interface ExcelToCsvResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  textOutput: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const getSourceFormat = (_isFr = false): ConversionFormat => ({
  name: 'Excel',
  extension: 'xlsx',
  icon: '/icons/excel.svg',
  color: '#107C41',
  subLabel: 'Microsoft Excel',
});

export const getTargetFormat = (isFr = false): ConversionFormat => ({
  name: 'CSV',
  extension: 'csv',
  icon: '/icons/csv.svg',
  color: '#21A366',
  subLabel: isFr ? 'Données délimitées' : 'Comma-Separated',
});

export function validateExcelFile(selectedFile: File, isFr = false): FileValidationResult {
  const isExcel =
    selectedFile.name.toLowerCase().endsWith('.xlsx') ||
    selectedFile.name.toLowerCase().endsWith('.xls') ||
    selectedFile.name.toLowerCase().endsWith('.ods') ||
    selectedFile.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    selectedFile.type === 'application/vnd.ms-excel';

  if (!isExcel) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un classeur Excel (.xlsx ou .xls) valide.'
        : 'Please select a valid Excel workbook (.xlsx or .xls).',
    };
  }

  if (selectedFile.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'The file exceeds the maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export async function parseWorkbookSheets(buf: ArrayBuffer): Promise<string[]> {
  try {
    const xlsxModule = (await import('xlsx')) as any;
    const XLSX = xlsxModule.read ? xlsxModule : xlsxModule.default ?? xlsxModule;
    const wb = XLSX.read(buf, { type: 'buffer' });
    if (wb.SheetNames && wb.SheetNames.length > 0) {
      return wb.SheetNames;
    }
  } catch (err) {
    console.warn('Soft fail parsing sheets ahead of time:', err);
  }
  return [];
}

export async function parseSheetPreview(
  buf: ArrayBuffer,
  selectedSheet?: string
): Promise<{ headers: string[]; rows: any[][] }> {
  try {
    const xlsxModule = (await import('xlsx')) as any;
    const XLSX = xlsxModule.read ? xlsxModule : xlsxModule.default ?? xlsxModule;
    const wb = XLSX.read(buf, { type: 'buffer' });
    const targetSheet = selectedSheet || wb.SheetNames[0];
    const ws = wb.Sheets[targetSheet];
    if (!ws) return { headers: [], rows: [] };
    const aoa: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const headers = (aoa[0] as string[]) || [];
    const rows = (aoa.slice(1, 5) as any[][]) || [];
    return { headers, rows };
  } catch {
    return { headers: [], rows: [] };
  }
}

export async function convertExcelToCsv(options: {
  file: File;
  fileData?: ArrayBuffer | null;
  selectedSheet?: string;
  delimiter?: string;
}): Promise<ExcelToCsvResult> {
  const { file, fileData, selectedSheet, delimiter } = options;

  const xlsxModule = (await import('xlsx')) as any;
  const XLSX = xlsxModule.read ? xlsxModule : xlsxModule.default ?? xlsxModule;
  const buf = fileData ?? (await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: 'buffer' });
  const targetSheet = selectedSheet || wb.SheetNames[0];
  const ws = wb.Sheets[targetSheet];
  const csv = XLSX.utils.sheet_to_csv(ws, { FS: delimiter || ',' });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const baseName = file.name.replace(/\.(xlsx?|xls|ods)$/i, '');
  const filename =
    wb.SheetNames.length > 1 ? `${baseName}_${targetSheet}.csv` : `${baseName}.csv`;

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    textOutput: csv,
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
