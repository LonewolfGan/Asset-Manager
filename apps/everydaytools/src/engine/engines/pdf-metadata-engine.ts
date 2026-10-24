import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib';
import { apiUrl } from '@/lib/apiBase';
import type { PdfMetadataForm } from '@/lib/pdf-metadata-logic';

export interface PdfMetadataValues {
  title?: string;
  showInTitleBar?: boolean;
  author?: string;
  subject?: string;
  tags?: string[];
  keywords?: string[] | string;
  creator?: string;
  producer?: string;
  language?: string;
  dateMode?: 'keep' | 'today' | 'custom' | 'clear';
  customDate?: string;
}

export interface PdfMetadataExecuteOptions extends ToolExecuteOptions {
  metadata?: Partial<PdfMetadataValues>;
  executionMode?: 'client' | 'server';
}

/**
 * Creates an enterprise-grade PDF Metadata Engine contract adapter.
 * Defaults to in-browser execution with pdf-lib (< 3ms, 100% private)
 * with optional server ProcessPool fallback.
 */
export function createPdfMetadataEngine(
  defaultOptions?: PdfMetadataExecuteOptions
): ToolEngineContract<File, PdfMetadataExecuteOptions, Blob> {
  return {
    id: 'pdf-metadata',
    name: 'PDF Metadata',

    async execute(file: File, options?: PdfMetadataExecuteOptions): Promise<ToolResult<Blob>> {
      const mergedOptions = { ...defaultOptions, ...options };
      const mode = mergedOptions.executionMode ?? 'client';
      const meta = mergedOptions.metadata ?? {};
      const baseName = file.name.replace(/\.[^/.]+$/, '').trim() || 'document';
      const outputFilename = `${baseName}_metadata.pdf`;

      const tags =
        meta.tags ??
        (Array.isArray(meta.keywords)
          ? meta.keywords
          : meta.keywords
          ? String(meta.keywords)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined);

      if (mode === 'server') {
        const fd = new FormData();
        fd.append('file', file);
        if (meta.title !== undefined) fd.append('title', meta.title);
        if (meta.author !== undefined) fd.append('author', meta.author);
        if (meta.subject !== undefined) fd.append('subject', meta.subject);
        if (tags && tags.length > 0) fd.append('keywords', tags.join(', '));
        if (meta.creator !== undefined) fd.append('creator', meta.creator);
        if (meta.producer !== undefined) fd.append('producer', meta.producer);
        if (meta.language !== undefined) fd.append('language', meta.language);

        const res = await fetch(apiUrl('/convert/pdf-metadata'), {
          method: 'POST',
          body: fd,
          signal: mergedOptions.signal,
        });

        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
          throw new Error(err.message ?? err.error ?? 'PDF metadata update failed');
        }

        const blob = await res.blob();
        return {
          data: blob,
          filename: outputFilename,
          originalSize: file.size,
          resultSize: blob.size,
          mimeType: 'application/pdf',
        };
      }

      // In-browser Client Execution via pdf-lib (100% private, zero upload)
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf, {
        ignoreEncryption: true,
        parseSpeed: 1,
      });

      if (meta.title !== undefined) {
        doc.setTitle(meta.title.trim(), { showInWindowTitleBar: meta.showInTitleBar ?? true });
      }
      if (meta.author !== undefined) doc.setAuthor(meta.author.trim());
      if (meta.subject !== undefined) doc.setSubject(meta.subject.trim());
      if (tags !== undefined) doc.setKeywords(tags);
      if (meta.creator !== undefined) doc.setCreator(meta.creator.trim());
      if (meta.producer !== undefined) doc.setProducer(meta.producer.trim());
      if (meta.language !== undefined && meta.language.trim()) {
        doc.setLanguage(meta.language.trim());
      }

      if (meta.dateMode === 'today') {
        doc.setCreationDate(new Date());
      } else if (meta.dateMode === 'custom' && meta.customDate) {
        const d = new Date(meta.customDate);
        if (!isNaN(d.getTime())) doc.setCreationDate(d);
      } else if (meta.dateMode === 'clear') {
        try {
          const info = doc.context.lookup(doc.context.trailerInfo.Info, PDFDict);
          info?.delete(PDFName.of('CreationDate'));
        } catch {
          // ignore
        }
      }

      doc.setModificationDate(new Date());

      const savedBytes = await doc.save({ useObjectStreams: false });
      const blob = new Blob([new Uint8Array(savedBytes).buffer as ArrayBuffer], {
        type: 'application/pdf',
      });

      return {
        data: blob,
        filename: outputFilename,
        originalSize: file.size,
        resultSize: blob.size,
        mimeType: 'application/pdf',
      };
    },
  };
}

export const pdfMetadataEngine = createPdfMetadataEngine();
