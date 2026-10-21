import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToEpubEngine } from '@/engine/engines/pdf-to-epub-engine';

describe('PDF to EPUB Engine Contract (TDD RED)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToEpubEngine.id).toBe('pdf-to-epub');
    expect(pdfToEpubEngine.name).toBe('PDF to EPUB');
    expect(typeof pdfToEpubEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockEpubBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00]);
    const mockBlob = new Blob([mockEpubBytes], {
      type: 'application/epub+zip',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 sample content'], 'digital-book.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToEpubEngine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-epub');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('digital-book.epub');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.mimeType).toBe('application/epub+zip');
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'PDF is encrypted or password-protected' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToEpubEngine.execute(testFile)).rejects.toThrow(
      'PDF is encrypted or password-protected'
    );
  });
});
