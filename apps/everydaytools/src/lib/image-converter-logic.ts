export interface ConversionFormat {
  id: string;
  label: string;
  mime: string;
  ext: string;
  description: string;
  hasQuality: boolean;
}

export const SUPPORTED_CONVERSION_FORMATS: ConversionFormat[] = [
  { id: 'webp', label: 'WEBP', mime: 'image/webp', ext: 'webp', description: 'Idéal pour le web, ultra léger', hasQuality: true },
  { id: 'jpeg', label: 'JPG / JPEG', mime: 'image/jpeg', ext: 'jpg', description: 'Standard universel pour photos', hasQuality: true },
  { id: 'png', label: 'PNG', mime: 'image/png', ext: 'png', description: 'Sans perte avec canal alpha transparent', hasQuality: false },
  { id: 'avif', label: 'AVIF', mime: 'image/avif', ext: 'avif', description: 'Compression moderne jusqu’à 50% plus efficace que WebP', hasQuality: true },
  { id: 'gif', label: 'GIF', mime: 'image/gif', ext: 'gif', description: 'Animation & rétro-compatibilité', hasQuality: false },
  { id: 'bmp', label: 'BMP', mime: 'image/bmp', ext: 'bmp', description: 'Format non compressé Windows', hasQuality: false },
  { id: 'tiff', label: 'TIFF', mime: 'image/tiff', ext: 'tiff', description: 'Haute fidélité pour édition et impression', hasQuality: false },
  { id: 'pdf', label: 'PDF', mime: 'application/pdf', ext: 'pdf', description: 'Document portable prêt pour l’impression', hasQuality: false },
];

export function getTargetFilename(originalName: string, targetExt: string): string {
  const base = originalName.replace(/\.[^/.]+$/, '');
  return `${base}.${targetExt}`;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
