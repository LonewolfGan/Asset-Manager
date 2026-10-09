/**
 * URL Encoding, Decoding, and Structural Query Parameter Parsing Logic
 */

export type UrlEncodeMode = 'component' | 'full' | 'form';

export interface ParsedUrlDetails {
  isValid: boolean;
  protocol?: string;
  host?: string;
  pathname?: string;
  hash?: string;
  params: Array<{ key: string; value: string }>;
  error?: string;
}

export type UrlDetails = ParsedUrlDetails;

export function encodeUrl(input: string, mode: UrlEncodeMode = 'component'): string {
  if (!input) return '';

  switch (mode) {
    case 'component':
      return encodeURIComponent(input);
    case 'full':
      return encodeURI(input);
    case 'form':
      // standard application/x-www-form-urlencoded replaces spaces with +
      return encodeURIComponent(input).replace(/%20/g, '+');
  }
}

export function decodeUrl(input: string): string {
  if (!input) return '';
  // Normalize + back to %20 if form-encoded
  const normalized = input.replace(/\+/g, '%20');
  return decodeURIComponent(normalized);
}

export function parseUrlDetails(input: string): ParsedUrlDetails {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, params: [] };
  }

  try {
    // Handle URLs without explicit protocol by prefixing https://
    const targetUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(targetUrl);
    const params: Array<{ key: string; value: string }> = [];

    parsed.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });

    return {
      isValid: true,
      protocol: parsed.protocol,
      host: parsed.host,
      pathname: parsed.pathname,
      hash: parsed.hash,
      params,
    };
  } catch {
    return {
      isValid: false,
      params: [],
      error: 'URL non valide ou format incorrect',
    };
  }
}

/**
 * Process encoding line-by-line (default true for batch/multi-line inputs)
 */
export function encodeUrlLines(
  input: string,
  mode: UrlEncodeMode = 'component',
  multiline: boolean = true
): string {
  if (!input) return '';
  if (!multiline) return encodeUrl(input, mode);
  return input
    .split('\n')
    .map((line) => (line ? encodeUrl(line, mode) : ''))
    .join('\n');
}

/**
 * Process decoding line-by-line (default true for batch/multi-line inputs)
 */
export function decodeUrlLines(input: string, multiline: boolean = true): string {
  if (!input) return '';
  if (!multiline) return decodeUrl(input);
  return input
    .split('\n')
    .map((line) => {
      if (!line) return '';
      try {
        return decodeUrl(line);
      } catch {
        return line;
      }
    })
    .join('\n');
}

/**
 * Remove an individual query parameter from a URL string
 * Handles both plain URLs and percent-encoded URLs transparently.
 */
export function removeQueryParam(input: string, keyToRemove: string): string {
  const trimmed = input.trim();
  if (!trimmed || !keyToRemove) return input;

  const isEncoded =
    !trimmed.includes('://') &&
    (trimmed.toLowerCase().includes('%3a') || trimmed.toLowerCase().includes('%2f'));
  const decoded = isEncoded ? decodeUrl(trimmed) : trimmed;

  try {
    const hasProtocol = /^https?:\/\//i.test(decoded);
    const targetUrl = hasProtocol ? decoded : `https://${decoded}`;
    const parsed = new URL(targetUrl);

    parsed.searchParams.delete(keyToRemove);

    const result = parsed.toString();
    const cleanedDecoded = hasProtocol ? result : result.replace(/^https?:\/\//i, '');
    return isEncoded ? encodeUrl(cleanedDecoded, 'component') : cleanedDecoded;
  } catch {
    return input;
  }
}


