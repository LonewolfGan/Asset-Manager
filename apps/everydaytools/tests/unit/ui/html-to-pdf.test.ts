import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import HtmlToPdf from '@/pages/html-to-pdf';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/html-to-pdf', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'HTML to PDF');
  },
}));

let lastModalProps: any = null;
vi.mock('@/components/conversion/NextActionModal', () => ({
  NextActionModal: (props: any) => {
    lastModalProps = props;
    return React.createElement('div', { 'data-testid': 'next-action-modal' });
  },
}));

let mockWorkflowState: any = null;
vi.mock('@/hooks/use-html-to-pdf-workflow', () => ({
  useHtmlToPdfWorkflow: () => mockWorkflowState,
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
        'html-to-pdf': {
          title: 'HTML to PDF',
          description: 'Convert HTML snippets or files into structured, printable PDF documents.',
        },
      },
      htmlToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Generating high-fidelity PDF...',
        convertAnother: 'Change file / code',
        downloadPdf: 'Download PDF document',
        tabUpload: 'Upload file (.html)',
        tabPaste: 'Paste HTML code',
        error: 'Conversion failed',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

describe('HtmlToPdf Page UI & Workflow Flow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    lastTitleProps = null;
    lastModalProps = null;

    mockWorkflowState = {
      t: {
        nav: {
          breadcrumb: {
            home: 'Accueil',
            documents: 'Documents',
          },
        },
        tools: {
          'html-to-pdf': {
            title: 'HTML en PDF',
            description: 'Convertissez des documents HTML en fichiers PDF paginés de haute fidélité.',
          },
        },
      },
      tc: {
        convertBtn: 'Convertir en PDF',
        converting: 'Génération du document PDF haute fidélité...',
        convertAnother: 'Changer de fichier / code',
        downloadPdf: 'Télécharger le document PDF',
        error: 'Erreur',
      },
      isFr: true,
      sourceFormat: {
        name: 'HTML',
        extension: 'html',
        icon: '/icons/html.svg',
        color: 'var(--accent, #ea580c)',
        subLabel: 'Document HTML5',
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
      htmlInput: '',
      setHtmlInput: vi.fn(),
      isPastedStaged: false,
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

  it('renders reciprocal title and dropzone in initial upload mode', () => {
    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    expect(container.querySelector('[data-testid="reciprocal-title"]')).not.toBeNull();
    expect(container.textContent).toContain('HTML to PDF');
    expect(container.textContent).toContain('Glissez-déposez votre document HTML');
    expect(lastTitleProps.currentSlug).toBe('html-to-pdf');
  });

  it('renders mode selector with accessible aria-pressed attributes', () => {
    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    const buttons = container.querySelectorAll('button[aria-pressed]');
    expect(buttons.length).toBe(2);

    const uploadBtn = buttons[0];
    const pasteBtn = buttons[1];

    expect(uploadBtn.getAttribute('aria-pressed')).toBe('true');
    expect(pasteBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('calls setMode when clicking mode selector buttons', () => {
    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    const buttons = container.querySelectorAll('button[aria-pressed]');
    const pasteBtn = buttons[1];

    act(() => {
      pasteBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(mockWorkflowState.setMode).toHaveBeenCalledWith('paste');
  });

  it('renders paste mode pane when mode is paste', () => {
    mockWorkflowState.mode = 'paste';

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    expect(container.textContent).toContain('Document HTML5');
    expect(container.textContent).toContain('Valider et configurer');
  });

  it('renders ConversionStaging when file or pasted content is staged', () => {
    mockWorkflowState.isStaged = true;
    mockWorkflowState.stagedFile = new File(['<h1>Title</h1>'], 'doc.html', { type: 'text/html' });

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    expect(container.textContent).toContain('doc.html');
    expect(container.textContent).toContain('Convertir en PDF');
  });

  it('renders ConversionConduit during processing', () => {
    mockWorkflowState.isProcessing = true;

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    expect(container.textContent).toContain('Génération du document PDF haute fidélité...');
  });

  it('renders heroic ConversionResult with download, preview, and next actions buttons', () => {
    mockWorkflowState.result = {
      blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
      filename: 'rapport.pdf',
      sizeAfter: 8450,
      sizeBefore: 1200,
    };

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    expect(container.textContent).toContain('rapport.pdf');
    expect(container.textContent).toContain('Télécharger le document PDF');
    expect(container.textContent).toContain("Ouvrir l'aperçu PDF");
    expect(container.textContent).toContain('Actions suivantes');
  });

  it('connects NextActionModal with toolId html-to-pdf', () => {
    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(HtmlToPdf))
      );
    });

    expect(container.querySelector('[data-testid="next-action-modal"]')).not.toBeNull();
    expect(lastModalProps?.toolId).toBe('html-to-pdf');
  });
});
