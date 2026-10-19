import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import WordToText from '@/pages/word-to-text';
import * as workflowModule from '@/hooks/use-word-to-text-workflow';
import { TooltipProvider } from '@/components/ui/tooltip';


(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('wouter', () => ({
  useLocation: () => ['/word-to-text', vi.fn()],
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
    t: {
      nav: {
        breadcrumb: {
          home: 'Accueil',
          documents: 'Documents',
        },
      },
      tools: {
        'word-to-text': {
          title: 'Word en Texte',
          description: 'Extrayez le texte brut de documents Word (.docx, .doc).',
        },
      },
      wordToText: {
        error: 'Erreur',
        downloadTxt: 'Télécharger le fichier texte',
        convertAnother: 'Changer de fichier',
        convertBtn: 'Extraire le texte',
        converting: 'Extraction du texte brut en cours...',
        copyText: 'Copier le texte',
        copiedText: 'Copié !',
      },
    },
    isFr: true,
    locale: 'fr',
  }),
}));

vi.mock('@/hooks/use-word-to-text-workflow');

describe('WordToText UI flow [TDD-Lock ECC]', () => {
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
      name: 'Texte',
      extension: 'txt',
      icon: '/icons/txt.svg',
      color: 'var(--accent, #4b5563)',
      subLabel: 'Texte Brut UTF-8',
    },
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

  it('renders Dropzone scene when idle', () => {
    vi.mocked(workflowModule.useWordToTextWorkflow).mockReturnValue({
      ...defaultWorkflowState,
    });

    act(() => {
      root.render(React.createElement(WordToText));
    });

    expect(container.textContent).toMatch(/Glissez-déposez votre document Word/i);
    expect(container.textContent).toMatch(/Sélectionner un fichier/i);
  });

  it('renders Staging scene when a file is selected', () => {
    const file = new File(['content'], 'rapport-annuel.docx');
    vi.mocked(workflowModule.useWordToTextWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      file,
    });

    act(() => {
      root.render(React.createElement(WordToText));
    });

    expect(container.textContent).toContain('rapport-annuel.docx');
    expect(container.textContent).toContain('Extraire le texte');
  });

  it('renders Conduit scene when processing extraction', () => {
    const file = new File(['content'], 'rapport-annuel.docx');
    vi.mocked(workflowModule.useWordToTextWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      file,
      isProcessing: true,
    });

    act(() => {
      root.render(React.createElement(WordToText));
    });

    expect(container.textContent).toMatch(/Extraction du texte brut/i);
  });

  it('renders Result scene with download, preview, copy button, and next action controls', () => {
    const mockBlob = new Blob(['Texte extrait'], { type: 'text/plain' });
    vi.mocked(workflowModule.useWordToTextWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      result: {
        blob: mockBlob,
        filename: 'rapport-annuel.txt',
        sizeAfter: 1024,
        sizeBefore: 4096,
        textOutput: 'Texte extrait',
      },
    });

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToText))
      );
    });


    expect(container.textContent).toContain('rapport-annuel.txt');
    expect(container.textContent).toContain('Télécharger le fichier texte');
    expect(container.textContent).toMatch(/Aperçu du texte/i);
    expect(container.textContent).toMatch(/Copier le texte/i);
    expect(container.textContent).toMatch(/Actions suivantes/i);
  });

  it('verifies zero raw non-standard hex and zero transition-all in rendered markup', () => {
    const mockBlob = new Blob(['Texte extrait'], { type: 'text/plain' });
    vi.mocked(workflowModule.useWordToTextWorkflow).mockReturnValue({
      ...defaultWorkflowState,
      result: {
        blob: mockBlob,
        filename: 'rapport-annuel.txt',
        sizeAfter: 1024,
        sizeBefore: 4096,
        textOutput: 'Texte extrait',
      },
    });

    act(() => {
      root.render(
        React.createElement(TooltipProvider, null, React.createElement(WordToText))
      );
    });

    const html = container.innerHTML;
    expect(html).not.toContain('#185ABD');
    expect(html).not.toContain('#4B5563');
    expect(html).not.toContain('transition-all');
  });
});

