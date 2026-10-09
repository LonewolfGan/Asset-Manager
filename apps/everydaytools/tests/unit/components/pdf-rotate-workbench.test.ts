import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PdfRotateWorkbench } from '@/components/pdf-rotate/PdfRotateWorkbench';
import { PdfRotateResultView } from '@/components/pdf-rotate/PdfRotateResultView';

describe('PdfRotate Modular Components (TDD Phase RED)', () => {
  const dummyFile = {
    name: 'document-scan.pdf',
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
  ];

  it('renders PdfRotateWorkbench with file info, rotation shortcuts, and page cards', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfRotateWorkbench, {
          file: dummyFile,
          format: dummyFormat,
          pages: dummyPages,
          isLoadingThumbs: false,
          pageRotations: { 0: 90 },
          selectedPages: [1],
          modifiedPagesCount: 1,
          isProcessing: false,
          isFr: true,
          t: { pdfRotate: {} },
          onReset: vi.fn(),
          onApplyRotation: vi.fn(),
          onRotateSelectedPages: vi.fn(),
          onResetAllRotations: vi.fn(),
          onSelectAllPages: vi.fn(),
          onClearSelection: vi.fn(),
          onSelectOddPages: vi.fn(),
          onSelectEvenPages: vi.fn(),
          onToggleSelectPage: vi.fn(),
          onRotateSinglePage: vi.fn(),
        })
      )
    );

    expect(html).toContain('document-scan.pdf');
    expect(html).toContain('-90°');
    expect(html).toContain('+90°');
    expect(html).toContain('180°');
    expect(html).toContain('1 page sélectionnée');
  });

  it('renders PdfRotateResultView with decisive actions and metrics', () => {
    const dummyBlob = new Blob(['rotated content'], { type: 'application/pdf' });
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfRotateResultView, {
          result: {
            blob: dummyBlob,
            filename: 'document-scan_rotated.pdf',
            sizeAfter: 2048000,
            sizeBefore: 2048576,
            rotatedCount: 1,
            totalPages: 2,
          },
          formatIcon: dummyFormat.icon,
          isFr: true,
          t: { pdfRotate: {} },
          onReset: vi.fn(),
          onOpenNextAction: vi.fn(),
        })
      )
    );

    expect(html).toContain('document-scan_rotated.pdf');
    expect(html).toContain('Pages pivotées');
    expect(html).toContain('Nouvelle rotation');
  });
});
