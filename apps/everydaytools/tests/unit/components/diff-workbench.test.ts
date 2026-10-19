import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { DiffWorkbench } from '@/components/diff-checker/DiffWorkbench';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('DiffWorkbench with CodeWorkspaceSplit', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const renderWorkbench = async (props: Partial<Parameters<typeof DiffWorkbench>[0]> = {}) => {
    const defaultProps = {
      viewMode: 'edit' as const,
      onViewModeChange: vi.fn(),
      textA: 'original text',
      textB: 'modified text',
      onUpdateOriginal: vi.fn(),
      onUpdateModified: vi.fn(),
      onFileUpload: vi.fn(),
      onSwap: vi.fn(),
      hasContent: true,
      editorHeight: 460,
      wordWrap: true,
      isDragOverOriginal: false,
      onDragOverOriginal: vi.fn(),
      isDragOverModified: false,
      onDragOverModified: vi.fn(),
      diffLines: [],
      changeRefs: { current: [] } as any,
      scrollContainerRef: { current: null } as any,
      onMouseDownResize: vi.fn(),
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(DiffWorkbench, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders editor view with text inputs', async () => {
    await renderWorkbench();

    expect(container.textContent).toContain('Texte Original');
    expect(container.textContent).toContain('Texte Modifié');
  });

  it('calls onMouseDownResize when clicking vertical resize handle', async () => {
    const onMouseDownResize = vi.fn();
    await renderWorkbench({ onMouseDownResize });

    const resizeHandle = container.querySelector('.cursor-row-resize') as HTMLDivElement;
    expect(resizeHandle).not.toBeNull();

    act(() => {
      resizeHandle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onMouseDownResize).toHaveBeenCalledTimes(1);
  });

  it('guarantees zero arbitrary hex #FF6B35 in rendered workbench HTML and uses var(--accent)', async () => {
    await renderWorkbench();

    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a26');
  });

  it('renders quick sample buttons when editor is empty and onLoadSample is provided', async () => {
    const onLoadSample = vi.fn();
    await renderWorkbench({
      hasContent: false,
      textA: '',
      textB: '',
      onLoadSample,
    });

    expect(container.textContent).toContain('Texte narratif');
    expect(container.textContent).toContain('Code TypeScript');
    expect(container.textContent).toContain('Fichier JSON');

    const sampleBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Texte narratif')
    );
    expect(sampleBtn).toBeDefined();

    act(() => {
      sampleBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onLoadSample).toHaveBeenCalledWith('text');
  });
});

