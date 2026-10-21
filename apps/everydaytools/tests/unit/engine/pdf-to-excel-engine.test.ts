import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToExcelEngine } from '@/engine/engines/pdf-to-excel-engine';

describe('PDF to Excel Engine Contract (TDD)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToExcelEngine.id).toBe('pdf-to-excel');
    expect(pdfToExcelEngine.name).toBe('PDF to Excel Engine');
    expect(typeof pdfToExcelEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockBlob = new Blob(['sample-xlsx-binary'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 test content'], 'quarterly-report.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToExcelEngine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-excel');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('quarterly-report.xlsx');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Corrupt or unreadable PDF document stream' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToExcelEngine.execute(testFile)).rejects.toThrow(
      'Corrupt or unreadable PDF document stream'
    );
  });
});
