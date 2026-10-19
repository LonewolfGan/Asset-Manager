import { describe, it, expect, beforeEach } from 'vitest';
import {
  setHandoffFile,
  consumeHandoffFile,
  hasHandoffFile,
  setHandoffText,
  consumeHandoffText,
  hasHandoffText,
} from '@/lib/file-handoff';

describe('File & Text Handoff Bridge (TDD)', () => {
  beforeEach(() => {
    // Consume any leftover handoffs
    consumeHandoffFile();
    consumeHandoffText();
  });

  it('stages and consumes a handoff file correctly once', () => {
    expect(hasHandoffFile()).toBe(false);
    const blob = new Blob(['sample csv content'], { type: 'text/csv' });
    setHandoffFile(blob, 'sample.csv');

    expect(hasHandoffFile()).toBe(true);
    const consumed = consumeHandoffFile();
    expect(consumed).not.toBeNull();
    expect(consumed?.name).toBe('sample.csv');
    expect(consumed?.type).toBe('text/csv');

    // Should be single-use
    expect(hasHandoffFile()).toBe(false);
    expect(consumeHandoffFile()).toBeNull();
  });

  it('stages and consumes handoff text correctly once', () => {
    expect(hasHandoffText()).toBe(false);
    setHandoffText('{"key":"value"}');

    expect(hasHandoffText()).toBe(true);
    const text = consumeHandoffText();
    expect(text).toBe('{"key":"value"}');

    // Single-use
    expect(hasHandoffText()).toBe(false);
    expect(consumeHandoffText()).toBeNull();
  });

  it('ignores empty handoff text', () => {
    setHandoffText('');
    expect(hasHandoffText()).toBe(false);
    expect(consumeHandoffText()).toBeNull();
  });
});
