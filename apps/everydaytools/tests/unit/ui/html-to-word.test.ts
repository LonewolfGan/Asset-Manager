import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import HtmlToWord from '@/pages/html-to-word';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('wouter', () => ({
  useLocation: () => ['/html-to-word', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'HTML to Word');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-html-to-word-workflow', () => ({
  useHtmlToWordWorkflow: () => mockWorkflowState,
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
        'html-to-word': {
          title: 'HTML to Word',
          description: 'Convert HTML code and web pages into editable Microsoft Word (.docx) documents.',
        },
      },
      htmlToWord: {
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

describe('HtmlToWord Page UI & Workflow Flow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    lastTitleProps = null;
    mockWorkflowState = {
      t: {
        nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
        tools: {
          'html-to-word': {
            title: 'HTML to Word',
            description: 'Convert HTML code and web pages into editable Microsoft Word (.docx) documents.',
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
      sourceFormat: { name: 'HTML', extension: 'html', icon: '/icons/html.svg', color: 'var(--accent, #ea580c)' },
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

  it('renders ReciprocalTitle with html-to-word slug in page header', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToWord))
      );
    });
    const title = container.querySelector('[data-testid="reciprocal-title"]');
    expect(title).not.toBeNull();
    expect(lastTitleProps?.currentSlug).toBe('html-to-word');
  });

  it('renders Dropzone scene when idle', async () => {
    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToWord))
      );
    });
    expect(container.textContent).toContain('HTML');
    expect(container.textContent).toContain('Word');
  });

  it('renders heroic result scene with next actions button', async () => {
    mockWorkflowState.file = new File(['<p>content</p>'], 'page.html', { type: 'text/html' });
    mockWorkflowState.result = {
      blob: new Blob(['docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'page.docx',
      sizeBefore: 120,
      sizeAfter: 90,
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToWord))
      );
    });

    expect(container.textContent).toContain('page.docx');
    expect(container.textContent).toContain('Next actions');
  });

  it('respects anti-slop constraint with zero transition-all in workspace DOM tree', async () => {
    mockWorkflowState.file = new File(['<p>content</p>'], 'page.html', { type: 'text/html' });
    mockWorkflowState.result = {
      blob: new Blob(['docx content'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'page.docx',
      sizeBefore: 120,
      sizeAfter: 90,
    };

    await act(async () => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToWord))
      );
    });

    const workspace = container.querySelector('.max-w-5xl');
    expect(workspace).not.toBeNull();
    const elementsWithTransitionAll = workspace?.querySelectorAll('.transition-all') ?? [];
    expect(elementsWithTransitionAll.length).toBe(0);
  });
});
