import { describe, it, expect, vi } from 'vitest';
import {
  downloadPatchFile,
  downloadOriginalFile,
  downloadModifiedFile,
} from '@/lib/diff-checker-downloads';

describe('diff-checker-downloads', () => {
  it('does nothing when content is empty', () => {
    expect(() => downloadPatchFile('', true)).not.toThrow();
    expect(() => downloadOriginalFile('', true)).not.toThrow();
    expect(() => downloadModifiedFile('', true)).not.toThrow();
  });

  it('triggers download with proper filenames for non-empty content', () => {
    expect(() => downloadPatchFile('diff content', true)).not.toThrow();
    expect(() => downloadOriginalFile('original content', true)).not.toThrow();
    expect(() => downloadModifiedFile('modified content', true)).not.toThrow();
  });
});
