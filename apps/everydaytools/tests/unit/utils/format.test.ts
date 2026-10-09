import { describe, it, expect } from 'vitest';
import { formatBytes } from '@/utils/format';

describe('formatBytes utility', () => {
  it('formats zero and negative values as "0 B"', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(-100)).toBe('0 B');
    expect(formatBytes(NaN)).toBe('0 B');
  });

  it('formats bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  it('formats kilobytes correctly with default decimals', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1572864)).toBe('1.5 MB');
  });

  it('formats gigabytes and terabytes correctly', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
    expect(formatBytes(1099511627776)).toBe('1 TB');
  });

  it('respects custom decimal parameter', () => {
    expect(formatBytes(1572864, 2)).toBe('1.5 MB');
    expect(formatBytes(1600000, 3)).toBe('1.526 MB');
    expect(formatBytes(1600000, 0)).toBe('2 MB');
  });
});
