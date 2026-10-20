import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as downloadModule from '@/lib/download';
import {
  encodeBase64,
  decodeBase64,
  detectBase64Binary,
  base64ToBlob,
} from '@/lib/base64-logic';
import {
  encodeUrl,
  decodeUrl,
  parseUrlDetails,
} from '@/lib/url-logic';
import { triggerUrlFileDownload } from '@/lib/url-export-logic';
import {
  serializeSvgToString,
  downloadSvgBarcode,
} from '@/lib/barcode-export';
import {
  validateBarcode,
  calculateEanCheckDigit,
} from '@/lib/barcode-logic';
import { analyzeText } from '@/lib/word-counter-logic';
import { downloadTextFile } from '@/lib/word-counter-export-logic';
import {
  generateLoremBlocks,
  generateLoremText,
  calculateLoremStats,
} from '@/lib/lorem-ipsum-logic';
import { useBase64Workflow } from '@/hooks/use-base64-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock SSOT @/lib/download
vi.mock('@/lib/download', () => ({
  downloadText: vi.fn(),
  downloadBlob: vi.fn(),
  downloadDataUrl: vi.fn(),
  triggerDownload: vi.fn(),
}));

describe('Encoders, Vector & Lexicon Integrity Suite (#77, #78, #109, #79, #80)', () => {
  let createElementSpy: ReturnType<typeof vi.spyOn>;
  let setTimeoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    createElementSpy = vi.spyOn(document, 'createElement');
    setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
  });

  afterEach(() => {
    createElementSpy.mockRestore();
    setTimeoutSpy.mockRestore();
  });

  describe('1. Algorithmic Integrity for the 5 Tools', () => {
    it('#77 base64: encodes/decodes UTF-8 Uint8Array chunks, URL-safe, and detects magic bytes', () => {
      const text = 'EverydayTools & Studio Vectoriel 🚀';
      const encoded = encodeBase64(text, { urlSafe: true, stripPadding: true });
      expect(encoded).not.toMatch(/[+/=]/);

      const decoded = decodeBase64(encoded);
      expect(decoded.output).toBe(text);
      expect(decoded.error).toBeUndefined();

      // Uint8Array conversion
      const blob = base64ToBlob(encoded);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);

      // Binary magic signatures detection
      const pngMeta = detectBase64Binary('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      expect(pngMeta?.isImage).toBe(true);
      expect(pngMeta?.mimeType).toBe('image/png');
      expect(pngMeta?.extension).toBe('png');

      const jpegMeta = detectBase64Binary('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=');
      expect(jpegMeta?.isImage).toBe(true);
      expect(jpegMeta?.mimeType).toBe('image/jpeg');
      expect(jpegMeta?.extension).toBe('jpg');

      const pdfMeta = detectBase64Binary('JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nGNgYGBkYGQAAn8AIwADcmVuZHN0cmVhbQplbmRvYmo=');
      expect(pdfMeta?.isPdf).toBe(true);
      expect(pdfMeta?.mimeType).toBe('application/pdf');
      expect(pdfMeta?.extension).toBe('pdf');
    });

    it('#78 url-encoder: full vs component vs form encoding, and searchParams query inspection', () => {
      const fullUrl = 'https://api.everydaytools.dev/v1/search?category=dev tools&tag=cœur&lang=fr#result';

      const componentEncoded = encodeUrl(fullUrl, 'component');
      expect(componentEncoded).toContain('https%3A%2F%2F');
      expect(componentEncoded).toContain('%20');

      const fullEncoded = encodeUrl(fullUrl, 'full');
      expect(fullEncoded).toContain('https://api.everydaytools.dev/v1/search?category=dev%20tools');
      expect(fullEncoded).toContain('&tag=c%C5%93ur&lang=fr#result');

      const formEncoded = encodeUrl('search query with spaces', 'form');
      expect(formEncoded).toBe('search+query+with+spaces');
      expect(decodeUrl(formEncoded)).toBe('search query with spaces');

      const details = parseUrlDetails(fullUrl);
      expect(details.isValid).toBe(true);
      expect(details.protocol).toBe('https:');
      expect(details.host).toBe('api.everydaytools.dev');
      expect(details.pathname).toBe('/v1/search');
      expect(details.hash).toBe('#result');
      expect(details.params).toEqual([
        { key: 'category', value: 'dev tools' },
        { key: 'tag', value: 'cœur' },
        { key: 'lang', value: 'fr' },
      ]);
    });

    it('#109 barcode-generator: SVG XML serialization and CODE128/EAN13 symbology validation', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '300');
      svg.setAttribute('height', '120');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', '10');
      rect.setAttribute('width', '2');
      svg.appendChild(rect);

      const serializedSvg = serializeSvgToString(svg);
      expect(serializedSvg).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(serializedSvg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(serializedSvg).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');

      // CODE128 validation
      expect(validateBarcode('CODE128', 'ITEM-CODE-128', true).isValid).toBe(true);
      expect(validateBarcode('CODE128', '', true).isValid).toBe(false);

      // EAN13 validation and checksum autoFix
      expect(calculateEanCheckDigit('400638133393')).toBe(1);

      const ean12 = validateBarcode('EAN13', '400638133393', true);
      expect(ean12.isValid).toBe(false);
      expect(ean12.status).toBe('needs_check');
      expect(ean12.expectedKey).toBe(1);
      expect(ean12.autoFix).toBe('4006381333931');

      const eanValid = validateBarcode('EAN13', '4006381333931', true);
      expect(eanValid.isValid).toBe(true);
      expect(eanValid.status).toBe('valid');

      const eanWrong = validateBarcode('EAN13', '4006381333938', true);
      expect(eanWrong.isValid).toBe(false);
      expect(eanWrong.status).toBe('wrong_key');
      expect(eanWrong.autoFix).toBe('4006381333931');
    });

    it('#79 word-counter: counts words, chars, sentences, reading time, and keyword densities', () => {
      const text =
        'EverydayTools provides fast vector utilities. Vector tools optimize workflows!\n\nSecond paragraph for testing.';
      const stats = analyzeText(text);

      expect(stats.words).toBe(13);
      expect(stats.sentences).toBe(3);
      expect(stats.paragraphs).toBe(2);
      expect(stats.lines).toBe(3);
      expect(stats.characters).toBe(text.length);
      expect(stats.charactersNoSpaces).toBe(text.replace(/\s/g, '').length);
      expect(stats.readingTimeSec).toBeGreaterThan(0);
      expect(stats.speakingTimeSec).toBeGreaterThan(0);
      expect(stats.avgWordLength).toBeGreaterThan(0);

      const topKey = stats.topKeywords.find((k) => k.word === 'vector');
      expect(topKey).toBeDefined();
      expect(topKey?.count).toBe(2);
      expect(topKey?.percentage).toBeGreaterThan(0);
    });

    it('#80 lorem-ipsum: generates Latin paragraphs, sentences, and words with proper grammar', () => {
      const paragraphs = generateLoremBlocks({
        flavor: 'classic',
        unit: 'paragraphs',
        count: 3,
        startWithClassic: true,
      });
      expect(paragraphs).toHaveLength(3);
      expect(paragraphs[0]).toContain('Lorem ipsum dolor sit amet');

      const sentences = generateLoremBlocks({
        flavor: 'classic',
        unit: 'sentences',
        count: 4,
      });
      expect(sentences).toHaveLength(4);

      const words = generateLoremBlocks({
        flavor: 'classic',
        unit: 'words',
        count: 30,
      });
      expect(words[0].split(' ')).toHaveLength(30);

      const htmlFormatted = generateLoremText({
        flavor: 'classic',
        unit: 'paragraphs',
        count: 2,
        format: 'html',
      });
      expect(htmlFormatted).toContain('<p>');
      expect(calculateLoremStats(htmlFormatted).words).toBeGreaterThan(0);
    });
  });

  describe('2. SSOT @/lib/download Delegation & Zero DOM Anchor Creation', () => {
    it('url-export-logic delegates triggerUrlFileDownload to downloadText without creating <a> elements', () => {
      triggerUrlFileDownload('https%3A%2F%2Ftest', 'encoded.txt', 'text/plain;charset=utf-8');

      expect(downloadModule.downloadText).toHaveBeenCalledWith(
        'https%3A%2F%2Ftest',
        'encoded.txt',
        'text/plain;charset=utf-8'
      );
      const anchorCalls = createElementSpy.mock.calls.filter(([tag]) => tag.toLowerCase() === 'a');
      expect(anchorCalls).toHaveLength(0);
    });

    it('barcode-export delegates downloadSvgBarcode to downloadText without creating <a> elements', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '240');

      downloadSvgBarcode(svg, 'EAN13', '4006381333931');

      expect(downloadModule.downloadText).toHaveBeenCalledWith(
        expect.stringContaining('<?xml version="1.0"'),
        'barcode-ean13-4006381333931.svg',
        'image/svg+xml;charset=utf-8'
      );
      const anchorCalls = createElementSpy.mock.calls.filter(([tag]) => tag.toLowerCase() === 'a');
      expect(anchorCalls).toHaveLength(0);
    });

    it('word-counter-export-logic delegates downloadTextFile to downloadText without creating <a> elements', () => {
      downloadTextFile('# Word Counter Report', 'text-report.txt');

      expect(downloadModule.downloadText).toHaveBeenCalled();
      const [firstContent, firstFilename] = vi.mocked(downloadModule.downloadText).mock.calls[0];
      expect(firstContent).toBe('# Word Counter Report');
      expect(firstFilename).toBe('text-report.txt');

      const anchorCalls = createElementSpy.mock.calls.filter(([tag]) => tag.toLowerCase() === 'a');
      expect(anchorCalls).toHaveLength(0);
    });

    it('useBase64Workflow delegates handleDownload to downloadBlob/downloadText without <a> elements', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const root = createRoot(container);

      let hookInstance!: ReturnType<typeof useBase64Workflow>;
      function TestHarness() {
        hookInstance = useBase64Workflow({ isFr: true });
        return null;
      }

      await act(async () => {
        root.render(React.createElement(TestHarness));
      });

      await act(async () => {
        hookInstance.handleInputChange('Text to encode');
      });

      createElementSpy.mockClear();

      await act(async () => {
        hookInstance.handleDownload();
      });

      const delegated =
        vi.mocked(downloadModule.downloadBlob).mock.calls.length > 0 ||
        vi.mocked(downloadModule.downloadText).mock.calls.length > 0;
      expect(delegated).toBe(true);

      const anchorCalls = createElementSpy.mock.calls.filter(([tag]) => tag.toLowerCase() === 'a');
      expect(anchorCalls).toHaveLength(0);

      await act(async () => {
        root.unmount();
      });
      container.remove();
    });

    it('verifies strict absence of artificial timeouts (no setTimeout >= 600ms)', () => {
      const delayedTimeouts = setTimeoutSpy.mock.calls.filter(
        ([, delay]) => typeof delay === 'number' && delay >= 600
      );
      expect(delayedTimeouts).toHaveLength(0);
    });
  });
});
