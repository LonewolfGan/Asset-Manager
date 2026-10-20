import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import JSZip from 'jszip';
import { usePptxToImagesWorkflow } from '@/hooks/use-pptx-to-images-workflow';

// Mock UI & Telemetry side effects
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

/**
 * Harness React 19 pour tester les hooks sans dépendance externe
 */
function renderHook<T>(hookCallback: () => T) {
  const result = { current: null as unknown as T };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function HookHarness() {
    result.current = hookCallback();
    return null;
  }

  act(() => {
    root.render(React.createElement(HookHarness));
  });

  return {
    result: result as { current: T },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

/**
 * Génère un Blob ZIP valide contenant un slide PNG 1x1 base64
 */
async function createValidMockZipBlob(): Promise<Blob> {
  const zip = new JSZip();
  const valid1x1PngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  zip.file('slide_1.png', valid1x1PngBase64, { base64: true });
  return await zip.generateAsync({ type: 'blob' });
}

describe('usePptxToImagesWorkflow — TDD Regression & Performance Suite', () => {
  const originalFetch = globalThis.fetch;
  let hookHarness: ReturnType<typeof renderHook<ReturnType<typeof usePptxToImagesWorkflow>>> | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (hookHarness) {
      hookHarness.unmount();
      hookHarness = null;
    }
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('does not introduce artificial delays (>= 600ms) during conversion (Prove-It RED)', async () => {
    // 1. Mock de fetch retournant un ZIP valide avec au moins 1 fichier PNG
    const mockZipBlob = await createValidMockZipBlob();
    globalThis.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
      const urlStr = typeof url === 'string' ? url : url.toString();
      if (urlStr.includes('/api/tools/pptx-to-images')) {
        return new Response(mockZipBlob, {
          status: 200,
          headers: { 'Content-Type': 'application/zip' },
        });
      }
      return new Response(null, { status: 404 });
    });

    // 2. Espionnage de setTimeout
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    // Initialisation du hook
    hookHarness = renderHook(() => usePptxToImagesWorkflow(false));
    const { result } = hookHarness;

    // 3. Validation et staging d'un fichier PPTX valide
    const validPptxFile = new File(['dummy pptx content'], 'presentation.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    act(() => {
      result.current.validateAndSetFile(validPptxFile);
    });

    expect(result.current.file).toBe(validPptxFile);

    // 4. Exécution de handleConvert
    await act(async () => {
      await result.current.handleConvert();
    });

    // 5. Assertion TDD : aucun délai artificiel >= 600ms ne doit exister
    const artificialDelays = setTimeoutSpy.mock.calls.filter(
      ([_, delay]) => typeof delay === 'number' && delay >= 600
    );

    // RED EXPECTATION: Fails because use-pptx-to-images-workflow.ts line 128
    // triggers `new Promise((resolve) => setTimeout(resolve, 800))`
    expect(artificialDelays).toHaveLength(0);
  });

  it('validates and stages a valid PPTX presentation file', () => {
    hookHarness = renderHook(() => usePptxToImagesWorkflow(false));
    const { result } = hookHarness;

    const validFile = new File(['pptx content'], 'pitch.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    act(() => {
      result.current.validateAndSetFile(validFile);
    });

    expect(result.current.file).toBe(validFile);
    expect(result.current.slides).toEqual([]);
    expect(result.current.result).toBeNull();
  });

  it('rejects unsupported file formats and preserves clean state', () => {
    hookHarness = renderHook(() => usePptxToImagesWorkflow(false));
    const { result } = hookHarness;

    const invalidFile = new File(['corrupt content'], 'document.pdf', {
      type: 'application/pdf',
    });

    act(() => {
      result.current.validateAndSetFile(invalidFile);
    });

    expect(result.current.file).toBeUndefined();
    expect(result.current.slides).toEqual([]);
    expect(result.current.result).toBeNull();
  });

  it('clears all state when handleReset is called', () => {
    hookHarness = renderHook(() => usePptxToImagesWorkflow(false));
    const { result } = hookHarness;

    const validFile = new File(['pptx content'], 'deck.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    act(() => {
      result.current.validateAndSetFile(validFile);
    });
    expect(result.current.file).toBe(validFile);

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.file).toBeUndefined();
    expect(result.current.slides).toEqual([]);
    expect(result.current.result).toBeNull();
    expect(result.current.isProcessing).toBe(false);
  });
});
