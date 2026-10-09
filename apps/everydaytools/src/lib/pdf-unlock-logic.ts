import type { ConversionFormat } from '@/components/conversion';

export const PDF_UNLOCK_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function getPdfUnlockSourceFormat(isFr: boolean): ConversionFormat {
  return {
    name: 'PDF',
    extension: 'pdf',
    icon: '/icons/pdf.svg',
    color: '#EC1C24',
    subLabel: isFr ? 'Document protégé' : 'Protected document',
  };
}

export function getPdfUnlockTargetFormat(isFr: boolean): ConversionFormat {
  return {
    name: 'PDF',
    extension: 'pdf',
    icon: '/icons/pdf.svg',
    color: '#FF6B35',
    subLabel: isFr ? 'Document déverrouillé' : 'Unlocked document',
  };
}

export function validatePdfUnlockFile(
  file: File
): { valid: boolean; error?: 'unsupported_format' | 'file_too_large' } {
  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return { valid: false, error: 'unsupported_format' };
  }

  if (file.size > PDF_UNLOCK_MAX_FILE_SIZE) {
    return { valid: false, error: 'file_too_large' };
  }

  return { valid: true };
}

export function buildUnlockedPdfFilename(originalName: string): string {
  if (/\.pdf$/i.test(originalName)) {
    return originalName.replace(/\.pdf$/i, '_unlocked.pdf');
  }
  return `${originalName}_unlocked.pdf`;
}

export async function unlockPdfDocument(
  file: File,
  password?: string,
  endpointUrl?: string
): Promise<Blob> {
  const fd = new FormData();
  fd.append('file', file);
  if (password && password.trim()) {
    fd.append('password', password.trim());
  }

  const url = endpointUrl ?? '/api/tools/pdf-unlock';
  const res = await fetch(url, {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? 'Failed to unlock PDF document.');
  }

  return res.blob();
}
