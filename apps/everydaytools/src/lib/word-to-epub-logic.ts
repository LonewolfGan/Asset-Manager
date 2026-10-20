import mammoth from 'mammoth';
import type { ConversionFormat } from '@/components/conversion';
import { downloadBlob } from '@/lib/download';

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
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: 'var(--accent, #2563eb)',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'EPUB',
  extension: 'epub',
  icon: '/icons/epub.svg',
  color: 'var(--accent, #65a30d)',
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
    const errorTitle = isFr ? 'Format non supporté' : 'Unsupported format';
    const errorDesc = isFr
      ? 'Veuillez sélectionner un document Word (.docx ou .doc) valide.'
      : 'Please select a valid Word (.docx or .doc) document.';
    return {
      isValid: false,
      error: errorDesc,
      errorTitle,
      errorDesc,
    };
  }

  if (selectedFile.size > 50 * 1024 * 1024) {
    const errorTitle = isFr ? 'Fichier trop volumineux' : 'File too large';
    const errorDesc = isFr
      ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
      : 'File exceeds maximum allowed size of 50 MB.';
    return {
      isValid: false,
      error: errorDesc,
      errorTitle,
      errorDesc,
    };
  }

  return { isValid: true };
}

export function buildEpubFilename(originalName: string): string {
  const baseTitle = originalName.replace(/\.(docx?|doc)$/i, '').trim();
  return `${baseTitle || 'document'}.epub`;
}

export async function convertWordToEpub(file: File, isFr = false): Promise<WordToEpubResult> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: htmlBody } = await mammoth.convertToHtml({ arrayBuffer });
  const { value: rawText } = await mammoth.extractRawText({ arrayBuffer });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const epubModule = (await import('epub-gen-memory')) as any;
  const bookTitle =
    file.name.replace(/\.(docx?|doc)$/i, '').trim() || (isFr ? 'Document' : 'Document');
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
  downloadBlob(blob, filename);
}
