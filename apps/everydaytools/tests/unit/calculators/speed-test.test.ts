import { describe, it, expect } from 'vitest';
import { assessNetworkQuality } from '../../../src/lib/speed-test-logic';

describe('Internet Speed Test Logic', () => {
  it('correctly grades a gigabit fiber connection as A+', () => {
    const res = assessNetworkQuality({
      downloadMbps: 450,
      uploadMbps: 200,
      pingMs: 8,
      jitterMs: 1.5,
    });

    expect(res.grade).toBe('A+');
    expect(res.suitability.gaming.rating).toBe('Excellent');
    expect(res.suitability.streaming4k.rating).toBe('Excellent');
    expect(res.suitability.videoCalls.rating).toBe('Excellent');
    // 10 GB at 450 Mbps takes ~3 minutes
    expect(res.suitability.download10GbMinutes).toBeLessThan(5);
  });

  it('correctly detects insufficient bandwidth for 4K streaming', () => {
    const res = assessNetworkQuality({
      downloadMbps: 8,
      uploadMbps: 1,
      pingMs: 45,
      jitterMs: 12,
    });

    expect(res.grade).toBe('D');
    expect(res.suitability.streaming4k.supported).toBe(false);
  });

  it('accurately computes 10GB download time', () => {
    // 100 Mbps -> 80,000 / 100 = 800 sec = 13.3 min
    const res = assessNetworkQuality({
      downloadMbps: 100,
      uploadMbps: 20,
      pingMs: 20,
      jitterMs: 3,
    });

    expect(res.suitability.download10GbMinutes).toBeCloseTo(13.3, 1);
  });
});
