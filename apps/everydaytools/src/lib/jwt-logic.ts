/**
 * Pure JWT parsing, claim decoding, timestamp evaluation, and HMAC signature validation.
 * Compliant with RFC 7519 (JSON Web Token) and RFC 7515 (JSON Web Signature).
 */

export interface DecodedJwt {
  valid: boolean;
  error?: string;
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signature?: string;
  rawHeaderBase64?: string;
  rawPayloadBase64?: string;
  rawSignatureBase64?: string;
  isExpired?: boolean;
  isNotYetValid?: boolean;
  expDate?: Date;
  iatDate?: Date;
  nbfDate?: Date;
  timeRemaining?: string;
  timeElapsed?: string;
  algorithm?: string;
  tokenType?: string;
  claimsCount?: number;
}

export type {
  SecurityAuditItem,
  SecurityAuditResult,
  TimelineMetrics,
} from './jwt-audit-logic';

export {
  computeTimelineMetrics,
  auditJwtSecurity,
} from './jwt-audit-logic';

export {
  RFC_7519_CLAIMS,
  SAMPLE_JWTS,
} from './jwt-samples';

/**
 * URL-safe Base64 decode to UTF-8 string
 */
export function base64UrlDecode(str: string): string {
  let normalized = str.replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4 !== 0) {
    normalized += '=';
  }
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

/**
 * Format relative duration nicely in French or English
 */
