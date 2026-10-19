import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import OdtToPdf from '@/pages/odt-to-pdf';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/odt-to-pdf', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

let lastTitleProps: any = null;
vi.mock('@/components/conversion/ReciprocalTitle', () => ({
  ReciprocalTitle: (props: any) => {
    lastTitleProps = props;
    return React.createElement('span', { 'data-testid': 'reciprocal-title' }, 'ODT to PDF');
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
vi.mock('@/hooks/use-odt-to-pdf-workflow', () => ({
  useOdtToPdfWorkflow: () => mockWorkflowState,
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
      tools: {
        'odt-to-pdf': {
          title: 'ODT to PDF',
          description: 'Convert ODT documents to PDF.',
        },
      },
      odtToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Converting...',
        convertAnother: 'Change file',
        downloadPdf: 'Download PDF',
        error: 'Conversion failed',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

describe('OdtToPdf Page Flow & Anti-Slop (TDD)', () => {
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
        nav: { breadcrumb: { home: 'Accueil', documents: 'Documents' } },
        tools: {
          'odt-to-pdf': {
            title: 'ODT en PDF',
            description: 'Convertissez des documents ODT en fichiers PDF.',
          },
        },
      },
      tc: {
        convertBtn: 'Convertir en PDF',
        converting: 'Conversion en cours...',
        convertAnother: 'Changer de fichier',
        downloadPdf: 'Télécharger le document PDF',
      },
      isFr: true,
      sourceFormat: {
        name: 'ODT',
        extension: 'odt',
        icon: '/icons/odt.svg',
        color: 'var(--accent, #0d9488)',
        subLabel: 'OpenDocument Text',
      },
      targetFormat: {
        name: 'PDF',
        extension: 'pdf',
        icon: '/icons/pdf.svg',
        color: 'var(--accent, #dc2626)',
        subLabel: 'Adobe Acrobat',
      },
      file: null,
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

  it('renders reciprocal title and dropzone in initial state', () => {
    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(OdtToPdf))
      );
    });

    expect(container.querySelector('[data-testid="reciprocal-title"]')).not.toBeNull();
    expect(container.textContent).toContain('ODT to PDF');
    expect(container.textContent).toContain('Glissez-déposez votre document ODT');
    expect(lastTitleProps.currentSlug).toBe('odt-to-pdf');
  });

  it('renders ConversionStaging when file is present', () => {
    mockWorkflowState.file = new File(['mock content'], 'test.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(OdtToPdf))
      );
    });

    expect(container.textContent).toContain('test.odt');
    expect(container.textContent).toContain('Convertir en PDF');
  });

  it('renders ConversionConduit during conversion', () => {
    mockWorkflowState.file = new File(['mock content'], 'test.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    mockWorkflowState.isProcessing = true;

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(OdtToPdf))
      );
    });

    expect(container.textContent).toContain('Conversion en cours...');
  });

  it('renders heroic ConversionResult with preview and next actions buttons', () => {
    mockWorkflowState.result = {
      blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
      filename: 'test.pdf',
      sizeBefore: 120,
      sizeAfter: 340,
    };

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(OdtToPdf))
      );
    });

    expect(container.textContent).toContain('test.pdf');
    expect(container.textContent).toContain('Télécharger le document PDF');
    expect(container.textContent).toContain("Ouvrir l'aperçu PDF");
    expect(container.textContent).toContain('Actions suivantes');
  });

  it('connects NextActionModal with toolId odt-to-pdf', () => {
    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(OdtToPdf))
      );
    });

    expect(container.querySelector('[data-testid="next-action-modal"]')).not.toBeNull();
    expect(lastModalProps?.toolId).toBe('odt-to-pdf');
  });
});
