import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  pdfUnlockEngine,
  createPdfUnlockEngine,
  type PdfUnlockExecuteOptions,
  type PdfUnlockMetadata,
} from '@/engine/engines/pdf-unlock-engine';

describe('PDF Unlock Engine Contract (TDD RED)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfUnlockEngine.id).toBe('pdf-unlock');
    expect(pdfUnlockEngine.name).toBe('Unlock PDF');
    expect(typeof pdfUnlockEngine.execute).toBe('function');
  });

  it('pre-validates that password length does not exceed 128 characters', async () => {
    const file = new File(['%PDF-1.4 mock content'], 'doc.pdf', {
      type: 'application/pdf',
    });
    const engine = createPdfUnlockEngine();
    const longPassword = 'a'.repeat(129);

    await expect(
      engine.execute(file, { password: longPassword })
    ).rejects.toThrow(/128/i);
  });

  it('executes API decryption and returns ToolResult with Blob, telemetry metadata and filename', async () => {
    const mockDecryptedBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const mockBlob = new Blob([mockDecryptedBytes], { type: 'application/pdf' });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: {
        get: (h: string) => {
          const lower = h.toLowerCase();
          if (lower === 'content-type') return 'application/pdf';
          if (lower === 'x-decrypted') return 'true';
          if (lower === 'x-linearized') return 'true';
          return null;
        },
      },
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 encrypted payload'], 'protected_vault.pdf', {
      type: 'application/pdf',
    });

    const engine = createPdfUnlockEngine({
      password: 'DecryptionKey2026!',
    });

    const stages: string[] = [];
    const progressUpdates: number[] = [];

    const result = await engine.execute(testFile, {
      onProgress: (p) => {
        progressUpdates.push(p.percent);
        if (p.stage) stages.push(p.stage);
      },
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toMatch(/\/api\/(tools|convert)\/pdf-unlock/);
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    const formData = calledOptions.body as FormData;
    expect(formData.get('password')).toBe('DecryptionKey2026!');

    expect(result.filename).toBe('protected_vault_unlocked.pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.data).toBe(mockBlob);

    const meta = result.metadata as PdfUnlockMetadata;
    expect(meta.isDecrypted).toBe(true);
    expect(meta.isLinearized).toBe(true);

    expect(stages).toContain('reading');
    expect(stages).toContain('decrypting');
    expect(stages).toContain('finalizing');
    expect(stages).toContain('complete');
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
  });

  it('handles backend INVALID_PASSWORD error and throws descriptive exception', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'INVALID_PASSWORD',
        message: 'Incorrect password. Unable to unlock document.',
      }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4'], 'locked.pdf', { type: 'application/pdf' });
    const engine = createPdfUnlockEngine({ password: 'wrong' });

    await expect(engine.execute(testFile)).rejects.toThrow(
      'Incorrect password. Unable to unlock document.'
    );
  });

  it('handles backend NOT_ENCRYPTED error and throws descriptive exception', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'NOT_ENCRYPTED',
        message: 'Document is not encrypted.',
      }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4'], 'plain.pdf', { type: 'application/pdf' });
    const engine = createPdfUnlockEngine();

    await expect(engine.execute(testFile)).rejects.toThrow('Document is not encrypted.');
  });

  it('supports cancellation through AbortSignal', async () => {
    const abortController = new AbortController();
    const fetchSpy = vi.fn().mockImplementation((_url, options) => {
      return new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4'], 'secret.pdf', { type: 'application/pdf' });
    const engine = createPdfUnlockEngine({ password: 'key' });

    const promise = engine.execute(testFile, { signal: abortController.signal });
    abortController.abort();

    await expect(promise).rejects.toThrow(/abort/i);
  });
});
