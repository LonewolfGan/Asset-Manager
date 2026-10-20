import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import * as downloadModule from '@/lib/download';
import * as pdfToText from '@/lib/pdf-to-text-logic';
import * as pdfToHtml from '@/lib/pdf-to-html-logic';
import * as pdfToImage from '@/lib/pdf-to-image-logic';
import * as pdfToEpub from '@/lib/pdf-to-epub-logic';
import * as pdfToMarkdown from '@/lib/pdf-to-markdown-logic';
import * as wordToText from '@/lib/word-to-text-logic';
import * as wordToHtml from '@/lib/word-to-html-logic';
import * as wordToMarkdown from '@/lib/word-to-markdown-logic';
import * as wordToEpub from '@/lib/word-to-epub-logic';
import * as excelToCsv from '@/lib/excel-to-csv-logic';
import * as excelToPdf from '@/lib/excel-to-pdf-logic';
import * as pdfExportConverter from '@/lib/pdf-export-converter-logic';

const DELAY_FILES = [
  'src/lib/pdf-to-text-logic.ts',
  'src/lib/pdf-to-html-logic.ts',
  'src/lib/pdf-to-image-logic.ts',
  'src/lib/pdf-export-converter-logic.ts',
  'src/hooks/use-html-to-markdown-workflow.ts',
  'src/hooks/use-pdf-to-epub-workflow.ts',
  'src/hooks/use-pdf-to-pptx-workflow.ts',
  'src/hooks/use-word-to-epub-workflow.ts',
];

const DOWNLOAD_LOGIC_MODULES = [
  { name: 'pdf-to-text', trigger: (b: Blob, f: string) => pdfToText.downloadPdfToTextResult({ blob: b, filename: f } as any) },
  { name: 'pdf-to-html', trigger: (b: Blob, f: string) => pdfToHtml.triggerDownload(b, f) },
  { name: 'pdf-to-image', trigger: (b: Blob, f: string) => pdfToImage.triggerDownload(b, f) },
  { name: 'pdf-to-epub', trigger: (b: Blob, f: string) => pdfToEpub.triggerDownload(b, f) },
  { name: 'pdf-to-markdown', trigger: (b: Blob, f: string) => pdfToMarkdown.triggerDownload(b, f) },
  { name: 'word-to-text', trigger: (b: Blob, f: string) => wordToText.triggerDownload(b, f) },
  { name: 'word-to-html', trigger: (b: Blob, f: string) => wordToHtml.triggerDownload(b, f) },
  { name: 'word-to-markdown', trigger: (b: Blob, f: string) => wordToMarkdown.triggerDownload(b, f) },
  { name: 'word-to-epub', trigger: (b: Blob, f: string) => wordToEpub.triggerDownload(b, f) },
  { name: 'excel-to-csv', trigger: (b: Blob, f: string) => excelToCsv.triggerDownload(b, f) },
  { name: 'excel-to-pdf', trigger: (b: Blob, f: string) => excelToPdf.triggerDownload(b, f) },
  { name: 'pdf-export-converter', trigger: (b: Blob, f: string) => pdfExportConverter.triggerDownload(b, f) },
];

const DOWNLOAD_FILE_PATHS = [
  'src/lib/pdf-to-text-logic.ts',
  'src/lib/pdf-to-html-logic.ts',
  'src/lib/pdf-to-image-logic.ts',
  'src/lib/pdf-to-epub-logic.ts',
  'src/lib/pdf-to-markdown-logic.ts',
  'src/lib/word-to-text-logic.ts',
  'src/lib/word-to-html-logic.ts',
  'src/lib/word-to-markdown-logic.ts',
  'src/lib/word-to-epub-logic.ts',
  'src/lib/excel-to-csv-logic.ts',
  'src/lib/excel-to-pdf-logic.ts',
  'src/lib/pdf-export-converter-logic.ts',
];

describe('Historical Tools Integrity & Clean Architecture', () => {
  let downloadBlobSpy: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    downloadBlobSpy = vi.spyOn(downloadModule, 'downloadBlob').mockImplementation(() => {});
  });

  describe('Artificial Delays Eradication', () => {
    it.each(DELAY_FILES)('ensures %s does not contain artificial setTimeout delays', (relPath) => {
      const fullPath = path.resolve(__dirname, '../../../', relPath);
      const content = fs.readFileSync(fullPath, 'utf-8');

      expect(content).not.toMatch(/setTimeout\s*\(\s*resolve\s*,\s*(800|600)\s*\)/);
      expect(content).not.toMatch(/new\s+Promise\s*\(\s*\(\s*resolve\s*\)\s*=>\s*setTimeout\s*\(\s*resolve/);
    });
  });

  describe('Download Unification on @/lib/download SSOT', () => {
    it.each(DOWNLOAD_LOGIC_MODULES)('$name delegates download directly to downloadBlob', ({ trigger }) => {
      const dummyBlob = new Blob(['sample-test'], { type: 'text/plain' });
      trigger(dummyBlob, 'test-file.ext');

      expect(downloadBlobSpy).toHaveBeenCalledWith(dummyBlob, 'test-file.ext');
    });

    it('downloadPdfToTextResult invokes onAfterDownload callback after delegating to downloadBlob', () => {
      const dummyBlob = new Blob(['pdf-text'], { type: 'text/plain' });
      const callbackSpy = vi.fn();

      pdfToText.downloadPdfToTextResult(
        { blob: dummyBlob, filename: 'sample.txt' } as any,
        callbackSpy
      );

      expect(downloadBlobSpy).toHaveBeenCalledWith(dummyBlob, 'sample.txt');
      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });

    it.each(DOWNLOAD_FILE_PATHS)('ensures %s does not manually create anchor DOM elements', (relPath) => {
      const fullPath = path.resolve(__dirname, '../../../', relPath);
      const content = fs.readFileSync(fullPath, 'utf-8');

      expect(content).not.toMatch(/document\.createElement\s*\(\s*['"]a['"]\s*\)/);
    });
  });

  describe('Anti-Monolith LOC Limit (< 300 LOC)', () => {
    const ALL_TOUCHED_FILES = Array.from(new Set([...DELAY_FILES, ...DOWNLOAD_FILE_PATHS]));

    it.each(ALL_TOUCHED_FILES)('ensures %s has strictly less than 300 lines of code', (relPath) => {
      const fullPath = path.resolve(__dirname, '../../../', relPath);
      const lines = fs.readFileSync(fullPath, 'utf-8').split('\n').length;

      expect(lines).toBeLessThan(300);
    });
  });
});
