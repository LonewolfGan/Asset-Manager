import { PDFDocument } from 'pdf-lib';
import type { ConversionFormat } from '@/components/conversion';

export const SOURCE_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document PDF',
};

export const TARGET_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#FF6B35',
  subLabel: 'Document PDF mis à jour',
};

export const QUICK_TAG_SUGGESTIONS = [
  'Rapport',
  'Contrat',
  'Facture',
  '2026',
  'Officiel',
  'Documentation',
  'Confidentiel',
  'Audit',
];

export interface LanguageOption {
  label: string;
  value: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: 'Non spécifiée', value: '' },
  { label: 'Français (fr-FR)', value: 'fr-FR' },
  { label: 'English (en-US)', value: 'en-US' },
  { label: 'English (en-GB)', value: 'en-GB' },
  { label: 'Español (es-ES)', value: 'es-ES' },
  { label: 'Deutsch (de-DE)', value: 'de-DE' },
  { label: 'Italiano (it-IT)', value: 'it-IT' },
  { label: 'Português (pt-PT)', value: 'pt-PT' },
  { label: 'Nederlands (nl-NL)', value: 'nl-NL' },
];

export interface PdfMetadataForm {
  title: string;
  showInTitleBar: boolean;
  author: string;
  subject: string;
  tags: string[];
  creator: string;
  producer: string;
  language: string;
  dateMode: 'keep' | 'today' | 'custom' | 'clear';
  customDate: string;
}

export interface PdfInitialValues {
  title: string;
  author: string;
  subject: string;
  tags: string[];
  creator: string;
  producer: string;
  language: string;
  creationDate: Date | null;
}

export function formatDate(d: Date | null | undefined, isFr: boolean): string {
  if (!d || isNaN(d.getTime())) return isFr ? 'Non spécifiée' : 'Not specified';
  try {
    return new Intl.DateTimeFormat(isFr ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isFr ? 'Non spécifiée' : 'Not specified';
  }
}

export function inferTitleFromFilename(filename: string): string {
  const cleanName = filename
    .replace(/\.pdf$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : '';
}

export function cleanTag(tag: string): string {
  return tag.trim().replace(/^,+|,+$/g, '');
}

export async function parsePdfMetadata(buf: ArrayBuffer): Promise<{
  form: PdfMetadataForm;
  initialValues: PdfInitialValues;
  pageCount: number;
  creationDate: Date | null;
  pdfBytes: Uint8Array;
}> {
  const doc = await PDFDocument.load(buf, {
    ignoreEncryption: true,
    parseSpeed: 1,
  });

  const parsedTitle = doc.getTitle() ?? '';
  const parsedAuthor = doc.getAuthor() ?? '';
  const parsedSubject = doc.getSubject() ?? '';
  const rawKeywords = doc.getKeywords() ?? '';
  const parsedCreator = doc.getCreator() ?? '';
  const parsedProducer = doc.getProducer() ?? '';
  const pageCount = doc.getPageCount();
  const creationDate = doc.getCreationDate() ?? null;

  const parsedTags = rawKeywords
    ? rawKeywords
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const customDate =
    creationDate && !isNaN(creationDate.getTime())
      ? creationDate.toISOString().split('T')[0]
      : '';

  const form: PdfMetadataForm = {
    title: parsedTitle,
    showInTitleBar: true,
    author: parsedAuthor,
    subject: parsedSubject,
    tags: parsedTags,
    creator: parsedCreator,
    producer: parsedProducer,
    language: '',
    dateMode: 'keep',
    customDate,
  };

  const initialValues: PdfInitialValues = {
    title: parsedTitle,
    author: parsedAuthor,
    subject: parsedSubject,
    tags: parsedTags,
    creator: parsedCreator,
    producer: parsedProducer,
    language: '',
    creationDate,
  };

  return {
    form,
    initialValues,
    pageCount,
    creationDate,
    pdfBytes: new Uint8Array(buf),
  };
}

export async function savePdfMetadata(
  pdfBytes: Uint8Array,
  form: PdfMetadataForm,
  originalFilename: string,
  originalSize: number
): Promise<{
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore: number;
}> {
  const doc = await PDFDocument.load(pdfBytes, {
    ignoreEncryption: true,
    parseSpeed: 1,
  });

  doc.setTitle(form.title.trim(), { showInWindowTitleBar: form.showInTitleBar });
  doc.setAuthor(form.author.trim());
  doc.setSubject(form.subject.trim());
  doc.setKeywords(form.tags);
  doc.setCreator(form.creator.trim());
  doc.setProducer(form.producer.trim());

  if (form.language.trim()) {
    doc.setLanguage(form.language.trim());
  }

  if (form.dateMode === 'today') {
    doc.setCreationDate(new Date());
  } else if (form.dateMode === 'custom' && form.customDate) {
    const d = new Date(form.customDate);
    if (!isNaN(d.getTime())) {
      doc.setCreationDate(d);
    }
  }

  doc.setModificationDate(new Date());

  const saved = await doc.save({ useObjectStreams: false });
  const blob = new Blob([new Uint8Array(saved).buffer as ArrayBuffer], {
    type: 'application/pdf',
  });

  const baseName = originalFilename.replace(/\.[^/.]+$/, '');

  return {
    blob,
    filename: `${baseName}_metadata.pdf`,
    sizeAfter: blob.size,
    sizeBefore: originalSize,
  };
}
