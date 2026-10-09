export interface UrlByteStats {
  chars: number;
  bytes: number;
}

/**
 * Compute characters and UTF-8 bytes count of text string
 */
export function getUrlByteStats(text: string): UrlByteStats {
  const chars = text.length;
  const bytes = new TextEncoder().encode(text).length;
  return { chars, bytes };
}

/**
 * Localized input placeholder for encode vs decode mode
 */
export function getConversionPlaceholder(
  mode: 'encode' | 'decode',
  isFr: boolean
): string {
  if (mode === 'encode') {
    return isFr
      ? 'Collez ou déposez votre URL ou texte brut ici (ex: https://example.com/search?q=café noir&lang=fr)...'
      : 'Paste or drop your raw URL or text here (e.g. https://example.com/search?q=café noir&lang=en)...';
  }
  return isFr
    ? 'Collez votre chaîne URL encodée ici (ex: https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcaf%C3%A9+noir)...'
    : 'Paste your encoded URL string here (e.g. https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcaf%C3%A9+noir)...';
}

/**
 * Format URL parsed details as 2-space indented JSON string
 */
export function buildUrlComponentsJsonPayload(inspection: unknown): string {
  return JSON.stringify(inspection, null, 2);
}

/**
 * Trigger file download in browser
 */
export function triggerUrlFileDownload(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
