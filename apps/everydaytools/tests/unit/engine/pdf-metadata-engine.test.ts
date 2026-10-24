import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  createPdfMetadataEngine,
  pdfMetadataEngine,
} from '@/engine/engines/pdf-metadata-engine';

async function createSamplePdf(): Promise<File> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 200]);
  doc.setTitle('Original Title');
  doc.setAuthor('Original Author');
  const bytes = await doc.save();
  return new File([bytes.buffer as ArrayBuffer], 'document.pdf', {
    type: 'application/pdf',
  });
}

describe('PdfMetadataEngine (ToolEngineContract TDD)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('exposes contract metadata properly', () => {
    expect(pdfMetadataEngine.id).toBe('pdf-metadata');
    expect(pdfMetadataEngine.name).toBe('PDF Metadata');
  });

  it('executes in-memory metadata update and returns ToolResult<Blob>', async () => {
    const file = await createSamplePdf();
    const engine = createPdfMetadataEngine();

    const result = await engine.execute(file, {
      metadata: {
        title: 'New Title 2026',
        author: 'Jane Doe',
        subject: 'Confidential Audit',
        keywords: ['Audit', '2026'],
        creator: 'EverydayTools',
        producer: 'EverydayTools Studio',
      },
    });

    expect(result).toBeDefined();
    expect(result.data).toBeInstanceOf(Blob);
    expect(result.filename).toBe('document_metadata.pdf');
    expect(result.mimeType).toBe('application/pdf');
    expect(result.originalSize).toBe(file.size);
    expect(result.resultSize).toBe(result.data.size);

    // Verify metadata written inside the returned PDF blob
    const buf = await result.data.arrayBuffer();
    const loaded = await PDFDocument.load(buf);
    expect(loaded.getTitle()).toBe('New Title 2026');
    expect(loaded.getAuthor()).toBe('Jane Doe');
    expect(loaded.getSubject()).toBe('Confidential Audit');
    expect(loaded.getKeywords()).toBe('Audit 2026');
    expect(loaded.getCreator()).toBe('EverydayTools');
    expect(loaded.getProducer()).toBeDefined();
  });

  it('rejects with error when receiving non-pdf or corrupt data', async () => {
    const corruptFile = new File(['NOT_A_PDF'], 'invalid.pdf', {
      type: 'application/pdf',
    });
    const engine = createPdfMetadataEngine();

    await expect(
      engine.execute(corruptFile, {
        metadata: { title: 'Test' },
      })
    ).rejects.toThrow();
  });
});
