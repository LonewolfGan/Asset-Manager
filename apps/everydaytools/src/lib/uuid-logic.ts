/**
 * RFC 4122 (UUID v4) and RFC 9562 (UUID v7 time-ordered) generator algorithms,
 * with validation and structural inspection.
 */

export type UuidVersion = 'v4' | 'v7';

export interface UuidFormatOptions {
  version?: UuidVersion;
  hyphens?: boolean;
  uppercase?: boolean;
  braces?: boolean;
  quotes?: boolean;
}

export interface UuidParsedInfo {
  valid: boolean;
  cleanHex: string;
  formatted: string;
  version?: number;
  versionLabel?: string;
  variant?: string;
  timestamp?: Date;
  isNil?: boolean;
}

/**
 * Generate standard RFC 4122 v4 UUID
 */
export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40; // Version 4
  buf[8] = (buf[8] & 0x3f) | 0x80; // Variant RFC 4122

  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Generate RFC 9562 v7 time-ordered UUID
 * 48-bit timestamp (ms) + 12-bit random + 2-bit variant + 62-bit random
 */
export function generateUuidV7(): string {
  const timestamp = BigInt(Date.now());
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  // 48-bit timestamp hex (12 chars)
  const timeHex = timestamp.toString(16).padStart(12, '0');

  // version 7 nibble
  const randA = ((randomBytes[0] & 0x0f) | 0x70).toString(16).padStart(2, '0') +
    randomBytes[1].toString(16).padStart(2, '0');

  // variant 2 bits (10xx)
  const randB1 = ((randomBytes[2] & 0x3f) | 0x80).toString(16).padStart(2, '0');
  const randB2 = Array.from(randomBytes.slice(3), (b) => b.toString(16).padStart(2, '0')).join('');

  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-${randA}-${randB1}${randB2.slice(0, 2)}-${randB2.slice(2)}`;
}

/**
 * Nil UUID (all zeros)
 */
export const NIL_UUID = '00000000-0000-0000-0000-000000000000';

/**
 * Apply formatting options to UUID string
 */
export function formatUuid(rawUuid: string, options: UuidFormatOptions = {}): string {
  let id = rawUuid;

  if (options.hyphens === false) {
    id = id.replace(/-/g, '');
  }

  if (options.uppercase) {
    id = id.toUpperCase();
  } else {
    id = id.toLowerCase();
  }

  if (options.braces) {
    id = `{${id}}`;
  }

  if (options.quotes) {
    id = `"${id}"`;
  }

  return id;
}

/**
 * Generate a batch of formatted UUIDs
 */
export function generateUuidBatch(count: number, options: UuidFormatOptions = {}): string[] {
  const safeCount = Math.max(1, Math.min(count, 500));
  const generator = options.version === 'v7' ? generateUuidV7 : generateUuidV4;
  const list: string[] = [];

  for (let i = 0; i < safeCount; i++) {
    const raw = generator();
    list.push(formatUuid(raw, options));
  }

  return list;
}

/**
 * Validate if an input string is a valid UUID
 */
export function validateUuid(input: string): boolean {
  if (!input) return false;
  const clean = input.trim().replace(/^[{"]|[}"]$/g, '').replace(/-/g, '');
  return /^[0-9a-f]{32}$/i.test(clean);
}

/**
 * Inspect and extract metadata from any UUID string
 */
export function parseUuidInfo(input: string, isFr: boolean = true): UuidParsedInfo {
  const trimmed = input.trim().replace(/^[{"]|[}"]$/g, '');
  const clean = trimmed.replace(/-/g, '').toLowerCase();

  if (!/^[0-9a-f]{32}$/i.test(clean)) {
    return { valid: false, cleanHex: clean, formatted: trimmed };
  }

  const formatted = `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;

  if (clean === '00000000000000000000000000000000') {
    return {
      valid: true,
      cleanHex: clean,
      formatted,
      version: 0,
      versionLabel: isFr ? 'Nil UUID (Zéros)' : 'Nil UUID (All zeros)',
      variant: 'N/A',
      isNil: true
    };
  }

  // Version is in 13th hex char (index 12)
  const versionNibble = parseInt(clean[12], 16);
  let versionLabel = `Version ${versionNibble}`;
  switch (versionNibble) {
    case 1: versionLabel = isFr ? 'v1 (Temps & MAC)' : 'v1 (Time & MAC)'; break;
    case 2: versionLabel = isFr ? 'v2 (Sécurité DCE)' : 'v2 (DCE Security)'; break;
    case 3: versionLabel = isFr ? 'v3 (MD5 & Namespace)' : 'v3 (MD5 & Namespace)'; break;
    case 4: versionLabel = isFr ? 'v4 (Pseudo-aléatoire RFC 4122)' : 'v4 (Random RFC 4122)'; break;
    case 5: versionLabel = isFr ? 'v5 (SHA-1 & Namespace)' : 'v5 (SHA-1 & Namespace)'; break;
    case 6: versionLabel = isFr ? 'v6 (Re-ordonné v1)' : 'v6 (Reordered v1)'; break;
    case 7: versionLabel = isFr ? 'v7 (Horodaté Unix Epoch RFC 9562)' : 'v7 (Unix Epoch Timestamped RFC 9562)'; break;
    case 8: versionLabel = isFr ? 'v8 (Format personnalisé)' : 'v8 (Custom format)'; break;
  }

  // Variant in byte 8 (hex chars 16-17)
  const byte8 = parseInt(clean.slice(16, 18), 16);
  let variant = isFr ? 'Inconnu' : 'Unknown';
  if ((byte8 & 0x80) === 0x00) {
    variant = isFr ? 'NCS (Rétro-compatibilité)' : 'NCS (Backward compatibility)';
  } else if ((byte8 & 0xc0) === 0x80) {
    variant = 'RFC 4122 / Leach-Salz';
  } else if ((byte8 & 0xe0) === 0xc0) {
    variant = 'Microsoft GUID';
  } else if ((byte8 & 0xe0) === 0xe0) {
    variant = isFr ? 'Réservé pour usage futur' : 'Reserved for future use';
  }

  let timestamp: Date | undefined;
  if (versionNibble === 7) {
    // 48-bit timestamp in milliseconds
    const ms = parseInt(clean.slice(0, 12), 16);
    if (!isNaN(ms) && ms > 0) {
      timestamp = new Date(ms);
    }
  }

  return {
    valid: true,
    cleanHex: clean,
    formatted,
    version: versionNibble,
    versionLabel,
    variant,
    timestamp,
    isNil: false
  };
}
