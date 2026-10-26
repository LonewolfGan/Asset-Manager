import { describe, it, expect } from 'vitest';
// TDD RED Phase: pdf-page-numbers-engine contract tests
import { PDFDocument, degrees } from 'pdf-lib';
import {
  pdfPageNumbersEngine,
  createPdfPageNumbersEngine,
  type PdfPageNumbersExecuteOptions,
  type PdfPageNumbersMetadata,
} from '@/engine/engines/pdf-page-numbers-engine';

async function createSamplePdfFile(
  pages = 2,
  name = 'document.pdf',
  withRotations = false
): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([595.28, 841.89]);
    if (withRotations && i === 2) {
      page.setRotation(degrees(90));
    }
    page.drawText(`Page ${i}`, { x: 50, y: 750, size: 14 });
  }
  const bytes = await doc.save();
  return new File([bytes as unknown as BlobPart], name, { type: 'application/pdf' });
}

describe('PDF Page Numbers Engine Contract (TDD RED)', () => {
  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfPageNumbersEngine.id).toBe('pdf-page-numbers');
    expect(pdfPageNumbersEngine.name).toBe('Add Page Numbers');
    expect(typeof pdfPageNumbersEngine.execute).toBe('function');
  });

  it('executes in-browser numbering and emits ordered progress stages', async () => {
    const file = await createSamplePdfFile(3, 'quarterly-report.pdf');
    const stages: string[] = [];
    const progressUpdates: number[] = [];

    const result = await pdfPageNumbersEngine.execute(file, {
      position: 'bottom-center',
      format: '{n} / {total}',
      fontSize: 11,
      margin: 36,
      onProgress: (p) => {
        progressUpdates.push(p.percent);
        if (p.stage) stages.push(p.stage);
      },
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.data.type).toBe('application/pdf');
    expect(result.filename).toBe('quarterly-report_numbered.pdf');

    const meta = result.metadata as unknown as PdfPageNumbersMetadata;
    expect(meta.pageCount).toBe(3);
    expect(meta.numberedCount).toBe(3);
    expect(meta.isLinearized).toBe(true);

    expect(stages).toContain('reading');
    expect(stages).toContain('numbering');
    expect(stages).toContain('serializing');
    expect(stages).toContain('complete');
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100);

    const loaded = await PDFDocument.load(await result.data.arrayBuffer());
    expect(loaded.getPageCount()).toBe(3);
  });

  it('formats numbers correctly across {n}, {n}/{total}, and Roman numerals', async () => {
    const file = await createSamplePdfFile(2, 'thesis.pdf');

    const formats = ['{n}', '{n}/{total}', 'Page {n} of {total}', '{roman}', '{ROMAN}'];

    for (const format of formats) {
      const result = await pdfPageNumbersEngine.execute(file, {
        format,
        position: 'bottom-right',
      });
      expect(result.data).toBeInstanceOf(Blob);
      const meta = result.metadata as unknown as PdfPageNumbersMetadata;
      expect(meta.numberedCount).toBe(2);
    }
  });

  it('supports skipFirst: true to omit numbering from title/cover page', async () => {
    const file = await createSamplePdfFile(3, 'book.pdf');
    const result = await pdfPageNumbersEngine.execute(file, {
      skipFirst: true,
      position: 'bottom-center',
      format: '{n}',
    });

    expect(result.data).toBeInstanceOf(Blob);
    const meta = result.metadata as unknown as PdfPageNumbersMetadata;
    expect(meta.pageCount).toBe(3);
    expect(meta.numberedCount).toBe(2);
  });

  it('supports custom startFrom numbering offset', async () => {
    const file = await createSamplePdfFile(2, 'appendix.pdf');
    const result = await pdfPageNumbersEngine.execute(file, {
      startFrom: 10,
      format: 'Page {n}',
    });

    expect(result.data).toBeInstanceOf(Blob);
    const meta = result.metadata as unknown as PdfPageNumbersMetadata;
    expect(meta.numberedCount).toBe(2);
  });

  it('supports all 6 canonical positions without throwing', async () => {
    const file = await createSamplePdfFile(1, 'memo.pdf');
    const positions: PdfPageNumbersExecuteOptions['position'][] = [
      'bottom-center',
      'bottom-left',
      'bottom-right',
      'top-center',
      'top-left',
      'top-right',
    ];

    for (const position of positions) {
      const result = await pdfPageNumbersEngine.execute(file, { position });
      expect(result.data).toBeInstanceOf(Blob);
    }
  });

  it('correctly adjusts coordinates on rotated pages (/Rotate 90, /Rotate 270)', async () => {
    const file = await createSamplePdfFile(2, 'landscape-doc.pdf', true);
    const result = await pdfPageNumbersEngine.execute(file, {
      position: 'bottom-right',
      format: '{n}',
    });

    expect(result.data).toBeInstanceOf(Blob);
    const loaded = await PDFDocument.load(await result.data.arrayBuffer());
    expect(loaded.getPage(1).getRotation().angle).toBe(90);
  });

  it('respects AbortSignal cancellation', async () => {
    const file = await createSamplePdfFile(2, 'abort-test.pdf');
    const controller = new AbortController();
    controller.abort();

    await expect(
      pdfPageNumbersEngine.execute(file, {
        signal: controller.signal,
      })
    ).rejects.toThrow(/abort/i);
  });

  it('creates an engine instance with default options via factory', () => {
    const customEngine = createPdfPageNumbersEngine({
      position: 'top-right',
      fontSize: 14,
      color: '#333333',
    });
    expect(customEngine.id).toBe('pdf-page-numbers');
    expect(customEngine.name).toBe('Add Page Numbers');
  });
});
