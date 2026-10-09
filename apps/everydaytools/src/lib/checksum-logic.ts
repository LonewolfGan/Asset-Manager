import { md5Bytes } from './hash-logic';
import type { ConversionFormat } from '@/components/conversion';

export type ChecksumAlgo = 'SHA-256' | 'SHA-512' | 'MD5' | 'SHA-1' | 'SHA-384';

export interface AlgoMeta {
  id: ChecksumAlgo;
  name: string;
  bits: number;
  descriptionFr: string;
  descriptionEn: string;
  isStandard?: boolean;
}

export const ALGO_METAS: AlgoMeta[] = [
  {
    id: 'SHA-256',
    name: 'SHA-256',
    bits: 256,
    descriptionFr: 'Standard mondial d’intégrité logicielle',
    descriptionEn: 'Worldwide software integrity standard',
    isStandard: true,
  },
  {
    id: 'SHA-512',
    name: 'SHA-512',
    bits: 512,
    descriptionFr: 'Haute résistance aux collisions (Linux & paquets critiques)',
    descriptionEn: 'High collision resistance (Linux & critical binaries)',
  },
  {
    id: 'MD5',
    name: 'MD5',
    bits: 128,
    descriptionFr: 'Somme de contrôle patrimoniale',
    descriptionEn: 'Legacy checksum digest',
  },
  {
    id: 'SHA-1',
    name: 'SHA-1',
    bits: 160,
    descriptionFr: 'Empreinte historique (dépôts Git hérités)',
    descriptionEn: 'Historical hash digest (legacy Git archives)',
  },
  {
    id: 'SHA-384',
    name: 'SHA-384',
    bits: 384,
    descriptionFr: 'Variante de conformité SHA-2',
    descriptionEn: 'SHA-2 compliance variant',
  },
];

export function formatBytes(bytes: number, isFr: boolean = true): string {
  if (bytes === 0) return isFr ? '0 o' : '0 B';
  const k = 1024;
  const sizesFr = ['o', 'Ko', 'Mo', 'Go', 'To'];
  const sizesEn = ['B', 'KB', 'MB', 'GB', 'TB'];
  const sizes = isFr ? sizesFr : sizesEn;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Compute cryptographic digest with native Web Crypto API
 */
export async function computeSubtleHex(
  buffer: ArrayBuffer,
  algo: string
): Promise<string> {
  const digest = await crypto.subtle.digest(algo, buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compute all cryptographic checksums in parallel (Web Crypto + pure JS MD5)
 */
export async function computeAllChecksums(
  buffer: ArrayBuffer,
  isFr: boolean = true
): Promise<Record<ChecksumAlgo, string>> {
  const [sha256, sha512, sha1, sha384] = await Promise.all([
    computeSubtleHex(buffer, 'SHA-256'),
    computeSubtleHex(buffer, 'SHA-512'),
    computeSubtleHex(buffer, 'SHA-1'),
    computeSubtleHex(buffer, 'SHA-384'),
  ]);

  let md5 = '';
  try {
    if (buffer.byteLength <= 100 * 1024 * 1024) {
      md5 = md5Bytes(new Uint8Array(buffer));
    } else {
      md5 = isFr ? '(Fichier > 100 Mo)' : '(File > 100MB)';
    }
  } catch {
    md5 = '';
  }

  return {
    'SHA-256': sha256,
    'SHA-512': sha512,
    MD5: md5,
    'SHA-1': sha1,
    'SHA-384': sha384,
  };
}

/**
 * Identify matching algorithm from expected hash input
 */
export function findMatchingAlgo(
  expected: string,
  hashes: Record<ChecksumAlgo, string> | null
): ChecksumAlgo | null {
  const normalized = expected.trim().toLowerCase();
  if (!normalized || !hashes) return null;
  return (
    ALGO_METAS.find((m) => hashes[m.id]?.toLowerCase() === normalized)?.id ?? null
  );
}

/**
 * Build standard UNIX checksum file content: `<hash>  <filename>\n`
 */
export function buildSingleChecksumFile(hash: string, filename: string): string {
  return `${hash.toLowerCase()}  ${filename}\n`;
}

/**
 * Build comprehensive text verification report
 */
export function buildChecksumReportText(
  filename: string,
  size: number,
  hashes: Record<ChecksumAlgo, string>,
  isFr: boolean
): string {
  const dateStr = new Date().toISOString();
  const lines = [
    '=================================================================',
    `RAPPORT D'INTÉGRITÉ CRYPTOGRAPHIQUE / CHECKSUM REPORT`,
    '=================================================================',
    `Fichier / File     : ${filename}`,
    `Taille / Size      : ${formatBytes(size, isFr)} (${size.toLocaleString(isFr ? 'fr-FR' : 'en-US')} ${isFr ? 'octets' : 'bytes'})`,
    `Horodatage / Date  : ${dateStr}`,
    '-----------------------------------------------------------------',
    `SHA-256 : ${hashes['SHA-256'].toLowerCase()}`,
    `SHA-512 : ${hashes['SHA-512'].toLowerCase()}`,
    `MD5     : ${hashes['MD5'].toLowerCase()}`,
    `SHA-1   : ${hashes['SHA-1'].toLowerCase()}`,
    `SHA-384 : ${hashes['SHA-384'].toLowerCase()}`,
    '=================================================================',
    isFr
      ? 'Généré en local avec EverydayTools (https://everydaytools.com)'
      : 'Generated locally with EverydayTools (https://everydaytools.com)',
  ];
  return lines.join('\n');
}

/**
 * Trigger text file download in browser
 */
export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Dropzone format definition for checksum tool
 */
export function getSourceDropzoneFormat(isFr: boolean): ConversionFormat {
  return {
    name: isFr ? 'Fichier' : 'File',
    extension: '*',
    icon: '/icons/file.svg',
    color: '#FF6B35',
    subLabel: isFr
      ? 'Tout type de fichier (ISO, ZIP, PDF, EXE, Image...)'
      : 'Any file type (ISO, ZIP, PDF, EXE, Image...)',
  };
}
