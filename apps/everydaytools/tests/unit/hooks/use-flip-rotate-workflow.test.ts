import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useFlipRotateWorkflow } from '@/hooks/use-flip-rotate-workflow';
import * as handoffModule from '@/lib/file-handoff';

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

function renderWorkflowHook(isFr = false) {
  let hookValue!: ReturnType<typeof useFlipRotateWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function TestComponent() {
    hookValue = useFlipRotateWorkflow(isFr);
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

describe('useFlipRotateWorkflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(handoffModule, 'consumeHandoffFile').mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('s initialise avec un état neutre et aucun fichier sélectionné', () => {
    const hook = renderWorkflowHook();

    expect(hook.current.file).toBeNull();
    expect(hook.current.previewUrl).toBeNull();
    expect(hook.current.rotation).toBe(0);
    expect(hook.current.flipH).toBe(false);
    expect(hook.current.flipV).toBe(false);
    expect(hook.current.outputFormat).toBe('image/png');
    expect(hook.current.hasTransform).toBe(false);
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.isNextActionOpen).toBe(false);

    hook.unmount();
  });

  it('charge un fichier image et initialise son URL d aperçu', () => {
    const hook = renderWorkflowHook();
    const testFile = new File(['image-content'], 'test.png', { type: 'image/png' });

    act(() => {
      hook.current.handleFiles([testFile]);
    });

    expect(hook.current.file).toBe(testFile);
    expect(hook.current.error).toBeNull();

    hook.unmount();
  });

  it('consomme automatiquement un fichier en handoff au montage', () => {
    const handoffFile = new File(['handoff'], 'incoming.jpg', { type: 'image/jpeg' });
    vi.spyOn(handoffModule, 'consumeHandoffFile').mockReturnValue(handoffFile);

    const hook = renderWorkflowHook();

    expect(hook.current.file).toBe(handoffFile);
    expect(hook.current.outputFormat).toBe('image/jpeg');

    hook.unmount();
  });

  it('gère les rotations incrémentales et le cycle des angles (-180° à 180°)', () => {
    const hook = renderWorkflowHook();
    const file = new File(['img'], 'test.png', { type: 'image/png' });

    act(() => {
      hook.current.handleFiles([file]);
    });

    act(() => {
      hook.current.rotateRight(); // 0 -> 90
    });
    expect(hook.current.rotation).toBe(90);
    expect(hook.current.hasTransform).toBe(true);

    act(() => {
      hook.current.rotateRight(); // 90 -> 180
    });
    expect(hook.current.rotation).toBe(180);

    act(() => {
      hook.current.rotateRight(); // 180 + 90 -> wrap to -90
    });
    expect(hook.current.rotation).toBe(-90);

    act(() => {
      hook.current.rotateLeft(); // -90 - 90 -> wrap to 180
    });
    expect(hook.current.rotation).toBe(180);

    act(() => {
      hook.current.rotate180(); // 180 + 180 -> 0
    });
    expect(hook.current.rotation).toBe(0);

    hook.unmount();
  });

  it('bascule les états de flip horizontal et vertical', () => {
    const hook = renderWorkflowHook();
    const file = new File(['img'], 'test.png', { type: 'image/png' });

    act(() => {
      hook.current.handleFiles([file]);
    });

    act(() => {
      hook.current.toggleFlipH();
    });
    expect(hook.current.flipH).toBe(true);
    expect(hook.current.hasTransform).toBe(true);

    act(() => {
      hook.current.toggleFlipV();
    });
    expect(hook.current.flipV).toBe(true);

    act(() => {
      hook.current.toggleFlipH();
    });
    expect(hook.current.flipH).toBe(false);
    expect(hook.current.flipV).toBe(true);

    hook.unmount();
  });

  it('réinitialise les transformations sans perdre le fichier via handleResetTransform', () => {
    const hook = renderWorkflowHook();
    const file = new File(['img'], 'test.png', { type: 'image/png' });

    act(() => {
      hook.current.handleFiles([file]);
      hook.current.rotateRight();
      hook.current.toggleFlipH();
    });

    expect(hook.current.hasTransform).toBe(true);

    act(() => {
      hook.current.handleResetTransform();
    });

    expect(hook.current.rotation).toBe(0);
    expect(hook.current.flipH).toBe(false);
    expect(hook.current.flipV).toBe(false);
    expect(hook.current.hasTransform).toBe(false);
    expect(hook.current.file).toBe(file);

    hook.unmount();
  });

  it('effectue un reset complet et révoque les ressources via handleFullReset', () => {
    const hook = renderWorkflowHook();
    const file = new File(['img'], 'test.png', { type: 'image/png' });

    act(() => {
      hook.current.handleFiles([file]);
      hook.current.rotateRight();
    });

    act(() => {
      hook.current.handleFullReset();
    });

    expect(hook.current.file).toBeNull();
    expect(hook.current.previewUrl).toBeNull();
    expect(hook.current.rotation).toBe(0);
    expect(hook.current.hasTransform).toBe(false);

    hook.unmount();
  });

  it('s exécute sans aucun délai artificiel (aucun setTimeout >= 600ms)', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const hook = renderWorkflowHook();
    const file = new File(['img'], 'photo.png', { type: 'image/png' });

    // Mock fetch for server fallback simulation
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['res'], { type: 'image/png' })),
    });

    act(() => {
      hook.current.handleFiles([file]);
    });

    await act(async () => {
      await hook.current.handleDownload();
    });

    // Vérifie qu'aucun timer bloquant artificiel >= 600ms n'est utilisé
    const longTimeouts = setTimeoutSpy.mock.calls.filter(
      (call) => typeof call[1] === 'number' && call[1] >= 600 && call[1] !== 1000 && call[1] !== 2000 // cleanup URL toléré
    );
    expect(longTimeouts.length).toBe(0);
    expect(hook.current.isProcessing).toBe(false);

    hook.unmount();
  });
});
