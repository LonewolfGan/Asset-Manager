import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToTextEngine } from '@/engine/engines/pdf-to-text-engine';

describe('PDF to Text Engine Contract (TDD)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToTextEngine.id).toBe('pdf-to-text');
    expect(pdfToTextEngine.name).toBe('PDF to Text Engine');
    expect(typeof pdfToTextEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockText = 'Architecture Whitepaper 2026\nEverydayTools Hub High-Fidelity Text Engine';
    const mockBlob = new Blob([mockText], {
      type: 'text/plain;charset=utf-8',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      text: async () => mockText,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 sample content'], 'whitepaper.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToTextEngine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-text');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('whitepaper.txt');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'PDF is password-protected or corrupt' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToTextEngine.execute(testFile)).rejects.toThrow(
      'PDF is password-protected or corrupt'
    );
  });
});
