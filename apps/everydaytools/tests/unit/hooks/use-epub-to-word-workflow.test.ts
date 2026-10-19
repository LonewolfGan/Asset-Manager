import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useEpubToWordWorkflow } from '@/hooks/use-epub-to-word-workflow';
import * as epubConverterLogic from '@/lib/epub-converter-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/epub-converter-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/epub-converter-logic')>();
  return {
    ...actual,
    convertEpub: vi.fn(),
    triggerDownload: vi.fn(),
  };
});
vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook(options?: { isFr?: boolean }) {
  let hookState: ReturnType<typeof useEpubToWordWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useEpubToWordWorkflow(options);
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

describe('useEpubToWordWorkflow [TDD-Lock ECC]', () => {
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
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.sourceFormat.extension).toBe('epub');
    expect(hook.current.targetFormat.extension).toBe('docx');
    hook.unmount();
  });

  it('validates and sets a valid epub file', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['mock content'], 'book.epub', {
      type: 'application/epub+zip',
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
    const handoffFile = new File(['epub-data'], 'staged-file.epub', {
      type: 'application/epub+zip',
    });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(handoffFile);

    const hook = renderWorkflowHook();
    expect(hook.current.file).toBe(handoffFile);
    hook.unmount();
  });

  it('resets workflow state when handleReset is called', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'test.epub', { type: 'application/epub+zip' });

    act(() => {
      hook.current.validateAndSetFile(validFile);
      hook.current.setIsNextActionOpen(true);
    });

    expect(hook.current.file).toBe(validFile);
    expect(hook.current.isNextActionOpen).toBe(true);

    act(() => {
      hook.current.handleReset();
    });

    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isNextActionOpen).toBe(false);
    hook.unmount();
  });

  it('converts epub to word successfully and updates result', async () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'novel.epub', { type: 'application/epub+zip' });
    const mockResult = {
      blob: new Blob(['docx binary'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'novel.docx',
      sizeBefore: 120,
      sizeAfter: 85,
    };

    vi.mocked(epubConverterLogic.convertEpub).mockResolvedValue(mockResult);

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

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
    expect(trackToolUsedMock).toHaveBeenCalledWith('epub-to-word', 'documents');
    hook.unmount();
  });

  it('handles conversion error properly with toast and analytics', async () => {
    const hook = renderWorkflowHook({ isFr: true });
    const validFile = new File(['content'], 'broken.epub', { type: 'application/epub+zip' });

    vi.mocked(epubConverterLogic.convertEpub).mockRejectedValue(
      new Error('Corrupted EPUB container')
    );

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

    let convertPromise: Promise<void>;
    act(() => {
      convertPromise = hook.current.handleConvert();
    });

    await act(async () => {
      try {
        await convertPromise;
      } catch {
        // error handled
      }
    });

    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(trackToolErrorMock).toHaveBeenCalledWith('epub-to-word', 'conversion_error');
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive', description: 'Corrupted EPUB container' })
    );
    hook.unmount();
  });

  it('triggers download with result payload and opens next actions after delay', async () => {
    const hook = renderWorkflowHook();
    const mockResult = {
      blob: new Blob(['binary'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'doc.docx',
      sizeBefore: 100,
      sizeAfter: 50,
    };
    vi.mocked(epubConverterLogic.convertEpub).mockResolvedValue(mockResult);
    act(() => hook.current.validateAndSetFile(new File([''], 'doc.epub', { type: 'application/epub+zip' })));

    let convertPromise: Promise<void>;
    act(() => {
      convertPromise = hook.current.handleConvert();
    });
    await act(async () => {
      await convertPromise;
    });

    act(() => hook.current.handleDownload());
    expect(epubConverterLogic.triggerDownload).toHaveBeenCalledWith(
      mockResult.blob,
      mockResult.filename
    );

    expect(hook.current.isNextActionOpen).toBe(false);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(hook.current.isNextActionOpen).toBe(true);
    hook.unmount();
  });

  it('handles Escape key to reset workflow when idle', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['content'], 'novel.epub', { type: 'application/epub+zip' });
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
    const validFile = new File(['content'], 'novel.epub', { type: 'application/epub+zip' });
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);

    act(() => hook.current.setIsNextActionOpen(true));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(hook.current.file).toBe(validFile);

    hook.unmount();
  });
});
