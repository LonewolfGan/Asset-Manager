import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useMetadataCleanerWorkflow } from '@/hooks/use-metadata-cleaner-workflow';
import { setHandoffFile, consumeHandoffFile } from '@/lib/file-handoff';

// Simple hook runner using standard React DOM root
function renderWorkflowHook(isFr: boolean = true) {
  let hookState: ReturnType<typeof useMetadataCleanerWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  function TestComponent() {
    hookState = useMetadataCleanerWorkflow(isFr);
    return null;
  }

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  return {
    get current() {
      return hookState;
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('useMetadataCleanerWorkflow (TDD RED Phase)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    consumeHandoffFile();
  });

  it('initializes with default clean state', () => {
    const hook = renderWorkflowHook(true);
    expect(hook.current.file).toBeNull();
    expect(hook.current.files).toEqual([]);
    expect(hook.current.result).toBeNull();
    expect(hook.current.isProcessing).toBe(false);
    expect(hook.current.activeFilter).toBe('all');
    expect(hook.current.isNextActionOpen).toBe(false);
    expect(hook.current.targetFormat.name).toBe('Fichier');
    hook.unmount();
  });

  it('consumes and stages handoff file on mount', () => {
    const mockFile = new File(['pdf-binary-data'], 'document.pdf', { type: 'application/pdf' });
    setHandoffFile(mockFile, mockFile.name);

    const hook = renderWorkflowHook(true);
    expect(hook.current.file).not.toBeNull();
    expect(hook.current.file?.name).toBe('document.pdf');
    expect(hook.current.targetFormat.name).toBe('PDF');
    hook.unmount();
  });

  it('updates targetFormat when image file is set', () => {
    const hook = renderWorkflowHook(true);
    const imageFile = new File(['img-data'], 'vacation.jpg', { type: 'image/jpeg' });

    act(() => {
      hook.current.setFiles([imageFile]);
    });

    expect(hook.current.file?.name).toBe('vacation.jpg');
    expect(hook.current.targetFormat.name).toBe('JPG');
    hook.unmount();
  });

  it('toggles filter between all and sensitive', () => {
    const hook = renderWorkflowHook(true);
    expect(hook.current.activeFilter).toBe('all');

    act(() => {
      hook.current.setActiveFilter('sensitive');
    });
    expect(hook.current.activeFilter).toBe('sensitive');

    act(() => {
      hook.current.setActiveFilter('all');
    });
    expect(hook.current.activeFilter).toBe('all');
    hook.unmount();
  });

  it('resets workflow cleanly on handleReset', () => {
    const hook = renderWorkflowHook(true);
    const mockFile = new File(['data'], 'test.png', { type: 'image/png' });

    act(() => {
      hook.current.setFiles([mockFile]);
      hook.current.setActiveFilter('sensitive');
    });

    expect(hook.current.file).not.toBeNull();

    act(() => {
      hook.current.handleReset();
    });

    expect(hook.current.file).toBeNull();
    expect(hook.current.files).toEqual([]);
    expect(hook.current.result).toBeNull();
    expect(hook.current.activeFilter).toBe('all');
    hook.unmount();
  });

  it('resets workflow when Escape key is pressed with staged file', () => {
    const hook = renderWorkflowHook(true);
    const mockFile = new File(['data'], 'test.png', { type: 'image/png' });

    act(() => {
      hook.current.setFiles([mockFile]);
    });

    expect(hook.current.file).not.toBeNull();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(hook.current.file).toBeNull();
    expect(hook.current.files).toEqual([]);
    hook.unmount();
  });

  it('automatically resets activeFilter to all when a new file is set', () => {
    const hook = renderWorkflowHook(true);
    const file1 = new File(['data1'], 'doc1.pdf', { type: 'application/pdf' });
    const file2 = new File(['data2'], 'doc2.pdf', { type: 'application/pdf' });

    act(() => {
      hook.current.setFiles([file1]);
    });

    act(() => {
      hook.current.setActiveFilter('sensitive');
    });

    expect(hook.current.activeFilter).toBe('sensitive');

    act(() => {
      hook.current.setFiles([file2]);
    });

    expect(hook.current.activeFilter).toBe('all');
    hook.unmount();
  });

  it('executes handleClean for image file in-browser without fetch network calls', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const origImage = globalThis.Image;
    class MockImage {
      naturalWidth = 200;
      naturalHeight = 200;
      onload: (() => void) | null = null;
      set src(_v: string) {
        setTimeout(() => this.onload && this.onload(), 0);
      }
    }
    globalThis.Image = MockImage as unknown as typeof Image;

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({
            drawImage: vi.fn(),
          })),
          toBlob: (cb: (b: Blob | null) => void, mime?: string) => {
            cb(new Blob(['clean-image-data'], { type: mime || 'image/png' }));
          },
        } as unknown as HTMLCanvasElement;
      }
      return origCreateElement(tagName);
    });

    const hook = renderWorkflowHook(true);
    const imgFile = new File(['png-data'], 'family.png', { type: 'image/png' });

    act(() => {
      hook.current.setFiles([imgFile]);
    });

    await act(async () => {
      await hook.current.handleClean();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.filename).toBe('anonymized_family.png');
    expect(hook.current.result?.blob).toBeInstanceOf(Blob);
    expect(hook.current.isProcessing).toBe(false);

    globalThis.Image = origImage;
    hook.unmount();
  });

  it('executes handleClean for PDF file in-browser without fetch network calls', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.create();
    doc.addPage([200, 200]);
    doc.setTitle('Confidential');
    const pdfBytes = await doc.save();
    const pdfFile = new File([pdfBytes], 'report.pdf', { type: 'application/pdf' });

    const hook = renderWorkflowHook(true);

    act(() => {
      hook.current.setFiles([pdfFile]);
    });

    await act(async () => {
      await hook.current.handleClean();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(hook.current.result).not.toBeNull();
    expect(hook.current.result?.filename).toBe('anonymized_report.pdf');
    expect(hook.current.result?.blob.type).toBe('application/pdf');
    expect(hook.current.isProcessing).toBe(false);
    hook.unmount();
  });
});
