import { describe, it, expect, vi } from 'vitest';
import {
  serializeSvgToString,
  printBarcodeLabel,
  downloadPngBarcode,
  downloadSvgBarcode,
} from '../../../src/lib/barcode-export';
import * as downloadModule from '../../../src/lib/download';

describe('barcode-export', () => {
  it('serializeSvgToString clones svg and outputs valid serialized XML with xml namespaces', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '50');
    svg.appendChild(rect);

    const serialized = serializeSvgToString(svg);
    expect(serialized).toContain('<svg');
    expect(serialized).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(serialized).toContain('width="100"');
  });

  it('printBarcodeLabel neutralizes DOM XSS in iframe and sets doc.title safely', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const maliciousValue = '</title><script>window.__xss = true;</script>';

    let capturedHtml = '';
    let assignedTitle = '';
    const iframe = document.createElement('iframe');
    const mockDoc = {
      open: vi.fn(),
      write: vi.fn((html: string) => {
        capturedHtml = html;
      }),
      close: vi.fn(),
      get title() {
        return assignedTitle;
      },
      set title(val: string) {
        assignedTitle = val;
      },
    };
    Object.defineProperty(iframe, 'contentWindow', {
      value: {
        document: mockDoc,
        focus: vi.fn(),
        print: vi.fn(),
      },
      configurable: true,
    });

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'iframe') {
        return iframe;
      }
      return origCreateElement(tagName);
    });

    printBarcodeLabel(svg, 'Code 128', maliciousValue);

    // Verify raw malicious script tag was NOT written into the html string in doc.write
    expect(capturedHtml).not.toContain('<script>window.__xss = true;</script>');
    expect(assignedTitle).toBe(`Code 128 - ${maliciousValue}`);
  });

  it('downloadPngBarcode handles image loading failure gracefully', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // Spy on Image constructor or trigger onerror
    const origImage = globalThis.Image;
    globalThis.Image = class extends origImage {
      constructor() {
        super();
        setTimeout(() => {
          this.onerror?.(new Event('error'));
        }, 10);
      }
    } as any;

    try {
      await expect(
        downloadPngBarcode(svg, 'CODE128', 'TEST', true)
      ).resolves.toBeUndefined();
    } finally {
      globalThis.Image = origImage;
    }
  });

  it('downloadSvgBarcode delegates to downloadText without creating anchor elements', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const spy = vi.spyOn(downloadModule, 'downloadText').mockImplementation(() => {});
    downloadSvgBarcode(svg, 'CODE128', 'ABC-123');

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('<?xml version="1.0"'),
      'barcode-code128-ABC-123.svg',
      'image/svg+xml;charset=utf-8'
    );
    spy.mockRestore();
  });
});
