import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useFaviconWorkflow } from '@/hooks/use-favicon-workflow';

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

describe('Hook [useFaviconWorkflow]', () => {
  let setTimeoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    // Ensure HTMLCanvasElement.toBlob is available in test runner
    if (!HTMLCanvasElement.prototype.toBlob) {
      HTMLCanvasElement.prototype.toBlob = function (cb, type) {
        cb(new Blob([new Uint8Array([1, 2, 3])], { type: type || 'image/png' }));
      };
    }
  });

  afterEach(() => {
    setTimeoutSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('initialise avec les paramètres par défaut conformes au contrat de design', () => {
    const { result, unmount } = renderHook(() => useFaviconWorkflow(true));

    expect(result.current.file).toBeNull();
    expect(result.current.sourceUrl).toBe('');
    expect(result.current.dimensions).toBeNull();
    expect(result.current.padding).toBe(10);
    expect(result.current.bgColor).toBe('transparent');
    expect(result.current.previewShape).toBe('squircle');
    expect(result.current.stageView).toBe('browser');
    expect(result.current.browserTheme).toBe('light');
    expect(result.current.isModified).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
    expect(result.current.activeCodeTab).toBe('html');

    unmount();
  });

  it('gère les modifications de paramètres et active le flag isModified', () => {
    const { result, unmount } = renderHook(() => useFaviconWorkflow(true));

    act(() => {
      result.current.setPadding(20);
    });
    expect(result.current.padding).toBe(20);
    expect(result.current.isModified).toBe(true);

    act(() => {
      result.current.setBgColor('#FF6B35');
    });
    expect(result.current.bgColor).toBe('#FF6B35');

    act(() => {
      result.current.setPreviewShape('circle');
    });
    expect(result.current.previewShape).toBe('circle');

    act(() => {
      result.current.handleResetAdjustments();
    });
    expect(result.current.padding).toBe(10);
    expect(result.current.bgColor).toBe('transparent');
    expect(result.current.previewShape).toBe('squircle');
    expect(result.current.isModified).toBe(false);

    unmount();
  });

  it('accepte les fichiers image valides et ignore les fichiers invalides', () => {
    const { result, unmount } = renderHook(() => useFaviconWorkflow(true));

    // Fichier non image
    const invalidFile = new File(['text content'], 'notes.txt', { type: 'text/plain' });
    act(() => {
      result.current.handleFiles([invalidFile]);
    });
    expect(result.current.file).toBeNull();

    // Image PNG valide
    const validPng = new File(['mock image'], 'logo.png', { type: 'image/png' });
    act(() => {
      result.current.handleFiles([validPng]);
    });
    expect(result.current.file).toBe(validPng);

    unmount();
  });

  it('réinitialise complètement l état lors de handleFullReset', () => {
    const { result, unmount } = renderHook(() => useFaviconWorkflow(true));

    const validPng = new File(['mock'], 'logo.png', { type: 'image/png' });
    act(() => {
      result.current.handleFiles([validPng]);
      result.current.setPadding(35);
      result.current.setBgColor('#18181B');
    });
    expect(result.current.file).not.toBeNull();

    act(() => {
      result.current.handleFullReset();
    });

    expect(result.current.file).toBeNull();
    expect(result.current.sourceUrl).toBe('');
    expect(result.current.dimensions).toBeNull();
    expect(result.current.padding).toBe(10);
    expect(result.current.bgColor).toBe('transparent');
    expect(result.current.isModified).toBe(false);

    unmount();
  });

  it('génère un téléchargement unitaire sans erreur', async () => {
    const { result, unmount } = renderHook(() => useFaviconWorkflow(true));

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    // Simuler le chargement d'une image
    const validPng = new File(['mock'], 'logo.png', { type: 'image/png' });
    act(() => {
      result.current.handleFiles([validPng]);
    });

    // Test de l'export unitaire
    await act(async () => {
      await result.current.handleDownloadSingle(32, 'favicon-32x32.png');
    });

    clickSpy.mockRestore();
    unmount();
  });

  it('fournit des extraits de code valides selon l onglet actif', () => {
    const { result, unmount } = renderHook(() => useFaviconWorkflow(true));

    expect(result.current.activeCodeSnippet).toContain('<link rel="icon"');

    act(() => {
      result.current.setActiveCodeTab('manifest');
    });
    expect(result.current.activeCodeSnippet).toContain('"display": "standalone"');

    act(() => {
      result.current.setActiveCodeTab('nextjs');
    });
    expect(result.current.activeCodeSnippet).toContain('export const metadata');

    unmount();
  });

  it('respecte strictement la règle anti-slop : aucun setTimeout artificiel >= 600ms', () => {
    const { result, unmount } = renderHook(() => useFaviconWorkflow(true));

    act(() => {
      result.current.handleResetAdjustments();
      result.current.setActiveCodeTab('html');
    });

    const longTimers = setTimeoutSpy.mock.calls.filter((call) => {
      const delay = call[1];
      return typeof delay === 'number' && delay >= 600;
    });

    expect(longTimers).toHaveLength(0);
    unmount();
  });
});
