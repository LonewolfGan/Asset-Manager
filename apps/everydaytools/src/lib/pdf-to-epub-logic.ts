import type { ConversionFormat } from '@/components/conversion';

export interface PdfToEpubResult {
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
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'EPUB',
  extension: 'epub',
  icon: '/icons/epub.svg',
  color: '#85BA38',
  subLabel: isFr ? 'Livre numérique ePub' : 'Flowable EPUB E-Book',
});

export function validatePdfFile(selectedFile: File, isFr = false): FileValidationResult {
  const isPdf =
    selectedFile.type === 'application/pdf' ||
    selectedFile.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
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

export async function convertPdfToEpub(file: File, isFr = false): Promise<PdfToEpubResult> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).href;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let bodyContent = '';
  const rawParagraphs: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    if (text.trim()) {
      bodyContent += `<p>${text}</p>\n`;
      rawParagraphs.push(text.trim());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const epubModule = (await import('epub-gen-memory')) as any;
  const bookTitle = file.name.replace(/\.[^/.]+$/, '');
  const chapters = [
    {
      title: bookTitle,
      content:
        bodyContent ||
        (isFr
          ? '<p>Aucun texte extractible trouvé dans ce document PDF.</p>'
          : '<p>No extractable text found in this PDF document.</p>'),
    },
  ];

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
  const extractedText =
    rawParagraphs.length > 0
      ? rawParagraphs.join('\n\n')
      : isFr
      ? 'Aucun texte extractible trouvé dans ce document PDF.'
      : 'No extractable text found in this PDF document.';

  return {
    blob,
    filename: `${bookTitle}.epub`,
    sizeAfter: blob.size,
    sizeBefore: file.size,
    textOutput: extractedText,
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
