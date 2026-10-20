import { downloadBlob } from '@/lib/download';
import type { ConversionFormat } from '@/components/conversion';

export interface PdfToMarkdownResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  textOutput: string;
}

export interface PdfFileValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorDesc?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: '#0284C7',
  subLabel: isFr ? 'Format CommonMark / GFM' : 'CommonMark / GFM',
});

const MAX_PDF_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export function buildMarkdownFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '') + '.md';
}

export function validatePdfFile(
  selectedFile: File,
  isFr: boolean
): PdfFileValidationResult {
  const isPdf =
    selectedFile.type === 'application/pdf' ||
    selectedFile.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Format non supporté' : 'Unsupported format',
      errorDesc: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
    };
  }

  if (selectedFile.size > MAX_PDF_FILE_SIZE) {
    return {
      isValid: false,
      errorTitle: isFr ? 'Fichier trop volumineux' : 'File too large',
      errorDesc: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 100 Mo.'
        : 'File exceeds maximum allowed size of 100 MB.',
    };
  }

  return { isValid: true };
}

interface ExtractedItem {
  str: string;
  fontSize: number;
  x: number;
  y: number;
}

interface LineGroup {
  y: number;
  maxFontSize: number;
  items: ExtractedItem[];
}

interface FormattedLine {
  text: string;
  isHeader: boolean;
  isBullet: boolean;
  y: number;
  fontSize: number;
}

function formatPageToMarkdown(textContent: { items: unknown[] }): string {
  const validItems: ExtractedItem[] = [];
  for (const raw of textContent.items) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const it = raw as any;
    if (typeof it?.str === 'string' && Array.isArray(it.transform)) {
      validItems.push({
        str: it.str,
        fontSize: Math.abs(it.transform[0]) || 0,
        x: it.transform[4] ?? 0,
        y: it.transform[5] ?? 0,
      });
    }
  }

  if (validItems.length === 0) return '';

  const lineGroups: LineGroup[] = [];
  for (const item of validItems) {
    const lastGroup = lineGroups[lineGroups.length - 1];
    if (lastGroup && Math.abs(item.y - lastGroup.y) <= 3) {
      lastGroup.items.push(item);
      if (item.fontSize > lastGroup.maxFontSize) {
        lastGroup.maxFontSize = item.fontSize;
      }
    } else {
      lineGroups.push({
        y: item.y,
        maxFontSize: item.fontSize,
        items: [item],
      });
    }
  }

  const formattedLines: FormattedLine[] = [];
  for (const group of lineGroups) {
    group.items.sort((a, b) => a.x - b.x);
    let lineText = '';
    for (const it of group.items) {
      const s = it.str;
      if (!s) continue;
      if (!lineText) {
        lineText = s;
      } else if (lineText.endsWith(' ') || s.startsWith(' ')) {
        lineText += s;
      } else {
        lineText += ' ' + s;
      }
    }
    lineText = lineText.trim();
    if (!lineText) continue;

    const isBullet = /^[-*•–—\u2022\u25E6\u25AA\u25B8]\s+/.test(lineText);
    let isHeader = false;
    let text = lineText;

    if (isBullet) {
      text = `- ${lineText.replace(/^[-*•–—\u2022\u25E6\u25AA\u25B8]\s+/, '')}`;
    } else if (group.maxFontSize >= 18) {
      isHeader = true;
      text = lineText.startsWith('#') ? lineText : `# ${lineText}`;
    } else if (group.maxFontSize >= 14) {
      isHeader = true;
      text = lineText.startsWith('#') ? lineText : `## ${lineText}`;
    }

    formattedLines.push({
      text,
      isHeader,
      isBullet,
      y: group.y,
      fontSize: group.maxFontSize,
    });
  }

  if (formattedLines.length === 0) return '';

  const blocks: string[] = [];
  let currentBlock = '';
  let prevLine: FormattedLine | null = null;

  for (const line of formattedLines) {
    if (!prevLine) {
      currentBlock = line.text;
      prevLine = line;
      continue;
    }

    if (prevLine.isBullet && line.isBullet) {
      currentBlock += '\n' + line.text;
    } else if (prevLine.isHeader || line.isHeader || prevLine.isBullet || line.isBullet) {
      blocks.push(currentBlock);
      currentBlock = line.text;
    } else {
      const isNewParagraph =
        prevLine.y === line.y
          ? true
          : prevLine.y - line.y > prevLine.fontSize * 1.6;

      if (isNewParagraph) {
        blocks.push(currentBlock);
        currentBlock = line.text;
      } else {
        if (currentBlock.endsWith('-')) {
          currentBlock = currentBlock.slice(0, -1) + line.text;
        } else {
          currentBlock += ' ' + line.text;
        }
      }
    }
    prevLine = line;
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks.join('\n\n');
}

export async function convertPdfToMarkdown(
  file: File,
  options: { isFr: boolean; errorFallback?: string }
): Promise<PdfToMarkdownResult> {
  const { isFr } = options;

  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).href;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pagesMarkdown: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageMd = formatPageToMarkdown(textContent);
    if (pageMd.trim()) {
      pagesMarkdown.push(pageMd.trim());
    }
  }

  const markdownText = pagesMarkdown.join('\n\n---\n\n').trim();

  if (!markdownText) {
    throw new Error(
      isFr
        ? 'Aucun texte extractible trouvé dans ce document PDF.'
        : 'No extractable text found in this PDF document.'
    );
  }

  const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
  const filename = buildMarkdownFilename(file.name);

  return {
    blob,
    filename,
    sizeBefore: file.size,
    sizeAfter: blob.size,
    textOutput: markdownText,
  };
}

export function triggerDownload(blob: Blob, filename: string): void {
  downloadBlob(blob, filename);
}
