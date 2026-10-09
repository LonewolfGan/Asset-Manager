import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export type TxtToPdfMode = 'upload' | 'paste';

export interface TxtToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: isFr ? 'Texte' : 'Text',
  extension: 'txt',
  icon: '/icons/txt.svg',
  color: '#4B5563',
  subLabel: isFr ? 'Texte Brut UTF-8' : 'Plain Text UTF-8',
});

export const getTargetFormat = (_isFr?: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

export const TXT_SAMPLE_FR = `RAPPORT D'ACTIVITÉ MENSUEL
EverydayTools Studio — Octobre 2026

1. OBJET ET CONTEXTE
Ce document présente le récapitulatif des opérations techniques, des performances d'infrastructure et des indicateurs de satisfaction du mois écoulé.

2. INDICATEURS CLÉS DE PERFORMANCE
- Taux de disponibilité de la plateforme : 99.98%
- Temps de réponse moyen API : 42 ms
- Volume de conversions traitées : 1 450 000 fichiers
- Taux de complétion des tâches sans erreur : 99.85%

3. PLAN D'ACTION IMMÉDIAT
- Finalisation de la mise à l'échelle des micro-serveurs graphiques
- Audit continu de sécurité des flux éphémères
- Optimisation des temps de premier rendu visuel
`;

export const TXT_SAMPLE_EN = `MONTHLY ACTIVITY REPORT
EverydayTools Studio — October 2026

1. PURPOSE AND CONTEXT
This document summarizes technical operations, infrastructure performance, and user satisfaction metrics for the past month.

2. KEY PERFORMANCE INDICATORS
- Platform uptime: 99.98%
- Average API response time: 42 ms
- Processed conversions volume: 1,450,000 files
- Error-free task completion rate: 99.85%

3. IMMEDIATE ACTION PLAN
- Finalize graphical micro-servers scaling
- Continuous security audit of ephemeral pipelines
- Optimization of first visual render times
`;

export function validateTxtFile(selectedFile: File, isFr = false): FileValidationResult {
  const isTxt =
    selectedFile.name.toLowerCase().endsWith('.txt') ||
    selectedFile.type === 'text/plain' ||
    selectedFile.type === '';

  if (!isTxt) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier texte (.txt) valide.'
        : 'Please select a valid text file (.txt).',
    };
  }

  if (selectedFile.size > 20 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 20 Mo.'
        : 'File exceeds the maximum allowed size of 20 MB.',
    };
  }

  return { isValid: true };
}

export function buildPdfFilename(
  mode: TxtToPdfMode,
  file?: File | null,
  isFr = false
): string {
  if (mode === 'upload' && file) {
    return file.name.replace(/\.txt$/i, '.pdf');
  }
  return isFr ? 'texte-converti.pdf' : 'converted-text.pdf';
}

export async function convertTxtToPdf(options: {
  mode: TxtToPdfMode;
  file?: File | null;
  textInput?: string;
  errorFallback?: string;
  isFr?: boolean;
}): Promise<TxtToPdfResult> {
  const { mode, file, textInput = '', errorFallback, isFr = false } = options;

  let text = '';
  const filename = buildPdfFilename(mode, file, isFr);
  let sizeBefore = 0;

  if (mode === 'upload' && file) {
    text = await file.text();
    sizeBefore = file.size;
  } else {
    text = textInput;
    sizeBefore = new TextEncoder().encode(textInput).length;
  }

  const [res] = await Promise.all([
    fetch(apiUrl('/api/convert/text-to-pdf'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]);

  if (!res.ok) {
    const errJson = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    throw new Error(
      errJson.message ??
        errJson.error ??
        errorFallback ??
        'Failed to convert to PDF. Please try again.'
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
  window.open(url, '_blank');
}
