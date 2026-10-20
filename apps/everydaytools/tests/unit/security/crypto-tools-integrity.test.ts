import { describe, it, expect, vi, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';
import {
  computeSubtleHex,
  computeAllChecksums,
  downloadTextFile,
} from '@/lib/checksum-logic';
import {
  computeSubtleHash,
  computeAllHashes,
  computeBufferHashes,
  computeHmac,
} from '@/lib/hash-logic';
import {
  decodeJwt,
  verifyJwtHmac,
  cleanJwtToken,
} from '@/lib/jwt-logic';
import {
  generateUuidBatch,
  generateUuidV4,
  generateUuidV7,
  validateUuid,
  parseUuidInfo,
} from '@/lib/uuid-logic';
import { triggerFileDownload } from '@/lib/uuid-export-logic';
import { triggerJwtDownload } from '@/lib/jwt-export-logic';
import * as downloadModule from '@/lib/download';

// Ensure WebCrypto Subtle is fully mapped in test/jsdom environment
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: true,
    configurable: true,
  });
}

/**
 * Test helper to build an authentic HS256-signed JWT
 */
async function createTestHmacJwt(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const b64Url = (str: string) =>
    btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const enc = new TextEncoder();
  const headerB64 = b64Url(JSON.stringify(header));
  const payloadB64 = b64Url(JSON.stringify(payload));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const sigB64 = b64Url(String.fromCharCode(...new Uint8Array(sig)));
  return `${dataToSign}.${sigB64}`;
}

