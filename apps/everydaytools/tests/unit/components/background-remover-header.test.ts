import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';
import { RemoverBatchGallery } from '@/components/background-remover/RemoverBatchGallery';
import { RemoverStudioScene } from '@/components/background-remover/RemoverStudioScene';
import { RemoverBackdropSelector } from '@/components/background-remover/RemoverBackdropSelector';
import type { QueueItem } from '@/lib/background-remover-logic';

describe('Background Remover Studio Header Harmonization', () => {
  const dummyItemDone: QueueItem = {
    id: 'item-1',
    file: new File(['data'], 'portrait.jpg', { type: 'image/jpeg' }),
    previewUrl: 'blob:preview-1',
    resultUrl: 'blob:result-1',
    status: 'done',
    dims: { w: 1200, h: 800 },
  };

  const dummyItemProcessing: QueueItem = {
    id: 'item-2',
    file: new File(['data2'], 'product.png', { type: 'image/png' }),
    previewUrl: 'blob:preview-2',
    status: 'processing',
    dims: { w: 800, h: 600 },
  };

  it('verifies RemoverBatchGallery uses canonical StudioCommandBar with right download button', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverBatchGallery, {
          queue: [dummyItemDone, dummyItemProcessing],
          isProcessing: false,
          doneCountTotal: 1,
          allBatchFinished: false,
          onFullReset: vi.fn(),
          onCancel: vi.fn(),
          onDownloadItem: vi.fn(),
          onDownloadBatchZip: vi.fn(),
          onInspectItem: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('data-testid="studio-reset-btn"');
    expect(html).toContain('Changer de fichiers');
    expect(html).toContain('2 images');
    expect(html).toContain('data-testid="studio-primary-action-btn"');
    expect(html).toContain('Télécharger le lot (.ZIP)');
    expect(html).toContain('aria-label="Inspecter portrait.jpg"');
  });

  it('verifies RemoverStudioScene shows disabled view modes in centerControls during processing instead of duplicate loader', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverStudioScene, {
          item: dummyItemProcessing,
          isInspecting: false,
          onBackToGallery: vi.fn(),
          onFullReset: vi.fn(),
          viewMode: 'cutout',
          onViewModeChange: vi.fn(),
          backdropType: 'transparent',
          onBackdropTypeChange: vi.fn(),
          customColor: '#ffffff',
          onCustomColorChange: vi.fn(),
          customBgUrl: null,
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          stageBackgroundStyle: {},
          isCompositing: false,
          onDownload: vi.fn(),
          onRetry: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('data-testid="studio-reset-btn"');
    // No duplicate loader in studio bar
    expect(html).not.toContain('Détourage IA en cours...');

    // Display modes present in disabled mode
    expect(html).toContain('Avant / Après');
    expect(html).toContain('Sujet détouré');
    expect(html).toContain('Original');
    expect(html).toContain('aria-disabled="true"');

    expect(html).toContain('data-testid="studio-primary-action-btn"');
    expect(html).toContain('Télécharger');
  });

  it('verifies RemoverStudioScene has clean center view modes and download action on the right', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverStudioScene, {
          item: dummyItemDone,
          isInspecting: false,
          onBackToGallery: vi.fn(),
          onFullReset: vi.fn(),
          viewMode: 'cutout',
          onViewModeChange: vi.fn(),
          backdropType: 'transparent',
          onBackdropTypeChange: vi.fn(),
          customColor: '#ffffff',
          onCustomColorChange: vi.fn(),
          customBgUrl: null,
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          stageBackgroundStyle: {},
          isCompositing: false,
          onDownload: vi.fn(),
          onRetry: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('data-testid="studio-reset-btn"');
    expect(html).toContain('Avant / Après');
    expect(html).toContain('Sujet détouré');
    expect(html).toContain('Original');
    expect(html).toContain('data-testid="studio-primary-action-btn"');
    expect(html).toContain('Télécharger');
    expect(html).toContain('Transparent');

    // In DOM order, center controls must appear before primary action button
    const centerIdx = html.indexOf('Sujet détouré');
    const downloadIdx = html.indexOf('data-testid="studio-primary-action-btn"');
    expect(centerIdx).toBeGreaterThan(0);
    expect(downloadIdx).toBeGreaterThan(0);
    expect(centerIdx).toBeLessThan(downloadIdx);

    // centerControls must not have order-last which breaks the visual layout and puts download in the middle
    expect(html).not.toContain('order-last');

    // Accessibility on view mode controls
    expect(html).toContain('role="group"');
    expect(html).toContain('Mode d&#x27;affichage');
    expect(html).toContain('aria-pressed="true"');
  });

  it('verifies RemoverBackdropSelector provides full accessible ARIA labels and pressed states', () => {
    const handleBackdropTypeChange = vi.fn();
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverBackdropSelector, {
          backdropType: 'transparent',
          onBackdropTypeChange: handleBackdropTypeChange,
          customColor: '',
          onCustomColorChange: vi.fn(),
          customBgUrl: null,
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          isFr: true,
        })
      )
    );

    expect(html).toContain('aria-label="Fond transparent sans arrière-plan"');
    expect(html).toContain('aria-pressed="true"');
    // No double border on Transparent button
    expect(html).not.toContain('ring-offset');
    expect(html).not.toContain('ring-2 ring-zinc');

    // Zero external color presets in front of ColorPickerField (design contract)
    expect(html).not.toContain('aria-label="Fond blanc pur"');
    expect(html).not.toContain('aria-label="Fond noir studio profond"');
    expect(html).not.toContain('aria-label="Fond gris clair catalogue"');

    // Canonical ColorPickerField from @workspace/ui must be used
    expect(html).toContain('data-testid="color-picker-trigger"');
    expect(html).toContain('data-testid="color-picker-pipette"');

    // Without a custom color selected, renders neutral "Couleur" and no forced default hex
    expect(html).toContain('Couleur');
    expect(html).not.toContain('#2563EB');
    expect(html).not.toContain('#FF6B35');

    // Custom background image option
    expect(html).toContain('Image de fond');
  });

  it('verifies StudioCommandBar primary action uses global CSS design tokens instead of hardcoded hex', () => {
    const html = renderToString(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(RemoverStudioScene, {
          item: dummyItemDone,
          isInspecting: false,
          onBackToGallery: vi.fn(),
          onFullReset: vi.fn(),
          viewMode: 'cutout',
          onViewModeChange: vi.fn(),
          backdropType: 'transparent',
          onBackdropTypeChange: vi.fn(),
          customColor: '#ffffff',
          onCustomColorChange: vi.fn(),
          customBgUrl: null,
          customBgInputRef: { current: null },
          onCustomBgChange: vi.fn(),
          stageBackgroundStyle: {},
          isCompositing: false,
          onDownload: vi.fn(),
          onRetry: vi.fn(),
          isFr: true,
        })
      )
    );

    // Must bind to global design tokens
    expect(html).toContain('bg-[var(--accent)]');
    expect(html).toContain('hover:bg-[var(--accent-hover)]');
    // Must NOT contain hardcoded magic hex
    expect(html).not.toContain('#ff5519');
    expect(html).not.toContain('bg-[#FF6B35]');
  });
});
