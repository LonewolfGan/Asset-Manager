import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useWordToHtmlWorkflow } from '@/hooks/use-word-to-html-workflow';
import * as wordToHtmlLogic from '@/lib/word-to-html-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/word-to-html-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/word-to-html-logic')>();
  return {
    ...actual,
    convertWordToHtml: vi.fn(),
    triggerDownload: vi.fn(),
  };
});
vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook(options?: { isFr?: boolean }) {
  let hookState: ReturnType<typeof useWordToHtmlWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useWordToHtmlWorkflow(options);
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

describe('useWordToHtmlWorkflow [TDD-Lock ECC]', () => {
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
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with clean default state', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.previewOpen).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.sourceFormat.extension).toBe('docx');
    expect(hook.current.targetFormat.extension).toBe('html');
    hook.unmount();
  });

  it('validates and sets a valid word file', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['mock content'], 'test-document.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

    expect(hook.current.file).toBe(validFile);
    expect(hook.current.result).toBeNull();
    hook.unmount();
  });

  it('rejects an invalid file format with error toast', () => {
    const hook = renderWorkflowHook({ isFr: true });
    const invalidFile = new File(['bad content'], 'unsupported.pdf', {
      type: 'application/pdf',
    });

    act(() => {
      hook.current.validateAndSetFile(invalidFile);
    });

    expect(hook.current.file).toBeUndefined();
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
        title: 'Format non supporté',
      })
    );
    hook.unmount();
  });

  it('consumes handoff file safely on mount with single execution guard', () => {
    const handoffFile = new File(['word-data'], 'staged-file.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(handoffFile);

    const hook = renderWorkflowHook();
    expect(hook.current.file).toBe(handoffFile);
    hook.unmount();
  });

  it('resets workflow state when handleReset is called', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'test.docx');

    act(() => {
      hook.current.validateAndSetFile(validFile);
      hook.current.setPreviewOpen(true);
      hook.current.setIsNextActionOpen(true);
    });

    expect(hook.current.file).toBe(validFile);
    expect(hook.current.previewOpen).toBe(true);
    expect(hook.current.isNextActionOpen).toBe(true);

    act(() => {
      hook.current.handleReset();
    });

    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.previewOpen).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    hook.unmount();
  });

  it('converts word to html successfully and updates result', async () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'article.docx');
    const mockResult = {
      blob: new Blob(['<article><h1>Doc</h1></article>'], { type: 'text/html' }),
      filename: 'article.html',
      sizeBefore: 120,
      sizeAfter: 85,
      textOutput: '<article><h1>Doc</h1></article>',
    };
    vi.mocked(wordToHtmlLogic.convertWordToHtml).mockResolvedValue(mockResult);
    act(() => hook.current.validateAndSetFile(validFile));

    let convertPromise: Promise<void>;
    act(() => { convertPromise = hook.current.handleConvert(); });
    expect(hook.current.isProcessing).toBe(true);

    await act(async () => { await convertPromise; });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.result).toEqual(mockResult);
    expect(trackToolUsedMock).toHaveBeenCalledWith('word-to-html', 'documents');
    hook.unmount();
  });

  it('handles conversion error properly with toast and analytics', async () => {
    const hook = renderWorkflowHook({ isFr: true });
    const validFile = new File(['content'], 'broken.docx');
    vi.mocked(wordToHtmlLogic.convertWordToHtml).mockRejectedValue(new Error('Corrupted docx archive'));

    act(() => hook.current.validateAndSetFile(validFile));
    let convertPromise: Promise<void>;
    act(() => { convertPromise = hook.current.handleConvert(); });

    await act(async () => { await convertPromise; });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(trackToolErrorMock).toHaveBeenCalledWith('word-to-html', 'conversion-error');
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive', description: 'Corrupted docx archive' })
    );
    hook.unmount();
  });

  it('extracts html without network calls or timer delays', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const mockResult = {
      blob: new Blob(['<p>instant html</p>'], { type: 'text/html' }),
      filename: 'instant.html',
      sizeBefore: 100,
      sizeAfter: 20,
      textOutput: '<p>instant html</p>',
    };
    vi.mocked(wordToHtmlLogic.convertWordToHtml).mockResolvedValue(mockResult);

    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'instant.docx');
    act(() => hook.current.validateAndSetFile(validFile));

    let convertPromise: Promise<void>;
    act(() => { convertPromise = hook.current.handleConvert(); });

    await act(async () => { await convertPromise; });

    expect(hook.current.result).toEqual(mockResult);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
    setTimeoutSpy.mockRestore();
    hook.unmount();
  });

  it('triggers download with result payload', async () => {
    const hook = renderWorkflowHook();
    const mockResult = {
      blob: new Blob(['<p>text</p>'], { type: 'text/html' }),
      filename: 'doc.html',
      sizeBefore: 100,
      sizeAfter: 50,
      textOutput: '<p>text</p>',
    };
    vi.mocked(wordToHtmlLogic.convertWordToHtml).mockResolvedValue(mockResult);
    act(() => hook.current.validateAndSetFile(new File([''], 'doc.docx')));

    let convertPromise: Promise<void>;
    act(() => {
      convertPromise = hook.current.handleConvert();
    });
    await act(async () => {
      await convertPromise;
    });

    act(() => hook.current.handleDownload());
    expect(wordToHtmlLogic.triggerDownload).toHaveBeenCalledWith(
      mockResult.blob,
      mockResult.filename
    );
    hook.unmount();
  });

  it('handles Escape key to reset workflow when idle', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'document.docx');
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(hook.current.file).toBeUndefined();
    hook.unmount();
  });

  it('does not reset workflow on Escape when modal is open', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'document.docx');
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);

    act(() => hook.current.setPreviewOpen(true));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(hook.current.file).toBe(validFile);

    act(() => hook.current.setPreviewOpen(false));
    act(() => hook.current.setIsNextActionOpen(true));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(hook.current.file).toBe(validFile);

    hook.unmount();
  });
});
