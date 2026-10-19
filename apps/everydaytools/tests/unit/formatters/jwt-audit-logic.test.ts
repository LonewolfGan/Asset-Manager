import { describe, it, expect } from 'vitest';
import { decodeJwt } from '@/lib/jwt-logic';
import { computeTimelineMetrics, auditJwtSecurity } from '@/lib/jwt-audit-logic';
import { SAMPLE_JWTS } from '@/lib/jwt-samples';

describe('jwt-audit-logic', () => {
  describe('computeTimelineMetrics', () => {
    it('computes metrics for active token with exp and iat', () => {
      const decoded = decodeJwt(SAMPLE_JWTS.activeAdmin);
      const metrics = computeTimelineMetrics(decoded);
      expect(metrics.hasExp).toBe(true);
      expect(metrics.hasIat).toBe(true);
      expect(metrics.isExpired).toBe(false);
      expect(metrics.progressPct).toBeGreaterThanOrEqual(0);
      expect(metrics.progressPct).toBeLessThanOrEqual(100);
      expect(metrics.remainingLabel).toContain('Valide encore');
    });

    it('computes metrics for expired token', () => {
      const decoded = decodeJwt(SAMPLE_JWTS.expiredUser);
      const metrics = computeTimelineMetrics(decoded);
      expect(metrics.hasExp).toBe(true);
      expect(metrics.isExpired).toBe(true);
      expect(metrics.progressPct).toBe(100);
      expect(metrics.remainingLabel).toContain('Expiré');
    });

    it('computes metrics for token without exp', () => {
      const decoded = decodeJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U');
      const metrics = computeTimelineMetrics(decoded);
      expect(metrics.hasExp).toBe(false);
      expect(metrics.isExpired).toBe(false);
      expect(metrics.remainingLabel).toBe('Durée illimitée');
    });
  });

  describe('auditJwtSecurity', () => {
    it('returns critical score for "none" algorithm token', () => {
      const decoded = decodeJwt(SAMPLE_JWTS.insecureNone.token);
      const audit = auditJwtSecurity(decoded);
      expect(audit.score).toBe('critical');
      const algItem = audit.items.find((i) => i.id === 'alg_none');
      expect(algItem).toBeDefined();
      expect(algItem?.status).toBe('critical');
    });

    it('returns safe or warning score for valid standard tokens', () => {
      const decoded = decodeJwt(SAMPLE_JWTS.activeAdmin);
      const audit = auditJwtSecurity(decoded);
      expect(['safe', 'warning']).toContain(audit.score);
      const algItem = audit.items.find((i) => i.id === 'alg_ok');
      expect(algItem).toBeDefined();
      expect(algItem?.status).toBe('pass');
    });
  });
});
