import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PdfWatermarkWorkbench } from '@/components/pdf-watermark/PdfWatermarkWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PdfWatermarkWorkbench integration with @workspace/ui (TDD)', () => {
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

  const sampleFile = new File(['mock-pdf-bytes'], 'dossier.pdf', { type: 'application/pdf' });
  const mockFormat = {
    id: 'pdf',
    name: 'PDF',
    extension: 'pdf',
    icon: '/images/formats/pdf.svg',
    color: '#FF6B35',
  };

  const renderWorkbench = async (props: Partial<Parameters<typeof PdfWatermarkWorkbench>[0]> = {}) => {
    const defaultProps = {
      file: sampleFile,
      sourceFormat: mockFormat,
      totalPages: 5,
      isProcessing: false,
      isFr: true,
      tc: { applyBtn: 'Appliquer le filigrane' },
      onReset: vi.fn(),
      onConvert: vi.fn(),
      text: 'CONFIDENTIEL',
      setText: vi.fn(),
      presetTexts: ['CONFIDENTIEL', 'COPIE'],
      pattern: 'single' as const,
      setPattern: vi.fn(),
      colorHex: '#FF0000',
      setColorHex: vi.fn(),
      fontSize: 32,
      setFontSize: vi.fn(),
      opacity: 0.3,
      setOpacity: vi.fn(),
      angle: -45 as const,
      setAngle: vi.fn(),
      pagesScope: 'all' as const,
      setPagesScope: vi.fn(),
      pagePreviewUrl: null,
      previewPage: 1,
      isLoadingPreview: false,
      onPageChange: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(PdfWatermarkWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders StudioCommandBar with file metadata and watermark action button', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('dossier.pdf');
    expect(container.textContent).toContain('5 p.');
    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn?.textContent).toContain('Appliquer le filigrane');
  });

  it('triggers onReset when reset button is clicked', async () => {
    const onReset = vi.fn();
    await renderWorkbench({ onReset });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();

    act(() => {
      resetBtn.click();
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('triggers onConvert when primary action button is clicked', async () => {
    const onConvert = vi.fn();
    await renderWorkbench({ onConvert });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();

    act(() => {
      actionBtn.click();
    });

    expect(onConvert).toHaveBeenCalledTimes(1);
  });

  it('disables primary action button when watermark text is empty', async () => {
    await renderWorkbench({ text: '' });

    const actionBtn = container.querySelector('button[data-testid="studio-primary-action-btn"]') as HTMLButtonElement;
    expect(actionBtn).not.toBeNull();
    expect(actionBtn.disabled).toBe(true);
  });

  it('renders ColorPickerField with color swatch trigger and custom color options', async () => {
    const setColorHex = vi.fn();
    await renderWorkbench({
      colorHex: '#FF0000',
      setColorHex,
    });

    const swatchBtn = container.querySelector('[data-testid="color-picker-trigger"]');
    expect(swatchBtn).not.toBeNull();
  });
});

