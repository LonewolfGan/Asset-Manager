import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useTxtToPdfWorkflow } from '@/hooks/use-txt-to-pdf-workflow';
import * as txtToPdfLogic from '@/lib/txt-to-pdf-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    t: {
      nav: { breadcrumb: { home: 'Home', documents: 'Documents' } },
      tools: { 'txt-to-pdf': { title: 'Text to PDF', description: 'Convert plain text into PDF.' } },
      txtToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Converting...',
        convertAnother: 'Convert Another',
        downloadPdf: 'Download PDF',
        tabUpload: 'Upload',
        tabPaste: 'Paste',
        error: 'Conversion failed',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

vi.mock('@/lib/txt-to-pdf-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/txt-to-pdf-logic')>();
  return {
    ...actual,
    convertTxtToPdf: vi.fn(),
    triggerDownload: vi.fn(),
    openPdfPreview: vi.fn(),
  };
});
vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook() {
  let hookState!: ReturnType<typeof useTxtToPdfWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useTxtToPdfWorkflow();
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

describe('useTxtToPdfWorkflow (TDD Workflow States)', () => {
  const toastMock = vi.fn();
  const trackToolUsedMock = vi.fn();
  const trackToolErrorMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(toastModule.toast).mockImplementation(toastMock);
    vi.mocked(analyticsModule.trackToolUsed).mockImplementation(trackToolUsedMock);
    vi.mocked(analyticsModule.trackToolError).mockImplementation(trackToolErrorMock);
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(null);
  });

  it('initializes with expected default values', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.mode).toBe('upload');
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.files).toEqual([]);
    expect(hook.current.textInput).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.isStaged).toBe(false);
    expect(hook.current.stagedFile).toBeNull();
    hook.unmount();
  });

  it('validates and stages a valid txt file', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['Hello world'], 'doc.txt', { type: 'text/plain' });
    act(() => { hook.current.validateAndSetFile(validFile); });

    expect(hook.current.file).toBe(validFile);
    expect(hook.current.isStaged).toBe(true);
    expect(hook.current.stagedFile).toBe(validFile);
    expect(toastMock).not.toHaveBeenCalled();
    hook.unmount();
  });

  it('rejects invalid file format with error toast', () => {
    const hook = renderWorkflowHook();
    const invalidFile = new File(['%PDF-1.4'], 'wrong.pdf', { type: 'application/pdf' });
    act(() => { hook.current.validateAndSetFile(invalidFile); });

    expect(hook.current.file).toBeUndefined();
    expect(hook.current.isStaged).toBe(false);
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
    hook.unmount();
  });

  it('automatically stages handoff file on mount if present', () => {
    const handoffFile = new File(['staged note'], 'handoff.txt', { type: 'text/plain' });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(handoffFile);
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBe(handoffFile);
    expect(hook.current.isStaged).toBe(true);
    hook.unmount();
  });

  it('handles drag and drop interactions', () => {
    const hook = renderWorkflowHook();
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    act(() => { hook.current.handleDragOver({ preventDefault, stopPropagation } as any); });
    expect(hook.current.isDragging).toBe(true);

    act(() => { hook.current.handleDragLeave(); });
    expect(hook.current.isDragging).toBe(false);

    const droppedFile = new File(['Drop text'], 'dropped.txt', { type: 'text/plain' });
    act(() => {
      hook.current.handleDrop({ preventDefault, stopPropagation, dataTransfer: { files: [droppedFile] } } as any);
    });
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.file).toBe(droppedFile);
    hook.unmount();
  });

  it('handles paste mode transitions and staging', () => {
    const hook = renderWorkflowHook();
    act(() => {
      hook.current.setMode('paste');
      hook.current.setTextInput('My pasted note');
    });
    expect(hook.current.isStaged).toBe(false);

    act(() => { hook.current.setIsPastedStaged(true); });
    expect(hook.current.isStaged).toBe(true);
    expect(hook.current.stagedFile?.name).toContain('.txt');
    hook.unmount();
  });

  it('executes convert in upload mode and sets result', async () => {
    const hook = renderWorkflowHook();
    const file = new File(['Sample content'], 'test.txt', { type: 'text/plain' });
    const mockResult: txtToPdfLogic.TxtToPdfResult = {
      blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
      filename: 'test.pdf',
      sizeBefore: 14,
      sizeAfter: 120,
    };
    vi.mocked(txtToPdfLogic.convertTxtToPdf).mockResolvedValue(mockResult);

    act(() => { hook.current.validateAndSetFile(file); });
    await act(async () => { await hook.current.handleConvert(); });

    expect(trackToolUsedMock).toHaveBeenCalledWith('txt-to-pdf', 'documents');
    expect(txtToPdfLogic.convertTxtToPdf).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'upload', file })
    );
    expect(hook.current.result).toBe(mockResult);
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('handles convert failure and displays error toast', async () => {
    const hook = renderWorkflowHook();
    const file = new File(['Crash'], 'crash.txt', { type: 'text/plain' });
    vi.mocked(txtToPdfLogic.convertTxtToPdf).mockRejectedValue(new Error('PDF generation failure'));

    act(() => { hook.current.validateAndSetFile(file); });
    await act(async () => { await hook.current.handleConvert(); });

    expect(trackToolErrorMock).toHaveBeenCalledWith('txt-to-pdf', 'conversion-error');
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive', description: 'PDF generation failure' })
    );
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('triggers download and opens next action modal', async () => {
    const hook = renderWorkflowHook();
    const mockResult: txtToPdfLogic.TxtToPdfResult = {
      blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
      filename: 'test.pdf',
      sizeAfter: 120,
    };
    vi.mocked(txtToPdfLogic.convertTxtToPdf).mockResolvedValue(mockResult);
    const file = new File(['text'], 'test.txt', { type: 'text/plain' });

    act(() => { hook.current.validateAndSetFile(file); });
    await act(async () => { await hook.current.handleConvert(); });
    act(() => { hook.current.handleDownload(); });

    expect(txtToPdfLogic.triggerDownload).toHaveBeenCalledWith(mockResult.blob, 'test.pdf');
    expect(hook.current.isNextActionOpen).toBe(true);
    hook.unmount();
  });

  it('triggers open preview', async () => {
    const hook = renderWorkflowHook();
    const mockResult: txtToPdfLogic.TxtToPdfResult = {
      blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
      filename: 'test.pdf',
      sizeAfter: 120,
    };
    vi.mocked(txtToPdfLogic.convertTxtToPdf).mockResolvedValue(mockResult);
    const file = new File(['text'], 'test.txt', { type: 'text/plain' });

    act(() => { hook.current.validateAndSetFile(file); });
    await act(async () => { await hook.current.handleConvert(); });
    act(() => { hook.current.handleOpenPreview(); });

    expect(txtToPdfLogic.openPdfPreview).toHaveBeenCalledWith(mockResult.blob);
    hook.unmount();
  });

  it('resets workflow state cleanly', () => {
    const hook = renderWorkflowHook();
    const file = new File(['Hello'], 'doc.txt', { type: 'text/plain' });

    act(() => {
      hook.current.validateAndSetFile(file);
      hook.current.setTextInput('some text');
      hook.current.setIsPastedStaged(true);
      hook.current.setIsNextActionOpen(true);
    });

    act(() => { hook.current.handleReset(); });

    expect(hook.current.files).toEqual([]);
    expect(hook.current.textInput).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    hook.unmount();
  });
});
