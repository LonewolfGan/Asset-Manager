import { describe, it, expect } from 'vitest';
import {
  speedToNormalized,
  DIAL_TICKS,
  getLatencyVerdict,
  formatSpeedReportSummary,
} from '@/lib/speed-test-dial-logic';

describe('Speed Test Dial & Report Logic (Phase RED -> GREEN)', () => {
  describe('speedToNormalized', () => {
    it('returns 0 for non-positive speeds', () => {
      expect(speedToNormalized(0)).toBe(0);
      expect(speedToNormalized(-10)).toBe(0);
    });

    it('returns 1 for speeds >= 1000 Mbps', () => {
      expect(speedToNormalized(1000)).toBe(1);
      expect(speedToNormalized(1500)).toBe(1);
    });

    it('returns progressive non-linear curve for typical speeds', () => {
      const s10 = speedToNormalized(10);
      const s100 = speedToNormalized(100);
      const s500 = speedToNormalized(500);

      expect(s10).toBeGreaterThan(0);
      expect(s100).toBeGreaterThan(s10);
      expect(s500).toBeGreaterThan(s100);
      expect(s500).toBeLessThan(1);
    });
  });

  describe('DIAL_TICKS', () => {
    it('contains standard graduation steps up to 1G', () => {
      const labels = DIAL_TICKS.map((t) => t.label);
      expect(labels).toEqual(['0', '10', '50', '100', '250', '500', '1G']);
    });
  });

  describe('getLatencyVerdict', () => {
    it('returns low latency verdicts correctly in FR and EN', () => {
      expect(getLatencyVerdict(15, true)).toContain('Excellente');
      expect(getLatencyVerdict(15, false)).toContain('Ultra-low');

      expect(getLatencyVerdict(35, true)).toContain('Très Réactive');
      expect(getLatencyVerdict(35, false)).toContain('Low Latency');

      expect(getLatencyVerdict(60, true)).toContain('Normale');
      expect(getLatencyVerdict(60, false)).toContain('Moderate');

      expect(getLatencyVerdict(120, true)).toContain('Élevée');
      expect(getLatencyVerdict(120, false)).toContain('High Latency');
    });
  });

  describe('formatSpeedReportSummary', () => {
    it('generates multi-line text report with all metrics', () => {
      const report = formatSpeedReportSummary({
        downloadSpeed: 125.4,
        uploadSpeed: 42.1,
        ping: 18,
        jitter: 2.3,
        streamingMaxResolution: '4K Ultra HD',
        gamingRating: 'Optimal',
        isFr: true,
      });

      expect(report).toContain('Test de Débit Internet');
      expect(report).toContain('Téléchargement : 125.4 Mbps');
      expect(report).toContain('Envoi : 42.1 Mbps');
      expect(report).toContain('Latence (Ping) : 18 ms');
      expect(report).toContain('Gigue (Jitter) : 2.3 ms');
      expect(report).toContain('Streaming : 4K Ultra HD');
    });
  });
});
