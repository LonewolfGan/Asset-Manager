import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useHtmlToMarkdownWorkflow } from '@/hooks/use-html-to-markdown-workflow';
import * as htmlToMarkdownLogic from '@/lib/html-to-markdown-logic';
import * as fileHandoff from '@/lib/file-handoff';
import * as toastModule from '@/hooks/use-toast';
import * as analyticsModule from '@/lib/analytics';

vi.mock('@/lib/html-to-markdown-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/html-to-markdown-logic')>();
  return { ...actual, convertHtmlToMarkdown: vi.fn(), triggerDownload: vi.fn() };
});
vi.mock('@/lib/file-handoff');
vi.mock('@/hooks/use-toast');
vi.mock('@/lib/analytics');

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook(options?: { isFr?: boolean }) {
  let hookState: ReturnType<typeof useHtmlToMarkdownWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(React.createElement(() => {
      hookState = useHtmlToMarkdownWorkflow(options);
      return null;
    }));
  });

  return {
    get current() { return hookState; },
    unmount() { act(() => root.unmount()); container.remove(); },
  };
}

describe('useHtmlToMarkdownWorkflow [TDD-Lock ECC]', () => {
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

  afterEach(() => { vi.useRealTimers(); });

  it('initializes with clean default states and format descriptors', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.htmlInput).toBe('');
    expect(hook.current.mode).toBe('upload');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.previewOpen).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.isStaged).toBe(false);
    expect(hook.current.sourceFormat.name).toBe('HTML');
    expect(hook.current.targetFormat.name).toBe('Markdown');
    hook.unmount();
  });

  it('switches mode between upload and paste', () => {
    const hook = renderWorkflowHook();
    act(() => hook.current.setMode('paste'));
    expect(hook.current.mode).toBe('paste');
    act(() => hook.current.setMode('upload'));
    expect(hook.current.mode).toBe('upload');
    hook.unmount();
  });

  it('rejects invalid file on validateAndSetFile and displays destructive toast', async () => {
    const hook = renderWorkflowHook({ isFr: true });
    const invalidFile = new File(['binary content'], 'archive.zip', { type: 'application/zip' });
    await act(async () => { await hook.current.validateAndSetFile(invalidFile); });
    expect(hook.current.file).toBeUndefined();
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive', title: 'Format ou taille invalide' }));
    hook.unmount();
  });

  it('accepts valid HTML file, reads content, and stages file', async () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['<h1>Title</h1>'], 'index.html', { type: 'text/html' });
    await act(async () => { await hook.current.validateAndSetFile(validFile); });
    expect(hook.current.file).toBe(validFile);
    expect(hook.current.htmlInput).toBe('<h1>Title</h1>');
    expect(hook.current.isStaged).toBe(true);
    expect(hook.current.stagedFile).toBe(validFile);
    hook.unmount();
  });

  it('consumes staged handoff file at mount idempotently', async () => {
    const stagedFile = new File(['<p>Staged</p>'], 'staged.html', { type: 'text/html' });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValueOnce(stagedFile);
    const hook = renderWorkflowHook();
    await act(async () => {});
    expect(hook.current.file).toBe(stagedFile);
    hook.unmount();
  });

  it('stages pasted html input correctly in paste mode', () => {
    const hook = renderWorkflowHook({ isFr: false });
    act(() => {
      hook.current.setMode('paste');
      hook.current.setHtmlInput('<p>Pasted content</p>');
      hook.current.setIsPastedStaged(true);
    });
    expect(hook.current.isStaged).toBe(true);
    expect(hook.current.stagedFile).not.toBeNull();
    expect(hook.current.stagedFile?.name).toBe('html-code.html');
    hook.unmount();
  });

  it('converts HTML to Markdown successfully with stagedFile filename fallback', async () => {
    vi.mocked(htmlToMarkdownLogic.convertHtmlToMarkdown).mockResolvedValueOnce('# Title\n\nContent');
    const hook = renderWorkflowHook({ isFr: false });
    act(() => {
      hook.current.setMode('paste');
      hook.current.setHtmlInput('<h1>Title</h1><p>Content</p>');
      hook.current.setIsPastedStaged(true);
    });

    let convertPromise: Promise<void>;
    act(() => { convertPromise = hook.current.handleConvert(); });
    expect(hook.current.isProcessing).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1000);
      await convertPromise;
    });

    expect(trackToolUsedMock).toHaveBeenCalledWith('html-to-markdown', 'textCode');
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.filename).toBe('html-code.md');
    expect(hook.current.result?.textOutput).toBe('# Title\n\nContent');
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('handles conversion errors with tracking and destructive toast', async () => {
    vi.mocked(htmlToMarkdownLogic.convertHtmlToMarkdown).mockRejectedValueOnce(new Error('Parser failure'));
    const hook = renderWorkflowHook({ isFr: true });
    const validFile = new File(['<bad html>'], 'bad.html', { type: 'text/html' });
    await act(async () => { await hook.current.validateAndSetFile(validFile); });

    let convertPromise: Promise<void>;
    act(() => { convertPromise = hook.current.handleConvert(); });
    await act(async () => {
      vi.advanceTimersByTime(1000);
      try { await convertPromise; } catch {}
    });

    expect(trackToolErrorMock).toHaveBeenCalledWith('html-to-markdown', 'conversion-error');
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive', title: 'Erreur de conversion' }));
    hook.unmount();
  });

  it('triggers download and schedules next action modal opening after 450ms', async () => {
    vi.mocked(htmlToMarkdownLogic.convertHtmlToMarkdown).mockResolvedValueOnce('## Section');
    const hook = renderWorkflowHook();

    act(() => hook.current.handleDownload());
    expect(htmlToMarkdownLogic.triggerDownload).not.toHaveBeenCalled();

    await act(async () => {
      await hook.current.validateAndSetFile(new File(['<h2>Section</h2>'], 'page.html', { type: 'text/html' }));
    });

    let convertPromise: Promise<void>;
    act(() => { convertPromise = hook.current.handleConvert(); });
    await act(async () => {
      vi.advanceTimersByTime(1000);
      await convertPromise;
    });
    expect(hook.current.result).not.toBeNull();

    act(() => hook.current.handleDownload());
    expect(htmlToMarkdownLogic.triggerDownload).toHaveBeenCalledWith(hook.current.result?.blob, hook.current.result?.filename);
    expect(hook.current.isNextActionOpen).toBe(false);

    act(() => vi.advanceTimersByTime(450));
    expect(hook.current.isNextActionOpen).toBe(true);
    hook.unmount();
  });

  it('clears state completely on handleReset', async () => {
    const hook = renderWorkflowHook();
    await act(async () => {
      await hook.current.validateAndSetFile(new File(['<html/>'], 'test.html', { type: 'text/html' }));
    });
    expect(hook.current.file).toBeDefined();
    expect(hook.current.htmlInput).toBe('<html/>');

    act(() => hook.current.handleReset());
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.htmlInput).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    hook.unmount();
  });

  it('resets workflow on Escape key when resting without open dialog', async () => {
    const hook = renderWorkflowHook();
    await act(async () => {
      await hook.current.validateAndSetFile(new File(['<html/>'], 'test.html', { type: 'text/html' }));
    });
    expect(hook.current.file).toBeDefined();

    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
    expect(hook.current.file).toBeUndefined();
    hook.unmount();
  });
});
