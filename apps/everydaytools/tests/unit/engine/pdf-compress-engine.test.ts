import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  pdfCompressEngine,
  createPdfCompressEngine,
  type PdfCompressMetadata,
} from '@/engine/engines/pdf-compress-engine';

describe('PDF Compress Engine Contract (TDD RED)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfCompressEngine.id).toBe('pdf-compress');
    expect(pdfCompressEngine.name).toBe('Compress PDF');
    expect(typeof pdfCompressEngine.execute).toBe('function');
  });

  it('executes API compression and returns ToolResult with Blob, telemetry metadata and filename', async () => {
    const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x36]);
    const mockBlob = new Blob([mockPdfBytes], {
      type: 'application/pdf',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: {
        get: (h: string) => {
          const lower = h.toLowerCase();
          if (lower === 'content-type') return 'application/pdf';
          if (lower === 'x-original-size') return '100000';
          if (lower === 'x-compressed-size') return '25000';
          if (lower === 'x-compression-gain') return '75';
          return null;
        },
      },
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 raw data payload'], 'annual_report.pdf', {
      type: 'application/pdf',
    });

    const engine = createPdfCompressEngine({ level: 'recommended' });
    const progressUpdates: number[] = [];
    const result = await engine.execute(testFile, {
      onProgress: (p) => progressUpdates.push(p.percent),
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/tools/pdf-compress');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('annual_report_compressed.pdf');
    expect(result.resultSize).toBe(25000);
    expect(result.originalSize).toBe(100000);
    expect(result.mimeType).toBe('application/pdf');
    expect(result.data).toBe(mockBlob);

    const meta = result.metadata as PdfCompressMetadata;
    expect(meta.gain).toBe(75);
    expect(meta.sizeBefore).toBe(100000);
    expect(meta.sizeAfter).toBe(25000);
    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
  });

  it('serializes custom compression level into FormData correctly', async () => {
    const mockBlob = new Blob(['%PDF-'], { type: 'application/pdf' });
    let capturedFormData: FormData | null = null;

    const fetchSpy = vi.fn().mockImplementation((_url, options) => {
      capturedFormData = options.body;
      return Promise.resolve({
        ok: true,
        blob: async () => mockBlob,
        headers: {
          get: (h: string) => {
            if (h.toLowerCase() === 'x-original-size') return '500';
            if (h.toLowerCase() === 'x-compressed-size') return '500';
            if (h.toLowerCase() === 'x-compression-gain') return '0';
            return null;
          },
        },
      });
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4'], 'test.pdf', { type: 'application/pdf' });
    const engine = createPdfCompressEngine({ level: 'extreme' });
    await engine.execute(testFile);

    expect(capturedFormData).not.toBeNull();
    expect(capturedFormData?.get('level')).toBe('extreme');
  });

  it('handles server errors and throws descriptive exception', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'INVALID_PDF', message: 'Corrupted document' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['invalid bytes'], 'corrupt.pdf', { type: 'application/pdf' });
    const engine = createPdfCompressEngine();

    await expect(engine.execute(testFile)).rejects.toThrow('Corrupted document');
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

    const testFile = new File(['%PDF-'], 'doc.pdf', { type: 'application/pdf' });
    const engine = createPdfCompressEngine();

    const promise = engine.execute(testFile, { signal: abortController.signal });
    abortController.abort();

    await expect(promise).rejects.toThrow(/abort/i);
  });
});
