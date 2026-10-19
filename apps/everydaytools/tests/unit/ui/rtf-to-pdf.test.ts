import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import RtfToPdf from '@/pages/rtf-to-pdf';
import * as workflowHook from '@/hooks/use-rtf-to-pdf-workflow';

vi.mock('wouter', () => ({
  useLocation: () => ['/rtf-to-pdf', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'RTF to PDF');
  },
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          documents: 'Documents',
        },
      },
      tools: {
        'rtf-to-pdf': {
          title: 'RTF to PDF',
          description: 'Convert RTF documents to PDF.',
        },
      },
      rtfToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadPdf: 'Download PDF',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('RtfToPdf UI Flow [TDD-Lock ECC]', () => {
  let container: HTMLDivElement;
  let root: Root;

  const mockWorkflowBase = {
    t: {
      nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
      tools: { 'rtf-to-pdf': { title: 'RTF to PDF', description: 'Convert RTF to PDF.' } },
    },
    tc: {
      convertBtn: 'Convert to PDF',
      converting: 'Converting...',
      convertAnother: 'Convert Another',
      downloadPdf: 'Download PDF',
      error: 'Conversion failed',
    },
    sourceFormat: {
      name: 'RTF',
      extension: 'rtf',
      icon: '/icons/rtf.svg',
      color: 'var(--accent, #d97706)',
      subLabel: 'Rich Text Format',
    },
    targetFormat: {
      name: 'PDF',
      extension: 'pdf',
      icon: '/icons/pdf.svg',
      color: 'var(--accent, #dc2626)',
      subLabel: 'Adobe Acrobat',
    },
    file: undefined as File | undefined,
    result: null as any,
    isProcessing: false,
    isDragging: false,
    isNextActionOpen: false,
    setIsNextActionOpen: vi.fn(),
    validateAndSetFile: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn(),
    handleReset: vi.fn(),
    handleConvert: vi.fn(),
    handleDownload: vi.fn(),
    handleOpenPreview: vi.fn(),
    handleOpenNextAction: vi.fn(),
  };

  beforeEach(() => {
    lastTitleProps = null;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.spyOn(workflowHook, 'useRtfToPdfWorkflow').mockReturnValue(mockWorkflowBase as any);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it('renders Scene 1 (Dropzone) when idle with no file', async () => {
    await act(async () => {
      root.render(React.createElement(RtfToPdf));
    });

    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('rtf-to-pdf');

    // Button in dropzone to select file
    const selectBtn = container.querySelector('button');
    expect(selectBtn).not.toBeNull();
  });

  it('renders Scene 2 (Staging) when file is staged', async () => {
    const stagedFile = new File(['{\\rtf1 test}'], 'sample.rtf', { type: 'application/rtf' });
    vi.spyOn(workflowHook, 'useRtfToPdfWorkflow').mockReturnValue({
      ...mockWorkflowBase,
      file: stagedFile,
    } as any);

    await act(async () => {
      root.render(React.createElement(RtfToPdf));
    });

    expect(container.textContent).toContain('sample.rtf');
  });

  it('renders Scene 3 (Conduit) when conversion is processing', async () => {
    const stagedFile = new File(['{\\rtf1 test}'], 'sample.rtf', { type: 'application/rtf' });
    vi.spyOn(workflowHook, 'useRtfToPdfWorkflow').mockReturnValue({
      ...mockWorkflowBase,
      file: stagedFile,
      isProcessing: true,
    } as any);

    await act(async () => {
      root.render(React.createElement(RtfToPdf));
    });

    expect(container.textContent).toContain('Converting...');
  });

  it('renders Scene 4 (Result) with download and preview actions when conversion completes', async () => {
    const stagedFile = new File(['{\\rtf1 test}'], 'sample.rtf', { type: 'application/rtf' });
    const mockResult = {
      blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
      filename: 'sample.pdf',
      sizeBefore: 120,
      sizeAfter: 340,
    };

    vi.spyOn(workflowHook, 'useRtfToPdfWorkflow').mockReturnValue({
      ...mockWorkflowBase,
      file: stagedFile,
      result: mockResult,
    } as any);

    await act(async () => {
      root.render(React.createElement(RtfToPdf));
    });

    expect(container.textContent).toContain('sample.pdf');
    // Ensure no prohibited transition-all on tool action buttons
    const buttons = container.querySelectorAll('button');
    for (const btn of Array.from(buttons)) {
      expect(btn.className).not.toContain('transition-all');
    }
  });
});
