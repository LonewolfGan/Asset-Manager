import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useWatermarkWorkflow } from '@/hooks/use-watermark-workflow';
import * as handoffModule from '@/lib/file-handoff';
import * as watermarkLogic from '@/lib/watermark-logic';

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

function renderWatermarkHook(isFr = false) {
  let hookValue!: ReturnType<typeof useWatermarkWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function TestComponent() {
    hookValue = useWatermarkWorkflow(isFr);
    return null;
  }

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  return {
    get current() {
      return hookValue;
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('useWatermarkWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(handoffModule, 'consumeHandoffFile').mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('s initialise avec la configuration standard et sans modification', () => {
    const hook = renderWatermarkHook();

    expect(hook.current.file).toBeNull();
    expect(hook.current.previewUrl).toBeNull();
    expect(hook.current.config.text).toBe(watermarkLogic.DEFAULT_WATERMARK_CONFIG.text);
    expect(hook.current.config.mode).toBe('points');
    expect(hook.current.config.positions).toEqual(['bottom-right']);
    expect(hook.current.hasModifications).toBe(false);
    expect(hook.current.isExporting).toBe(false);
    expect(hook.current.error).toBeNull();

    hook.unmount();
  });

  it('rejette les fichiers non-images avec message d erreur et accepte les images valides', () => {
    const hook = renderWatermarkHook(true);
    const textFile = new File(['hello'], 'document.txt', { type: 'text/plain' });

    act(() => {
      hook.current.handleFiles([textFile]);
    });

    expect(hook.current.file).toBeNull();
    expect(hook.current.error).toMatch(/pas une image valide/i);

    const imageFile = new File(['image-bytes'], 'valid.png', { type: 'image/png' });
    act(() => {
      hook.current.handleFiles([imageFile]);
    });

    expect(hook.current.file).toBe(imageFile);
    expect(hook.current.error).toBeNull();

    hook.unmount();
  });

  it('charge automatiquement un fichier handoff au montage', () => {
    const staged = new File(['staged'], 'staged.webp', { type: 'image/webp' });
    vi.spyOn(handoffModule, 'consumeHandoffFile').mockReturnValue(staged);

    const hook = renderWatermarkHook();

    expect(hook.current.file).toBe(staged);

    hook.unmount();
  });

  it('détecte les modifications personnalisées de la configuration', () => {
    const hook = renderWatermarkHook();
    expect(hook.current.hasModifications).toBe(false);

    act(() => {
      hook.current.setConfig((prev) => ({ ...prev, text: 'CONFIDENTIEL' }));
    });
    expect(hook.current.hasModifications).toBe(true);

    act(() => {
      hook.current.setConfig((prev) => ({ ...prev, mode: 'tile' }));
    });
    expect(hook.current.config.mode).toBe('tile');

    hook.unmount();
  });

  it('gère la bascule des positions 9-point grid et interdit de vider la sélection', () => {
    const hook = renderWatermarkHook();

    expect(hook.current.config.positions).toEqual(['bottom-right']);

    // Ajoute 'top-left'
    act(() => {
      hook.current.handleTogglePosition('top-left');
    });
    expect(hook.current.config.positions).toEqual(['bottom-right', 'top-left']);

    // Supprime 'bottom-right'
    act(() => {
      hook.current.handleTogglePosition('bottom-right');
    });
    expect(hook.current.config.positions).toEqual(['top-left']);

    // Tente de supprimer 'top-left' alors que c'est la seule position restante
    act(() => {
      hook.current.handleTogglePosition('top-left');
    });
    // Règle d'intégrité : doit préserver au moins une position active
    expect(hook.current.config.positions).toEqual(['top-left']);

    hook.unmount();
  });

  it('réinitialise la configuration aux valeurs par défaut via handleResetConfig', () => {
    const hook = renderWatermarkHook();

    act(() => {
      hook.current.setConfig((prev) => ({
        ...prev,
        text: 'MARQUE PERSONNALISÉE',
        opacity: 30,
        mode: 'tile',
      }));
    });
    expect(hook.current.hasModifications).toBe(true);

    act(() => {
      hook.current.handleResetConfig();
    });

    expect(hook.current.config.text).toBe(watermarkLogic.DEFAULT_WATERMARK_CONFIG.text);
    expect(hook.current.config.mode).toBe('points');

    hook.unmount();
  });

  it('nettoie l ensemble des ressources et réinitialise tout via handleFullReset', () => {
    const hook = renderWatermarkHook();
    const file = new File(['img'], 'photo.png', { type: 'image/png' });

    act(() => {
      hook.current.handleFiles([file]);
      hook.current.setConfig((prev) => ({ ...prev, text: 'TEST' }));
    });

    act(() => {
      hook.current.handleFullReset();
    });

    expect(hook.current.file).toBeNull();
    expect(hook.current.previewUrl).toBeNull();
    expect(hook.current.config.text).toBe(watermarkLogic.DEFAULT_WATERMARK_CONFIG.text);
    expect(hook.current.hasModifications).toBe(false);

    hook.unmount();
  });

  it('exporte en-navigateur sans délai artificiel (aucun setTimeout >= 600ms)', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const mockBlob = new Blob(['watermarked-image-bytes'], { type: 'image/png' });
    vi.spyOn(watermarkLogic, 'renderWatermarkedBlob').mockResolvedValue(mockBlob);

    const hook = renderWatermarkHook();
    const file = new File(['img'], 'original.png', { type: 'image/png' });

    act(() => {
      hook.current.handleFiles([file]);
    });

    await act(async () => {
      await hook.current.handleExportWithFormat('png');
    });

    // Vérifie l'absence de fake delays >= 600ms
    const artificialDelays = setTimeoutSpy.mock.calls.filter(
      (call) => typeof call[1] === 'number' && call[1] >= 600 && call[1] !== 1000 // 1000ms URL revoke toléré
    );
    expect(artificialDelays).toHaveLength(0);

    expect(watermarkLogic.renderWatermarkedBlob).toHaveBeenCalledWith(file, hook.current.config, 'png', 0.94);
    expect(hook.current.isExporting).toBe(false);
    expect(hook.current.exportedResult?.filename).toBe('original_watermarked.png');

    hook.unmount();
  });
});
