import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useOdtToPdfWorkflow } from '@/hooks/use-odt-to-pdf-workflow';
import * as odtToPdfLogic from '@/lib/odt-to-pdf-logic';
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
      tools: { 'odt-to-pdf': { title: 'ODT to PDF', description: 'Convert ODT to PDF.' } },
      odtToPdf: {
        convertBtn: 'Convert to PDF',
        converting: 'Converting...',
        convertAnother: 'Change file',
        downloadPdf: 'Download PDF',
        error: 'Failed to convert ODT.',
      },
    },
    tc: {},
    isFr: false,
    locale: 'en',
  }),
}));

vi.mock('@/lib/odt-to-pdf-logic', async (importOriginal) => {
  const actual = await importOriginal<typeof odtToPdfLogic>();
  return {
    ...actual,
    convertOdtToPdf: vi.fn(),
    triggerDownload: vi.fn(),
  };
});

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function renderWorkflowHook() {
  let hookState!: ReturnType<typeof useOdtToPdfWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      React.createElement(() => {
        hookState = useOdtToPdfWorkflow();
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

describe('useOdtToPdfWorkflow [TDD-Lock ECC]', () => {
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
    vi.restoreAllMocks();
  });

  it('initializes with default clean state', () => {
    const hook = renderWorkflowHook();
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.isDragging).toBe(false);
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.sourceFormat.extension).toBe('odt');
    expect(hook.current.targetFormat.extension).toBe('pdf');
    hook.unmount();
  });

  it('validates and accepts a valid ODT file', () => {
    const hook = renderWorkflowHook();
    const validFile = new File(['mock content'], 'test.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    act(() => hook.current.validateAndSetFile(validFile));
    expect(hook.current.file).toBe(validFile);
    expect(toastMock).not.toHaveBeenCalled();
    hook.unmount();
  });

  it('rejects unsupported file and triggers toast', () => {
    const hook = renderWorkflowHook();
    const invalidFile = new File(['image'], 'photo.png', { type: 'image/png' });
    act(() => hook.current.validateAndSetFile(invalidFile));
    expect(hook.current.file).toBeUndefined();
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
    hook.unmount();
  });

  it('consumes handoff file on mount', () => {
    const handoffFile = new File(['mock'], 'handoff.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    vi.mocked(fileHandoff.consumeHandoffFile).mockReturnValue(handoffFile);
    const hook = renderWorkflowHook();
    expect(hook.current.file?.name).toBe('handoff.odt');
    hook.unmount();
  });

  it('resets workflow when handleReset is called', () => {
    const hook = renderWorkflowHook();
    const file = new File(['mock'], 'sample.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    act(() => hook.current.validateAndSetFile(file));
    expect(hook.current.file).toBeDefined();
    act(() => hook.current.handleReset());
    expect(hook.current.file).toBeUndefined();
    expect(hook.current.result).toBeNull();
    hook.unmount();
  });

  it('handles conversion successfully and tracks analytics', async () => {
    const fakeBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
    const mockResult = {
      blob: fakeBlob,
      filename: 'sample.pdf',
      sizeBefore: 120,
      sizeAfter: 340,
    };
    vi.mocked(odtToPdfLogic.convertOdtToPdf).mockResolvedValue(mockResult);

    const hook = renderWorkflowHook();
    const file = new File(['mock'], 'sample.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    act(() => hook.current.validateAndSetFile(file));

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(odtToPdfLogic.convertOdtToPdf).toHaveBeenCalledWith(file, expect.any(Object));
    expect(trackToolUsedMock).toHaveBeenCalledWith('odt-to-pdf', 'documents');
    expect(hook.current.result).toEqual(mockResult);
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('handles conversion error gracefully', async () => {
    vi.mocked(odtToPdfLogic.convertOdtToPdf).mockRejectedValue(new Error('Backend engine error'));

    const hook = renderWorkflowHook();
    const file = new File(['mock'], 'broken.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    act(() => hook.current.validateAndSetFile(file));

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(trackToolErrorMock).toHaveBeenCalledWith('odt-to-pdf', 'conversion-error');
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ variant: 'destructive' }));
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });

  it('triggers download and opens next action modal', () => {
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
    expect(odtToPdfLogic.triggerDownload).toHaveBeenCalledWith(fakeBlob, 'sample.pdf');
    expect(hook.current.isNextActionOpen).toBe(true);
    hook.unmount();
  });

  it('handles Escape keyboard shortcut to reset staged state', () => {
    const hook = renderWorkflowHook();
    const file = new File(['mock'], 'sample.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    act(() => hook.current.validateAndSetFile(file));
    expect(hook.current.file).toBeDefined();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(hook.current.file).toBeUndefined();
    hook.unmount();
  });
});
