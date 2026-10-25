import { describe, it, expect } from 'vitest';
// TDD GREEN: pdf-watermark-engine contract tests
import { PDFDocument } from 'pdf-lib';
import {
  pdfWatermarkEngine,
  createPdfWatermarkEngine,
  type PdfWatermarkExecuteOptions,
  type PdfWatermarkMetadata,
} from '@/engine/engines/pdf-watermark-engine';

async function createSamplePdfFile(pages = 2, name = 'document.pdf'): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`Page ${i}`, { x: 50, y: 750, size: 14 });
  }
  const bytes = await doc.save();
  return new File([bytes as unknown as BlobPart], name, { type: 'application/pdf' });
}

function createSamplePngFile(name = 'watermark.png'): File {
  const base64Png =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const binary = atob(base64Png);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], name, { type: 'image/png' });
}

describe('PDF Watermark Engine Contract (TDD RED)', () => {
  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfWatermarkEngine.id).toBe('pdf-watermark');
    expect(pdfWatermarkEngine.name).toBe('Watermark PDF');
    expect(typeof pdfWatermarkEngine.execute).toBe('function');
  });

  it('pre-validates that text or image is supplied; rejects empty input', async () => {
    const file = await createSamplePdfFile(1);
    const engine = createPdfWatermarkEngine();

    await expect(
      engine.execute(file, { text: '   ' })
    ).rejects.toThrow(/watermark/i);
  });

  it('executes in-browser text watermarking emitting ordered progress stages', async () => {
    const file = await createSamplePdfFile(2, 'contract.pdf');
    const stages: string[] = [];
    const progressUpdates: number[] = [];

    const result = await pdfWatermarkEngine.execute(file, {
      text: 'CONFIDENTIAL',
      fontSize: 48,
      angle: 45,
      opacity: 0.3,
      color: '#FF0000',
      pattern: 'single',
      onProgress: (p) => {
        progressUpdates.push(p.percent);
        if (p.stage) stages.push(p.stage);
      },
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.data.type).toBe('application/pdf');
    expect(result.filename).toBe('contract_watermarked.pdf');

    const meta = result.metadata as unknown as PdfWatermarkMetadata;
    expect(meta.watermarkType).toBe('text');
    expect(meta.pageCount).toBe(2);

    expect(stages).toContain('reading');
    expect(stages).toContain('rendering');
    expect(stages).toContain('serializing');
    expect(stages).toContain('complete');
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100);

    const loaded = await PDFDocument.load(await result.data.arrayBuffer());
    expect(loaded.getPageCount()).toBe(2);
  });

  it('correctly embeds repeated text pattern across pages', async () => {
    const file = await createSamplePdfFile(2, 'report.pdf');
    const result = await pdfWatermarkEngine.execute(file, {
      text: 'REPEATED DRAFT',
      pattern: 'repeat',
      fontSize: 32,
      opacity: 0.2,
      angle: 45,
    });

    expect(result.data).toBeInstanceOf(Blob);
    const loaded = await PDFDocument.load(await result.data.arrayBuffer());
    expect(loaded.getPageCount()).toBe(2);
  });

  it('executes in-browser image watermarking with PNG transparency', async () => {
    const pdfFile = await createSamplePdfFile(1, 'presentation.pdf');
    const pngWatermark = createSamplePngFile('logo.png');

    const stages: string[] = [];
    const result = await pdfWatermarkEngine.execute(pdfFile, {
      imageFile: pngWatermark,
      opacity: 0.5,
      position: 'center',
      onProgress: (p) => {
        if (p.stage) stages.push(p.stage);
      },
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.filename).toBe('presentation_watermarked.pdf');

    const meta = result.metadata as unknown as PdfWatermarkMetadata;
    expect(meta.watermarkType).toBe('image');
    expect(meta.pageCount).toBe(1);
    expect(stages).toContain('complete');
  });

  it('supports selective pages filtering (pages: "1" vs all)', async () => {
    const file = await createSamplePdfFile(3, 'multi.pdf');
    const result = await pdfWatermarkEngine.execute(file, {
      text: 'COVER ONLY',
      pages: '1',
    });

    expect(result.data).toBeInstanceOf(Blob);
    const meta = result.metadata as unknown as PdfWatermarkMetadata;
    expect(meta.watermarkedCount).toBe(1);
    expect(meta.pageCount).toBe(3);
  });

  it('supports cancellation via AbortSignal', async () => {
    const file = await createSamplePdfFile(2, 'cancelled.pdf');
    const controller = new AbortController();
    controller.abort();

    await expect(
      pdfWatermarkEngine.execute(file, {
        text: 'ABORT TEST',
        signal: controller.signal,
      })
    ).rejects.toThrow(/abort/i);
  });

  it('creates an engine instance with default options via factory', () => {
    const customEngine = createPdfWatermarkEngine({ text: 'CUSTOM PRESET', opacity: 0.4 });
    expect(customEngine.id).toBe('pdf-watermark');
    expect(customEngine.name).toBe('Watermark PDF');
  });

  it('safely sanitizes emoji and non-WinAnsi text without crashing StandardFonts', async () => {
    const file = await createSamplePdfFile(1, 'emoji.pdf');
    const result = await pdfWatermarkEngine.execute(file, {
      text: 'SECRET 🔒 🚀 TOP',
    });
    expect(result.data).toBeInstanceOf(Blob);
    const loaded = await PDFDocument.load(await result.data.arrayBuffer());
    expect(loaded.getPageCount()).toBe(1);
  });
});
