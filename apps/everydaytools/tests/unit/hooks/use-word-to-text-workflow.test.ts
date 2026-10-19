import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useWordToTextWorkflow } from '@/hooks/use-word-to-text-workflow';
import * as wordToTextLogic from '@/lib/word-to-text-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/word-to-text-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/word-to-text-logic')>();
  return {
    ...actual,
    convertWordToText: vi.fn(),
    triggerDownload: vi.fn(),
  };
});
vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook() {
  let hookState: ReturnType<typeof useWordToTextWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useWordToTextWorkflow();
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

describe('useWordToTextWorkflow [TDD-Lock ECC]', () => {
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
    expect(hook.current.sourceFormat.extension).toBe('docx');
    expect(hook.current.targetFormat.extension).toBe('txt');
    hook.unmount();
  });

  it('validates and sets a valid word file', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['mock content'], 'article.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);
    expect(hook.current.result).toBeNull();
    expect(toastMock).not.toHaveBeenCalled();
    hook.unmount();
  });

  it('rejects an invalid file format with error toast', () => {
    const hook = renderWorkflowHook();
    const invalidFile = new File(['image'], 'banner.jpg', { type: 'image/jpeg' });
    act(() => hook.current.validateAndSetFile(invalidFile));
    expect(hook.current.file).toBeUndefined();
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
    hook.unmount();
  });

  it('consumes handoff file safely on mount with single execution guard', () => {
    const stagedFile = new File(['content'], 'handoff.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(stagedFile);
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBe(stagedFile);
    hook.unmount();
  });

  it('resets workflow state when handleReset is called', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'note.docx');
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);

    act(() => hook.current.handleReset());
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.previewOpen).toBe(false);
    hook.unmount();
  });

  it('extracts plain text successfully and updates result', async () => {
    const mockResult = {
      blob: new Blob(['extracted plain text'], { type: 'text/plain' }),
      filename: 'rapport.txt',
      sizeBefore: 4096,
      sizeAfter: 1024,
      textOutput: 'extracted plain text',
    };
    vi.mocked(wordToTextLogic.convertWordToText).mockResolvedValue(mockResult);

    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'rapport.docx');
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
    expect(hook.current.result).toEqual(mockResult);
    expect(trackToolUsedMock).toHaveBeenCalledWith('word-to-text', 'documents');
    hook.unmount();
  });

  it('handles extraction error properly with toast and analytics', async () => {
    vi.mocked(wordToTextLogic.convertWordToText).mockRejectedValue(new Error('Corrupted docx archive'));

    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'bad.docx');
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
    expect(trackToolErrorMock).toHaveBeenCalledWith('word-to-text', 'conversion-error');
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive', description: 'Corrupted docx archive' })
    );
    hook.unmount();
  });

  it('triggers download with result payload', () => {
    const hook = renderWorkflowHook();
    const mockResult = {
      blob: new Blob(['text'], { type: 'text/plain' }),
      filename: 'doc.txt',
      sizeBefore: 100,
      sizeAfter: 50,
      textOutput: 'text',
    };
    // Simulate result
    vi.mocked(wordToTextLogic.convertWordToText).mockResolvedValue(mockResult);
    act(() => hook.current.validateAndSetFile(new File([''], 'doc.docx')));

    let convertPromise: Promise<void>;
    act(() => {
      convertPromise = hook.current.handleConvert();
    });

    act(() => hook.current.handleDownload());
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
