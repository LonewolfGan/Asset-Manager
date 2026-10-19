import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import PdfToMarkdown from '@/pages/pdf-to-markdown';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/pdf-to-markdown', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'PDF to Markdown');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-pdf-to-markdown-workflow', () => ({
  usePdfToMarkdownWorkflow: () => mockWorkflowState,
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: {
        breadcrumb: {
          home: 'Home',
          pdf: 'PDF Tools',
        },
      },
      tools: {
        'pdf-to-markdown': {
          title: 'PDF to Markdown',
          description: 'Convert PDF documents to Markdown.',
        },
      },
      pdfToMarkdown: {
        convertBtn: 'Convert to Markdown',
        converting: 'Converting to Markdown...',
        convertAnother: 'Convert Another',
        downloadMd: 'Download .md file',
        copyMd: 'Copy Markdown',
        copiedMd: 'Copied!',
        error: 'Conversion failed',
      },
      pdfToText: {
        previewText: 'Preview',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

describe('PdfToMarkdown UI Workflow Integration', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.restoreAllMocks();
    lastTitleProps = null;
    mockWorkflowState = {
      t: {
        nav: { breadcrumb: { home: 'Home', pdf: 'PDF Tools' } },
        tools: {
          'pdf-to-markdown': {
            title: 'PDF to Markdown',
            description: 'Convert PDF documents to Markdown.',
          },
        },
        pdfToMarkdown: {
          convertBtn: 'Convert to Markdown',
          converting: 'Converting to Markdown...',
          convertAnother: 'Convert Another',
          downloadMd: 'Download .md file',
          copyMd: 'Copy Markdown',
          copiedMd: 'Copied!',
          error: 'Conversion failed',
        },
        pdfToText: {
          previewText: 'Preview',
        },
      },
      tc: {
        convertBtn: 'Convert to Markdown',
        converting: 'Converting to Markdown...',
        convertAnother: 'Convert Another',
        downloadMd: 'Download .md file',
        copyMd: 'Copy Markdown',
        copiedMd: 'Copied!',
        error: 'Conversion failed',
      },
      isFr: false,
      sourceFormat: { name: 'PDF', extension: 'pdf', icon: '/icons/pdf.svg', color: '#EC1C24' },
      targetFormat: { name: 'Markdown', extension: 'md', icon: '/icons/markdown.svg', color: '#0284C7' },
      file: undefined,
      result: null,
      isProcessing: false,
      isDragging: false,
      isPreviewOpen: false,
      setIsPreviewOpen: vi.fn(),
      isNextActionOpen: false,
      setIsNextActionOpen: vi.fn(),
      validateAndSetFile: vi.fn(),
      handleDragOver: vi.fn(),
      handleDragLeave: vi.fn(),
      handleDrop: vi.fn(),
      handleReset: vi.fn(),
      handleConvert: vi.fn(),
      handleDownload: vi.fn(),
    };

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders ReciprocalTitle with pdf-to-markdown slug in page header', async () => {
    await act(async () => {
      root.render(React.createElement(TooltipProvider, null, React.createElement(PdfToMarkdown)));
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('pdf-to-markdown');
  });

  it('renders Dropzone scene when idle without any network fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await act(async () => {
      root.render(React.createElement(TooltipProvider, null, React.createElement(PdfToMarkdown)));
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(container.textContent).toContain('PDF');
  });

  it('renders staging scene when file is selected and triggers in-browser convert without fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    mockWorkflowState.file = new File(['%PDF content'], 'document.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      root.render(React.createElement(TooltipProvider, null, React.createElement(PdfToMarkdown)));
    });

    const convertBtn = Array.from(container.querySelectorAll('button')).find(
      (btn) => btn.textContent?.includes('Convert to Markdown')
    );
    expect(convertBtn).toBeDefined();

    await act(async () => {
      convertBtn?.click();
    });

    expect(mockWorkflowState.handleConvert).toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('renders heroic result scene with copy button and preview dialog when conversion finishes', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    mockWorkflowState.file = new File(['%PDF content'], 'document.pdf', {
      type: 'application/pdf',
    });
    mockWorkflowState.result = {
      blob: new Blob(['# Heading\n\nContent'], { type: 'text/markdown' }),
      filename: 'document.md',
      sizeBefore: 1024,
      sizeAfter: 24,
      textOutput: '# Heading\n\nContent',
    };

    await act(async () => {
      root.render(React.createElement(TooltipProvider, null, React.createElement(PdfToMarkdown)));
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(container.textContent).toContain('document.md');
    expect(container.textContent).toContain('Copy Markdown');
    expect(container.textContent).toContain('Download .md file');
  });
});
