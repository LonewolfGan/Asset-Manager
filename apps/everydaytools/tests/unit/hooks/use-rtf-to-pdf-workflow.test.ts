import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useRtfToPdfWorkflow } from '@/hooks/use-rtf-to-pdf-workflow';
import * as rtfToPdfLogic from '@/lib/rtf-to-pdf-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');
vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
      tools: { 'rtf-to-pdf': { title: 'RTF to PDF', description: 'Convert RTF to PDF.' } },
      rtfToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Converting...',
        convertAnother: 'Change file',
        downloadPdf: 'Download PDF',
        error: 'Failed to convert RTF.',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

vi.mock('@/lib/rtf-to-pdf-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof rtfToPdfLogic>();
  return {
    ...actual,
    convertRtfToPdf: vi.fn(),
    triggerDownload: vi.fn(),
    openPreview: vi.fn(),
  };
});

function renderWorkflowHook() {
  const resultRef: { current: ReturnType<typeof useRtfToPdfWorkflow> | null } = { current: null };
  function TestComponent() {
    resultRef.current = useRtfToPdfWorkflow();
    return null;
  }

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  return {
    get current() {
      return resultRef.current!;
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('useRtfToPdfWorkflow Hook [TDD-Lock ECC]', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with clean default states', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.sourceFormat.extension).toBe('rtf');
    expect(hook.current.targetFormat.extension).toBe('pdf');
    hook.unmount();
  });

  it('validates and stages a valid RTF file', () => {
    const hook = renderWorkflowHook();
    const file = new File(['{\\rtf1 mock}'], 'sample.rtf', {
      type: 'application/rtf',
    });

    act(() => {
      hook.current.validateAndSetFile(file);
    });

    expect(hook.current.file).toBe(file);
    expect(hook.current.result).toBeNull();
    hook.unmount();
  });

  it('rejects invalid file with toast notification', () => {
    const toastSpy = vi.spyOn(toastModule, 'toast');
    const hook = renderWorkflowHook();
    const invalidFile = new File(['bad'], 'script.exe', { type: '' });

    act(() => {
      hook.current.validateAndSetFile(invalidFile);
    });

    expect(hook.current.file).toBeUndefined();
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    );
    hook.unmount();
  });

  it('consumes handoff file on mount when available', () => {
    const handoffFile = new File(['{\\rtf1 handoff}'], 'handoff.rtf', {
      type: 'application/rtf',
    });
    vi.spyOn(fileHandoff, 'consumeHandoffFile').mockReturnValue(handoffFile);

    const hook = renderWorkflowHook();
    expect(hook.current.file).toBe(handoffFile);
    hook.unmount();
  });

  it('handles drag over, drag leave, and drop events properly', () => {
    const hook = renderWorkflowHook();

    act(() => {
      hook.current.handleDragOver({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as any);
    });
    expect(hook.current.isDragging).toBe(true);

    act(() => {
      hook.current.handleDragLeave();
    });
    expect(hook.current.isDragging).toBe(false);

    const droppedFile = new File(['{\\rtf1 drop}'], 'dropped.rtf', {
      type: 'application/rtf',
    });
    act(() => {
      hook.current.handleDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [droppedFile] },
      } as any);
    });
    expect(hook.current.file).toBe(droppedFile);
    hook.unmount();
  });

  it('resets workflow state cleanly', () => {
    const hook = renderWorkflowHook();
    const file = new File(['mock'], 'sample.rtf', { type: 'application/rtf' });
    act(() => hook.current.validateAndSetFile(file));
    expect(hook.current.file).toBeDefined();

    act(() => hook.current.handleReset());
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    hook.unmount();
  });

  it('converts rtf file successfully and updates state', async () => {
    const mockBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    const mockResult: rtfToPdfLogic.RtfToPdfResult = {
      blob: mockBlob,
      filename: 'sample.pdf',
      sizeBefore: 120,
      sizeAfter: 340,
    };
    vi.mocked(rtfToPdfLogic.convertRtfToPdf).mockResolvedValue(mockResult);

    const hook = renderWorkflowHook();
    const file = new File(['{\\rtf1 content}'], 'sample.rtf', {
      type: 'application/rtf',
    });
    act(() => hook.current.validateAndSetFile(file));

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(hook.current.result).toEqual(mockResult);
    expect(hook.current.isProcessing).toBe(false);
    expect(analyticsModule.trackToolUsed).toHaveBeenCalledWith('rtf-to-pdf', 'documents');
    hook.unmount();
  });

  it('handles conversion errors with toast notification', async () => {
    vi.mocked(rtfToPdfLogic.convertRtfToPdf).mockRejectedValue(new Error('Server failure'));
    const toastSpy = vi.spyOn(toastModule, 'toast');

    const hook = renderWorkflowHook();
    const file = new File(['{\\rtf1 content}'], 'sample.rtf', {
      type: 'application/rtf',
    });
    act(() => hook.current.validateAndSetFile(file));

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    );
    expect(analyticsModule.trackToolError).toHaveBeenCalledWith('rtf-to-pdf', 'conversion-error');
    hook.unmount();
  });

  it('triggers download, invokes logic and opens next action modal', () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    const mockResult = {
      blob: fakeBlob,
      filename: 'sample.pdf',
      sizeBefore: 120,
      sizeAfter: 340,
    };
    const hook = renderWorkflowHook();
    act(() => {
      (hook.current as any).setResult?.(mockResult);
    });

    act(() => hook.current.handleDownload());
    expect(rtfToPdfLogic.triggerDownload).toHaveBeenCalledWith(fakeBlob, 'sample.pdf');
    expect(hook.current.isNextActionOpen).toBe(true);
    hook.unmount();
  });

  it('handles Escape keyboard shortcut to reset staged state', () => {
    const hook = renderWorkflowHook();
    const file = new File(['mock'], 'sample.rtf', { type: 'application/rtf' });
    act(() => hook.current.validateAndSetFile(file));
    expect(hook.current.file).toBeDefined();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(hook.current.file).toBeUndefined();
    hook.unmount();
  });
});
