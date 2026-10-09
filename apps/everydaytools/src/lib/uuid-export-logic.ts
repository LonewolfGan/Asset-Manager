import type { UuidVersion, UuidFormatOptions } from '@/lib/uuid-logic';

export type EnclosureType = 'none' | 'braces' | 'quotes';

export const QUANTITY_PRESETS = [1, 5, 10, 25, 50, 100];

export function buildUuidTextFileContent(uuids: string[]): string {
  return uuids.join('\n');
}

export function buildUuidCsvFileContent(uuids: string[]): string {
  return 'Index,UUID\n' + uuids.map((id, i) => `${i + 1},${id}`).join('\n');
}

export function buildFormatOptions(
  version: UuidVersion | 'nil',
  hyphens: boolean,
  uppercase: boolean,
  enclosure: EnclosureType
): UuidFormatOptions {
  return {
    version: version === 'nil' ? 'v4' : version,
    hyphens,
    uppercase,
    braces: enclosure === 'braces',
    quotes: enclosure === 'quotes',
  };
}

export function getUuidExportFilename(
  version: UuidVersion | 'nil',
  count: number,
  extension: string
): string {
  return `uuids-${version}-${count}.${extension}`;
}

export function triggerFileDownload(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
