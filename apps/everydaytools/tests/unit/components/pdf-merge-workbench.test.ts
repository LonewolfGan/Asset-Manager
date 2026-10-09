import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PdfMergeWorkbench } from '@/components/pdf-merge/PdfMergeWorkbench';
import { PdfMergeResultView } from '@/components/pdf-merge/PdfMergeResultView';
import type { StagedFile } from '@/lib/pdf-merge-logic';

describe('PdfMerge Modular Components (TDD Phase RED)', () => {
  const dummyFormat = {
    name: 'PDF',
    extension: 'pdf',
    icon: '/icons/pdf.svg',
    color: '#EC1C24',
    subLabel: 'Document Adobe Acrobat',
  };

  const dummyFiles: StagedFile[] = [
    {
      id: 'file-1',
      file: new File(['part1'], 'chapitre-1.pdf', { type: 'application/pdf' }),
    },
    {
      id: 'file-2',
      file: new File(['part2'], 'chapitre-2.pdf', { type: 'application/pdf' }),
    },
  ];

  it('renders PdfMergeWorkbench in grid view with documents and actions', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfMergeWorkbench, {
          files: dummyFiles,
          format: dummyFormat,
          totalSize: 2048,
          outputFilename: 'document_fusionne.pdf',
          viewMode: 'grid',
          draggedIndex: null,
          dragOverIndex: null,
          isProcessing: false,
          isFr: true,
          t: { tools: { 'pdf-merge': {} }, pdfMerge: {} },
          fileInputRef: { current: null },
          onReset: vi.fn(),
          onMerge: vi.fn(),
          onViewModeChange: vi.fn(),
          onOutputFilenameChange: vi.fn(),
          onMoveItem: vi.fn(),
          onRemoveFile: vi.fn(),
          onSortAZ: vi.fn(),
          onReverseOrder: vi.fn(),
          onItemDragStart: vi.fn(),
          onItemDragOver: vi.fn(),
          onItemDragEnd: vi.fn(),
          onItemDrop: vi.fn(),
          onDragOver: vi.fn(),
          onDragLeave: vi.fn(),
          onDrop: vi.fn(),
        })
      )
    );

    expect(html).toContain('chapitre-1.pdf');
    expect(html).toContain('chapitre-2.pdf');
    expect(html).toContain('2 documents');
    expect(html).toContain('document_fusionne.pdf');
  });

  it('renders PdfMergeResultView with decisive actions and metrics', () => {
    const dummyBlob = new Blob(['merged content'], { type: 'application/pdf' });
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(PdfMergeResultView, {
          result: {
            blob: dummyBlob,
            filename: 'document_fusionne.pdf',
            sizeAfter: 4096,
            sizeBefore: 2048,
            count: 2,
          },
          formatIcon: dummyFormat.icon,
          isFr: true,
          t: { pdfMerge: {} },
          onReset: vi.fn(),
          onOpenNextAction: vi.fn(),
        })
      )
    );

    expect(html).toContain('document_fusionne.pdf');
    expect(html).toContain('Documents reliés');
    expect(html).toContain('Nouvelle fusion');
  });
});
