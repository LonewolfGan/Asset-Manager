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
vi.mock('@/engine/use-tool-workflow', () => ({
  useToolWorkflow: () => mockWorkflowState,
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
        previewText: 'Preview',
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
      inputFile: undefined,
      result: null,
      error: null,
      isProcessing: false,
      handleFileSelect: vi.fn(),
      handleExecute: vi.fn(),
      handleReset: vi.fn(),
      setError: vi.fn(),
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

  it('renders staging scene when file is selected and triggers convert without fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    mockWorkflowState.inputFile = new File(['%PDF content'], 'document.pdf', {
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

    expect(mockWorkflowState.handleExecute).toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('renders heroic result scene with copy button and preview dialog when conversion finishes', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    mockWorkflowState.inputFile = new File(['%PDF content'], 'document.pdf', {
      type: 'application/pdf',
    });
    mockWorkflowState.result = {
      data: new Blob(['# Heading\n\nContent'], { type: 'text/markdown' }),
      filename: 'document.md',
      originalSize: 1024,
      resultSize: 24,
      mimeType: 'text/markdown; charset=utf-8',
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
