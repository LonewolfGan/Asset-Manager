import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfMergeWorkflow } from '@/hooks/use-pdf-merge-workflow';
import { PDFDocument } from 'pdf-lib';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfMergeWorkflow (In-Browser TDD)', () => {
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

  function renderHook(isFr = false) {
    let hookValue!: ReturnType<typeof usePdfMergeWorkflow>;
    function TestComponent() {
      hookValue = usePdfMergeWorkflow(isFr);
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

  it('does NOT call fetch or setTimeout >= 1000ms during merge', async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const hook = renderHook(true);

    const doc1 = await PDFDocument.create();
    doc1.addPage([100, 100]);
    const bytes1 = await doc1.save();
    const file1 = new File([bytes1], 'f1.pdf', { type: 'application/pdf' });

    const doc2 = await PDFDocument.create();
    doc2.addPage([100, 100]);
    const bytes2 = await doc2.save();
    const file2 = new File([bytes2], 'f2.pdf', { type: 'application/pdf' });

    act(() => {
      hook.current.handleFilesAdded([file1, file2]);
    });

    let success = false;
    await act(async () => {
      success = await hook.current.handleMerge();
    });

    expect(success).toBe(true);
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.count).toBe(2);
    expect(hook.current.result?.filename).toBe('document_fusionne.pdf');

    // Verification: Zero network upload, zero artificial delay
    expect(fetchSpy).not.toHaveBeenCalled();
    const artificialDelays = setTimeoutSpy.mock.calls.filter(([, ms]) => typeof ms === 'number' && ms >= 1000);
    expect(artificialDelays.length).toBe(0);
  });
});
