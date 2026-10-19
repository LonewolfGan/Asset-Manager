import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import HtmlToMarkdown from '@/pages/html-to-markdown';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('wouter', () => ({
  useLocation: () => ['/html-to-markdown', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'HTML to Markdown');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-html-to-markdown-workflow', () => ({
  useHtmlToMarkdownWorkflow: () => mockWorkflowState,
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
        'html-to-markdown': {
          title: 'HTML to Markdown',
          description: 'Convert HTML content to clean, readable Markdown format in your browser.',
        },
      },
      htmlToMarkdown: {
        tabUpload: 'Upload file (.html)',
        tabPaste: 'Paste HTML code',
        convertBtn: 'Convert to Markdown',
        converting: 'Converting...',
        convertAnother: 'Convert another',
        downloadMd: 'Download Markdown file',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('HtmlToMarkdown Page UI & Workflow Flow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
    mockWorkflowState = {
      t: {
        nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
        tools: {
          'html-to-markdown': {
            title: 'HTML to Markdown',
            description: 'Convert HTML content to clean, readable Markdown format in your browser.',
          },
        },
      },
      tc: {
        tabUpload: 'Upload file (.html)',
        tabPaste: 'Paste HTML code',
        convertBtn: 'Convert to Markdown',
        converting: 'Converting...',
        convertAnother: 'Convert another',
        downloadMd: 'Download Markdown file',
      },
      isFr: false,
      sourceFormat: { name: 'HTML', extension: 'html', icon: '/icons/html.svg', color: 'var(--accent, #ea580c)' },
      targetFormat: { name: 'Markdown', extension: 'md', icon: '/icons/markdown.svg', color: 'var(--accent, #0284c7)' },
      mode: 'upload',
      setMode: vi.fn(),
      files: [],
      file: undefined,
      htmlInput: '',
      setHtmlInput: vi.fn(),
      isPastedStaged: false,
      setIsPastedStaged: vi.fn(),
      result: null,
      isProcessing: false,
      isDragging: false,
      previewOpen: false,
      setPreviewOpen: vi.fn(),
      isNextActionOpen: false,
      setIsNextActionOpen: vi.fn(),
      isStaged: false,
      stagedFile: null,
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

  it('renders ReciprocalTitle with html-to-markdown slug in page header', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToMarkdown))
      );
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('html-to-markdown');
  });

  it('renders ModeSelector and Dropzone scene when idle in upload mode', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToMarkdown))
      );
    });
    expect(container.textContent).toContain('Upload file (.html)');
    expect(container.textContent).toContain('Paste HTML code');
    expect(container.textContent).toContain('HTML');
  });

  it('renders paste mode CodeWorkspace pane when mode is paste', async () => {
    mockWorkflowState.mode = 'paste';

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToMarkdown))
      );
    });

    expect(container.textContent).toContain('HTML5 Source Code');
  });

  it('renders heroic result scene with next actions button and preview button', async () => {
    mockWorkflowState.file = new File(['<p>content</p>'], 'page.html', { type: 'text/html' });
    mockWorkflowState.stagedFile = mockWorkflowState.file;
    mockWorkflowState.result = {
      blob: new Blob(['# Markdown content'], { type: 'text/markdown' }),
      filename: 'page.md',
      sizeBefore: 120,
      sizeAfter: 85,
      textOutput: '# Markdown content',
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToMarkdown))
      );
    });

    expect(container.textContent).toContain('page.md');
    expect(container.textContent).toContain('Markdown preview');
    expect(container.textContent).toContain('Next actions');
  });

  it('respects anti-slop constraint with zero transition-all in workspace DOM tree', async () => {
    mockWorkflowState.file = new File(['<p>content</p>'], 'page.html', { type: 'text/html' });
    mockWorkflowState.stagedFile = mockWorkflowState.file;
    mockWorkflowState.result = {
      blob: new Blob(['# Markdown content'], { type: 'text/markdown' }),
      filename: 'page.md',
      sizeBefore: 120,
      sizeAfter: 85,
      textOutput: '# Markdown content',
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToMarkdown))
      );
    });

    const workspace = container.querySelector('.max-w-5xl');
    expect(workspace).not.toBeNull();
    const elementsWithTransitionAll = workspace?.querySelectorAll('.transition-all') ?? [];
    expect(elementsWithTransitionAll.length).toBe(0);
  });
});
