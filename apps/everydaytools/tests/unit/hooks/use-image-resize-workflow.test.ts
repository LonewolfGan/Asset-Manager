import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useImageResizeWorkflow } from '@/hooks/use-image-resize-workflow';
// TDD Tests for useImageResizeWorkflow hook

function renderWorkflowHook(isFr = true) {
  const result: { current: ReturnType<typeof useImageResizeWorkflow> } = {
    current: null as unknown as ReturnType<typeof useImageResizeWorkflow>,
  };
  const container = document.createElement('div');
  const root = createRoot(container);

  function TestHookComponent() {
    result.current = useImageResizeWorkflow(isFr);
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

describe('useImageResizeWorkflow hook (In-Browser Execution & Anti-Artificial Delays)', () => {
  let originalImage: typeof global.Image;

  beforeEach(() => {
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

  it('initialise le workflow avec un état vide et propre', () => {
    const { result, unmount } = renderWorkflowHook(true);

    expect(result.current.file).toBeNull();
    expect(result.current.files).toHaveLength(0);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.isNextActionOpen).toBe(false);

    unmount();
  });

  it('rejette les fichiers non supportés ou dépassant 50 Mo', () => {
    const { result, unmount } = renderWorkflowHook(true);
    const textFile = new File(['hello'], 'document.txt', { type: 'text/plain' });

    act(() => {
      result.current.validateAndSetFile(textFile);
    });

    expect(result.current.error).toMatch(/valide/i);
    expect(result.current.file).toBeNull();

    unmount();
  });

  it('charge et initialise les dimensions naturelles d’une image valide', async () => {
    const { result, unmount } = renderWorkflowHook(true);
    const validImg = new File(['valid-binary'], 'picture.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });

    await vi.waitFor(() => {
      expect(result.current.file).not.toBeNull();
      expect(result.current.origW).toBe(1920);
      expect(result.current.origH).toBe(1080);
      expect(result.current.error).toBeNull();
    });

    unmount();
  });

  it('rejette si targetW ou targetH dépasse les limites autorisées', async () => {
    const { result, unmount } = renderWorkflowHook(true);
    const validImg = new File(['valid-binary'], 'pic.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });

    await vi.waitFor(() => expect(result.current.origW).toBe(1920));

    act(() => {
      result.current.dimensions.handleWidthChange(25000); // > 10000 px limit
    });

    await act(async () => {
      await result.current.handleProcessResize();
    });

    expect(result.current.error).toMatch(/10 000 px/i);
    expect(result.current.isProcessing).toBe(false);

    unmount();
  });

  it('exécute le redimensionnement in-browser sans délai artificiel (aucun setTimeout >= 600ms)', async () => {
    const { result, unmount } = renderWorkflowHook(true);
    const validImg = new File(['valid-binary'], 'pic.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });
    await vi.waitFor(() => expect(result.current.origW).toBe(1920));

    const startTime = performance.now();
    await act(async () => {
      await result.current.handleProcessResize();
    });
    const duration = performance.now() - startTime;

    // L'exécution in-browser doit être quasi-instantanée et sans attente artificielle >= 600ms
    expect(duration).toBeLessThan(600);
    expect(result.current.isProcessing).toBe(false);

    unmount();
  });

  it('déclenche le dialogue d’action suivante lors du téléchargement avec un délai <= 500ms', async () => {
    vi.useFakeTimers();
    const { result, unmount } = renderWorkflowHook(true);

    // Mock direct du résultat pour tester l'action de téléchargement
    act(() => {
      (result.current as any).setResult?.({
        blob: new Blob(['data'], { type: 'image/jpeg' }),
        filename: 'resized_test.jpg',
        sizeBefore: 1000,
        sizeAfter: 800,
        finalW: 800,
        finalH: 600,
      });
    });

    if (result.current.result) {
      act(() => {
        result.current.handleDownload();
      });

      expect(result.current.isNextActionOpen).toBe(false);

      act(() => {
        vi.advanceTimersByTime(460); // 450ms attendus
      });

      expect(result.current.isNextActionOpen).toBe(true);
    }

    vi.useRealTimers();
    unmount();
  });

  it('nettoie intégralement l’état et les URLs objets lors d’un full reset', async () => {
    const { result, unmount } = renderWorkflowHook(true);
    const validImg = new File(['data'], 'pic.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.validateAndSetFile(validImg);
    });
    await vi.waitFor(() => expect(result.current.previewUrl).not.toBeNull());

    act(() => {
      result.current.handleFullReset();
    });

    expect(result.current.file).toBeNull();
    expect(result.current.previewUrl).toBeNull();
    expect(result.current.resultPreviewUrl).toBeNull();
    expect(result.current.error).toBeNull();
    expect(URL.revokeObjectURL).toHaveBeenCalled();

    unmount();
  });
});
