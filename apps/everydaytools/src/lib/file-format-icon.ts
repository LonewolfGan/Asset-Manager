/**
 * Détecte et renvoie le chemin de l'icône SVG correspondant au format d'un fichier.
 * - Formats images (PNG, JPG, WebP, SVG, AVIF, GIF, etc.) : icône d'image universelle (/icons/image.svg).
 * - Formats bureautiques & logiciels officiels (PDF, Word, Excel, PowerPoint, etc.) : icônes officielles de la suite.
 * - Défaut / Fichier générique : icône générique de fichier (/icons/file.svg).
 */
export function getFileFormatIcon(file?: File | string | null, fallbackIcon: string = '/icons/file.svg'): string {
  if (!file) return fallbackIcon;
  const filename = typeof file === 'string' ? file : file.name;

  if (filename && filename.includes('.')) {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      // 1. Formats d'image génériques (PNG, JPG, WebP, SVG, AVIF, GIF, etc.) : icône universelle image.svg
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
      case 'svg':
      case 'avif':
      case 'gif':
      case 'heic':
      case 'tiff':
      case 'tif':
      case 'bmp':
      case 'ico':
        return '/icons/image.svg';

      // 2. Formats bureautiques & applicatifs officiels reconnus
      case 'pdf':
        return '/icons/pdf.svg';
      case 'docx':
      case 'doc':
        return '/icons/word.svg';
      case 'odt':
        return '/icons/odt.svg';
      case 'rtf':
        return '/icons/rtf.svg';
      case 'epub':
        return '/icons/epub.svg';
      case 'xlsx':
      case 'xls':
        return '/icons/excel.svg';
      case 'csv':
        return '/icons/csv.svg';
      case 'pptx':
      case 'ppt':
        return '/icons/pptx.svg';

      // 3. Formats structurés, code et texte
      case 'json':
        return '/icons/json.svg';
      case 'md':
      case 'markdown':
        return '/icons/markdown.svg';
      case 'txt':
        return '/icons/txt.svg';
      case 'xml':
        return '/icons/xml.svg';
      case 'yaml':
      case 'yml':
        return '/icons/yaml.svg';
      case 'html':
      case 'htm':
        return '/icons/html.svg';
    }
  }

  // Fallback secondaire sur le type MIME pour les fichiers/blobs sans extension
  if (typeof file !== 'string' && file && 'type' in file && file.type?.startsWith('image/')) {
    return '/icons/image.svg';
  }

  // 4. Par défaut : icône générique de fichier file.svg
  return fallbackIcon;
}
