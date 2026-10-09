/**
 * Détecte et renvoie le chemin de l'icône SVG officielle correspondant au format d'un fichier.
 * Toutes les icônes cibles utilisent des couleurs vives et contrastées adaptées au Light Mode et Dark Mode.
 */
export function getFileFormatIcon(file?: File | string | null, fallbackIcon: string = '/icons/image.svg'): string {
  if (!file) return fallbackIcon;
  const filename = typeof file === 'string' ? file : file.name;
  if (!filename) return fallbackIcon;

  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return '/icons/png.svg';
    case 'jpg':
    case 'jpeg':
      return '/icons/jpg.svg';
    case 'webp':
      return '/icons/webp.svg';
    case 'svg':
      return '/icons/svg.svg';
    case 'avif':
      return '/icons/avif.svg';
    case 'gif':
      return '/icons/gif.svg';
    case 'heic':
      return '/icons/heic.svg';
    case 'tiff':
    case 'tif':
      return '/icons/tiff.svg';
    case 'pdf':
      return '/icons/pdf.svg';
    case 'csv':
      return '/icons/csv.svg';
    case 'xlsx':
    case 'xls':
      return '/icons/excel.svg';
    case 'docx':
    case 'doc':
      return '/icons/word.svg';
    case 'pptx':
    case 'ppt':
      return '/icons/pptx.svg';
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
    default:
      return fallbackIcon;
  }
}
