import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useWordToPdfWorkflow } from '@/hooks/use-word-to-pdf-workflow';
import * as asyncConversion from '@/lib/async-conversion';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/async-conversion');
vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook(isFr: boolean = true) {
  let hookState: ReturnType<typeof useWordToPdfWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useWordToPdfWorkflow({ isFr });
        return null;
      })
    );
  });

  return {
    get current() {
      return hookState;
    },
    unmount() {
      act(() => root.unmount());
      container.remove();
    },
  };
}

describe('useWordToPdfWorkflow [TDD-Lock ECC]', () => {
  const toastMock = vi.fn();
  const trackToolUsedMock = vi.fn();
  const trackToolErrorMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(toastModule.toast).mockImplementation(toastMock);
    vi.mocked(analyticsModule.trackToolUsed).mockImplementation(trackToolUsedMock);
    vi.mocked(analyticsModule.trackToolError).mockImplementation(trackToolErrorMock);
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(null);
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-pdf-url');
    global.URL.revokeObjectURL = vi.fn();
    window.open = vi.fn(() => ({}) as Window);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with clean default state', () => {
    const hook = renderWorkflowHook(true);
    expect(hook.current.file).toBeNull();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.sourceFormat.extension).toBe('docx');
    expect(hook.current.targetFormat.extension).toBe('pdf');
    hook.unmount();
  });

  it('validates and sets a valid word file', () => {
    const hook = renderWorkflowHook(true);
    const validFile = new File(['dummy docx'], 'contrat.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);
    expect(hook.current.result).toBeNull();
    expect(toastMock).not.toHaveBeenCalled();
    hook.unmount();
  });

  it('rejects an invalid file and displays an error toast', () => {
    const hook = renderWorkflowHook(true);
    const invalidFile = new File(['image bytes'], 'image.png', { type: 'image/png' });
    act(() => hook.current.validateAndSetFile(invalidFile));
    expect(hook.current.file).toBeNull();
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
    hook.unmount();
  });

  it('consumes handoff file safely on mount', () => {
    const stagedFile = new File(['content'], 'handoff.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(stagedFile);
    const hook = renderWorkflowHook(true);
    expect(hook.current.file).toBe(stagedFile);
    hook.unmount();
  });

  it('resets workflow state when handleReset is invoked', () => {
    const hook = renderWorkflowHook(true);
    const validFile = new File(['content'], 'doc.docx');
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);

    act(() => hook.current.handleReset());
    expect(hook.current.file).toBeNull();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('converts word document successfully and updates result state', async () => {
    const mockBlob = new Blob(['pdf-output'], { type: 'application/pdf' });
    vi.mocked(asyncConversion.runAsyncDocumentConversion).mockResolvedValue({
      blob: mockBlob,
      filename: 'document.pdf',
      sizeAfter: 1024,
    });
    const hook = renderWorkflowHook(true);
    const validFile = new File(['content'], 'document.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    act(() => hook.current.validateAndSetFile(validFile));
    let convertPromise: Promise<void>;
    act(() => {
      convertPromise = hook.current.handleConvert();
    });
    expect(hook.current.isProcessing).toBe(true);
    await act(async () => {
      await convertPromise;
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.result).toEqual({
      blob: mockBlob,
      filename: 'document.pdf',
      sizeAfter: 1024,
      sizeBefore: validFile.size,
    });
    expect(trackToolUsedMock).toHaveBeenCalledWith('word-to-pdf', 'documents');
    hook.unmount();
  });

  it('handles conversion failure properly with toast and analytics', async () => {
    vi.mocked(asyncConversion.runAsyncDocumentConversion).mockRejectedValue(
      new Error('Gotenberg service timeout')
    );
    const hook = renderWorkflowHook(true);
    const validFile = new File(['content'], 'document.docx');
    act(() => hook.current.validateAndSetFile(validFile));

    let convertPromise: Promise<void>;
    act(() => {
      convertPromise = hook.current.handleConvert();
    });
    await act(async () => {
      await convertPromise;
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(trackToolErrorMock).toHaveBeenCalledWith('word-to-pdf', 'conversion-error');
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive', description: 'Gotenberg service timeout' })
    );
    hook.unmount();
  });

  it('downloads converted PDF with DOM attachment and delayed URL revocation', () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');
    const hook = renderWorkflowHook(true);
    const mockBlob = new Blob(['pdf-output'], { type: 'application/pdf' });

    act(() => {
      hook.current.setResult({ blob: mockBlob, filename: 'mon-contrat.pdf', sizeAfter: 500 });
    });
    act(() => hook.current.handleDownload());

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1000));
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-pdf-url');
    hook.unmount();
  });

  it('opens PDF preview in new tab or warns if popup is blocked', () => {
    const hook = renderWorkflowHook(true);
    const mockBlob = new Blob(['pdf-output'], { type: 'application/pdf' });
    act(() => {
      hook.current.setResult({ blob: mockBlob, filename: 'mon-contrat.pdf', sizeAfter: 500 });
    });

    // 1. Successful window.open
    act(() => hook.current.handleOpenPreview());
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(window.open).toHaveBeenCalledWith('blob:mock-pdf-url', '_blank');

    // 2. Blocked popup case
    vi.mocked(window.open).mockReturnValue(null);
    act(() => hook.current.handleOpenPreview());
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
        title: 'Popup bloquée',
      })
    );
    hook.unmount();
  });

  it('handles Escape key to reset workflow when idle', () => {
    const hook = renderWorkflowHook(true);
    const validFile = new File(['content'], 'document.docx');
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(hook.current.file).toBeNull();
    hook.unmount();
  });
});
