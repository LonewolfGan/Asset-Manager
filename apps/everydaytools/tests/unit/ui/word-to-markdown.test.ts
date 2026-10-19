import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import WordToMarkdown from '@/pages/word-to-markdown';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('wouter', () => ({
  useLocation: () => ['/word-to-markdown', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'Word to Markdown');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-word-to-markdown-workflow', () => ({
  useWordToMarkdownWorkflow: () => mockWorkflowState,
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
        'word-to-markdown': {
          title: 'Word to Markdown',
          description: 'Convert DOCX files to clean Markdown.',
        },
      },
      wordToMarkdown: {
        convertBtn: 'Convert to Markdown',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadMd: 'Download Markdown file',
        copyMd: 'Copy Markdown',
        copiedMd: 'Copied!',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('WordToMarkdown Page UI & Workflow Flow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
    mockWorkflowState = {
      t: {
        nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
        tools: {
          'word-to-markdown': {
            title: 'Word to Markdown',
            description: 'Convert DOCX files to clean Markdown.',
          },
        },
      },
      tc: {
        convertBtn: 'Convert to Markdown',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadMd: 'Download Markdown file',
        copyMd: 'Copy Markdown',
        copiedMd: 'Copied!',
        error: 'Conversion failed',
      },
      isFr: false,
      sourceFormat: { name: 'Word', extension: 'docx', icon: '/icons/word.svg', color: 'var(--accent, #2563eb)' },
      targetFormat: { name: 'Markdown', extension: 'md', icon: '/icons/markdown.svg', color: 'var(--accent, #0284c7)' },
      file: undefined,
      result: null,
      isProcessing: false,
      isDragging: false,
      previewOpen: false,
      setPreviewOpen: vi.fn(),
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

  it('renders ReciprocalTitle with word-to-markdown slug in page header', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToMarkdown))
      );
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('word-to-markdown');
  });

  it('renders Dropzone scene when idle', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToMarkdown))
      );
    });
    expect(container.textContent).toContain('Word');
    expect(container.textContent).toContain('Markdown');
  });

  it('renders heroic result scene with preview button, copy button and next actions button', async () => {
    mockWorkflowState.file = new File(['content'], 'test.docx');
    mockWorkflowState.result = {
      blob: new Blob(['# hello'], { type: 'text/markdown' }),
      filename: 'test.md',
      sizeBefore: 100,
      sizeAfter: 80,
      textOutput: '# hello',
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToMarkdown))
      );
    });

    expect(container.textContent).toContain('test.md');
    expect(container.textContent).toContain('Markdown preview');
    expect(container.textContent).toContain('Next actions');
  });

  it('respects anti-slop constraint with zero transition-all in workspace DOM tree', async () => {
    mockWorkflowState.file = new File(['content'], 'test.docx');
    mockWorkflowState.result = {
      blob: new Blob(['# hello'], { type: 'text/markdown' }),
      filename: 'test.md',
      sizeBefore: 100,
      sizeAfter: 80,
      textOutput: '# hello',
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToMarkdown))
      );
    });

    const workspace = container.querySelector('.max-w-5xl');
    expect(workspace).not.toBeNull();
    const elementsWithTransitionAll = workspace?.querySelectorAll('.transition-all') ?? [];
    expect(elementsWithTransitionAll.length).toBe(0);
  });
});
