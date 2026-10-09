import mammoth from 'mammoth';
import type { ConversionFormat } from '@/components/conversion';

export interface WordToEpubResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  textOutput: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: '#185ABD',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'EPUB',
  extension: 'epub',
  icon: '/icons/epub.svg',
  color: '#85BA38',
  subLabel: isFr ? 'eBook universel' : 'Universal eBook',
});

export function validateWordFile(selectedFile: File, isFr = false): FileValidationResult {
  const isWord =
    selectedFile.name.toLowerCase().endsWith('.docx') ||
    selectedFile.name.toLowerCase().endsWith('.doc') ||
    selectedFile.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    selectedFile.type === 'application/msword';

  if (!isWord) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un document Word (.docx ou .doc) valide.'
        : 'Please select a valid Word (.docx or .doc) document.',
    };
  }

  if (selectedFile.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'File exceeds maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true };
}

export function buildEpubFilename(originalName: string): string {
  const baseTitle = originalName.replace(/\.(docx?|doc)$/i, '');
  return `${baseTitle}.epub`;
}

export async function convertWordToEpub(file: File, isFr = false): Promise<WordToEpubResult> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: htmlBody } = await mammoth.convertToHtml({ arrayBuffer });
  const { value: rawText } = await mammoth.extractRawText({ arrayBuffer });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const epubModule = (await import('epub-gen-memory')) as any;
  const bookTitle = file.name.replace(/\.(docx?|doc)$/i, '');
  const chapters = [
    {
      title: bookTitle,
      content:
        htmlBody ||
        (isFr
          ? '<p>Aucun contenu textuel trouvé dans ce document Word.</p>'
          : '<p>No textual content found in this Word document.</p>'),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let epubBuffer: any;
  const epubGen = epubModule.default?.default || epubModule.default;

  if (typeof epubGen === 'function') {
    epubBuffer = await epubGen(
      {
        title: bookTitle,
        author: 'EverydayTools',
      },
      chapters
    );
  } else {
    const EPubClass = epubModule.EPub || epubModule.default?.EPub;
    const epubInstance = new EPubClass(
      {
        title: bookTitle,
        author: 'EverydayTools',
      },
      chapters
    );
    epubBuffer = await epubInstance.genEpub();
  }

  const blob = new Blob([epubBuffer], { type: 'application/epub+zip' });
  const filename = buildEpubFilename(file.name);
  const textOutput =
    rawText ||
    (isFr
      ? 'Aucun contenu textuel trouvé dans ce document Word.'
      : 'No textual content found in this Word document.');

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    textOutput,
  };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
