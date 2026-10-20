import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfPageNumbersWorkflow } from '@/hooks/use-pdf-page-numbers-workflow';
import { PDFDocument } from 'pdf-lib';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfPageNumbersWorkflow (In-Browser TDD)', () => {
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

  function renderHook() {
    let hookValue!: ReturnType<typeof usePdfPageNumbersWorkflow>;
    function TestComponent() {
      hookValue = usePdfPageNumbersWorkflow({
        isFr: true,
        tc: { error: 'Erreur' },
      });
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

  it('does NOT call fetch or setTimeout >= 800ms during page numbering', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const doc = await PDFDocument.create();
    doc.addPage([200, 200]);
    doc.addPage([200, 200]);
    const bytes = await doc.save();
    const file = new File([bytes], 'sample.pdf', { type: 'application/pdf' });

    const hook = renderHook();

    act(() => {
      hook.current.validateAndSetFile(file);
      hook.current.setPosition('bottom-right');
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.filename).toBe('sample_numbered.pdf');

    expect(fetchSpy).not.toHaveBeenCalled();
    const artificialDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 800);
    expect(artificialDelays.length).toBe(0);
  });
});
