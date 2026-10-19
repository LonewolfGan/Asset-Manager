import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import EpubToWord from '@/pages/epub-to-word';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('wouter', () => ({
  useLocation: () => ['/epub-to-word', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'EPUB to Word');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-epub-to-word-workflow', () => ({
  useEpubToWordWorkflow: () => mockWorkflowState,
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
        'epub-to-word': {
          title: 'EPUB to Word',
          description: 'Convert EPUB e-books to Microsoft Word (.docx) document.',
        },
      },
      epubToWord: {
        convertBtn: 'Convert to Word',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadDocx: 'Download Word',
        error: 'Conversion failed',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('EpubToWord Page UI & Workflow Flow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
    mockWorkflowState = {
      t: {
        nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
        tools: {
          'epub-to-word': {
            title: 'EPUB to Word',
            description: 'Convert EPUB e-books to Microsoft Word (.docx) document.',
          },
        },
      },
      tc: {
        convertBtn: 'Convert to Word',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadDocx: 'Download Word',
        error: 'Conversion failed',
      },
      isFr: false,
      sourceFormat: { name: 'EPUB', extension: 'epub', icon: '/icons/epub.svg', color: 'var(--accent, #8b5cf6)' },
      targetFormat: { name: 'Word', extension: 'docx', icon: '/icons/word.svg', color: 'var(--accent, #2563eb)' },
      file: undefined,
      result: null,
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

  it('renders ReciprocalTitle with epub-to-word slug in page header', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(EpubToWord))
      );
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('epub-to-word');
  });

  it('renders Dropzone scene when idle', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(EpubToWord))
      );
    });
    expect(container.textContent).toContain('EPUB');
    expect(container.textContent).toContain('Word');
  });

  it('renders heroic result scene with next actions button', async () => {
    mockWorkflowState.file = new File(['content'], 'novel.epub', { type: 'application/epub+zip' });
    mockWorkflowState.result = {
      blob: new Blob(['docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'novel.docx',
      sizeBefore: 120,
      sizeAfter: 90,
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(EpubToWord))
      );
    });

    expect(container.textContent).toContain('novel.docx');
    expect(container.textContent).toContain('Next actions');
  });

  it('respects anti-slop constraint with zero transition-all in workspace DOM tree', async () => {
    mockWorkflowState.file = new File(['content'], 'novel.epub', { type: 'application/epub+zip' });
    mockWorkflowState.result = {
      blob: new Blob(['docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'novel.docx',
      sizeBefore: 120,
      sizeAfter: 90,
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(EpubToWord))
      );
    });

    const workspace = container.querySelector('.max-w-5xl');
    expect(workspace).not.toBeNull();
    const elementsWithTransitionAll = workspace?.querySelectorAll('.transition-all') ?? [];
    expect(elementsWithTransitionAll.length).toBe(0);
  });
});
