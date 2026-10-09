import { describe, it, expect } from 'vitest';
import {
  generateUuidV4,
  generateUuidV7,
  formatUuid,
  generateUuidBatch,
  NIL_UUID,
  validateUuid,
  parseUuidInfo,
} from '@/lib/uuid-logic';

describe('UUID Generator Logic', () => {
  it('generates valid RFC 4122 v4 UUID with correct structure and version nibble', () => {
    const id = generateUuidV4();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('generates valid RFC 9562 v7 time-ordered UUID with version 7 nibble', () => {
    const id = generateUuidV7();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('formats UUIDs with options (uppercase, no hyphens, braces, quotes)', () => {
    const raw = '12345678-1234-4234-8234-123456789abc';

    const upper = formatUuid(raw, { uppercase: true });
    expect(upper).toBe('12345678-1234-4234-8234-123456789ABC');

    const noHyphens = formatUuid(raw, { hyphens: false });
    expect(noHyphens).toBe('12345678123442348234123456789abc');

    const braces = formatUuid(raw, { braces: true });
    expect(braces).toBe('{12345678-1234-4234-8234-123456789abc}');

    const quotes = formatUuid(raw, { quotes: true });
    expect(quotes).toBe('"12345678-1234-4234-8234-123456789abc"');
  });

  it('generates a batch of distinct UUIDs up to requested count', () => {
    const batch = generateUuidBatch(20, { version: 'v4' });
    expect(batch.length).toBe(20);
    const unique = new Set(batch);
    expect(unique.size).toBe(20);
  });

  it('handles Nil UUID constant correctly', () => {
    expect(NIL_UUID).toBe('00000000-0000-0000-0000-000000000000');
  });

  it('validates UUID strings accurately', () => {
    expect(validateUuid('c9b88ef2-70b1-49b0-9bd7-494a942b0833')).toBe(true);
    expect(validateUuid('{c9b88ef2-70b1-49b0-9bd7-494a942b0833}')).toBe(true);
    expect(validateUuid('c9b88ef270b149b09bd7494a942b0833')).toBe(true);
    expect(validateUuid('invalid-uuid-string')).toBe(false);
    expect(validateUuid('')).toBe(false);
  });

  it('correctly parses UUID metadata and timestamp for v7', () => {
    const v4 = parseUuidInfo('c9b88ef2-70b1-49b0-9bd7-494a942b0833');
    expect(v4.valid).toBe(true);
    expect(v4.version).toBe(4);
    expect(v4.variant).toBe('RFC 4122 / Leach-Salz');

    const nil = parseUuidInfo(NIL_UUID);
    expect(nil.valid).toBe(true);
    expect(nil.isNil).toBe(true);

    const v7Id = generateUuidV7();
    const v7Info = parseUuidInfo(v7Id);
    expect(v7Info.valid).toBe(true);
    expect(v7Info.version).toBe(7);
    expect(v7Info.timestamp).toBeDefined();
    expect(v7Info.timestamp?.getTime()).toBeGreaterThan(0);
  });
});
