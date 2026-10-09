import { describe, it, expect } from 'vitest';
import {
  decodeJwt,
  verifyJwtHmac,
  SAMPLE_JWTS,
} from '@/lib/jwt-logic';

describe('JWT Decoder Logic', () => {
  it('correctly decodes header and payload of a valid JWT', () => {
    const res = decodeJwt(SAMPLE_JWTS.activeAdmin);
    expect(res.valid).toBe(true);
    expect(res.header).toBeDefined();
    expect(res.header?.alg).toBe('HS256');
    expect(res.payload?.sub).toBe('usr_1001');
    expect(res.payload?.name).toBe('Alexandre Martin');
  });

  it('accurately identifies active vs expired tokens', () => {
    const active = decodeJwt(SAMPLE_JWTS.activeAdmin);
    expect(active.isExpired).toBe(false);

    const expired = decodeJwt(SAMPLE_JWTS.expiredUser);
    expect(expired.isExpired).toBe(true);
    expect(expired.timeRemaining).toBeDefined();
  });

  it('fails gracefully on invalid token formats', () => {
    const res = decodeJwt('not-a-valid-jwt');
    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('verifies HMAC signature against matching secret', async () => {
    // Generate a quick test token
    const headerB64 = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=/g, '');
    const payloadB64 = btoa(JSON.stringify({ sub: 'test' })).replace(/=/g, '');
    const data = `${headerB64}.${payloadB64}`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('my-secret-key'),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
    const sigHex = Array.from(new Uint8Array(sig), (b) => String.fromCharCode(b)).join('');
    const sigB64 = btoa(sigHex).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const fullToken = `${data}.${sigB64}`;

    const validRes = await verifyJwtHmac(fullToken, 'my-secret-key');
    expect(validRes.verified).toBe(true);

    const invalidRes = await verifyJwtHmac(fullToken, 'wrong-key');
    expect(invalidRes.verified).toBe(false);
  });
});
