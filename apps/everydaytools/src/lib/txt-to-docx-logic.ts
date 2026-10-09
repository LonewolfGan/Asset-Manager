import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export type TxtToDocxMode = 'upload' | 'paste';

export interface TxtToDocxResult {
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

export const getTargetFormat = (_isFr: boolean): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: '#185ABD',
  subLabel: 'Microsoft Word',
});

export const TXT_DOCX_SAMPLE_FR = `PROPOSITION COMMERCIALE
EverydayTools Studio — Solutions Documentaires

1. RÉSUMÉ EXÉCUTIF
EverydayTools propose une suite logicielle unifiée pour le traitement instantané et sécurisé de vos flux de données documentaires.

2. OBJECTIFS DU PROJET
- Automatisation complète des conversions de fichiers
- Réduction drastique des temps de traitement d'équipe
- Confidentialité totale et conformité stricte aux normes RGPD

3. ESTIMATION BUDGÉTAIRE ET CALENDRIER
Phase 1 : Cadrage technique et intégration API (Semaines 1 à 3)
Phase 2 : Déploiement et formation des utilisateurs (Semaines 4 et 5)
Phase 3 : Maintenance proactive et support 24/7 (Continu)
`;

export const TXT_DOCX_SAMPLE_EN = `BUSINESS PROPOSAL
EverydayTools Studio — Document Solutions

1. EXECUTIVE SUMMARY
EverydayTools offers a unified software suite for instant and secure processing of your document workflows.

2. PROJECT OBJECTIVES
- Complete automation of file conversions
- Drastic reduction of team processing times
- Complete confidentiality and strict GDPR compliance

3. BUDGET ESTIMATION AND TIMELINE
Phase 1: Technical scoping and API integration (Weeks 1 to 3)
Phase 2: Deployment and user onboarding (Weeks 4 and 5)
Phase 3: Proactive maintenance and 24/7 support (Ongoing)
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

  if (selectedFile.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 10 Mo.'
        : 'File exceeds the maximum allowed size of 10 MB.',
    };
  }

  return { isValid: true };
}

export function buildDocxFilename(
  mode: TxtToDocxMode,
  file?: File | null,
  isFr = false
): string {
  if (mode === 'upload' && file) {
    return file.name.replace(/\.txt$/i, '.docx');
  }
  return isFr ? 'texte-saisi.docx' : 'pasted-text.docx';
}

export async function convertTxtToDocx(options: {
  mode: TxtToDocxMode;
  file?: File | null;
  textInput?: string;
  errorFallback?: string;
  isFr?: boolean;
}): Promise<TxtToDocxResult> {
  const { mode, file, textInput = '', errorFallback, isFr = false } = options;

  const fd = new FormData();
  let filename = buildDocxFilename(mode, file, isFr);
  let sizeBefore = 0;

  if (mode === 'upload' && file) {
    fd.append('file', file);
    sizeBefore = file.size;
  } else {
    fd.append('text', textInput);
    sizeBefore = new Blob([textInput]).size;
  }

  const [res] = await Promise.all([
    fetch(apiUrl('/api/convert/txt-to-docx'), {
      method: 'POST',
      body: fd,
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
        'Failed to convert to Word document. Please try again.'
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
