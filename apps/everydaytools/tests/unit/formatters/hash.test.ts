import { describe, it, expect } from 'vitest';
import {
  md5,
  computeAllHashes,
  computeHmac,
  verifyHashMatch,
} from '@/lib/hash-logic';

describe('Cryptographic Hash Logic', () => {
  it('correctly calculates MD5 hash', () => {
    expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(md5('EverydayTools')).toBe('948969bface89c84b42d26cde5dd555d');
  });

  it('computes all hashes simultaneously (MD5, SHA-1, SHA-256, SHA-384, SHA-512)', async () => {
    const hashes = await computeAllHashes('hello');
    expect(hashes.MD5).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(hashes['SHA-1']).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    expect(hashes['SHA-256']).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    expect(hashes['SHA-384']).toBeDefined();
    expect(hashes['SHA-512']).toBeDefined();
  });

  it('computes HMAC signature with a secret key', async () => {
    const hmac = await computeHmac('message', 'secret', 'SHA-256');
    expect(hmac).toBeTruthy();
    expect(hmac.length).toBe(64); // 256 bits in hex
  });

  it('verifies matching hash against computed set', () => {
    const calculated = {
      MD5: '5d41402abc4b2a76b9719d911017c592',
      'SHA-256': '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    };
    const res1 = verifyHashMatch('5d41402abc4b2a76b9719d911017c592', calculated);
    expect(res1.matched).toBe(true);
    expect(res1.algorithm).toBe('MD5');

    const res2 = verifyHashMatch('2CF24DBA5FB0A30E26E83B2AC5B9E29E1B161E5C1FA7425E73043362938B9824', calculated);
    expect(res2.matched).toBe(true);
    expect(res2.algorithm).toBe('SHA-256');

    const res3 = verifyHashMatch('randominvalidhash', calculated);
    expect(res3.matched).toBe(false);
  });

  it('computes buffer hashes for binary array data', async () => {
    const encoder = new TextEncoder();
    const buf = encoder.encode('EverydayTools binary test').buffer;
    const { computeBufferHashes } = await import('@/lib/hash-logic');
    const hashes = await computeBufferHashes(buf);
    expect(hashes['SHA-256']).toBeTruthy();
    expect(hashes['SHA-512']).toBeTruthy();
    expect(hashes['SHA-1']).toBeTruthy();
  });
});

