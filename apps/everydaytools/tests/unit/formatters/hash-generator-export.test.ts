import { describe, it, expect } from 'vitest';
import {
  ALGORITHMS,
  formatBytes,
  generateManifestContent,
  buildJsonExportPayload,
} from '@/lib/hash-generator-export';

describe('Hash Generator Export Logic (Phase RED -> GREEN)', () => {
  describe('ALGORITHMS', () => {
    it('defines standard 5 cryptographic algorithms in correct order', () => {
      expect(ALGORITHMS.map((a) => a.id)).toEqual([
        'SHA-256',
        'SHA-512',
        'SHA-384',
        'SHA-1',
        'MD5',
      ]);
      expect(ALGORITHMS[0].hexLength).toBe(64);
      expect(ALGORITHMS[1].hexLength).toBe(128);
    });
  });

  describe('formatBytes', () => {
    it('formats zero bytes correctly', () => {
      expect(formatBytes(0, true)).toBe('0 o');
      expect(formatBytes(0, false)).toBe('0 B');
    });

    it('formats kilobytes and megabytes in FR and EN', () => {
      expect(formatBytes(1024, true)).toBe('1 Ko');
      expect(formatBytes(1024, false)).toBe('1 KB');
      expect(formatBytes(1024 * 1024 * 2.5, true)).toBe('2.5 Mo');
      expect(formatBytes(1024 * 1024 * 2.5, false)).toBe('2.5 MB');
    });
  });

  describe('generateManifestContent', () => {
    it('generates text manifest with headers and lowercase hashes', () => {
      const manifest = generateManifestContent({
        sourceLabel: 'hello.txt',
        isFr: true,
        enableHmac: false,
        hmacSecret: '',
        isUppercase: false,
        hashes: {
          'SHA-256': '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
          'SHA-512': 'abc512',
          'SHA-384': 'abc384',
          'SHA-1': 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
          MD5: '5d41402abc4b2a76b9719d911017c592',
        },
      });

      expect(manifest).toContain('# Manifeste Cryptographique — EverydayTools');
      expect(manifest).toContain('# Source : hello.txt');
      expect(manifest).toContain('SHA-256');
      expect(manifest).toContain('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    it('generates uppercase hashes when requested', () => {
      const manifest = generateManifestContent({
        sourceLabel: 'test',
        isFr: false,
        enableHmac: true,
        hmacSecret: 'my-secret',
        isUppercase: true,
        hashes: {
          'SHA-256': 'abcdef',
          'SHA-512': '',
          'SHA-384': '',
          'SHA-1': '',
          MD5: '',
        },
      });

      expect(manifest).toContain('# Cryptographic Manifest — EverydayTools');
      expect(manifest).toContain('# HMAC: Yes');
      expect(manifest).toContain('ABCDEF');
    });
  });

  describe('buildJsonExportPayload', () => {
    it('builds JSON export structure matching application state', () => {
      const payload = buildJsonExportPayload({
        source: 'sample.pdf',
        isHmac: false,
        isUppercase: false,
        hashes: {
          'SHA-256': 'hash256',
          'SHA-512': 'hash512',
          'SHA-384': 'hash384',
          'SHA-1': 'hash1',
          MD5: 'hashmd5',
        },
      });

      expect(payload.source).toBe('sample.pdf');
      expect(payload.isHmac).toBe(false);
      expect(payload.hashes['SHA-256']).toBe('hash256');
      expect(typeof payload.timestamp).toBe('string');
    });
  });
});
