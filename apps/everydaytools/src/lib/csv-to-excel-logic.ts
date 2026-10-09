import type { ConversionFormat } from '@/components/conversion';

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'CSV',
  extension: 'csv',
  icon: '/icons/csv.svg',
  color: '#21A366',
  subLabel: isFr ? 'Données CSV Délimitées' : 'Delimited CSV Data',
});

export const getTargetFormat = (): ConversionFormat => ({
  name: 'Excel',
  extension: 'xlsx',
  icon: '/icons/excel.svg',
  color: '#107C41',
  subLabel: 'Microsoft Excel XLSX',
});

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateCsvFile(file: File, isFr: boolean): FileValidationResult {
  const isCsv =
    file.name.toLowerCase().endsWith('.csv') ||
    file.name.toLowerCase().endsWith('.tsv') ||
    file.name.toLowerCase().endsWith('.txt') ||
    file.type === 'text/csv' ||
    file.type === 'text/tab-separated-values' ||
    file.type === 'text/plain' ||
    file.type === '';

  if (!isCsv) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier CSV (.csv) valide.'
        : 'Please select a valid CSV (.csv) file.',
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'The file exceeds the maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export function buildExcelFilename(
  mode: 'upload' | 'paste',
  file?: File,
  isFr = false
): string {
  if (mode === 'upload' && file) {
    return file.name.replace(/\.(csv|tsv|txt)$/i, '.xlsx');
  }
  return isFr ? 'donnees-export.xlsx' : 'export-data.xlsx';
}

export async function convertCsvToExcel(
  csvText: string,
  isFr = false,
  delimiter?: string
): Promise<Blob> {
  const trimmed = csvText.trim();
  if (!trimmed) {
    throw new Error(
      isFr
        ? 'Aucune donnée CSV valide trouvée.'
        : 'No valid CSV data found.'
    );
  }

  const [PapaModule, XLSXModule] = await Promise.all([
    import('papaparse'),
    import('xlsx'),
  ]);

  const Papa = PapaModule.default ?? PapaModule;
  const XLSX = XLSXModule.default ?? XLSXModule;

  const { data } = Papa.parse<string[]>(csvText, {
    skipEmptyLines: true,
    delimiter: delimiter || undefined,
  });
  if (!data || data.length === 0) {
    throw new Error(
      isFr
        ? 'Aucune donnée CSV valide trouvée dans le fichier.'
        : 'No valid CSV data found in file.'
    );
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, isFr ? 'Feuille 1' : 'Sheet 1');

  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
