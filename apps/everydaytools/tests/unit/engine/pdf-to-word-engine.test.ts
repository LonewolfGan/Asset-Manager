import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToWordEngine } from '@/engine/engines/pdf-to-word-engine';

describe('PDF to Word Engine Contract (TDD)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToWordEngine.id).toBe('pdf-to-word');
    expect(pdfToWordEngine.name).toBe('PDF to Word Engine');
    expect(typeof pdfToWordEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockBlob = new Blob(['sample-docx-binary'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 test content'], 'financial-report.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToWordEngine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-word');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('financial-report.docx');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Corrupt PDF document stream' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToWordEngine.execute(testFile)).rejects.toThrow(
      'Corrupt PDF document stream'
    );
  });
});
