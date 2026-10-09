import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const SAMPLE_HEADERS_FR = ['Nom & Prénom', 'Email', 'Département', 'Poste', 'Statut', 'Budget (€)'];
export const SAMPLE_HEADERS_EN = ['Full Name', 'Email', 'Department', 'Position', 'Status', 'Budget ($)'];

export const SAMPLE_ROWS_FR = [
  ['Alexandre Martin', 'a.martin@entreprise.com', 'Direction', 'Directeur Général', 'Actif', '45 000'],
  ['Sophie Bernard', 's.bernard@entreprise.com', 'Finance', 'Responsable Comptable', 'Actif', '28 500'],
  ['Thomas Dubois', 't.dubois@entreprise.com', 'Technique', 'Lead Développeur', 'Actif', '35 000'],
  ['Émilie Moreau', 'e.moreau@entreprise.com', 'Marketing', 'Chef de Projet Digital', 'Actif', '18 200'],
  ['Lucas Petit', 'l.petit@entreprise.com', 'Ressources Humaines', 'Chargé de Recrutement', 'En attente', '12 000'],
  ['Camille Roux', 'c.roux@entreprise.com', 'Commercial', 'Account Manager', 'Actif', '22 000'],
];

export const SAMPLE_ROWS_EN = [
  ['Alex Martin', 'a.martin@company.com', 'Management', 'Managing Director', 'Active', '45,000'],
  ['Sophie Bernard', 's.bernard@company.com', 'Finance', 'Accounting Manager', 'Active', '28,500'],
  ['Thomas Dubois', 't.dubois@company.com', 'Engineering', 'Lead Developer', 'Active', '35,000'],
  ['Emily Moreau', 'e.moreau@company.com', 'Marketing', 'Digital Project Manager', 'Active', '18,200'],
  ['Lucas Petit', 'l.petit@company.com', 'Human Resources', 'Recruiter', 'Pending', '12,000'],
  ['Camille Roux', 'c.roux@company.com', 'Sales', 'Account Manager', 'Active', '22,000'],
];

export interface TableSnapshot {
  headers: string[];
  rows: string[][];
  documentName: string;
}

export type SortConfig = { colIndex: number; direction: 'asc' | 'desc' } | null;

export interface ProcessedRow {
  row: string[];
  originalIndex: number;
}

export function createBlankTable(isFr: boolean) {
  return {
    headers: [
      isFr ? 'Colonne 1' : 'Column 1',
      isFr ? 'Colonne 2' : 'Column 2',
      isFr ? 'Colonne 3' : 'Column 3',
      isFr ? 'Colonne 4' : 'Column 4',
    ],
    rows: [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
    ],
    documentName: isFr ? 'nouveau_tableau' : 'new_table',
  };
}

export function createSampleTable(isFr: boolean) {
  return {
    headers: isFr ? [...SAMPLE_HEADERS_FR] : [...SAMPLE_HEADERS_EN],
    rows: (isFr ? SAMPLE_ROWS_FR : SAMPLE_ROWS_EN).map((r) => [...r]),
    documentName: isFr ? 'donnees_exemple' : 'sample_data',
  };
}

export function parseCsvString(csvContent: string): { headers: string[]; rows: string[][] } {
  const res = Papa.parse(csvContent, { skipEmptyLines: 'greedy' });
  if (res.data && res.data.length > 0) {
    const raw = res.data as string[][];
    const headers = raw[0].map((h, i) => (h ? String(h).trim() : `Col ${i + 1}`));
    const rows = raw.slice(1).map((r) => {
      const row: string[] = [];
      for (let i = 0; i < headers.length; i++) {
        row.push(String(r[i] ?? ''));
      }
      return row;
    });
    return {
      headers,
      rows: rows.length > 0 ? rows : [new Array(headers.length).fill('')],
    };
  }
  throw new Error('Empty CSV');
}

export function parseExcelArrayBuffer(buffer: ArrayBuffer, isFr: boolean): { headers: string[]; rows: string[][] } {
  const data = new Uint8Array(buffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const raw = XLSX.utils.sheet_to_json<any[]>(worksheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });

  if (raw.length > 0) {
    const headers = raw[0].map((h, i) => String(h || `Col ${i + 1}`));
    const rows = raw.slice(1).map((r) => {
      const row: string[] = [];
      for (let i = 0; i < headers.length; i++) {
        row.push(String(r[i] ?? ''));
      }
      return row;
    });

    return {
      headers,
      rows: rows.length > 0 ? rows : [new Array(headers.length).fill('')],
    };
  }

  throw new Error(isFr ? 'La feuille Excel est vide.' : 'The Excel sheet is empty.');
}

export function generateCsvBlob(headers: string[], rows: string[][], delimiter: string = ','): Blob {
  const csv = Papa.unparse({ fields: headers, data: rows }, { delimiter });
  return new Blob([csv], { type: 'text/csv;charset=utf-8' });
}

export function generateExcelBlob(headers: string[], rows: string[][]): Blob {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Feuille1');
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function filterAndSortRows(
  rows: string[][],
  searchQuery: string,
  sortConfig: SortConfig
): ProcessedRow[] {
  let indexed = rows.map((row, originalIndex) => ({ row, originalIndex }));

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    indexed = indexed.filter(({ row }) =>
      row.some((cell) => String(cell).toLowerCase().includes(query))
    );
  }

  if (sortConfig !== null) {
    const { colIndex, direction } = sortConfig;
    indexed.sort((a, b) => {
      const valA = String(a.row[colIndex] ?? '').trim();
      const valB = String(b.row[colIndex] ?? '').trim();

      const numA = parseFloat(valA.replace(/\s+/g, '').replace(',', '.'));
      const numB = parseFloat(valB.replace(/\s+/g, '').replace(',', '.'));

      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === 'asc' ? numA - numB : numB - numA;
      }

      return direction === 'asc'
        ? valA.localeCompare(valB, undefined, { numeric: true })
        : valB.localeCompare(valA, undefined, { numeric: true });
    });
  }

  return indexed;
}
