import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export type MarkdownToPdfMode = 'upload' | 'paste';

export interface MarkdownToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const getSourceFormat = (isFr = false): ConversionFormat => ({
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: '#0284C7',
  subLabel: isFr ? 'Syntaxe Markdown' : 'Markdown Syntax',
});

export const getTargetFormat = (): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

export const MARKDOWN_SAMPLE_FR = `# Rapport de Synthèse Annuelle

## 1. Introduction
Ce document présente les résultats clés obtenus au cours du dernier exercice.

### Points saillants
- Croissance de l'activité : **+24%**
- Taux de satisfaction client : **98.2%**
- Nouveaux utilisateurs actifs : **12 500**

> Note : Toutes les métriques sont conformes aux standards internationaux.

| Trimestre | Revenus | Marge |
| :--- | :--- | :--- |
| T1 | 120 k€ | 32% |
| T2 | 145 k€ | 35% |
| T3 | 160 k€ | 38% |
| T4 | 195 k€ | 41% |
`;

export const MARKDOWN_SAMPLE_EN = `# Annual Summary Report

## 1. Introduction
This document outlines the key outcomes achieved during the fiscal year.

### Highlights
- Business growth: **+24%**
- Customer satisfaction rate: **98.2%**
- New active users: **12,500**

> Note: All metrics conform to international reporting standards.

| Quarter | Revenue | Margin |
| :--- | :--- | :--- |
| Q1 | $120k | 32% |
| Q2 | $145k | 35% |
| Q3 | $160k | 38% |
| Q4 | $195k | 41% |
`;

export function validateMarkdownFile(selectedFile: File, isFr = false): FileValidationResult {
  const isMd =
    selectedFile.name.toLowerCase().endsWith('.md') ||
    selectedFile.name.toLowerCase().endsWith('.markdown') ||
    selectedFile.name.toLowerCase().endsWith('.txt') ||
    selectedFile.type === 'text/markdown' ||
    selectedFile.type === 'text/plain' ||
    selectedFile.type === '';

  if (!isMd) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier Markdown (.md, .markdown) valide.'
        : 'Please select a valid Markdown (.md, .markdown) file.',
    };
  }

  if (selectedFile.size > 20 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 20 Mo.'
        : 'The file exceeds the maximum allowed size of 20 MB.',
    };
  }

  return { isValid: true };
}

export function buildPdfFilename(
  mode: MarkdownToPdfMode,
  file?: File | null,
  _isFr = false
): string {
  if (mode === 'upload' && file) {
    return file.name.replace(/\.(md|markdown|txt)$/i, '.pdf');
  }
  return 'document-markdown.pdf';
}

export async function convertMarkdownToPdf(options: {
  mode: MarkdownToPdfMode;
  file?: File | null;
  markdownInput?: string;
  errorFallback?: string;
}): Promise<MarkdownToPdfResult> {
  const { mode, file, markdownInput = '', errorFallback } = options;

  let res: Response;
  const filename = buildPdfFilename(mode, file);
  let sizeBefore = 0;

  if (mode === 'upload' && file) {
    const fd = new FormData();
    fd.append('file', file);
    sizeBefore = file.size;

    const [response] = await Promise.all([
      fetch(apiUrl('/api/tools/markdown-to-pdf'), {
        method: 'POST',
        body: fd,
      }),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
    res = response;
  } else {
    const bodyContent = { markdown: markdownInput };
    sizeBefore = new Blob([markdownInput]).size;

    const [response] = await Promise.all([
      fetch(apiUrl('/api/tools/markdown-to-pdf'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyContent),
      }),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
    res = response;
  }

  if (!res.ok) {
    const errJson = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    throw new Error(
      errJson.message ??
        errJson.error ??
        errorFallback ??
        'Failed to convert to PDF document. Please try again.'
    );
  }

  const blob = await res.blob();

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore,
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

export function openPdfPreview(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
}
