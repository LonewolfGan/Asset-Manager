/**
 * Cryptographic hashing and HMAC logic using hardware-accelerated SubtleCrypto
 * with MD5 fallback via pure JavaScript implementation.
 */

import { md5, md5Bytes } from './hash-md5-pure';

export type SupportedHashAlgo = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

// Re-export pure MD5 functions for backward compatibility and clean modularity
export { md5, md5Bytes };

/**
 * Compute hex hash using SubtleCrypto
 */
export async function computeSubtleHash(
  data: ArrayBuffer,
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute all hashes for text
 */
export async function computeAllHashes(
  text: string
): Promise<Record<SupportedHashAlgo, string>> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const [sha1, sha256, sha384, sha512] = await Promise.all([
    computeSubtleHash(data.buffer, 'SHA-1'),
    computeSubtleHash(data.buffer, 'SHA-256'),
    computeSubtleHash(data.buffer, 'SHA-384'),
    computeSubtleHash(data.buffer, 'SHA-512'),
  ]);

  const md5Hash = md5(text);

  return {
    MD5: md5Hash,
    'SHA-1': sha1,
    'SHA-256': sha256,
    'SHA-384': sha384,
    'SHA-512': sha512,
  };
}

/**
 * Compute all hashes for an ArrayBuffer (binary files)
 */
export async function computeBufferHashes(
  buffer: ArrayBuffer
): Promise<Record<SupportedHashAlgo, string>> {
  const [sha1, sha256, sha384, sha512] = await Promise.all([
    computeSubtleHash(buffer, 'SHA-1'),
    computeSubtleHash(buffer, 'SHA-256'),
    computeSubtleHash(buffer, 'SHA-384'),
    computeSubtleHash(buffer, 'SHA-512'),
  ]);

  let md5Hash = '';
  try {
    // Calcul MD5 pour les fichiers de taille modérée (< 30 Mo)
    if (buffer.byteLength <= 30 * 1024 * 1024) {
      md5Hash = md5Bytes(new Uint8Array(buffer));
    } else {
      md5Hash = '(Fichier > 30 Mo : MD5 omis pour la fluidité)';
    }
  } catch {
    md5Hash = '';
  }

  return {
    MD5: md5Hash,
    'SHA-1': sha1,
    'SHA-256': sha256,
    'SHA-384': sha384,
    'SHA-512': sha512,
  };
}

/**
 * Compute HMAC for text with a secret key
 */
export async function computeHmac(
  text: string,
  secret: string,
  algo: 'SHA-256' | 'SHA-512' | 'SHA-384' | 'SHA-1' = 'SHA-256'
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(text);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algo } },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify an expected hash against calculated hashes
 */
export function verifyHashMatch(
  expectedHash: string,
  calculatedHashes: Record<string, string>
): { matched: boolean; algorithm?: string } {
  const cleanExpected = expectedHash.trim().toLowerCase();
  if (!cleanExpected) return { matched: false };

  for (const [algo, hashVal] of Object.entries(calculatedHashes)) {
    if (hashVal.toLowerCase() === cleanExpected) {
      return { matched: true, algorithm: algo };
    }
  }

  return { matched: false };
}
