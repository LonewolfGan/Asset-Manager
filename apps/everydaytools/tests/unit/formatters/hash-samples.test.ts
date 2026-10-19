import { describe, it, expect } from 'vitest';
import { HASH_SAMPLES, getHashSampleById } from '@/lib/hash-samples';

describe('hash-samples', () => {
  it('provides predefined cryptographic hash samples', () => {
    expect(HASH_SAMPLES.length).toBeGreaterThanOrEqual(3);
    const hello = HASH_SAMPLES.find((s) => s.id === 'hello');
    expect(hello).toBeDefined();
    expect(hello?.text).toContain('Hello');
  });

  it('retrieves sample by id correctly', () => {
    const sample = getHashSampleById('hello');
    expect(sample?.id).toBe('hello');
    expect(sample?.text).toBe('Hello, world!');

    const missing = getHashSampleById('unknown-id');
    expect(missing).toBeUndefined();
  });
});
