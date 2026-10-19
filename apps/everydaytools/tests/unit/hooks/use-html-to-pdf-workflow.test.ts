import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useHtmlToPdfWorkflow } from '@/hooks/use-html-to-pdf-workflow';
import * as htmlToPdfLogic from '@/lib/html-to-pdf-logic';
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
      tools: { 'html-to-pdf': { title: 'HTML to PDF', description: 'Convert HTML to PDF.' } },
      htmlToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Generating PDF...',
        convertAnother: 'Change file',
        downloadPdf: 'Download PDF',
        tabUpload: 'Upload (.html)',
        tabPaste: 'Paste HTML',
        error: 'Failed to convert HTML.',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

vi.mock('@/lib/html-to-pdf-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof htmlToPdfLogic>();
  return { ...actual, convertHtmlToPdf: vi.fn() };
});

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook() {
  let hookState!: ReturnType<typeof useHtmlToPdfWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useHtmlToPdfWorkflow();
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

describe('useHtmlToPdfWorkflow [TDD-Lock ECC]', () => {
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
    vi.restoreAllMocks();
  });

  it('initializes with default upload state', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.mode).toBe('upload');
    expect(hook.current.files).toEqual([]);
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.htmlInput).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.isStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.sourceFormat.name).toBe('HTML');
    expect(hook.current.targetFormat.name).toBe('PDF');
    hook.unmount();
  });

  it('validates and sets a valid file in upload mode', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['<h1>Test</h1>'], 'doc.html', { type: 'text/html' });
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);
    expect(hook.current.isStaged).toBe(true);
    expect(hook.current.stagedFile?.name).toBe('doc.html');
    hook.unmount();
  });

  it('rejects invalid file and triggers destructive toast', () => {
    const hook = renderWorkflowHook();
    const invalidFile = new File(['binary'], 'virus.exe', { type: 'application/x-msdownload' });
    act(() => hook.current.validateAndSetFile(invalidFile));
    expect(hook.current.file).toBeUndefined();
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
    hook.unmount();
  });

  it('consumes handoff file on mount', () => {
    const handoffFile = new File(['<p>Handoff</p>'], 'handoff.html', { type: 'text/html' });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(handoffFile);
    const hook = renderWorkflowHook();
    expect(hook.current.file?.name).toBe('handoff.html');
    expect(hook.current.isStaged).toBe(true);
    hook.unmount();
  });

  it('consumes handoff text on mount, switches to paste mode, and stages it', () => {
    vi.mocked(fileHandoff.consumeHandoffText).mockReturnValue('<h2>Handoff text</h2>');
    const hook = renderWorkflowHook();
    expect(hook.current.mode).toBe('paste');
    expect(hook.current.htmlInput).toBe('<h2>Handoff text</h2>');
    expect(hook.current.isPastedStaged).toBe(true);
    expect(hook.current.isStaged).toBe(true);
    hook.unmount();
  });

  it('resets workflow when handleReset is called', () => {
    const hook = renderWorkflowHook();
    const file = new File(['<p>Test</p>'], 'test.html', { type: 'text/html' });
    act(() => hook.current.validateAndSetFile(file));
    expect(hook.current.file).toBeDefined();
    act(() => hook.current.handleReset());
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.htmlInput).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    hook.unmount();
  });

  it('preserves htmlInput when resetting in paste mode', () => {
    const hook = renderWorkflowHook();
    act(() => {
      hook.current.setMode('paste');
      hook.current.setHtmlInput('<div>Keep me</div>');
      hook.current.setIsPastedStaged(true);
    });
    expect(hook.current.isStaged).toBe(true);
    act(() => hook.current.handleReset());
    expect(hook.current.htmlInput).toBe('<div>Keep me</div>');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.isStaged).toBe(false);
    hook.unmount();
  });

  it('handles conversion in upload mode successfully', async () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    vi.mocked(htmlToPdfLogic.convertHtmlToPdf).mockResolvedValue(fakeBlob);
    const hook = renderWorkflowHook();
    const file = new File(['<h1>Test</h1>'], 'manual.html', { type: 'text/html' });
    act(() => hook.current.validateAndSetFile(file));

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(htmlToPdfLogic.convertHtmlToPdf).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'upload', file })
    );
    expect(trackToolUsedMock).toHaveBeenCalledWith('html-to-pdf', 'documents');
    expect(hook.current.result).toEqual({
      blob: fakeBlob,
      filename: 'manual.pdf',
      sizeBefore: file.size,
      sizeAfter: fakeBlob.size,
    });
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('handles conversion in paste mode successfully', async () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    vi.mocked(htmlToPdfLogic.convertHtmlToPdf).mockResolvedValue(fakeBlob);
    const hook = renderWorkflowHook();

    act(() => {
      hook.current.setMode('paste');
      hook.current.setHtmlInput('<div>Direct snippet</div>');
      hook.current.setIsPastedStaged(true);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(htmlToPdfLogic.convertHtmlToPdf).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'paste', htmlInput: '<div>Direct snippet</div>' })
    );
    expect(hook.current.result?.filename).toMatch(/\.pdf$/);
    hook.unmount();
  });

  it('handles conversion errors gracefully', async () => {
    vi.mocked(htmlToPdfLogic.convertHtmlToPdf).mockRejectedValue(new Error('Conversion server timeout'));
    const hook = renderWorkflowHook();
    const file = new File(['<h1>Crash</h1>'], 'crash.html', { type: 'text/html' });
    act(() => hook.current.validateAndSetFile(file));

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(trackToolErrorMock).toHaveBeenCalledWith('html-to-pdf', 'conversion-error');
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    );
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('triggers download with delayed blob revocation and opens next action modal', () => {
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://localhost/fake-pdf');
    const mockRevokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    vi.mocked(htmlToPdfLogic.convertHtmlToPdf).mockResolvedValue(fakeBlob);

    const hook = renderWorkflowHook();
    const file = new File(['<h1>Test</h1>'], 'doc.html', { type: 'text/html' });
    act(() => hook.current.validateAndSetFile(file));

    act(() => {
      (hook.current as any).setResult?.({
        blob: fakeBlob,
        filename: 'doc.pdf',
        sizeBefore: 100,
        sizeAfter: 200,
      });
    });

    act(() => hook.current.handleDownload());
    expect(mockCreateObjectURL).toHaveBeenCalledWith(fakeBlob);
    expect(hook.current.isNextActionOpen).toBe(true);
    expect(mockRevokeObjectURL).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1000));
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/fake-pdf');
    hook.unmount();
  });

  it('handles Escape keyboard shortcut to reset staged state', () => {
    const hook = renderWorkflowHook();
    const file = new File(['<h1>Test</h1>'], 'doc.html', { type: 'text/html' });
    act(() => hook.current.validateAndSetFile(file));
    expect(hook.current.isStaged).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(hook.current.file).toBeUndefined();
    expect(hook.current.isStaged).toBe(false);
    hook.unmount();
  });
});
