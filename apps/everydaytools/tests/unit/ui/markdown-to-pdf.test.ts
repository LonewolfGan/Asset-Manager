import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import MarkdownToPdf from '@/pages/markdown-to-pdf';
import { TooltipProvider } from '@/components/ui/tooltip';

vi.mock('wouter', () => ({
  useLocation: () => ['/markdown-to-pdf', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'Markdown to PDF');
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-markdown-to-pdf-workflow', () => ({
  useMarkdownToPdfWorkflow: () => mockWorkflowState,
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
        'markdown-to-pdf': {
          title: 'Markdown to PDF',
          description: 'Convert Markdown (.md) or text files into an elegant, formatted PDF document.',
        },
      },
      markdownToPdf: {
        error: 'Failed to convert to PDF document.',
        convertBtn: 'Convert to PDF',
        converting: 'Compiling PDF document...',
        convertAnother: 'Convert another document',
        downloadPdf: 'Download PDF document',
      },
    },
    isFr: false,
    locale: 'en',
  }),
}));

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('MarkdownToPdf Page UI & Workflow Flow (TDD)', () => {
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
          'markdown-to-pdf': {
            title: 'Markdown en PDF',
            description: 'Convertissez vos documents Markdown (.md) en PDF.',
          },
        },
      },
      tc: {
        convertBtn: 'Convertir en PDF',
        converting: 'Compilation du document PDF haute fidélité...',
        convertAnother: 'Convertir un autre document',
        downloadPdf: 'Télécharger le document PDF',
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
        name: 'PDF',
        extension: 'pdf',
        icon: '/icons/pdf.svg',
        color: 'var(--accent, #dc2626)',
        subLabel: 'Adobe Acrobat',
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
      handleOpenPreview: vi.fn(),
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
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToPdf))
      );
    });

    expect(container.querySelector('[data-testid="reciprocal-title"]')).not.toBeNull();
    expect(container.textContent).toContain('Markdown to PDF');
    expect(container.textContent).toContain('Glissez-déposez votre fichier Markdown');
    expect(lastTitleProps.currentSlug).toBe('markdown-to-pdf');
  });

  it('renders paste mode pane when mode is paste', () => {
    mockWorkflowState.mode = 'paste';

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToPdf))
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
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToPdf))
      );
    });

    expect(container.textContent).toContain('doc.md');
    expect(container.textContent).toContain('Convertir en PDF');
  });

  it('renders ConversionConduit during processing', () => {
    mockWorkflowState.isProcessing = true;

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToPdf))
      );
    });

    expect(container.textContent).toContain('Compilation du document PDF haute fidélité...');
  });

  it('renders heroic ConversionResult with preview and next action buttons', () => {
    mockWorkflowState.result = {
      blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
      filename: 'rapport.pdf',
      sizeAfter: 12450,
      sizeBefore: 4500,
    };

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(MarkdownToPdf))
      );
    });

    expect(container.textContent).toContain('rapport.pdf');
    expect(container.textContent).toContain('Télécharger le document PDF');
    expect(container.textContent).toContain("Ouvrir l'aperçu PDF");
    expect(container.textContent).toContain('Actions suivantes');
  });
});
