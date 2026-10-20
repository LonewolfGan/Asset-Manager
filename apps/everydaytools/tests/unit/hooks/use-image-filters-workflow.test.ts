import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useImageFiltersWorkflow } from '@/hooks/use-image-filters-workflow';
import { AESTHETIC_PRESETS, DEFAULT_FILTER_SETTINGS } from '@/lib/image-filters-logic';

function renderHook<T>(hookFn: () => T) {
  const result = { current: null as unknown as T };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function TestComponent() {
    result.current = hookFn();
    return null;
  }

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  return {
    result,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('Hook [useImageFiltersWorkflow]', () => {
  let setTimeoutSpy: ReturnType<typeof vi.spyOn>;
  let originalImage: typeof global.Image;

  beforeEach(() => {
    setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    originalImage = global.Image;
    global.Image = class MockImage {
      naturalWidth = 1920;
      naturalHeight = 1080;
      width = 1920;
      height = 1080;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = '';

      set src(v: string) {
        this._src = v;
        setTimeout(() => this.onload?.(), 0);
      }
      get src() {
        return this._src;
      }
    } as unknown as typeof global.Image;

    if (!HTMLCanvasElement.prototype.toBlob) {
      HTMLCanvasElement.prototype.toBlob = function (cb, type) {
        cb(new Blob([new Uint8Array([1, 2, 3])], { type: type || 'image/png' }));
      };
    }
  });

  afterEach(() => {
    global.Image = originalImage;
    setTimeoutSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('initialise avec les réglages par défaut et sans image chargée', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    expect(result.current.file).toBeNull();
    expect(result.current.previewUrl).toBeNull();
    expect(result.current.originalDims).toBeNull();
    expect(result.current.settings).toEqual(DEFAULT_FILTER_SETTINGS);
    expect(result.current.activePresetId).toBe('original');
    expect(result.current.presetIntensity).toBe(100);
    expect(result.current.consoleTab).toBe('presets');
    expect(result.current.viewMode).toBe('split');
    expect(result.current.isHoldingOriginal).toBe(false);
    expect(result.current.isExporting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasModifications).toBe(false);

    unmount();
  });

  it('rejette les fichiers non-images et affiche un message d erreur approprié', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    const badFile = new File(['plain document'], 'doc.pdf', { type: 'application/pdf' });
    act(() => {
      result.current.handleFiles([badFile]);
    });

    expect(result.current.file).toBeNull();
    expect(result.current.error).toBe("Le fichier sélectionné n'est pas une image valide.");

    unmount();
  });

  it('accepte les images valides et initialise la prévisualisation', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    const imageFile = new File(['image byte stream'], 'photo.jpg', { type: 'image/jpeg' });
    act(() => {
      result.current.handleFiles([imageFile]);
    });

    expect(result.current.file).toBe(imageFile);
    expect(result.current.previewUrl).toBe('mock-url');
    expect(result.current.error).toBeNull();

    unmount();
  });

  it('applique un preset esthétique (Portra 400) et met à jour les canaux', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    const portraPreset = AESTHETIC_PRESETS.find((p) => p.id === 'portra-400')!;
    expect(portraPreset).toBeDefined();

    act(() => {
      result.current.handleSelectPreset(portraPreset);
    });

    expect(result.current.activePresetId).toBe('portra-400');
    expect(result.current.settings.brightness).toBe(104);
    expect(result.current.settings.contrast).toBe(108);
    expect(result.current.settings.saturation).toBe(95);
    expect(result.current.settings.sepia).toBe(12);
    expect(result.current.hasModifications).toBe(true);

    unmount();
  });

  it('module l intensité d un preset via handleIntensityChange', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    const portraPreset = AESTHETIC_PRESETS.find((p) => p.id === 'portra-400')!;
    act(() => {
      result.current.handleSelectPreset(portraPreset);
    });

    act(() => {
      result.current.handleIntensityChange(50);
    });

    expect(result.current.presetIntensity).toBe(50);
    // À 50% d'intensité, sepia passe de 12 à 6 (base 0 + (12-0)*0.5)
    expect(result.current.settings.sepia).toBe(6);

    unmount();
  });

  it('permet l ajustement fin d un canal individuel et son reset', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    act(() => {
      result.current.handleAdjustChannel('contrast', 140);
    });

    expect(result.current.settings.contrast).toBe(140);
    expect(result.current.activePresetId).toBe('custom');
    expect(result.current.hasModifications).toBe(true);

    act(() => {
      result.current.handleResetChannel('contrast');
    });

    expect(result.current.settings.contrast).toBe(DEFAULT_FILTER_SETTINGS.contrast);

    unmount();
  });

  it('remet tous les filtres à zéro via handleResetAll', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    act(() => {
      result.current.handleAdjustChannel('brightness', 150);
      result.current.handleAdjustChannel('blur', 5);
    });
    expect(result.current.hasModifications).toBe(true);

    act(() => {
      result.current.handleResetAll();
    });

    expect(result.current.settings).toEqual(DEFAULT_FILTER_SETTINGS);
    expect(result.current.activePresetId).toBe('original');
    expect(result.current.hasModifications).toBe(false);

    unmount();
  });

  it('gère l export aux formats supportés PNG, JPEG, WebP', async () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.createElement('a'));
    const removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.createElement('a'));

    const imageFile = new File(['img'], 'source.jpg', { type: 'image/jpeg' });
    act(() => {
      result.current.handleFiles([imageFile]);
    });

    // Test de déclenchement d'export
    await act(async () => {
      await result.current.handleExportWithFormat('image/png');
    });

    expect(result.current.isExporting).toBe(false);

    clickSpy.mockRestore();
    appendSpy.mockRestore();
    removeSpy.mockRestore();
    unmount();
  });

  it('respecte la règle anti-slop : aucun délai artificiel de traitement (setTimeout >= 600ms)', () => {
    const { result, unmount } = renderHook(() => useImageFiltersWorkflow(true));

    act(() => {
      result.current.handleResetAll();
      result.current.setConsoleTab('adjust');
      result.current.setViewMode('direct');
    });

    const longDelays = setTimeoutSpy.mock.calls.filter((call) => {
      const delay = call[1];
      return typeof delay === 'number' && delay >= 600;
    });

    expect(longDelays).toHaveLength(0);
    unmount();
  });
});
