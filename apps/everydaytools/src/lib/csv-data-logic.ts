/**
 * Tabular and CSV parsing, delimiter auto-detection, JSON/Excel bidirectional transformation.
 */

export interface ParsedTable {
  headers: string[];
  rows: string[][];
  rowCount: number;
  colCount: number;
  delimiter: string;
}

/**
 * Auto-detect delimiter from first few lines (, ; \t |)
 */
export function detectDelimiter(csvText: string): ',' | ';' | '\t' | '|' {
  const lines = csvText.trim().split('\n').slice(0, 5);
  if (lines.length === 0) return ',';

  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0, '|': 0 };

  for (const line of lines) {
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (!inQuotes && char in counts) {
        counts[char]++;
      }
    }
  }

  let bestDelim: ',' | ';' | '\t' | '|' = ',';
  let maxCount = -1;

  for (const [delim, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      bestDelim = delim as ',' | ';' | '\t' | '|';
    }
  }

  return maxCount > 0 ? bestDelim : ',';
}

/**
 * Robust CSV Line Tokenizer handling quotes, escaped quotes, and newlines inside quotes
 */
export function parseCsvRows(csvText: string, delimiter?: string): string[][] {
  const delim = delimiter || detectDelimiter(csvText);
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delim && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentVal.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal.length > 0 || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Parse CSV into structured table with headers and data rows
 */
export function parseCsvToTable(
  csvText: string,
  options: { delimiter?: string; hasHeader?: boolean } = {}
): ParsedTable {
  const delim = options.delimiter || detectDelimiter(csvText);
  const allRows = parseCsvRows(csvText, delim);

  if (allRows.length === 0) {
    return { headers: [], rows: [], rowCount: 0, colCount: 0, delimiter: delim };
  }

  const hasHeader = options.hasHeader ?? true;
  let headers: string[] = [];
  let rows: string[][] = [];

  if (hasHeader) {
    headers = allRows[0];
    rows = allRows.slice(1);
  } else {
    const maxCols = Math.max(...allRows.map((r) => r.length));
    headers = Array.from({ length: maxCols }, (_, i) => `Colonne ${i + 1}`);
    rows = allRows;
  }

  // Normalize row length to match headers
  const maxCols = headers.length;
  const normalizedRows = rows.map((r) => {
    if (r.length < maxCols) {
      return [...r, ...new Array(maxCols - r.length).fill('')];
    }
    return r.slice(0, maxCols);
  });

  return {
    headers,
    rows: normalizedRows,
    rowCount: normalizedRows.length,
    colCount: maxCols,
    delimiter: delim,
  };
}

/**
 * Convert structured table back to CSV string
 */
export function tableToCsv(
  headers: string[],
  rows: string[][],
  delimiter: string = ','
): string {
  const escapeCell = (val: string) => {
    if (val.includes(delimiter) || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headerLine = headers.map(escapeCell).join(delimiter);
  const dataLines = rows.map((r) => r.map(escapeCell).join(delimiter));

  return [headerLine, ...dataLines].join('\n');
}

/**
 * Convert structured table to JSON array of objects
 */
export function tableToJson(headers: string[], rows: string[][]): Record<string, unknown>[] {
  return rows.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      const val = row[idx] ?? '';
      // Try parsing numbers and booleans
      if (val.toLowerCase() === 'true') obj[header] = true;
      else if (val.toLowerCase() === 'false') obj[header] = false;
      else if (val !== '' && !isNaN(Number(val)) && !val.startsWith('0') && val.length < 15) {
        obj[header] = Number(val);
      } else {
        obj[header] = val;
      }
    });
    return obj;
  });
}

/**
 * Convert JSON array of objects to table
 */
export function jsonToTable(jsonText: string): { headers: string[]; rows: string[][] } {
  const parsed = JSON.parse(jsonText);
  const items = Array.isArray(parsed) ? parsed : [parsed];
  if (items.length === 0) return { headers: [], rows: [] };

  // Collect all unique keys
  const headerSet = new Set<string>();
  items.forEach((item) => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach((k) => headerSet.add(k));
    }
  });

  const headers = Array.from(headerSet);
  const rows = items.map((item) => {
    return headers.map((h) => {
      const val = (item as Record<string, unknown>)?.[h];
      if (val === undefined || val === null) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    });
  });

  return { headers, rows };
}

/**
 * Rich sample datasets for testing
 */
export const SAMPLE_CSV_DATA = {
  sales: `ID_Vente,Client,Produit,Quantité,Prix_Unitaire,Total,Statut
CMD-101,Sophie Dupont,MacBook Pro M3,1,1999.00,1999.00,Livré
CMD-102,Lucas Martin,Écran 4K Dell,2,450.00,900.00,En cours
CMD-103,Emma Bernard,Clavier Sans Fil,3,89.90,269.70,Livré
CMD-104,Thomas Dubois,Casque Bose 700,1,299.00,299.00,Expédié
CMD-105,Camille Leroy,Souris MX Master 3S,2,99.00,198.00,Livré`,

  employees: `Matricule;Nom;Prénom;Département;Poste;Date_Embauche;Actif
EMP-001;Moreau;Claire;Ingénierie;Lead Tech;2021-04-15;true
EMP-002;Lefebvre;Hugo;Design;Product Designer;2022-09-01;true
EMP-003;Roux;Antoine;Marketing;Growth Manager;2023-01-10;true
EMP-004;Fournier;Léa;Finance;Contrôleur de Gestion;2020-11-20;false`,
};

export interface IndexedTabularRow {
  row: string[];
  originalIndex: number;
}

export type TabularSortDir = 'asc' | 'desc' | null;

/**
 * Filter rows by search term across all cells, then sort numerically or alphabetically
 */
export function filterAndSortTabularRows(
  rows: string[][],
  searchQuery: string,
  sortCol: number | null,
  sortDir: TabularSortDir
): IndexedTabularRow[] {
  let list: IndexedTabularRow[] = rows.map((row, originalIndex) => ({ row, originalIndex }));

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(({ row }) =>
      row.some((cell) => String(cell).toLowerCase().includes(q))
    );
  }

  if (sortCol !== null && sortDir !== null) {
    list.sort((a, b) => {
      const valA = String(a.row[sortCol] ?? '').trim();
      const valB = String(b.row[sortCol] ?? '').trim();

      const numA = parseFloat(valA.replace(/\s+/g, '').replace(',', '.'));
      const numB = parseFloat(valB.replace(/\s+/g, '').replace(',', '.'));

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === 'asc' ? numA - numB : numB - numA;
      }

      return sortDir === 'asc'
        ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
        : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  return list;
}

/**
 * Paginate rows with safe boundary calculation
 */
export function paginateTabularRows<T>(items: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
