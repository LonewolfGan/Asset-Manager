import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeRevokeObjectUrl } from '@/lib/object-url';

describe('safeRevokeObjectUrl Utility (TDD)', () => {
  let revokeSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    revokeSpy = vi.fn();
    vi.stubGlobal('URL', {
      ...globalThis.URL,
      revokeObjectURL: revokeSpy,
    });
  });

  it('revokes valid blob URLs', () => {
    safeRevokeObjectUrl('blob:http://localhost:5000/123-abc');
    expect(revokeSpy).toHaveBeenCalledTimes(1);
    expect(revokeSpy).toHaveBeenCalledWith('blob:http://localhost:5000/123-abc');
  });

  it('ignores null, undefined, or empty strings gracefully without throwing', () => {
    safeRevokeObjectUrl(null);
    safeRevokeObjectUrl(undefined);
    safeRevokeObjectUrl('');
    expect(revokeSpy).toHaveBeenCalledTimes(0);
  });

  it('ignores non-blob URLs like data: or http:', () => {
    safeRevokeObjectUrl('https://example.com/image.png');
    safeRevokeObjectUrl('data:image/png;base64,xxxx');
    expect(revokeSpy).toHaveBeenCalledTimes(0);
  });
});