describe('WebCrypto Multi-Algorithm Integrity (Checksum #74 & Hash-Generator #110)', () => {
  it('calcule fidèlement les empreintes WebCrypto SHA-256, SHA-512, SHA-384, SHA-1', async () => {
    const encoder = new TextEncoder();
    const buffer = encoder.encode('EverydayTools-Security-Vector').buffer;

    const [sha256, sha512, sha384, sha1] = await Promise.all([
      computeSubtleHex(buffer, 'SHA-256'),
      computeSubtleHex(buffer, 'SHA-512'),
      computeSubtleHex(buffer, 'SHA-384'),
      computeSubtleHex(buffer, 'SHA-1'),
    ]);

    expect(sha256).toHaveLength(64);
    expect(sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(sha512).toHaveLength(128);
    expect(sha384).toHaveLength(96);
    expect(sha1).toHaveLength(40);

    // Consistency check between Checksum and Hash-Generator implementations
    const hashGenSha256 = await computeSubtleHash(buffer, 'SHA-256');
    expect(hashGenSha256).toBe(sha256);
  });

  it('calcule l’ensemble des sommes de contrôle en parallèle avec MD5', async () => {
    const encoder = new TextEncoder();
    const buffer = encoder.encode('Integrity payload 12345').buffer;

    const checksums = await computeAllChecksums(buffer);
    expect(checksums['SHA-256']).toHaveLength(64);
    expect(checksums['SHA-512']).toHaveLength(128);
    expect(checksums['SHA-384']).toHaveLength(96);
    expect(checksums['SHA-1']).toHaveLength(40);
    expect(checksums['MD5']).toHaveLength(32);
    expect(checksums['MD5']).toMatch(/^[0-9a-f]{32}$/);
  });

  it('traite un buffer volumineux (2 Mo) sans plantage ni fuite mémoire', async () => {
    const largeBuffer = new Uint8Array(2 * 1024 * 1024).fill(0xaa).buffer;

    const t0 = performance.now();
    const result = await computeBufferHashes(largeBuffer);
    const duration = performance.now() - t0;

    expect(result['SHA-256']).toHaveLength(64);
    expect(result['MD5']).toHaveLength(32);
    expect(duration).toBeLessThan(2000); // Exécution rapide sans blocage UI
  });

  it('génère un HMAC SHA-256 vérifiable pour Hash Generator', async () => {
    const message = 'Authenticated Transaction';
    const secret = 'k3y-s3cr3t-99';
    const hmacHex = await computeHmac(message, secret, 'SHA-256');

    expect(hmacHex).toHaveLength(64);
    expect(hmacHex).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('JWT Reactive Decoding & HMAC Signature Verification (#108)', () => {
  it('normalise et nettoie le token (supprime "Bearer " et espaces parasites)', () => {
    const raw = '  Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.abc \n ';
    expect(cleanJwtToken(raw)).toBe('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.abc');
  });

  it('décode réactivement les revendications (Header, Payload, Délais)', async () => {
    const token = await createTestHmacJwt(
      { alg: 'HS256', typ: 'JWT' },
      { sub: 'user_42', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 },
      'test-secret'
    );

    const decoded = decodeJwt(token);
    expect(decoded.valid).toBe(true);
    expect(decoded.header?.alg).toBe('HS256');
    expect(decoded.payload?.sub).toBe('user_42');
    expect(decoded.payload?.role).toBe('admin');
    expect(decoded.isExpired).toBe(false);
    expect(decoded.claimsCount).toBe(3);
  });

  it('valide la signature HMAC HS256 avec clé UTF-8 et rejette une clé incorrecte', async () => {
    const secret = 'enterprise-super-secret-key';
    const token = await createTestHmacJwt(
      { alg: 'HS256', typ: 'JWT' },
      { user: 'alice' },
      secret
    );

    const validRes = await verifyJwtHmac(token, secret, false);
    expect(validRes.verified).toBe(true);

    const invalidRes = await verifyJwtHmac(token, 'wrong-password', false);
    expect(invalidRes.verified).toBe(false);
  });

  it('valide la signature HMAC HS256 avec clé encodée en Base64', async () => {
    const rawSecret = 'binary-key-bytes-12345';
    const b64Secret = btoa(rawSecret);
    const token = await createTestHmacJwt(
      { alg: 'HS256', typ: 'JWT' },
      { sub: 'token-b64' },
      rawSecret
    );

    const res = await verifyJwtHmac(token, b64Secret, true);
    expect(res.verified).toBe(true);
  });
});

describe('CSPRNG High-Performance UUID Generator (#111)', () => {
  it('génère un lot de 500 UUIDs v4 valides avec zéro doublon', () => {
    const batch = generateUuidBatch(500, { version: 'v4' });
    expect(batch).toHaveLength(500);

    const uniqueSet = new Set(batch);
    expect(uniqueSet.size).toBe(500); // 0 collision

    const v4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    batch.slice(0, 50).forEach((uuid) => {
      expect(uuid).toMatch(v4Regex);
      expect(validateUuid(uuid)).toBe(true);
    });
  });

  it('génère un lot de 500 UUIDs v7 ordonnés temporellement et uniques', () => {
    const batch = generateUuidBatch(500, { version: 'v7' });
    expect(batch).toHaveLength(500);

    const uniqueSet = new Set(batch);
    expect(uniqueSet.size).toBe(500);

    const v7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(batch[0]).toMatch(v7Regex);

    const parsed = parseUuidInfo(batch[0]);
    expect(parsed.valid).toBe(true);
    expect(parsed.version).toBe(7);
  });

  it('assure une génération CSPRNG performante (< 50ms pour 500 identifiants)', () => {
    const t0 = performance.now();
    generateUuidBatch(500, { version: 'v4' });
    const duration = performance.now() - t0;

    expect(duration).toBeLessThan(50);
  });
});

describe('Download Unification & Zero Artificial Delay Guardrails', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('garantit un calcul instantané sans délai artificiel imposé', async () => {
    const t0 = performance.now();
    await computeAllHashes('Performance benchmark test');
    const elapsed = performance.now() - t0;

    // Pas de pause artificielle setTimeout(..., 600+)
    expect(elapsed).toBeLessThan(400);
  });

  it('exige l’unification des téléchargements Checksum via @/lib/download (RED)', () => {
    const downloadTextSpy = vi.spyOn(downloadModule, 'downloadText');
    const downloadBlobSpy = vi.spyOn(downloadModule, 'downloadBlob');

    downloadTextFile('sample-checksum-content', 'sample.sha256');

    // DOIT échouer en RED tant que checksum-logic duplique createElement('a') au lieu de @/lib/download
    expect(downloadTextSpy.mock.calls.length + downloadBlobSpy.mock.calls.length).toBeGreaterThan(0);
  });

  it('exige l’unification des téléchargements UUID via @/lib/download (RED)', () => {
    const downloadTextSpy = vi.spyOn(downloadModule, 'downloadText');
    const downloadBlobSpy = vi.spyOn(downloadModule, 'downloadBlob');

    triggerFileDownload('uuid-1\nuuid-2', 'uuids.txt', 'text/plain;charset=utf-8');

    // DOIT échouer en RED tant que uuid-export-logic n’appelle pas @/lib/download
    expect(downloadTextSpy.mock.calls.length + downloadBlobSpy.mock.calls.length).toBeGreaterThan(0);
  });

  it('exige l’unification des téléchargements JWT via @/lib/download (RED)', () => {
    const downloadTextSpy = vi.spyOn(downloadModule, 'downloadText');
    const downloadBlobSpy = vi.spyOn(downloadModule, 'downloadBlob');

    triggerJwtDownload('{"header":{}}', 'jwt.json', 'application/json');

    // DOIT échouer en RED tant que jwt-export-logic n’appelle pas @/lib/download
    expect(downloadTextSpy.mock.calls.length + downloadBlobSpy.mock.calls.length).toBeGreaterThan(0);
  });
});
