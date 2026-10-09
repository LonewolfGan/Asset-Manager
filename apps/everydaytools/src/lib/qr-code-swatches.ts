import { getContrastRatio } from './qr-code-logic';

export interface IconSwatch {
  label: string;
  color: string;
}

export function getAvailableIconSwatches(
  fgColor: string,
  bgColor: string,
  isFr: boolean
): IconSwatch[] {
  const candidates: IconSwatch[] = [
    { label: isFr ? 'Motif' : 'Pattern', color: fgColor },
    { label: 'Orange', color: '#FF6B35' },
    { label: isFr ? 'Noir' : 'Black', color: '#09090b' },
    { label: isFr ? 'Blanc' : 'White', color: '#ffffff' },
    { label: isFr ? 'Bleu' : 'Blue', color: '#2563eb' },
    { label: isFr ? 'Vert' : 'Green', color: '#10b981' },
    { label: isFr ? 'Violet' : 'Purple', color: '#8b5cf6' },
  ];

  const highContrast = candidates.filter(
    (item) => getContrastRatio(item.color, bgColor) >= 3.0
  );
  const seen = new Set<string>();
  const deduplicated: IconSwatch[] = [];
  for (const item of highContrast) {
    const hexLower = item.color.toLowerCase();
    if (!seen.has(hexLower)) {
      seen.add(hexLower);
      deduplicated.push(item);
    }
  }
  return deduplicated;
}
