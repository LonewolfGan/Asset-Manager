import { describe, it, expect } from 'vitest';
import { getFileFormatIcon } from '@/lib/file-format-icon';

describe('getFileFormatIcon - StudioCommandBar Icon Harmonization', () => {
  describe('Images: maps all raster and vector image formats to generic image.svg', () => {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'avif', 'gif', 'heic', 'tiff', 'tif', 'bmp', 'ico'];

    it.each(imageExtensions)('maps .%s files to /icons/image.svg', (ext) => {
      expect(getFileFormatIcon(`sample.${ext}`)).toBe('/icons/image.svg');
      expect(getFileFormatIcon(`SAMPLE.${ext.toUpperCase()}`)).toBe('/icons/image.svg');
    });

    it('works with File objects for image types', () => {
      const file = new File(['mock content'], 'avatar.png', { type: 'image/png' });
      expect(getFileFormatIcon(file)).toBe('/icons/image.svg');
    });

    it('falls back to MIME type for extensionless image blobs', () => {
      const blobFile = new File(['mock content'], 'blob', { type: 'image/webp' });
      expect(getFileFormatIcon(blobFile)).toBe('/icons/image.svg');
    });
  });

  describe('Official formats: retains official vendor icons', () => {
    it('maps PDF files to official /icons/pdf.svg', () => {
      expect(getFileFormatIcon('contract.pdf')).toBe('/icons/pdf.svg');
    });

    it('maps Word files to official /icons/word.svg', () => {
      expect(getFileFormatIcon('letter.docx')).toBe('/icons/word.svg');
      expect(getFileFormatIcon('letter.doc')).toBe('/icons/word.svg');
    });

    it('maps Excel files to official /icons/excel.svg', () => {
      expect(getFileFormatIcon('budget.xlsx')).toBe('/icons/excel.svg');
      expect(getFileFormatIcon('budget.xls')).toBe('/icons/excel.svg');
    });

    it('maps PowerPoint files to official /icons/pptx.svg', () => {
      expect(getFileFormatIcon('presentation.pptx')).toBe('/icons/pptx.svg');
      expect(getFileFormatIcon('presentation.ppt')).toBe('/icons/pptx.svg');
    });

    it('maps OpenDocument and e-pub formats to their official icons', () => {
      expect(getFileFormatIcon('document.odt')).toBe('/icons/odt.svg');
      expect(getFileFormatIcon('book.epub')).toBe('/icons/epub.svg');
      expect(getFileFormatIcon('formatted.rtf')).toBe('/icons/rtf.svg');
    });

    it('maps data and markup files to their dedicated icons', () => {
      expect(getFileFormatIcon('dataset.csv')).toBe('/icons/csv.svg');
      expect(getFileFormatIcon('config.json')).toBe('/icons/json.svg');
      expect(getFileFormatIcon('readme.md')).toBe('/icons/markdown.svg');
      expect(getFileFormatIcon('notes.txt')).toBe('/icons/txt.svg');
      expect(getFileFormatIcon('feed.xml')).toBe('/icons/xml.svg');
      expect(getFileFormatIcon('deploy.yaml')).toBe('/icons/yaml.svg');
      expect(getFileFormatIcon('index.html')).toBe('/icons/html.svg');
    });
  });

  describe('Generic and unknown files: defaults to /icons/file.svg', () => {
    it('defaults unknown extensions to /icons/file.svg', () => {
      expect(getFileFormatIcon('archive.zip')).toBe('/icons/file.svg');
      expect(getFileFormatIcon('binary.bin')).toBe('/icons/file.svg');
      expect(getFileFormatIcon('payload.tar.gz')).toBe('/icons/file.svg');
      expect(getFileFormatIcon('noextension')).toBe('/icons/file.svg');
    });

    it('handles null, undefined or empty input with /icons/file.svg', () => {
      expect(getFileFormatIcon(null)).toBe('/icons/file.svg');
      expect(getFileFormatIcon(undefined)).toBe('/icons/file.svg');
      expect(getFileFormatIcon('')).toBe('/icons/file.svg');
    });

    it('respects a custom fallback icon when provided', () => {
      expect(getFileFormatIcon(null, '/custom-fallback.svg')).toBe('/custom-fallback.svg');
      expect(getFileFormatIcon('unknown.xyz', '/custom-fallback.svg')).toBe('/custom-fallback.svg');
    });
  });
});
