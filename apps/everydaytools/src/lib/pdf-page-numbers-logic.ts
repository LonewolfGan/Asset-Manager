import type { ConversionFormat } from '@/components/conversion';

export type PdfNumberPosition =
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'top-right'
  | 'top-left';

export const BASE_SOURCE_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document source',
};

export const BASE_TARGET_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#FF6B35',
  subLabel: 'Document numéroté',
};

export interface PageNumberLabelParams {
  format: string;
  previewPage: number;
  startNum: number;
  skipFirst: boolean;
  totalPages: number | null;
  isFr: boolean;
}

/**
 * Calculates dynamic stamp label according to page index, start offset, cover exclusion, and format.
 */
export function formatPageNumberLabel({
  format,
  previewPage,
  startNum,
  skipFirst,
  totalPages,
  isFr,
}: PageNumberLabelParams): string | null {
  if (skipFirst && previewPage === 1) {
    return null;
  }
  const currentNumber = previewPage - 1 + startNum - (skipFirst ? 1 : 0);
  const totalCount = totalPages ? totalPages - (skipFirst ? 1 : 0) : 10;

  if (format === 'Page {n}') return `Page ${currentNumber}`;
  if (format === 'Page {n} of {total}') {
    return isFr
      ? `Page ${currentNumber} sur ${totalCount}`
      : `Page ${currentNumber} of ${totalCount}`;
  }
  if (format === '{n}/{total}') return `${currentNumber}/${totalCount}`;
  return `${currentNumber}`;
}

export interface PositionOption {
  id: PdfNumberPosition;
  label: string;
  shortLabel: string;
}

export function getPositionOptions(
  tc: Record<string, any> = {},
  isFr: boolean
): PositionOption[] {
  return [
    {
      id: 'top-left',
      label: tc.positions?.topLeft ?? (isFr ? 'Haut Gauche' : 'Top Left'),
      shortLabel: isFr ? 'Haut G.' : 'Top L.',
    },
    {
      id: 'top-center',
      label: tc.positions?.topCenter ?? (isFr ? 'Haut Centre' : 'Top Center'),
      shortLabel: isFr ? 'Haut C.' : 'Top C.',
    },
    {
      id: 'top-right',
      label: tc.positions?.topRight ?? (isFr ? 'Haut Droite' : 'Top Right'),
      shortLabel: isFr ? 'Haut D.' : 'Top R.',
    },
    {
      id: 'bottom-left',
      label: tc.positions?.bottomLeft ?? (isFr ? 'Bas Gauche' : 'Bottom Left'),
      shortLabel: isFr ? 'Bas G.' : 'Bottom L.',
    },
    {
      id: 'bottom-center',
      label: tc.positions?.bottomCenter ?? (isFr ? 'Bas Centre' : 'Bottom Center'),
      shortLabel: isFr ? 'Bas C.' : 'Bottom C.',
    },
    {
      id: 'bottom-right',
      label: tc.positions?.bottomRight ?? (isFr ? 'Bas Droite' : 'Bottom Right'),
      shortLabel: isFr ? 'Bas D.' : 'Bottom R.',
    },
  ];
}

export interface FormatOption {
  id: string;
  label: string;
}

export function getFormatOptions(isFr: boolean): FormatOption[] {
  return [
    { id: '{n}', label: '1, 2, 3...' },
    { id: 'Page {n}', label: 'Page 1, 2...' },
    { id: 'Page {n} of {total}', label: isFr ? 'Page 1 sur 10...' : 'Page 1 of 10...' },
    { id: '{n}/{total}', label: '1/10, 2/10...' },
  ];
}
