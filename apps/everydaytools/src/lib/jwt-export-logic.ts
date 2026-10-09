import { DecodedJwt } from './jwt-logic';

export interface JwtTokenStats {
  chars: number;
  bytes: number;
}

export type JwtExportMode = 'full' | 'payload' | 'header';

/**
 * Compute characters and UTF-8 byte count of a token string
 */
export function getJwtByteSize(token: string): JwtTokenStats {
  const chars = token.length;
  const bytes = new TextEncoder().encode(token).length;
  return { chars, bytes };
}

/**
 * Return human-readable annotation for standard JWT claims
 */
export function getClaimAnnotation(
  key: string,
  val: unknown,
  decoded: DecodedJwt,
  isFr: boolean
): string | null {
  if (key === 'exp' && typeof val === 'number') {
    const d = new Date(val * 1000);
    const dateStr = d.toLocaleDateString(isFr ? 'fr-FR' : 'en-US');
    if (decoded.timeRemaining) {
      if (decoded.isExpired) {
        return `${isFr ? 'Expiré le' : 'Expired on'} ${dateStr} (${isFr ? `il y a ${decoded.timeRemaining}` : `${decoded.timeRemaining} ago`})`;
      }
      return `${isFr ? 'Expire le' : 'Expires on'} ${dateStr} (${isFr ? `dans ${decoded.timeRemaining}` : `in ${decoded.timeRemaining}`})`;
    }
    return `${decoded.isExpired ? (isFr ? 'Expiré le' : 'Expired on') : (isFr ? 'Expire le' : 'Expires on')} ${dateStr}`;
  }

  if (key === 'iat' && typeof val === 'number') {
    const d = new Date(val * 1000);
    const dateStr = d.toLocaleDateString(isFr ? 'fr-FR' : 'en-US');
    if (decoded.timeElapsed) {
      return `${isFr ? 'Émis le' : 'Issued on'} ${dateStr} (${isFr ? `il y a ${decoded.timeElapsed}` : `${decoded.timeElapsed} ago`})`;
    }
    return `${isFr ? 'Émis le' : 'Issued on'} ${dateStr}`;
  }

  if (key === 'sub') {
    return isFr ? 'Identifiant sujet' : 'Subject identifier';
  }

  if (key === 'iss') {
    return isFr ? 'Émetteur' : 'Issuer';
  }

  if (key === 'aud') {
    return isFr ? 'Audience' : 'Audience';
  }

  return null;
}

/**
 * Format JWT components into clean 2-space indented JSON strings for export
 */
export function buildJwtExportPayload(
  decoded: DecodedJwt,
  mode: JwtExportMode
): string {
  if (mode === 'header') {
    return JSON.stringify(decoded.header ?? {}, null, 2);
  }
  if (mode === 'payload') {
    return JSON.stringify(decoded.payload ?? {}, null, 2);
  }
  return JSON.stringify(
    { header: decoded.header ?? {}, payload: decoded.payload ?? {} },
    null,
    2
  );
}

/**
 * Trigger browser file download from string content
 */
export function triggerJwtDownload(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
