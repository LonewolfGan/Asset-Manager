/**
 * Pure JWT parsing, claim decoding, timestamp evaluation, HMAC signature validation,
 * timeline lifecycle metrics, and security vulnerability audit.
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

export interface SecurityAuditItem {
  id: string;
  title: string;
  status: 'pass' | 'warning' | 'critical';
  detail: string;
}

export interface SecurityAuditResult {
  score: 'safe' | 'warning' | 'critical';
  passedCount: number;
  totalCount: number;
  items: SecurityAuditItem[];
}

export interface TimelineMetrics {
  hasExp: boolean;
  hasIat: boolean;
  isExpired: boolean;
  progressPct: number;
  elapsedLabel: string;
  remainingLabel: string;
}

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

/**
 * Compute the lifecycle progress of the token
 */
export function computeTimelineMetrics(decoded: DecodedJwt): TimelineMetrics {
  const now = Date.now();
  const hasExp = Boolean(decoded.expDate);
  const hasIat = Boolean(decoded.iatDate);

  if (!hasExp || !decoded.expDate) {
    return {
      hasExp: false,
      hasIat,
      isExpired: false,
      progressPct: 0,
      elapsedLabel: decoded.timeElapsed || 'Émis',
      remainingLabel: 'Durée illimitée',
    };
  }

  const expTime = decoded.expDate.getTime();
  const iatTime = decoded.iatDate ? decoded.iatDate.getTime() : expTime - 3600 * 1000 * 24;
  const isExpired = now >= expTime;

  let progressPct = 0;
  if (isExpired) {
    progressPct = 100;
  } else if (now <= iatTime) {
    progressPct = 0;
  } else {
    const total = expTime - iatTime;
    const elapsed = now - iatTime;
    progressPct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }

  return {
    hasExp: true,
    hasIat,
    isExpired,
    progressPct,
    elapsedLabel: decoded.timeElapsed ? `il y a ${decoded.timeElapsed}` : 'Émis',
    remainingLabel: isExpired
      ? `Expiré il y a ${decoded.timeRemaining}`
      : `Valide encore ${decoded.timeRemaining}`,
  };
}

/**
 * Client-side security diagnostic audit
 */
