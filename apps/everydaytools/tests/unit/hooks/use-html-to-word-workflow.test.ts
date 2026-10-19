import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useHtmlToWordWorkflow } from '@/hooks/use-html-to-word-workflow';
import * as htmlToWordLogic from '@/lib/html-to-word-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/html-to-word-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/html-to-word-logic')>();
  return {
    ...actual,
    convertHtmlToWord: vi.fn(),
    triggerDownload: vi.fn(),
  };
});
vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook(options?: { isFr?: boolean }) {
  let hookState: ReturnType<typeof useHtmlToWordWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useHtmlToWordWorkflow(options);
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

describe('useHtmlToWordWorkflow [TDD-Lock ECC]', () => {
  const toastMock = vi.fn();
  const trackToolUsedMock = vi.fn();
  const trackToolErrorMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(toastModule.toast).mockImplementation(toastMock);
    vi.mocked(analyticsModule.trackToolUsed).mockImplementation(trackToolUsedMock);
    vi.mocked(analyticsModule.trackToolError).mockImplementation(trackToolErrorMock);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default states and format descriptors', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.sourceFormat.name).toBe('HTML');
    expect(hook.current.targetFormat.name).toBe('Word');
    hook.unmount();
  });

  it('rejects invalid file on validateAndSetFile and displays destructive toast', () => {
    const hook = renderWorkflowHook({ isFr: true });
    const invalidFile = new File(['binary content'], 'archive.zip', { type: 'application/zip' });

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

  it('accepts valid HTML file and clears any previous result', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['<h1>Title</h1>'], 'index.html', { type: 'text/html' });

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

    expect(hook.current.file).toBe(validFile);
    expect(hook.current.result).toBeNull();
    hook.unmount();
  });

  it('consumes staged handoff file at mount idempotently', () => {
    const stagedFile = new File(['<p>Staged</p>'], 'staged.html', { type: 'text/html' });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValueOnce(stagedFile);

    const hook = renderWorkflowHook();
    expect(hook.current.file).toBe(stagedFile);
    hook.unmount();
  });

  it('handles drag and drop events properly', () => {
    const hook = renderWorkflowHook();

    const preventDefaultSpy = vi.fn();
    const stopPropagationSpy = vi.fn();
    const mockDragEvent = {
      preventDefault: preventDefaultSpy,
      stopPropagation: stopPropagationSpy,
    } as unknown as React.DragEvent;

    act(() => {
      hook.current.handleDragOver(mockDragEvent);
    });
    expect(hook.current.isDragging).toBe(true);

    act(() => {
      hook.current.handleDragLeave();
    });
    expect(hook.current.isDragging).toBe(false);

    const droppedFile = new File(['<p>Dropped</p>'], 'dropped.html', { type: 'text/html' });
    const mockDropEvent = {
      preventDefault: preventDefaultSpy,
      stopPropagation: stopPropagationSpy,
      dataTransfer: { files: [droppedFile] },
    } as unknown as React.DragEvent;

    act(() => {
      hook.current.handleDrop(mockDropEvent);
    });
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.file).toBe(droppedFile);
    hook.unmount();
  });

  it('converts file successfully and triggers success toast', async () => {
    const mockResult = {
      blob: new Blob(['docx bytes'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      filename: 'sample.docx',
      sizeBefore: 120,
      sizeAfter: 850,
    };
    vi.mocked(htmlToWordLogic.convertHtmlToWord).mockResolvedValueOnce(mockResult);

    const hook = renderWorkflowHook({ isFr: false });
    const validFile = new File(['<p>Convert me</p>'], 'sample.html', { type: 'text/html' });

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(trackToolUsedMock).toHaveBeenCalledWith('html-to-word', 'documents');
    expect(hook.current.result).toBe(mockResult);
    expect(hook.current.isProcessing).toBe(false);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Conversion successful',
      })
    );
    hook.unmount();
  });

  it('handles conversion errors properly with error tracking and toast', async () => {
    vi.mocked(htmlToWordLogic.convertHtmlToWord).mockRejectedValueOnce(
      new Error('Malformed HTML syntax')
    );

    const hook = renderWorkflowHook({ isFr: true });
    const validFile = new File(['<html>bad</html>'], 'bad.html', { type: 'text/html' });

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(trackToolErrorMock).toHaveBeenCalledWith('html-to-word', 'conversion_error');
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
        title: 'Erreur de conversion',
        description: 'Malformed HTML syntax',
      })
    );
    hook.unmount();
  });

  it('triggers download and schedules next action modal opening after 450ms', async () => {
    const hook = renderWorkflowHook();
    const mockResult = {
      blob: new Blob(['docx bytes']),
      filename: 'doc.docx',
      sizeBefore: 10,
      sizeAfter: 20,
    };

    // 1. Guard check when result is null
    act(() => {
      hook.current.handleDownload();
    });
    expect(htmlToWordLogic.triggerDownload).not.toHaveBeenCalled();

    // 2. Setup file and convert
    act(() => {
      hook.current.validateAndSetFile(new File(['<html/>'], 'doc.html', { type: 'text/html' }));
    });
    vi.mocked(htmlToWordLogic.convertHtmlToWord).mockResolvedValueOnce(mockResult);

    await act(async () => {
      await hook.current.handleConvert();
    });
    expect(hook.current.result).toBe(mockResult);

    // 3. Trigger download with valid result
    act(() => {
      hook.current.handleDownload();
    });
    expect(htmlToWordLogic.triggerDownload).toHaveBeenCalledWith(
      mockResult.blob,
      mockResult.filename
    );
    expect(hook.current.isNextActionOpen).toBe(false);

    // 4. Advance fake timers to verify delayed modal opening
    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(hook.current.isNextActionOpen).toBe(true);

    hook.unmount();
  });

  it('clears state on handleReset', () => {
    const hook = renderWorkflowHook();
    act(() => {
      hook.current.validateAndSetFile(new File(['html'], 'test.html', { type: 'text/html' }));
      hook.current.setIsNextActionOpen(true);
    });

    expect(hook.current.file).toBeDefined();
    expect(hook.current.isNextActionOpen).toBe(true);

    act(() => {
      hook.current.handleReset();
    });

    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isNextActionOpen).toBe(false);
    hook.unmount();
  });

  it('resets workflow on Escape key when resting without open dialog', () => {
    const hook = renderWorkflowHook();
    act(() => {
      hook.current.validateAndSetFile(new File(['html'], 'test.html', { type: 'text/html' }));
    });
    expect(hook.current.file).toBeDefined();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(hook.current.file).toBeUndefined();
    hook.unmount();
  });
});
