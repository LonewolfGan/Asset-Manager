import type { ConversionFormat } from '@/components/conversion';

export const SOURCE_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document source',
};

export const TARGET_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#FF6B35',
  subLabel: 'Chiffré AES-256',
};

export interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validatePdfFile(file: File, isFr: boolean): FileValidationResult {
  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un document au format PDF valide.'
        : 'Please select a valid PDF document.',
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
        : 'The file exceeds the maximum allowed size of 50 MB.',
    };
  }

  return { isValid: true, error: null };
}

export function generateRandomPassword(length: number = 14): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
  let pwd = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    pwd += chars[array[i] % chars.length];
  }
  return pwd;
}

export interface PasswordStrength {
  label: string;
  color: string;
  width: string;
  score: number;
}

export interface PasswordStrengthLabels {
  weak?: string;
  medium?: string;
  strong?: string;
}

export function getPasswordStrength(
  pwd: string,
  labels?: PasswordStrengthLabels
): PasswordStrength | null {
  if (!pwd) return null;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) {
    return {
      label: labels?.weak ?? 'Faible',
      color: 'bg-red-500',
      width: '33%',
      score,
    };
  }
  if (score <= 4) {
    return {
      label: labels?.medium ?? 'Bon',
      color: 'bg-amber-500',
      width: '66%',
      score,
    };
  }
  return {
    label: labels?.strong ?? 'Très fort',
    color: 'bg-emerald-500',
    width: '100%',
    score,
  };
}
