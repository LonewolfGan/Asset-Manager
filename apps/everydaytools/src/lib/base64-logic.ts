/**
 * Robust UTF-8 and URL-safe Base64 encoding and decoding logic.
 */

export interface Base64Options {
  urlSafe?: boolean;
  stripPadding?: boolean;
}

export type ChunkSize = 0 | 64 | 76;

export interface DetectedBase64Binary {
  isImage: boolean;
  isPdf: boolean;
  mimeType: string;
  dataUrl?: string;
  extension: string;
}

export function formatBytes(bytes: number, isFr: boolean = true): string {
  if (bytes === 0) return isFr ? '0 o' : '0 B';
  const k = 1024;
  const sizes = isFr ? ['o', 'Ko', 'Mo', 'Go'] : ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function applyLineBreaks(str: string, chunkSize: ChunkSize): string {
  if (chunkSize <= 0) return str;
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  const chunks = str.match(regex);
  return chunks ? chunks.join('\n') : str;
}

export function detectBase64Binary(raw: string): DetectedBase64Binary | null {
  const clean = raw.trim();
  if (!clean) return null;

  // 1. Détection via préfixe Data URI
  const dataUriMatch = clean.match(/^data:([^;]+);base64,(.+)$/i);
  if (dataUriMatch) {
    const mime = dataUriMatch[1].toLowerCase();
    const isImage = mime.startsWith('image/');
    const isPdf = mime === 'application/pdf';
    let ext = 'bin';
    if (mime === 'image/png') ext = 'png';
    else if (mime === 'image/jpeg' || mime === 'image/jpg') ext = 'jpg';
    else if (mime === 'image/webp') ext = 'webp';
    else if (mime === 'image/svg+xml') ext = 'svg';
    else if (mime === 'image/gif') ext = 'gif';
    else if (mime === 'application/pdf') ext = 'pdf';

    return {
      isImage,
      isPdf,
      mimeType: mime,
      dataUrl: clean,
      extension: ext,
    };
  }

  // 2. Détection via signatures binaires (Magic Bytes) pour Base64 brut
  try {
    let normalized = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4 !== 0) {
      normalized += '=';
    }
    const binary = atob(normalized.slice(0, 32));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // PNG : 89 50 4E 47
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
      return { isImage: true, isPdf: false, mimeType: 'image/png', dataUrl: `data:image/png;base64,${normalized}`, extension: 'png' };
    }
    // JPEG : FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return { isImage: true, isPdf: false, mimeType: 'image/jpeg', dataUrl: `data:image/jpeg;base64,${normalized}`, extension: 'jpg' };
    }
    // GIF : 47 49 46 38
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
      return { isImage: true, isPdf: false, mimeType: 'image/gif', dataUrl: `data:image/gif;base64,${normalized}`, extension: 'gif' };
    }
    // WebP : RIFF ... WEBP
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      return { isImage: true, isPdf: false, mimeType: 'image/webp', dataUrl: `data:image/webp;base64,${normalized}`, extension: 'webp' };
    }
    // PDF : %PDF
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      return { isImage: false, isPdf: true, mimeType: 'application/pdf', dataUrl: `data:application/pdf;base64,${normalized}`, extension: 'pdf' };
    }
    // SVG : <svg ou <?xml
    const headerStr = binary.slice(0, 16).toLowerCase();
    if (headerStr.includes('<svg') || headerStr.includes('<?xml')) {
      return { isImage: true, isPdf: false, mimeType: 'image/svg+xml', dataUrl: `data:image/svg+xml;base64,${normalized}`, extension: 'svg' };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Encode string to UTF-8 Base64 (supporting emojis and international characters)
 */
export function encodeBase64(text: string, options: Base64Options = {}): string {
  if (!text) return '';
  const bytes = new TextEncoder().encode(text);
  let binString = '';
  for (let i = 0; i < bytes.length; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  let base64 = btoa(binString);

  if (options.urlSafe) {
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
  }

  if (options.stripPadding) {
    base64 = base64.replace(/=+$/, '');
  }

  return base64;
}

/**
 * Decode UTF-8 Base64 string to original text
 */
export function decodeBase64(base64Text: string): { output: string; error?: string } {
  const clean = base64Text.trim();
  if (!clean) return { output: '' };

  try {
    // Revert URL-safe characters
    let normalized = clean.replace(/-/g, '+').replace(/_/g, '/');
    // Re-add padding if missing
    while (normalized.length % 4 !== 0) {
      normalized += '=';
    }

    const binString = atob(normalized);
    const bytes = Uint8Array.from(binString, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return { output: decoded };
  } catch (err) {
    return {
      output: '',
      error: err instanceof Error ? err.message : 'Chaîne Base64 invalide',
    };
  }
}

/**
 * Convert binary file / blob to Base64 Data URL
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert Base64 string / Data URL to Blob
 */
export function base64ToBlob(
  base64String: string,
  defaultMime = 'application/octet-stream'
): Blob {
  let mime = defaultMime;
  let rawBase64 = base64String.trim();

  // Check data: URL prefix
  const dataUrlMatch = rawBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (dataUrlMatch) {
    mime = dataUrlMatch[1];
    rawBase64 = dataUrlMatch[2];
  }

  let normalized = rawBase64.replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4 !== 0) {
    normalized += '=';
  }

  const byteCharacters = atob(normalized);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}
