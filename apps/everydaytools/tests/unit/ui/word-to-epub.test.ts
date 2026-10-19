import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import WordToEpub from '@/pages/word-to-epub';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('wouter', () => ({
  useLocation: () => ['/word-to-epub', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'Word to EPUB');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-word-to-epub-workflow', () => ({
  useWordToEpubWorkflow: () => mockWorkflowState,
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
        'word-to-epub': {
          title: 'Word to EPUB',
          description: 'Convert DOCX documents to EPUB e-books.',
        },
      },
      wordToEpub: {
        convertBtn: 'Convert to EPUB',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadEpub: 'Download EPUB e-book',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('WordToEpub Page UI & Workflow Flow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
    mockWorkflowState = {
      t: {
        nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
        tools: {
          'word-to-epub': {
            title: 'Word to EPUB',
            description: 'Convert DOCX documents to EPUB e-books.',
          },
        },
      },
      tc: {
        convertBtn: 'Convert to EPUB',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadEpub: 'Download EPUB e-book',
        error: 'Conversion failed',
      },
      isFr: false,
      sourceFormat: { name: 'Word', extension: 'docx', icon: '/icons/word.svg', color: 'var(--accent, #2563eb)' },
      targetFormat: { name: 'EPUB', extension: 'epub', icon: '/icons/epub.svg', color: 'var(--accent, #65a30d)' },
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

  it('renders ReciprocalTitle with word-to-epub slug in page header', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToEpub))
      );
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('word-to-epub');
  });

  it('renders Dropzone scene when idle', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToEpub))
      );
    });
    expect(container.textContent).toContain('Word');
    expect(container.textContent).toContain('EPUB');
  });

  it('renders heroic result scene with preview button and next actions button', async () => {
    mockWorkflowState.file = new File(['content'], 'manuscript.docx');
    mockWorkflowState.result = {
      blob: new Blob(['epub content'], { type: 'application/epub+zip' }),
      filename: 'manuscript.epub',
      sizeBefore: 120,
      sizeAfter: 90,
      textOutput: 'Chapter 1',
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToEpub))
      );
    });

    expect(container.textContent).toContain('manuscript.epub');
    expect(container.textContent).toContain('Preview book content');
    expect(container.textContent).toContain('Next actions');
  });

  it('respects anti-slop constraint with zero transition-all in workspace DOM tree', async () => {
    mockWorkflowState.file = new File(['content'], 'manuscript.docx');
    mockWorkflowState.result = {
      blob: new Blob(['epub content'], { type: 'application/epub+zip' }),
      filename: 'manuscript.epub',
      sizeBefore: 120,
      sizeAfter: 90,
      textOutput: 'Chapter 1',
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToEpub))
      );
    });

    const workspace = container.querySelector('.max-w-5xl');
    expect(workspace).not.toBeNull();
    const elementsWithTransitionAll = workspace?.querySelectorAll('.transition-all') ?? [];
    expect(elementsWithTransitionAll.length).toBe(0);
  });
});