export function formatRelativeDuration(
  targetDate: Date,
  now: Date = new Date(),
  isFr: boolean = true
): string {
  const diffMs = targetDate.getTime() - now.getTime();
  const absSeconds = Math.abs(Math.round(diffMs / 1000));

  if (isFr) {
    if (absSeconds < 60) return `${absSeconds} seconde${absSeconds > 1 ? 's' : ''}`;
    const minutes = Math.round(absSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days} jour${days > 1 ? 's' : ''}`;
    const months = Math.round(days / 30);
    if (months < 12) return `${months} mois`;
    const years = Math.round(days / 365);
    return `${years} an${years > 1 ? 's' : ''}`;
  } else {
    if (absSeconds < 60) return `${absSeconds} second${absSeconds > 1 ? 's' : ''}`;
    const minutes = Math.round(absSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''}`;
    const months = Math.round(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
    const years = Math.round(days / 365);
    return `${years} year${years > 1 ? 's' : ''}`;
  }
}

/**
 * Clean a JWT string by removing 'Bearer ', leading/trailing spaces, and internal line breaks
 */
export function cleanJwtToken(input: string): string {
  let cleaned = (input ?? '').trim();
  if (cleaned.toLowerCase().startsWith('bearer ')) {
    cleaned = cleaned.slice(7).trim();
  }
  return cleaned.replace(/[\r\n\s]+/g, '');
}

/**
 * Decode JWT token safely
 */
export function decodeJwt(token: string, isFr: boolean = true): DecodedJwt {
  const clean = cleanJwtToken(token);
  if (!clean) {
    return {
      valid: false,
      error: isFr ? 'Veuillez saisir ou coller un jeton JWT' : 'Please enter or paste a JWT token',
    };
  }

  const parts = clean.split('.');
  if (parts.length < 2) {
    return {
      valid: false,
      error: isFr
        ? 'Structure JWT invalide : doit comporter au moins 2 segments (Header.Payload) séparés par un point'
        : 'Invalid JWT structure: must contain at least 2 dot-separated segments (Header.Payload)',
    };
  }

  try {
    const rawHeaderBase64 = parts[0];
    const rawPayloadBase64 = parts[1];
    const rawSignatureBase64 = parts[2] || '';

    const headerJson = base64UrlDecode(rawHeaderBase64);
    const payloadJson = base64UrlDecode(rawPayloadBase64);

    const header = JSON.parse(headerJson) as Record<string, unknown>;
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;

    const now = new Date();
    let expDate: Date | undefined;
    let iatDate: Date | undefined;
    let nbfDate: Date | undefined;
    let isExpired = false;
    let isNotYetValid = false;
    let timeRemaining: string | undefined;
    let timeElapsed: string | undefined;

    if (typeof payload.exp === 'number') {
      expDate = new Date(payload.exp * 1000);
      isExpired = expDate.getTime() < now.getTime();
      timeRemaining = formatRelativeDuration(expDate, now, isFr);
    }

    if (typeof payload.iat === 'number') {
      iatDate = new Date(payload.iat * 1000);
      timeElapsed = formatRelativeDuration(iatDate, now, isFr);
    }

    if (typeof payload.nbf === 'number') {
      nbfDate = new Date(payload.nbf * 1000);
      isNotYetValid = nbfDate.getTime() > now.getTime();
    }

    const algorithm = typeof header.alg === 'string' ? header.alg : undefined;
    const tokenType = typeof header.typ === 'string' ? header.typ : undefined;
    const claimsCount = Object.keys(payload).length;

    return {
      valid: true,
      header,
      payload,
      signature: rawSignatureBase64,
      rawHeaderBase64,
      rawPayloadBase64,
      rawSignatureBase64,
      isExpired,
      isNotYetValid,
      expDate,
      iatDate,
      nbfDate,
      timeRemaining,
      timeElapsed,
      algorithm,
      tokenType,
      claimsCount,
    };
  } catch (err) {
    return {
      valid: false,
      error:
        err instanceof Error
          ? `${isFr ? 'Erreur de décodage' : 'Decoding error'} : ${err.message}`
          : isFr
          ? 'Échec du décodage Base64 / JSON'
          : 'Base64 / JSON decoding failed',
    };
  }
}

/**
 * Verify HMAC signature of a JWT token using Web Crypto API
 */
export async function verifyJwtHmac(
  token: string,
  secret: string,
  isBase64Secret: boolean = false,
  isFr: boolean = true
): Promise<{ verified: boolean; error?: string }> {
  const clean = cleanJwtToken(token);
  const parts = clean.split('.');
  if (parts.length !== 3) {
    return {
      verified: false,
      error: isFr
        ? 'Jeton JWT incomplet (signature manquante)'
        : 'Incomplete JWT token (missing signature)',
    };
  }

  if (!secret) {
    return {
      verified: false,
      error: isFr ? 'Clé secrète requise' : 'Secret key required',
    };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as Record<string, unknown>;
    const alg = header.alg;

    let hashAlgo = 'SHA-256';
    if (alg === 'HS384') hashAlgo = 'SHA-384';
    else if (alg === 'HS512') hashAlgo = 'SHA-512';
    else if (alg !== 'HS256') {
      return {
        verified: false,
        error: isFr
          ? `Algorithme ${alg} non pris en charge pour HMAC symétrique (supporte HS256, HS384, HS512)`
          : `Algorithm ${alg} unsupported for symmetric HMAC (supports HS256, HS384, HS512)`,
      };
    }

    const dataToSign = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);

    let keyData: Uint8Array;
    if (isBase64Secret) {
      let normalizedSecret = secret.replace(/-/g, '+').replace(/_/g, '/');
      while (normalizedSecret.length % 4 !== 0) normalizedSecret += '=';
      const binary = atob(normalizedSecret);
      keyData = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    } else {
      keyData = new TextEncoder().encode(secret);
    }

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData as unknown as BufferSource,
      { name: 'HMAC', hash: { name: hashAlgo } },
      false,
      ['verify']
    );

    // Decode signature
    let sigNorm = parts[2].replace(/-/g, '+').replace(/_/g, '/');
    while (sigNorm.length % 4 !== 0) sigNorm += '=';
    const sigBin = atob(sigNorm);
    const sigBytes = Uint8Array.from(sigBin, (c) => c.charCodeAt(0));

    const isMatch = await crypto.subtle.verify('HMAC', cryptoKey, sigBytes, dataToSign);
    return { verified: isMatch };
  } catch (err) {
    return {
      verified: false,
      error:
        err instanceof Error
          ? err.message
          : isFr
          ? 'Erreur lors de la vérification cryptographique'
          : 'Cryptographic verification error',
    };
  }
}
