export type Level = 'light' | 'balanced' | 'strong';

export interface CompressionPreset {
  id: Level;
  index: string;
  name: string;
  tag: string;
  quality: number;
  ratio: number;
  gainLabel: string;
  description: string;
}

export const COMPRESSION_PRESETS = [
  { id: 'lossless', name: 'Sans perte', quality: 95, ratio: 0.9 },
  { id: 'balanced', name: 'Équilibrée', quality: 80, ratio: 0.4 },
  { id: 'aggressive', name: 'Agressive', quality: 60, ratio: 0.2 },
];

/**
 * Return the 3 architectural compression presets (Light, Balanced, Strong)
 */
export function getCompressionPresets(isFr: boolean): CompressionPreset[] {
  return [
    {
      id: 'light',
      index: '01',
      name: isFr ? 'Légère' : 'Light',
      tag: isFr ? 'Qualité maximale' : 'Maximum quality',
      quality: 88,
      ratio: 0.7,
      gainLabel: '-30%',
      description: isFr
        ? 'Préserve les détails les plus fins et la netteté intégrale des textures.'
        : 'Preserves the finest details and full texture sharpness.',
    },
    {
      id: 'balanced',
      index: '02',
      name: isFr ? 'Équilibrée' : 'Balanced',
      tag: isFr ? 'Recommandé' : 'Recommended',
      quality: 75,
      ratio: 0.4,
      gainLabel: '-60%',
      description: isFr
        ? 'Le meilleur équilibre pour partager rapidement par e-mail ou sur le web.'
        : 'Best balance for fast sharing via email or web.',
    },
    {
      id: 'strong',
      index: '03',
      name: isFr ? 'Maximale' : 'Maximum',
      tag: isFr ? 'Poids minimum' : 'Smallest size',
      quality: 55,
      ratio: 0.2,
      gainLabel: '-80%',
      description: isFr
        ? 'Réduction poussée pour minimiser le poids au maximum.'
        : 'Aggressive compression to minimize file size.',
    },
  ];
}

/**
 * Estimate output size based on ratio with a minimum floor of 1024 bytes
 */
export function calculateEstimatedSize(fileSize: number, ratio: number): number {
  return Math.max(Math.round(fileSize * ratio), 1024);
}

/**
 * Calculate percentage reduction gain (clamped at 0 minimum)
 */
export function calculateCompressionGain(originalSize: number, compressedSize: number): number {
  if (originalSize <= 0) return 0;
  return Math.max(0, Math.round((1 - compressedSize / originalSize) * 100));
}

/**
 * Calculate savings details between original and compressed size
 */
export function calculateSavings(originalSize: number, compressedSize: number) {
  if (originalSize <= 0) {
    return {
      savedBytes: 0,
      percentage: 0,
      isReduced: false,
      displayPercentage: '0%',
    };
  }
  const savedBytes = originalSize - compressedSize;
  const percentage = Math.round((savedBytes / originalSize) * 100);
  const isReduced = savedBytes > 0;
  const displayPercentage = isReduced ? `-${percentage}%` : `+${Math.abs(percentage)}%`;
  return {
    savedBytes,
    percentage: Math.max(0, percentage),
    isReduced,
    displayPercentage,
  };
}

/**
 * Calculate aggregated savings for multiple items
 */
export function calculateTotalSavings(
  items: { originalSize: number; compressedSize?: number; status: string }[]
) {
  const completed = items.filter((i) => i.status === 'done' && i.compressedSize !== undefined);
  const totalOriginal = completed.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompressed = completed.reduce((acc, i) => acc + (i.compressedSize ?? 0), 0);
  const totalSaved = Math.max(0, totalOriginal - totalCompressed);
  const savingsPercentage = totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0;
  return {
    completedCount: completed.length,
    totalOriginal,
    totalCompressed,
    totalSaved,
    savingsPercentage,
  };
}

/**
 * Calculate scaled dimensions respecting aspect ratio
 */
export function calculateAspectRatioDimensions(
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  let w = width;
  let h = height;
  if (maxWidth && w > maxWidth) {
    h = Math.round((h * maxWidth) / w);
    w = maxWidth;
  }
  if (maxHeight && h > maxHeight) {
    w = Math.round((w * maxHeight) / h);
    h = maxHeight;
  }
  return { width: w, height: h };
}

/**
 * Format bytes for display in test suite
 */
export function formatBytes(bytes: number): string {
  if (isNaN(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i === 0) return `${bytes} B`;
  const val = bytes / Math.pow(k, i);
  if (i === 1) return `${val.toFixed(1)} KB`;
  return `${val.toFixed(2)} MB`;
}

/**
 * Generate output filename with `_compressed` suffix before file extension
 */
export function generateCompressedFilename(originalName: string): string {
  if (originalName.includes('.')) {
    return originalName.replace(/(\.[^.]+)$/, '_compressed$1');
  }
  return `${originalName}_compressed`;
}
