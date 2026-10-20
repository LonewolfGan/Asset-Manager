import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfSplitWorkflow } from '@/hooks/use-pdf-split-workflow';
import { PDFDocument } from 'pdf-lib';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfSplitWorkflow (In-Browser TDD)', () => {
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

  function renderHook(file: File | undefined, totalPages: number, isFr = false) {
    let hookValue!: ReturnType<typeof usePdfSplitWorkflow>;
    function TestComponent() {
      hookValue = usePdfSplitWorkflow(file, totalPages, isFr);
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

  it('does NOT call fetch or setTimeout >= 1000ms during extract split', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const doc = await PDFDocument.create();
    doc.addPage([100, 100]);
    doc.addPage([100, 100]);
    doc.addPage([100, 100]);
    const bytes = await doc.save();
    const file = new File([bytes], 'source_doc.pdf', { type: 'application/pdf' });

    const hook = renderHook(file, 3, true);

    act(() => {
      hook.current.setSelectedPages([1, 2]);
      hook.current.setExtractAsSinglePdf(true);
    });

    let success = false;
    await act(async () => {
      success = await hook.current.handleConvert();
    });

    expect(success).toBe(true);
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.isZip).toBe(false);
    expect(hook.current.result?.filename).toBe('source_doc_extraits.pdf');

    expect(fetchSpy).not.toHaveBeenCalled();
    const artificialDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 1000);
    expect(artificialDelays.length).toBe(0);
  });
});
