import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useMarkdownToDocxWorkflow } from '@/hooks/use-markdown-to-docx-workflow';
import * as markdownToDocxLogic from '@/lib/markdown-to-docx-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');
vi.mock('@/lib/markdown-to-docx-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof markdownToDocxLogic>();
  return {
    ...actual,
    convertMarkdownToDocx: vi.fn(),
    triggerDownload: vi.fn(),
  };
});

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook() {
  let hookState: ReturnType<typeof useMarkdownToDocxWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useMarkdownToDocxWorkflow();
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

describe('useMarkdownToDocxWorkflow [TDD-Lock ECC]', () => {
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
    vi.mocked(fileHandoff.consumeHandoffText).mockReturnValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with clean default state', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.mode).toBe('upload');
    expect(hook.current.markdownInput).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.isStaged).toBe(false);
    expect(hook.current.stagedFile).toBeNull();
    expect(hook.current.sourceFormat.extension).toBe('md');
    expect(hook.current.targetFormat.extension).toBe('docx');
    hook.unmount();
  });

  it('validates and accepts a valid Markdown file', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['# Documentation'], 'proposal.md', { type: 'text/markdown' });

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

    expect(hook.current.file).toBe(validFile);
    expect(hook.current.isStaged).toBe(true);
    expect(hook.current.stagedFile).toBe(validFile);
    expect(toastMock).not.toHaveBeenCalled();
    hook.unmount();
  });

  it('switches mode to upload when validateAndSetFile is called from paste mode', () => {
    const hook = renderWorkflowHook();
    act(() => {
      hook.current.setMode('paste');
    });
    expect(hook.current.mode).toBe('paste');

    const validFile = new File(['# Doc'], 'notes.md', { type: 'text/markdown' });
    act(() => {
      hook.current.validateAndSetFile(validFile);
    });

    expect(hook.current.mode).toBe('upload');
    expect(hook.current.file).toBe(validFile);
    expect(hook.current.isStaged).toBe(true);
    hook.unmount();
  });

  it('rejects an invalid file with error toast', () => {
    const hook = renderWorkflowHook();
    const invalidFile = new File(['binary'], 'image.png', { type: 'image/png' });

    act(() => {
      hook.current.validateAndSetFile(invalidFile);
    });

    expect(hook.current.file).toBeUndefined();
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
      })
    );
    hook.unmount();
  });

  it('consumes handoff file on mount when available', () => {
    const stagedFile = new File(['# Handoff Doc'], 'handoff.md', { type: 'text/markdown' });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(stagedFile);

    const hook = renderWorkflowHook();
    expect(hook.current.file).toBe(stagedFile);
    expect(hook.current.isStaged).toBe(true);
    hook.unmount();
  });

  it('supports paste mode staging and resets properly', () => {
    const hook = renderWorkflowHook();

    act(() => {
      hook.current.setMode('paste');
      hook.current.setMarkdownInput('# Raw Notes');
      hook.current.setIsPastedStaged(true);
    });

    expect(hook.current.mode).toBe('paste');
    expect(hook.current.isStaged).toBe(true);
    expect(hook.current.stagedFile).not.toBeNull();
    expect(hook.current.stagedFile?.name).toBe('saisie-markdown.md');

    act(() => {
      hook.current.handleReset();
    });

    expect(hook.current.markdownInput).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.isStaged).toBe(false);
    expect(hook.current.stagedFile).toBeNull();
    hook.unmount();
  });

  it('executes handleConvert successfully in upload mode', async () => {
    const hook = renderWorkflowHook();
    const mockFile = new File(['# Proposal'], 'proposal.md', { type: 'text/markdown' });
    const mockResult = {
      blob: new Blob(['docx-data'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'proposal.docx',
      sizeAfter: 2048,
      sizeBefore: 120,
    };

    vi.mocked(markdownToDocxLogic.convertMarkdownToDocx).mockResolvedValue(mockResult);

    act(() => {
      hook.current.validateAndSetFile(mockFile);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(trackToolUsedMock).toHaveBeenCalledWith('markdown-to-docx', 'documents');
    expect(hook.current.result).toEqual(mockResult);
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('handles conversion errors with toast notification', async () => {
    const hook = renderWorkflowHook();
    const mockFile = new File(['# Broken'], 'broken.md', { type: 'text/markdown' });

    vi.mocked(markdownToDocxLogic.convertMarkdownToDocx).mockRejectedValue(
      new Error('DOCX generation failed')
    );

    act(() => {
      hook.current.validateAndSetFile(mockFile);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(trackToolErrorMock).toHaveBeenCalledWith('markdown-to-docx', 'conversion-error');
    expect(hook.current.result).toBeNull();
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
        description: 'DOCX generation failed',
      })
    );
    hook.unmount();
  });

  it('calls triggerDownload and opens next action modal on result', async () => {
    const hook = renderWorkflowHook();
    const mockFile = new File(['# Proposal'], 'proposal.md', { type: 'text/markdown' });
    const mockResult = {
      blob: new Blob(['docx-data'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      filename: 'output.docx',
      sizeAfter: 500,
      sizeBefore: 120,
    };

    vi.mocked(markdownToDocxLogic.convertMarkdownToDocx).mockResolvedValue(mockResult);

    act(() => {
      hook.current.validateAndSetFile(mockFile);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(hook.current.result).toEqual(mockResult);

    act(() => {
      hook.current.handleDownload();
    });

    expect(markdownToDocxLogic.triggerDownload).toHaveBeenCalledWith(mockResult.blob, mockResult.filename);

    act(() => {
      vi.advanceTimersByTime(450);
    });

    expect(hook.current.isNextActionOpen).toBe(true);
    hook.unmount();
  });

  it('consumes handoff text on mount when available', () => {
    vi.mocked(fileHandoff.consumeHandoffText).mockReturnValue('# Handoff Title\nContent here');

    const hook = renderWorkflowHook();
    expect(hook.current.mode).toBe('paste');
    expect(hook.current.markdownInput).toBe('# Handoff Title\nContent here');
    expect(hook.current.isPastedStaged).toBe(true);
    expect(hook.current.isStaged).toBe(true);
    hook.unmount();
  });

  it('responds to Escape key to reset workflow when idle', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['# Test'], 'test.md', { type: 'text/markdown' });

    act(() => {
      hook.current.validateAndSetFile(validFile);
    });
    expect(hook.current.file).toBe(validFile);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(hook.current.file).toBeUndefined();
    hook.unmount();
  });
});
