import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import MarkdownToDocx from '@/pages/markdown-to-docx';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('wouter', () => ({
  useLocation: () => ['/markdown-to-docx', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'Markdown to Word');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-markdown-to-docx-workflow', () => ({
  useMarkdownToDocxWorkflow: () => mockWorkflowState,
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
        'markdown-to-docx': {
          title: 'Markdown to Word',
          description: 'Convert Markdown files to Microsoft Word (.docx) format.',
        },
      },
      markdownToDocx: {
        error: 'Failed to convert to Word document.',
        convertBtn: 'Convert to Word',
        converting: 'Generating Word DOCX document...',
        convertAnother: 'Convert another file',
        downloadDocx: 'Download Word document',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('MarkdownToDocx Page UI & Workflow Flow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    lastTitleProps = null;

    mockWorkflowState = {
      t: {
        nav: {
          breadcrumb: {
            home: 'Accueil',
            documents: 'Documents',
          },
        },
        tools: {
          'markdown-to-docx': {
            title: 'Markdown en Word',
            description: 'Convertissez du Markdown en un vrai document Word.',
          },
        },
      },
      tc: {
        convertBtn: 'Convertir en Word',
        converting: 'Génération du document Word DOCX en cours...',
        convertAnother: 'Convertir un autre fichier',
        downloadDocx: 'Télécharger le document Word',
        error: 'Erreur',
      },
      isFr: true,
      sourceFormat: {
        name: 'Markdown',
        extension: 'md',
        icon: '/icons/markdown.svg',
        color: 'var(--accent, #0284c7)',
        subLabel: 'Syntaxe Markdown',
      },
      targetFormat: {
        name: 'Word',
        extension: 'docx',
        icon: '/icons/word.svg',
        color: 'var(--accent, #2563eb)',
        subLabel: 'Document Microsoft Word (.docx)',
      },
      mode: 'upload',
      setMode: vi.fn(),
      file: null,
      markdownInput: '',
      setMarkdownInput: vi.fn(),
      setIsPastedStaged: vi.fn(),
      result: null,
      isProcessing: false,
      isDragging: false,
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
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it('renders reciprocal title, breadcrumbs and dropzone in initial upload mode', () => {
    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToDocx))
      );
    });

    expect(container.querySelector('[data-testid="reciprocal-title"]')).not.toBeNull();
    expect(container.textContent).toContain('Markdown to Word');
    expect(container.textContent).toContain('Glissez-déposez votre fichier Markdown');
    expect(lastTitleProps.currentSlug).toBe('markdown-to-docx');
  });

  it('renders paste mode pane when mode is paste', () => {
    mockWorkflowState.mode = 'paste';

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToDocx))
      );
    });

    expect(container.textContent).toContain('Document Markdown');
    expect(container.textContent).toContain('Valider et configurer');
  });

  it('renders ConversionStaging when file or pasted content is staged', () => {
    mockWorkflowState.isStaged = true;
    mockWorkflowState.stagedFile = new File(['# Title'], 'doc.md', { type: 'text/markdown' });

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToDocx))
      );
    });

    expect(container.textContent).toContain('doc.md');
    expect(container.textContent).toContain('Convertir en Word');
  });

  it('renders ConversionConduit during processing', () => {
    mockWorkflowState.isProcessing = true;

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToDocx))
      );
    });

    expect(container.textContent).toContain('Génération du document Word DOCX en cours...');
  });

  it('renders heroic ConversionResult with download and next action buttons', () => {
    mockWorkflowState.result = {
      blob: new Blob(['docx-data'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'rapport.docx',
      sizeAfter: 8450,
      sizeBefore: 1200,
    };

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToDocx))
      );
    });

    expect(container.textContent).toContain('rapport.docx');
    expect(container.textContent).toContain('Télécharger le document Word');
    expect(container.textContent).toContain('Actions suivantes');
  });
});
