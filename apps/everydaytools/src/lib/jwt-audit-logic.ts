import type { DecodedJwt } from './jwt-logic';

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
