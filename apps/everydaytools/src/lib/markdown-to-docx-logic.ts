import { apiUrl } from '@/lib/apiBase';
import type { ConversionFormat } from '@/components/conversion';

export type MarkdownToDocxMode = 'upload' | 'paste';

export interface MarkdownToDocxResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const getSourceFormat = (isFr = false): ConversionFormat => ({
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: 'var(--accent, #0284c7)',
  subLabel: isFr ? 'Syntaxe Markdown' : 'Markdown Syntax',
});

export const getTargetFormat = (isFr = false): ConversionFormat => ({
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: 'var(--accent, #2563eb)',
  subLabel: isFr ? 'Document Microsoft Word (.docx)' : 'Microsoft Word Document (.docx)',
});

export const MARKDOWN_SAMPLE_FR = `# Proposition Commerciale & Stratégie

## 1. Contexte du Projet
Ce document présente le plan de déploiement et les livrables attendus.

### Objectifs Clés
- Modernisation de l'infrastructure logicielle
- Optimisation des performances et de l'expérience utilisateur
- Respect strict des standards de sécurité et d'accessibilité

> « La simplicité est la sophistication suprême. » — Léonard de Vinci

### Tableau Récapitulatif
| Phase | Livrable | Échéance |
| :--- | :--- | :--- |
| Cadrage | Architecture & Spécifications | Semaine 1 |
| Développement | Implémentation & TDD | Semaines 2-4 |
| Validation | Audit Qualité & Recette | Semaine 5 |
`;

export const MARKDOWN_SAMPLE_EN = `# Business Proposal & Strategy

## 1. Project Context
This document outlines the deployment plan and expected key deliverables.

### Key Objectives
- Modernization of software architecture
- Performance and user experience optimization
- Strict adherence to accessibility and security standards

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci

### Project Schedule
| Phase | Deliverable | Timeline |
| :--- | :--- | :--- |
| Discovery | Architecture & Spec | Week 1 |
| Build | Implementation & TDD | Weeks 2-4 |
| Review | Quality Audit & QA | Week 5 |
`;

export function validateMarkdownFile(selectedFile: File, isFr = false): FileValidationResult {
  const hasValidExt = /\.(md|markdown|txt)$/i.test(selectedFile.name || '');
  const isMd =
    hasValidExt ||
    selectedFile.type === 'text/markdown' ||
    selectedFile.type === 'text/plain';

  if (!isMd) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier Markdown (.md, .markdown) valide.'
        : 'Please select a valid Markdown (.md, .markdown) file.',
    };
  }

  if (selectedFile.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 10 Mo.'
        : 'The file exceeds the maximum allowed size of 10 MB.',
    };
  }

  return { isValid: true };
}

export function buildDocxFilename(
  mode: MarkdownToDocxMode,
  file?: File | null
): string {
  if (mode === 'upload' && file) {
    const base = file.name.replace(/\.(md|markdown|txt)$/i, '');
    return `${base || 'document'}.docx`;
  }
  return 'document-markdown.docx';
}

export async function convertMarkdownToDocx(options: {
  mode: MarkdownToDocxMode;
  file?: File | null;
  markdownInput?: string;
  errorFallback?: string;
}): Promise<MarkdownToDocxResult> {
  const { mode, file, markdownInput = '', errorFallback } = options;

  let res: Response;
  const filename = buildDocxFilename(mode, file);
  let sizeBefore = 0;

  if (mode === 'upload' && file) {
    const fd = new FormData();
    fd.append('file', file);
    sizeBefore = file.size;

    res = await fetch(apiUrl('/api/convert/markdown-to-docx'), {
      method: 'POST',
      body: fd,
    });
  } else {
    const bodyContent = { markdown: markdownInput };
    sizeBefore = new Blob([markdownInput]).size;

    res = await fetch(apiUrl('/api/convert/markdown-to-docx'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyContent),
    });
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
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
