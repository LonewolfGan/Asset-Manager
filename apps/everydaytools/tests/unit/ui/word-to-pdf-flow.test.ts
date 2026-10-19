import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import WordToPdf from '@/pages/word-to-pdf';
import * as workflowModule from '@/hooks/use-word-to-pdf-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/word-to-pdf', vi.fn()],
  Link: ({ children, href }: any) => React.createElement('a', { href }, children),
}));

vi.mock('@/components/ToolPageLayout', () => ({
  default: (props: any) =>
    React.createElement('div', { 'data-testid': 'layout' }, [
      React.createElement('h1', { key: 'title' }, props.title),
      props.children,
    ]),
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'FR',
    isFr: true,
    t: {
      nav: { breadcrumb: { home: 'Accueil', documents: 'Documents' } },
      tools: {
        'word-to-pdf': {
          title: 'Word en PDF',
          description: 'Convertissez vos fichiers Word en documents PDF haute fidélité.',
        },
      },
      wordToPdf: {
        convertBtn: 'Convertir en PDF',
        convertAnother: 'Changer de fichier',
        downloadPdf: 'Télécharger le fichier PDF',
        converting: 'Conversion en cours...',
      },
    },
  }),
}));

vi.mock('@/hooks/use-word-to-pdf-workflow');

describe('WordToPdf UI flow [TDD-Lock ECC]', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
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

  const defaultWorkflowState = {
    sourceFormat: {
      name: 'Word',
      extension: 'docx',
      icon: '/icons/word.svg',
      color: 'var(--accent, #2563eb)',
      subLabel: 'Format Word (.docx)',
    },
    targetFormat: {
      name: 'PDF',
      extension: 'pdf',
      icon: '/icons/pdf.svg',
      color: 'var(--accent, #dc2626)',
      subLabel: 'Document Adobe Acrobat',
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
    setResult: vi.fn(),
  };

  it('renders Dropzone scene when idle', () => {
    vi.mocked(workflowModule.useWordToPdfWorkflow).mockReturnValue({
      ...defaultWorkflowState,
    });

    act(() => {
      root.render(React.createElement(WordToPdf));
    });

    expect(container.textContent).toMatch(/Glissez-déposez votre document Word/i);
    expect(container.textContent).toMatch(/Sélectionner un fichier/i);
  });

  it('renders Staging scene when a file is selected', () => {
    const file = new File(['mock content'], 'contrat-cadre.docx');
    vi.mocked(workflowModule.useWordToPdfWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      file,
    });

    act(() => {
      root.render(React.createElement(WordToPdf));
    });

    expect(container.textContent).toContain('contrat-cadre.docx');
    expect(container.textContent).toContain('Convertir en PDF');
  });

  it('renders Conduit scene when processing conversion', () => {
    const file = new File(['mock content'], 'contrat-cadre.docx');
    vi.mocked(workflowModule.useWordToPdfWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      file,
      isProcessing: true,
    });

    act(() => {
      root.render(React.createElement(WordToPdf));
    });

    expect(container.textContent).toMatch(/Conversion en cours/i);
  });

  it('renders Result scene with download, preview, and next action controls', () => {
    const mockBlob = new Blob(['pdf-data'], { type: 'application/pdf' });
    vi.mocked(workflowModule.useWordToPdfWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      result: {
        blob: mockBlob,
        filename: 'contrat-cadre.pdf',
        sizeAfter: 2048,
        sizeBefore: 4096,
      },
    });

    act(() => {
      root.render(React.createElement(WordToPdf));
    });

    expect(container.textContent).toContain('contrat-cadre.pdf');
    expect(container.textContent).toContain('Télécharger le fichier PDF');
    expect(container.textContent).toMatch(/Ouvrir l'aperçu PDF/i);
    expect(container.textContent).toMatch(/Actions suivantes/i);
  });

  it('verifies zero raw non-standard hex and zero transition-all in rendered markup', () => {
    const mockBlob = new Blob(['pdf-data'], { type: 'application/pdf' });
    vi.mocked(workflowModule.useWordToPdfWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      result: {
        blob: mockBlob,
        filename: 'contrat-cadre.pdf',
        sizeAfter: 2048,
        sizeBefore: 4096,
      },
    });

    act(() => {
      root.render(React.createElement(WordToPdf));
    });

    const html = container.innerHTML;
    expect(html).not.toContain('#185ABD');
    expect(html).not.toContain('#EC1C24');
    expect(html).not.toContain('transition-all');
  });
});
