import Papa from 'papaparse';
import type { ConversionFormat } from '@/components/conversion';

export type ConversionDirection = 'csv-to-json' | 'json-to-csv';
export type ConversionInputMode = 'upload' | 'paste';

export const MAX_CSV_JSON_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export const SAMPLE_CSV_TEXT =
  'id,nom,email,role,actif\n1,Alice,alice@example.com,Admin,true\n2,Bob,bob@example.com,User,false\n3,Claire,claire@example.com,Manager,true';

export const SAMPLE_JSON_TEXT =
  '[\n  {\n    "id": 1,\n    "nom": "Alice",\n    "email": "alice@example.com",\n    "role": "Admin"\n  },\n  {\n    "id": 2,\n    "nom": "Bob",\n    "email": "bob@example.com",\n    "role": "User"\n  }\n]';

export function getCsvFormat(isFr: boolean): ConversionFormat {
  return {
    name: 'CSV',
    extension: 'csv',
    icon: '/icons/csv.svg',
    color: 'var(--accent, #10b981)',
    subLabel: isFr ? 'Données CSV Délimitées' : 'Delimited CSV Data',
  };
}

export function getJsonFormat(isFr: boolean): ConversionFormat {
  return {
    name: 'JSON',
    extension: 'json',
    icon: '/icons/json.svg',
    color: 'var(--accent, #f59e0b)',
    subLabel: isFr ? 'Notation Objet JavaScript' : 'JavaScript Object Notation',
  };
}

export function validateCsvJsonFile(
  file: File,
  direction: ConversionDirection
): { valid: boolean; error?: 'unsupported_format' | 'file_too_large' } {
  const ext = file.name.toLowerCase();
  const isCsvTarget = direction === 'csv-to-json';

  if (isCsvTarget) {
    const hasValidExt = ext.endsWith('.csv') || ext.endsWith('.tsv') || ext.endsWith('.txt');
    const hasValidType = file.type === 'text/csv' || file.type === 'text/plain' || (file.type === '' && hasValidExt);
    if (!hasValidExt && !hasValidType) {
      return { valid: false, error: 'unsupported_format' };
    }
  } else {
    const hasValidExt = ext.endsWith('.json') || ext.endsWith('.txt');
    const hasValidType = file.type === 'application/json' || file.type === 'text/plain' || (file.type === '' && hasValidExt);
    if (!hasValidExt && !hasValidType) {
      return { valid: false, error: 'unsupported_format' };
    }
  }

  if (file.size > MAX_CSV_JSON_FILE_SIZE) {
    return { valid: false, error: 'file_too_large' };
  }

  return { valid: true };
}

export function convertCsvToJson(rawText: string, isFr: boolean, delimiter?: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error(isFr ? 'Le contenu CSV est vide.' : 'CSV content is empty.');
  }

  const parsed = Papa.parse(trimmed, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    delimiter: delimiter || undefined,
  });

  if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error(
      parsed.errors[0]?.message ?? (isFr ? 'Format CSV invalide.' : 'Invalid CSV format.')
    );
  }

  return JSON.stringify(parsed.data, null, 2);
}

export function convertJsonToCsv(rawText: string, isFr: boolean, delimiter?: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error(isFr ? 'Le contenu JSON est vide.' : 'JSON content is empty.');
  }

  const jsonData = JSON.parse(trimmed);
  const rows = Array.isArray(jsonData) ? jsonData : [jsonData];
  if (rows.length === 0) {
    throw new Error(isFr ? 'Le tableau JSON est vide.' : 'JSON array is empty.');
  }

  return Papa.unparse(rows, { delimiter: delimiter || ',' });
}

export function resolveConvertedFilename(
  inputMode: ConversionInputMode,
  file: File | null,
  direction: ConversionDirection,
  isFr: boolean
): string {
  const outExt = direction === 'csv-to-json' ? '.json' : '.csv';
  if (inputMode === 'upload' && file) {
    return file.name.replace(/\.[^.]+$/i, outExt);
  }
  const defaultBase = isFr ? 'donnees-converties' : 'converted-data';
  return `${defaultBase}${outExt}`;
}

export function parseCsvJsonPreview(
  rawText: string,
  direction: ConversionDirection,
  delimiter?: string
): { headers: string[]; rows: any[][] } {
  if (!rawText.trim()) return { headers: [], rows: [] };
  try {
    if (direction === 'csv-to-json') {
      const parsed = Papa.parse(rawText, {
        preview: 6,
        delimiter: delimiter || undefined,
        skipEmptyLines: true,
      });
      const headers = (parsed.data[0] as string[]) || [];
      const rows = (parsed.data.slice(1) as any[][]) || [];
      return { headers, rows };
    } else {
      const parsed = JSON.parse(rawText);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const headers = Object.keys(arr[0] || {});
      const rows = arr.slice(0, 5).map((item) => headers.map((h) => item[h]));
      return { headers, rows };
    }
  } catch {
    return { headers: [], rows: [] };
  }
}

export async function readEncodedText(file: File, encoding: string): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder(encoding || 'utf-8');
    return decoder.decode(buffer);
  } catch {
    return file.text();
  }
}
