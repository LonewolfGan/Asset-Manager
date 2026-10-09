import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WordCounterCommandBar } from '@/components/word-counter/WordCounterCommandBar';

describe('WordCounterCommandBar with CaseTransformButtonGroup (TDD RED Phase)', () => {
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

  it('renders CaseTransformButtonGroup and calls onTransformCase when clicked', async () => {
    const handleTransformCase = vi.fn();
    const fileInputRef = { current: null };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(WordCounterCommandBar, {
            loadedFile: null,
            text: 'Hello World Antigravity',
            undoStackLength: 1,
            redoStackLength: 0,
            fileInputRef,
            isFr: true,
            onFileUpload: vi.fn(),
            onDetachFile: vi.fn(),
            onTransformCase: handleTransformCase,
            onUndo: vi.fn(),
            onRedo: vi.fn(),
            onClear: vi.fn(),
            onCopyText: vi.fn(),
            onDownloadTxt: vi.fn(),
            onCopyReport: vi.fn(),
            onExportJson: vi.fn(),
          })
        )
      );
    });

    // Find and click the Case popover trigger
    const caseTrigger = container.querySelector('[data-testid="case-transform-trigger"]') as HTMLButtonElement;
    expect(caseTrigger).not.toBeNull();

    await act(async () => {
      caseTrigger.click();
    });

    // Delimiter / Case button with data-case="upper" should exist in body
    const upperBtn = document.body.querySelector('button[data-case="upper"]') as HTMLButtonElement;
    expect(upperBtn).not.toBeNull();

    await act(async () => {
      upperBtn.click();
    });

    expect(handleTransformCase).toHaveBeenCalledWith('upper');
  });
});
