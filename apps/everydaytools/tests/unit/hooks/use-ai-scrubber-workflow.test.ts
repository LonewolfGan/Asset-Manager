import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useAiScrubberWorkflow } from '@/hooks/use-ai-scrubber-workflow';
import { setHandoffText, setHandoffFile, consumeHandoffText, consumeHandoffFile } from '@/lib/file-handoff';

// Simple hook runner using standard React DOM root
function renderWorkflowHook(isFr: boolean = true) {
  let hookState: ReturnType<typeof useAiScrubberWorkflow>;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  function TestComponent() {
    hookState = useAiScrubberWorkflow(isFr);
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

describe('useAiScrubberWorkflow (TDD RED Phase)', () => {
  beforeEach(() => {
    consumeHandoffText();
    consumeHandoffFile();
  });

  it('initializes with default options and empty text state', () => {
    const hook = renderWorkflowHook(true);
    expect(hook.current.inputText).toBe('');
    expect(hook.current.outputText).toBe('');
    expect(hook.current.optInvisibles).toBe(true);
    expect(hook.current.optEmDashes).toBe(true);
    expect(hook.current.optStylistic).toBe(true);
    expect(hook.current.optSymbols).toBe(true);
    expect(hook.current.optWhitespace).toBe(true);
    expect(hook.current.hasContent).toBe(false);
    expect(hook.current.hasResult).toBe(false);
    hook.unmount();
  });

  it('consumes and stages handoff text on mount', () => {
    setHandoffText('Texte transmis avec tiret — cadratin et ZWSP\u200B');
    const hook = renderWorkflowHook(true);

    expect(hook.current.inputText).toBe('Texte transmis avec tiret — cadratin et ZWSP\u200B');
    expect(hook.current.hasContent).toBe(true);
    expect(hook.current.analysis.invisiblesCount).toBe(1);
    expect(hook.current.analysis.emDashesCount).toBe(1);
    hook.unmount();
  });

  it('loads sample text in French and English correctly', () => {
    const hookFr = renderWorkflowHook(true);
    act(() => {
      hookFr.current.handleLoadSample();
    });
    expect(hookFr.current.inputText).toContain('Dans un monde en constante évolution');
    expect(hookFr.current.hasContent).toBe(true);
    hookFr.unmount();

    const hookEn = renderWorkflowHook(false);
    act(() => {
      hookEn.current.handleLoadSample();
    });
    expect(hookEn.current.inputText).toContain("In today's fast-paced world");
    hookEn.unmount();
  });

  it('executes text scrubbing and produces cleaned output', () => {
    const hook = renderWorkflowHook(true);
    act(() => {
      hook.current.setInputText('Début\u200B de phrase — incision — fin.');
    });

    act(() => {
      hook.current.handleScrub();
    });

    expect(hook.current.hasResult).toBe(true);
    expect(hook.current.outputText).not.toContain('\u200B');
    expect(hook.current.outputText).not.toContain('—');
    hook.unmount();
  });

  it('manages undo stack when scrubbing, clearing, and applying to input', () => {
    const hook = renderWorkflowHook(true);
    act(() => {
      hook.current.setInputText('Original text');
    });

    act(() => {
      hook.current.handleScrub();
    });
    expect(hook.current.undoStack.length).toBe(1);

    act(() => {
      hook.current.handleApplyToInput();
    });
    expect(hook.current.undoStack.length).toBe(2);

    act(() => {
      hook.current.handleUndo();
    });
    expect(hook.current.undoStack.length).toBe(1);
    hook.unmount();
  });

  it('clears all text cleanly on handleClear and resets result', () => {
    const hook = renderWorkflowHook(true);
    act(() => {
      hook.current.setInputText('Some text');
      hook.current.handleScrub();
    });

    expect(hook.current.hasContent).toBe(true);

    act(() => {
      hook.current.handleClear();
    });

    expect(hook.current.inputText).toBe('');
    expect(hook.current.outputText).toBe('');
    expect(hook.current.hasContent).toBe(false);
    hook.unmount();
  });

  it('resets input when Escape key is pressed', () => {
    const hook = renderWorkflowHook(true);
    act(() => {
      hook.current.setInputText('Text to clear via Escape');
    });
    expect(hook.current.hasContent).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(hook.current.inputText).toBe('');
    hook.unmount();
  });

  it('strictly limits undo stack to a maximum of 20 items without off-by-one', () => {
    const hook = renderWorkflowHook(true);
    for (let i = 0; i < 25; i++) {
      act(() => {
        hook.current.setInputText(`iteration ${i}`);
        hook.current.handleScrub();
      });
    }

    expect(hook.current.undoStack.length).toBe(20);
    hook.unmount();
  });

  it('rejects dropped files exceeding 5MB', () => {
    const hook = renderWorkflowHook(true);
    const largeFile = new File(['x'.repeat(100)], 'huge.txt', { type: 'text/plain' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    const mockDropEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        files: [largeFile],
      },
    } as unknown as React.DragEvent;

    act(() => {
      hook.current.handleFileDrop(mockDropEvent);
    });

    expect(hook.current.inputText).toBe('');
    hook.unmount();
  });
});
