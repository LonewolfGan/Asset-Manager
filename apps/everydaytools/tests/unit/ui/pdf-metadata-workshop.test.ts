import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfMetadataWorkshop } from '@/components/pdf-metadata/PdfMetadataWorkshop';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfMetadataWorkshop integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'doc.pdf', { type: 'application/pdf' });

  const renderWorkshop = async (props: Partial<Parameters<typeof PdfMetadataWorkshop>[0]> = {}) => {
    const defaultForm = {
      title: 'Titre doc',
      setTitle: vi.fn(),
      showInTitleBar: false,
      setShowInTitleBar: vi.fn(),
      author: 'Auteur',
      setAuthor: vi.fn(),
      subject: 'Sujet',
      setSubject: vi.fn(),
      tags: ['tag1'],
      tagInput: '',
      setTagInput: vi.fn(),
      handleAddTag: vi.fn(),
      handleRemoveTag: vi.fn(),
      handleTagKeyDown: vi.fn(),
      showTechFields: false,
      setShowTechFields: vi.fn(),
      dateMode: 'keep' as const,
      setDateMode: vi.fn(),
      customDate: '',
      setCustomDate: vi.fn(),
      language: '',
      setLanguage: vi.fn(),
      creator: '',
      setCreator: vi.fn(),
      producer: '',
      setProducer: vi.fn(),
      initialValues: { author: 'Auteur original' },
      handleRestoreInitial: vi.fn(),
      handleInferTitle: vi.fn(),
      handleWipeMetadata: vi.fn(),
      isModified: false,
    };

    const defaultProps = {
      file: sampleFile,
      pageCount: 12,
      creationDate: new Date('2026-01-01'),
      isProcessing: false,
      onReset: vi.fn(),
      onSave: vi.fn(),
      form: defaultForm as any,
      quickTagSuggestions: ['Rapport', 'Facture'],
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfMetadataWorkshop, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and save action button', async () => {
    await renderWorkshop();

    expect(container.textContent).toContain('doc.pdf');
    expect(container.textContent).toContain('12 p.');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Enregistrer');
  });

  it('triggers onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    await renderWorkshop({ onReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onSave when primary action button is clicked', async () => {
    const onSave = vi.fn();
    await renderWorkshop({ onSave });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
