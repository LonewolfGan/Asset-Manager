import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  pdfProtectEngine,
  createPdfProtectEngine,
  type PdfProtectExecuteOptions,
  type PdfProtectMetadata,
} from '@/engine/engines/pdf-protect-engine';

describe('PDF Protect Engine Contract (TDD RED)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfProtectEngine.id).toBe('pdf-protect');
    expect(pdfProtectEngine.name).toBe('Protect PDF');
    expect(typeof pdfProtectEngine.execute).toBe('function');
  });

  it('pre-validates that at least one password is provided before network request', async () => {
    const file = new File(['%PDF-1.4 mock content'], 'doc.pdf', { type: 'application/pdf' });
    const engine = createPdfProtectEngine();

    await expect(
      engine.execute(file, { userPassword: '', ownerPassword: '' })
    ).rejects.toThrow(/password/i);
  });

  it('pre-validates that user and owner passwords are not identical', async () => {
    const file = new File(['%PDF-1.4 mock content'], 'doc.pdf', { type: 'application/pdf' });
    const engine = createPdfProtectEngine();

    await expect(
      engine.execute(file, {
        userPassword: 'identicalPassword123',
        ownerPassword: 'identicalPassword123',
      })
    ).rejects.toThrow(/identical/i);
  });

  it('pre-validates that password length does not exceed 128 characters', async () => {
    const file = new File(['%PDF-1.4 mock content'], 'doc.pdf', { type: 'application/pdf' });
    const engine = createPdfProtectEngine();
    const longPassword = 'a'.repeat(129);

    await expect(
      engine.execute(file, { userPassword: longPassword })
    ).rejects.toThrow(/128/i);
  });

  it('executes API encryption and returns ToolResult with Blob, telemetry metadata and filename', async () => {
    const mockProtectedBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const mockBlob = new Blob([mockProtectedBytes], { type: 'application/pdf' });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: {
        get: (h: string) => {
          const lower = h.toLowerCase();
          if (lower === 'content-type') return 'application/pdf';
          if (lower === 'x-encryption') return 'AES-256';
          if (lower === 'x-linearized') return 'true';
          return null;
        },
      },
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 cleartext payload'], 'confidential.pdf', {
      type: 'application/pdf',
    });

    const engine = createPdfProtectEngine({
      userPassword: 'SecretPassword2026!',
      allowPrinting: true,
      allowCopying: false,
      allowModifying: false,
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
    expect(calledUrl).toMatch(/\/api\/(tools|convert)\/pdf-protect/);
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    const formData = calledOptions.body as FormData;
    expect(formData.get('userPassword')).toBe('SecretPassword2026!');
    expect(formData.get('allowPrinting')).toBe('true');
    expect(formData.get('allowCopying')).toBe('false');
    expect(formData.get('allowModifying')).toBe('false');

    expect(result.filename).toBe('confidential_protected.pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.data).toBe(mockBlob);

    const meta = result.metadata as PdfProtectMetadata;
    expect(meta.encryption).toBe('AES-256');
    expect(meta.isLinearized).toBe(true);

    expect(stages).toContain('reading');
    expect(stages).toContain('encrypting');
    expect(stages).toContain('finalizing');
    expect(stages).toContain('complete');
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
  });

  it('handles server errors and throws descriptive exception', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: 'ALREADY_ENCRYPTED',
        message: 'Document is already encrypted.',
      }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4'], 'encrypted.pdf', { type: 'application/pdf' });
    const engine = createPdfProtectEngine({ userPassword: 'password123' });

    await expect(engine.execute(testFile)).rejects.toThrow('Document is already encrypted.');
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
    const engine = createPdfProtectEngine({ userPassword: 'password123' });

    const promise = engine.execute(testFile, { signal: abortController.signal });
    abortController.abort();

    await expect(promise).rejects.toThrow(/abort/i);
  });
});
