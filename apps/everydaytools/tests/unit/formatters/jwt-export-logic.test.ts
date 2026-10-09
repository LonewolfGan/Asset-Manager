import { describe, it, expect } from 'vitest';
import {
  getJwtByteSize,
  getClaimAnnotation,
  buildJwtExportPayload,
} from '@/lib/jwt-export-logic';
import { decodeJwt, SAMPLE_JWTS } from '@/lib/jwt-logic';

describe('JWT Export and Annotation Logic', () => {
  it('calculates char count and byte size accurately', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M';
    const stats = getJwtByteSize(token);
    expect(stats.chars).toBe(token.length);
    expect(stats.bytes).toBe(new TextEncoder().encode(token).length);
  });

  it('builds JSON export payloads for full, payload, and header modes', () => {
    const decoded = decodeJwt(SAMPLE_JWTS.activeAdmin, true);
    
    const fullJson = buildJwtExportPayload(decoded, 'full');
    const parsedFull = JSON.parse(fullJson);
    expect(parsedFull.header).toBeDefined();
    expect(parsedFull.payload).toBeDefined();
    expect(parsedFull.header.alg).toBe('HS256');

    const payloadJson = buildJwtExportPayload(decoded, 'payload');
    const parsedPayload = JSON.parse(payloadJson);
    expect(parsedPayload.sub).toBe('usr_1001');

    const headerJson = buildJwtExportPayload(decoded, 'header');
    const parsedHeader = JSON.parse(headerJson);
    expect(parsedHeader.alg).toBe('HS256');
  });

  it('generates standard RFC claim annotations for iss, sub, aud', () => {
    const decoded = decodeJwt(SAMPLE_JWTS.activeAdmin, true);
    
    const subFr = getClaimAnnotation('sub', 'usr_1001', decoded, true);
    expect(subFr).toBe('Identifiant sujet');

    const subEn = getClaimAnnotation('sub', 'usr_1001', decoded, false);
    expect(subEn).toBe('Subject identifier');

    const issFr = getClaimAnnotation('iss', 'https://auth.test', decoded, true);
    expect(issFr).toBe('Émetteur');

    const audEn = getClaimAnnotation('aud', 'https://api.test', decoded, false);
    expect(audEn).toBe('Audience');

    const customClaim = getClaimAnnotation('random_key', 'val', decoded, true);
    expect(customClaim).toBeNull();
  });

  it('generates timestamp annotations for exp and iat', () => {
    const decoded = decodeJwt(SAMPLE_JWTS.activeAdmin, true);

    const expAnnotationFr = getClaimAnnotation('exp', 2000000000, decoded, true);
    expect(expAnnotationFr).toContain('Expire le');

    const iatAnnotationFr = getClaimAnnotation('iat', 1600000000, decoded, true);
    expect(iatAnnotationFr).toContain('Émis le');

    const expiredDecoded = decodeJwt(SAMPLE_JWTS.expiredUser, false);
    const expAnnotationEn = getClaimAnnotation('exp', 1500000000, expiredDecoded, false);
    expect(expAnnotationEn).toContain('Expired on');
  });
});
