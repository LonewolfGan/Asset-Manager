import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToHtmlEngine } from '@/engine/engines/pdf-to-html-engine';

describe('PDF to HTML Engine Contract (TDD)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToHtmlEngine.id).toBe('pdf-to-html');
    expect(pdfToHtmlEngine.name).toBe('PDF to HTML5 Engine');
    expect(typeof pdfToHtmlEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockHtml = '<!DOCTYPE html><html><body><h1>Document</h1></body></html>';
    const mockBlob = new Blob([mockHtml], {
      type: 'text/html;charset=utf-8',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      text: async () => mockHtml,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 test document content'], 'sample-doc.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToHtmlEngine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-html');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('sample-doc.html');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Corrupt or unreadable PDF stream' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToHtmlEngine.execute(testFile)).rejects.toThrow(
      'Corrupt or unreadable PDF stream'
    );
  });
});
