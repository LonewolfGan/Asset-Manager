import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useImageCropWorkflow } from '@/hooks/use-image-crop-workflow';
// TDD Tests for useImageCropWorkflow hook

function renderCropHook() {
  const result: { current: ReturnType<typeof useImageCropWorkflow> } = {
    current: null as unknown as ReturnType<typeof useImageCropWorkflow>,
  };
  const container = document.createElement('div');
  const root = createRoot(container);

  function TestHookComponent() {
    result.current = useImageCropWorkflow();
    return null;
  }

  act(() => {
    root.render(React.createElement(TestHookComponent));
  });

  return {
    result,
    rerender: () => act(() => root.render(React.createElement(TestHookComponent))),
    unmount: () => act(() => root.unmount()),
  };
}

describe('useImageCropWorkflow hook (In-Browser Execution & Anti-Artificial Delays)', () => {
  let originalImage: typeof global.Image;

  beforeEach(() => {
    originalImage = global.Image;
    global.Image = class MockImage {
      naturalWidth = 1600;
      naturalHeight = 1200;
      width = 1600;
      height = 1200;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = '';

      set src(v: string) {
        this._src = v;
        if (v.includes('fail-image')) {
          setTimeout(() => this.onerror?.(), 0);
        } else {
          setTimeout(() => this.onload?.(), 0);
        }
      }
      get src() {
        return this._src;
      }
    } as unknown as typeof global.Image;
  });

  afterEach(() => {
    global.Image = originalImage;
    vi.clearAllMocks();
  });

  it('initialise le workflow de recadrage avec un état vierge', () => {
    const { result, unmount } = renderCropHook();

    expect(result.current.file).toBeNull();
    expect(result.current.files).toHaveLength(0);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.isModified).toBe(false);

    unmount();
  });

  it('rejette les fichiers invalides et affiche une erreur', () => {
    const { result, unmount } = renderCropHook();
    const pdfFile = new File(['pdf-binary'], 'doc.pdf', { type: 'application/pdf' });

    act(() => {
      result.current.validateAndSetFile(pdfFile);
    });

    expect(result.current.error).toMatch(/valide/i);
    expect(result.current.file).toBeNull();

    unmount();
  });

  it('calcule le cadre de recadrage par défaut lors du chargement de l’image', async () => {
    const { result, unmount } = renderCropHook();
    const validImg = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });

    await vi.waitFor(() => {
      expect(result.current.origW).toBe(1600);
      expect(result.current.origH).toBe(1200);
      expect(result.current.crop.w).toBeGreaterThan(0);
      expect(result.current.crop.h).toBeGreaterThan(0);
    });

    unmount();
  });

  it('ajuste le rectangle de recadrage lors de la sélection d’un preset (1:1, 16:9)', async () => {
    const { result, unmount } = renderCropHook();
    const validImg = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });
    await vi.waitFor(() => expect(result.current.origW).toBe(1600));

    // Sélection preset 1:1
    act(() => {
      result.current.handleSelectAspectPreset(1);
    });

    expect(result.current.aspectRatio).toBe(1);
    expect(result.current.crop.w).toBe(result.current.crop.h);

    unmount();
  });

  it('inverse l’orientation (swap orientation) en conservant les proportions', async () => {
    const { result, unmount } = renderCropHook();
    const validImg = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });
    await vi.waitFor(() => expect(result.current.origW).toBe(1600));

    act(() => {
      result.current.handleSelectAspectPreset(16 / 9);
    });
    const initialRatio = result.current.aspectRatio;

    act(() => {
      result.current.handleSwapOrientation();
    });

    expect(result.current.aspectRatio).toBeCloseTo(1 / (initialRatio ?? 1), 2);

    unmount();
  });

  it('exécute le recadrage in-browser sans latence artificielle (< 600ms)', async () => {
    const { result, unmount } = renderCropHook();
    const validImg = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });
    await vi.waitFor(() => expect(result.current.origW).toBe(1600));

    const startTime = performance.now();
    await act(async () => {
      await result.current.handleProcessCrop();
    });
    const duration = performance.now() - startTime;

    expect(duration).toBeLessThan(600);
    expect(result.current.isProcessing).toBe(false);

    unmount();
  });

  it('gère les erreurs et réinitialise isProcessing lors d’une panne', async () => {
    const { result, unmount } = renderCropHook();
    const validImg = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });
    await vi.waitFor(() => expect(result.current.origW).toBe(1600));

    // Forcer une boîte de crop invalide
    act(() => {
      result.current.setCrop({ x: 0, y: 0, w: 0, h: 0 });
    });

    await act(async () => {
      await result.current.handleProcessCrop();
    });

    expect(result.current.isProcessing).toBe(false);

    unmount();
  });

  it('nettoie les ressources lors d’un reset complet', async () => {
    const { result, unmount } = renderCropHook();
    const validImg = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });
    await vi.waitFor(() => expect(result.current.previewUrl).not.toBeNull());

    act(() => {
      result.current.handleFullReset();
    });

    expect(result.current.file).toBeNull();
    expect(result.current.previewUrl).toBeNull();
    expect(result.current.crop).toEqual({ x: 0, y: 0, w: 100, h: 100 });
    expect(URL.revokeObjectURL).toHaveBeenCalled();

    unmount();
  });
});