export function auditJwtSecurity(decoded: DecodedJwt): SecurityAuditResult {
  if (!decoded.valid) {
    return {
      score: 'critical',
      passedCount: 0,
      totalCount: 1,
      items: [
        {
          id: 'validity',
          title: 'Structure cryptographique',
          status: 'critical',
          detail: decoded.error || 'Le format du jeton n’est pas un JWT valide.',
        },
      ],
    };
  }

  const items: SecurityAuditItem[] = [];

  // 1. Audit de l'algorithme
  const alg = decoded.algorithm;
  if (!alg || alg.toLowerCase() === 'none') {
    items.push({
      id: 'alg_none',
      title: 'Algorithme "none" interdit',
      status: 'critical',
      detail:
        'Ce jeton utilise l’algorithme « none » sans signature cryptographique. N’importe qui peut forger des privilèges administrateur (Faille CVE critique).',
    });
  } else if (['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'EdDSA'].includes(alg)) {
    items.push({
      id: 'alg_ok',
      title: `Algorithme sécurisé (${alg})`,
      status: 'pass',
      detail: `Signature cryptographique standard (${alg}) protégée contre la falsification.`,
    });
  } else {
    items.push({
      id: 'alg_warn',
      title: `Algorithme atypique (${alg})`,
      status: 'warning',
      detail: 'L’algorithme spécifié dans l’en-tête ne fait pas partie des normes recommandées.',
    });
  }

  // 2. Audit de l'expiration
  if (!decoded.expDate) {
    items.push({
      id: 'no_exp',
      title: 'Absence de claim d’expiration (exp)',
      status: 'warning',
      detail:
        'Le jeton n’a aucune date d’expiration définie. En cas de vol, il reste utilisable indéfiniment.',
    });
  } else if (decoded.isExpired) {
    items.push({
      id: 'is_expired',
      title: 'Jeton expiré',
      status: 'warning',
      detail: `Ce jeton a expiré le ${decoded.expDate.toLocaleString()} et doit être rejeté par les API.`,
    });
  } else {
    // Vérifier durée de vie excessive (> 1 an)
    const now = Date.now();
    const ttlDays = Math.round((decoded.expDate.getTime() - now) / (1000 * 3600 * 24));
    if (ttlDays > 365) {
      items.push({
        id: 'long_ttl',
        title: 'Durée de vie très longue (> 1 an)',
        status: 'warning',
        detail: `Le jeton est valide pour ${ttlDays} jours. Privilégiez des jetons courts avec refresh token.`,
      });
    } else {
      items.push({
        id: 'exp_ok',
        title: 'Durée de validité conforme',
        status: 'pass',
        detail: `Expire dans ${decoded.timeRemaining}. Durée de session conforme aux bonnes pratiques.`,
      });
    }
  }

  // 3. Sujet et émetteur (sub & iss)
  const hasSub = Boolean(decoded.payload?.sub);
  const hasIss = Boolean(decoded.payload?.iss);

  if (hasSub && hasIss) {
    items.push({
      id: 'identity_ok',
      title: 'Identité complète (sub & iss)',
      status: 'pass',
      detail: 'Le sujet et l’émetteur sont clairement identifiés conformément à la RFC 7519.',
    });
  } else if (!hasSub) {
    items.push({
      id: 'missing_sub',
      title: 'Claim sujet (sub) manquant',
      status: 'warning',
      detail: 'Le jeton ne spécifie pas d’identifiant principal pour l’utilisateur.',
    });
  }

  // 4. Date d'émission (iat)
  if (decoded.iatDate) {
    items.push({
      id: 'iat_ok',
      title: 'Horodatage d’émission vérifié (iat)',
      status: 'pass',
      detail: `Émis le ${decoded.iatDate.toLocaleString()}.`,
    });
  } else {
    items.push({
      id: 'missing_iat',
      title: 'Claim émis le (iat) absent',
      status: 'warning',
      detail: 'Impossible de déterminer précisément quand ce jeton a été forgé.',
    });
  }

  // Score global
  const hasCritical = items.some((i) => i.status === 'critical');
  const hasWarning = items.some((i) => i.status === 'warning');
  const score = hasCritical ? 'critical' : hasWarning ? 'warning' : 'safe';
  const passedCount = items.filter((i) => i.status === 'pass').length;

  return {
    score,
    passedCount,
    totalCount: items.length,
    items,
  };
}

/**
 * Standard RFC 7519 registered claims descriptions
 */
export const RFC_7519_CLAIMS: Record<string, { label: string; description: string; type: string }> = {
  iss: {
    label: 'Issuer (Émetteur)',
    description: "Identifie le fournisseur d'identité ou le service qui a généré et émis le jeton.",
    type: 'string',
  },
  sub: {
    label: 'Subject (Sujet)',
    description: "Identifie l'entité principale ciblée par le jeton (ex. identifiant d'utilisateur).",
    type: 'string',
  },
  aud: {
    label: 'Audience (Destinataire)',
    description: 'Désigne les services, API ou domaines récipiendaires auxquels ce jeton est destiné.',
    type: 'string | string[]',
  },
  exp: {
    label: 'Expiration Time (Expiration)',
    description: 'Horodatage Unix (secondes) après lequel le jeton ne doit plus être accepté.',
    type: 'number (Unix Timestamp)',
  },
  nbf: {
    label: 'Not Before (Date d’effet)',
    description: 'Horodatage Unix (secondes) avant lequel le jeton ne doit pas être considéré comme valide.',
    type: 'number (Unix Timestamp)',
  },
  iat: {
    label: 'Issued At (Émis le)',
    description: 'Horodatage Unix (secondes) marquant le moment précis où le jeton a été émis.',
    type: 'number (Unix Timestamp)',
  },
  jti: {
    label: 'JWT ID (Identifiant unique)',
    description: 'Identifiant cryptographique unique pour prévenir les attaques par rejeu (replay attacks).',
    type: 'string (UUID / Hash)',
  },
};

/**
 * Real-world provider JWT presets
 */
export const SAMPLE_JWTS = {
  activeAdmin:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwMSIsIm5hbWUiOiJBbGV4YW5kcmUgTWFydGluIiwiZXhwIjoyMDAwMDAwMDAwLCJpYXQiOjE2MDAwMDAwMDB9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
  expiredUser:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwMiIsIm5hbWUiOiJTb3BoaWUgTWFydGluIiwiZXhwIjoxNTAwMDAwMDAwLCJpYXQiOjE0MDAwMDAwMDB9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
  supabaseAuth: {
    name: 'Supabase Auth (Session Active)',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb2plY3Quc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImQzYjA3Mzg0LWQxMTMtNGE3Yi1hMmM5LTE2YThkNjcyNThlMiIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJleHAiOjE3OTA4NjM3NzUsImlhdCI6MTc5MDI0NDU3NSwiZW1haWwiOiJhbGV4YW5kcmUubWFydGluQGNvbXBhbnkuaW8iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImdpdGh1YiIsInByb3ZpZGVycyI6WyJnaXRodWIiXX0sInVzZXJfbWV0YWRhdGEiOnsiZnVsbF9uYW1lIjoiQWxleGFuZHJlIE1hcnRpbiIsImF2YXRhcl91cmwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTA0OTIifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJzZXNzaW9uX2lkIjoiOGM3OTI0ZWYtOTEyYi00MmVhLTllN2YtYjI1ODY3MTQwNDFiIn0.TlDBGWIAXZymKCpRMYRMxyB5q0CU-7UcM4acjmPcSRc',
    secret: 'supabase-super-secret-jwt-token-key-32chars',
    provider: 'Supabase',
    description: 'Jeton utilisateur Supabase complet avec métadonnées GitHub et rôles.',
  },
  auth0Admin: {
    name: 'Auth0 Management API (Admin)',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXZlcnlkYXl0b29scy5kZXYvIiwic3ViIjoiYXV0aDB8NjRmMWEyYjNjNGQ1ZTZmN2E4YjljMGQxIiwiYXVkIjpbImh0dHBzOi8vYXBpLmV2ZXJ5ZGF5dG9vbHMuZGV2L3YyLyIsImh0dHBzOi8vYXV0aC5ldmVyeWRheXRvb2xzLmRldi91c2VyaW5mbyJdLCJpYXQiOjE3OTAyMTU3NzUsImV4cCI6MTc5Mjg1MDk3NSwiYXpwIjoiY2xpZW50Xzk5YThiN2M2ZDVlNGYzYTIiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHJlYWQ6dXNlcnMgd3JpdGU6dXNlcnMgYWRtaW46YWxsIiwicGVybWlzc2lvbnMiOlsicmVhZDpyZXBvcnRzIiwibWFuYWdlOmJpbGxpbmciLCJhZG1pbiphY2Nlc3MiXX0.WYX7FVvgQ4Fz3kOuKPvSZTxY5ILLBVKDpD1h77crLyM',
    secret: 'auth0-management-api-secret-key-prod',
    provider: 'Auth0',
    description: 'Jeton API Auth0 avec scopes étendus et permissions de sécurité.',
  },
  expiredSession: {
    name: 'Session Échue (Expirée)',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXZlcnlkYXl0b29scy5kZXYiLCJzdWIiOiJ1c3JfbGVnYWN5XzQ4MTAyIiwiYXVkIjoiZXZlcnlkYXl0b29scy13ZWIiLCJpYXQiOjE3ODUwNzQ5NzUsImV4cCI6MTc4ODk2Mjk3NSwiZW1haWwiOiJzb3BoaWUuZHVwb250QGxlZ2FjeS5uZXQiLCJyb2xlIjoidmlld2VyIn0.yVmMXuQneu010uDnAjdIxPzJywH6OiuaMWIiGA4FuR4',
    secret: 'old-session-secret-expired',
    provider: 'Standard',
    description: 'Jeton dont la date d’expiration (exp) est échue depuis plusieurs jours.',
  },
  insecureNone: {
    name: 'Faille CVE Algorithme "none"',
    token:
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL3Z1bG5lcmFibGUtYXV0aC5uZXQiLCJzdWIiOiJyb290X2FkbWluaXN0cmF0b3IiLCJhZG1pbiI6dHJ1ZSwicm9sZSI6InN1cGVydXNlciIsImlhdCI6MTc5MDI1NzE3NSwiZXhwIjoxNzkwMzQ1Mzc1fQ.',
    secret: '',
    provider: 'Test Vulnérabilité',
    description: 'Jeton sans signature exploitant la faille classique de contournement d’auth.',
  },
};
