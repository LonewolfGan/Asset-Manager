import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PdfSplitWorkbench } from '@/components/pdf-split/PdfSplitWorkbench';
import { PdfSplitResultView } from '@/components/pdf-split/PdfSplitResultView';

describe('PdfSplit Modular Components (TDD Phase RED)', () => {
  const dummyFile = {
    name: 'document-rapport.pdf',
    size: 2048576,
  } as unknown as File;

  const dummyFormat = {
    name: 'PDF',
    extension: 'pdf',
    icon: '/icons/pdf.svg',
    color: '#EC1C24',
    subLabel: 'Document Adobe Acrobat',
  };

  const dummyPages = [
    { pageNumber: 1, dataUrl: 'data:image/jpeg;base64,abc' },
    { pageNumber: 2, dataUrl: 'data:image/jpeg;base64,def' },
    { pageNumber: 3, dataUrl: 'data:image/jpeg;base64,ghi' },
  ];

  it('renders PdfSplitWorkbench in extract mode with pages and controls', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfSplitWorkbench, {
          file: dummyFile,
          format: dummyFormat,
          pages: dummyPages,
          isLoadingThumbs: false,
          activeMode: 'extract',
          selectedPages: [1, 2],
          extractRangeFrom: 1,
          extractRangeTo: 2,
          isEditingCustomSyntax: false,
          rawSyntaxText: '1-2',
          extractAsSinglePdf: true,
          tranches: [],
          batchChunkSize: 2,
          splitViewMode: 'list',
          overlappingTranchesInfo: null,
          error: null,
          isProcessing: false,
          canConvert: true,
          isFr: true,
          t: { pdfSplit: {} },
          contactSheetRef: { current: null },
          onReset: vi.fn(),
          onModeChange: vi.fn(),
          onConvert: vi.fn(),
          onRangeFromChange: vi.fn(),
          onRangeToChange: vi.fn(),
          onAddRange: vi.fn(),
          setSelectedPages: vi.fn(),
          setIsEditingCustomSyntax: vi.fn(),
          setRawSyntaxText: vi.fn(),
          setExtractAsSinglePdf: vi.fn(),
          setSplitViewMode: vi.fn(),
          setBatchChunkSize: vi.fn(),
          setTranches: vi.fn(),
          getPageTrancheIndices: () => [],
          onPageCardClick: vi.fn(),
        })
      )
    );

    expect(html).toContain('document-rapport.pdf');
    expect(html).toContain('Extraire des pages');
    expect(html).toContain('3 pages au total');
    expect(html).toContain('Sélectionner des pages à extraire');
  });

  it('renders PdfSplitResultView with formatted metrics and buttons', () => {
    const dummyBlob = new Blob(['sample pdf content'], { type: 'application/pdf' });
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfSplitResultView, {
          result: {
            blob: dummyBlob,
            filename: 'document-rapport_extraits.pdf',
            isZip: false,
            sizeAfter: 1024,
            sizeBefore: 2048576,
            title: 'Document extrait',
            details: '2 pages (1-2)',
          },
          formatIcon: dummyFormat.icon,
          isFr: true,
          t: { pdfSplit: {} },
          onReset: vi.fn(),
          onOpenNextAction: vi.fn(),
        })
      )
    );

    expect(html).toContain('document-rapport_extraits.pdf');
    expect(html).toContain('Document PDF');
    expect(html).toContain('2 pages (1-2)');
    expect(html).toContain('Nouvelle opération');
  });
});
