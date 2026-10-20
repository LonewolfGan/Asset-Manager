import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfRotateWorkflow } from '@/hooks/use-pdf-rotate-workflow';
import { PDFDocument } from 'pdf-lib';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfRotateWorkflow (In-Browser TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function renderHook(file?: File, pages: { pageNumber: number; dataUrl: string }[] = []) {
    let hookValue!: ReturnType<typeof usePdfRotateWorkflow>;
    function TestComponent() {
      hookValue = usePdfRotateWorkflow(file, pages, 'Erreur');
      return null;
    }

    act(() => {
      root.render(React.createElement(TestComponent));
    });

    return {
      get current() {
        return hookValue;
      },
    };
  }

  it('rotates PDF in-browser without fetch or artificial delay', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const doc = await PDFDocument.create();
    doc.addPage([200, 200]);
    const bytes = await doc.save();
    const file = new File([bytes], 'rotate_test.pdf', { type: 'application/pdf' });

    const hook = renderHook(file, [{ pageNumber: 1, dataUrl: '' }]);

    act(() => {
      hook.current.rotateSinglePage(1, 90);
    });

    let success = false;
    await act(async () => {
      success = await hook.current.handleApplyRotation();
    });

    expect(success).toBe(true);
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.filename).toBe('rotate_test_rotated.pdf');

    expect(fetchSpy).not.toHaveBeenCalled();
    const artificialDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 1000);
    expect(artificialDelays.length).toBe(0);
  });
});
