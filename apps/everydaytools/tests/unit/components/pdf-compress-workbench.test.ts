import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PdfCompressCalibrator } from '@/components/pdf-compress/PdfCompressCalibrator';
import { PdfCompressWorkbench } from '@/components/pdf-compress/PdfCompressWorkbench';
import { PdfCompressResultShowcase } from '@/components/pdf-compress/PdfCompressResultShowcase';
import { getPresets, getPdfFormat } from '@/lib/pdf-compress-logic';

describe('pdf-compress components', () => {
  const dummyFile = new File(['dummy content'], 'document.pdf', {
    type: 'application/pdf',
  });
  const pdfFormat = getPdfFormat(true);
  const presets = getPresets(true);

  it('renders calibrator with 3 intensity presets', () => {
    const html = renderToString(
      React.createElement(PdfCompressCalibrator, {
        presets,
        fileSize: 10_000_000,
        selectedLevel: 'ebook',
        isFr: true,
        onSelectLevel: () => {},
      })
    );

    expect(html).toContain('Légère');
    expect(html).toContain('Équilibrée');
    expect(html).toContain('Maximale');
    expect(html).toContain('-60%');
  });

  it('renders full workbench container', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfCompressWorkbench, {
          file: dummyFile,
          pdfFormat,
          presets,
          level: 'ebook',
          isFr: true,
          isProcessing: false,
          onReset: () => {},
          onCompress: () => {},
          onSelectLevel: () => {},
        })
      )
    );

    expect(html).toContain('document.pdf');
    expect(html).toContain('Niveau de compression');
    expect(html).toContain('Compresser le document');
  });

  it('renders result showcase with gain and download button', () => {
    const dummyBlob = new Blob(['compressed content'], {
      type: 'application/pdf',
    });
    const result = {
      blob: dummyBlob,
      filename: 'document_compresse.pdf',
      sizeBefore: 10_000_000,
      sizeAfter: 4_000_000,
      gain: 60,
    };

    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfCompressResultShowcase, {
          result,
          pdfFormat,
          isFr: true,
          onDownload: () => {},
          onReset: () => {},
        })
      )
    );

    expect(html).toContain('document_compresse.pdf');
    expect(html).toContain('-60%');
    expect(html).toContain('Télécharger le PDF compressé');
  });
});
