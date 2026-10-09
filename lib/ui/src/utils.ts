import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2, isFr: boolean = true): string {
  if (bytes <= 0 || isNaN(bytes)) return isFr ? '0 o' : '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizesEn = ['B', 'KB', 'MB', 'GB', 'TB'];
  const sizesFr = ['o', 'Ko', 'Mo', 'Go', 'To'];
  const sizes = isFr ? sizesFr : sizesEn;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i]}`;
}
