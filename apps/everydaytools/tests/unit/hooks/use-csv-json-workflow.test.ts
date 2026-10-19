import { describe, it, expect, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useCsvJsonWorkflow } from '@/hooks/use-csv-json-workflow';
import { setHandoffText, setHandoffFile, consumeHandoffText, consumeHandoffFile } from '@/lib/file-handoff';

function renderCustomHook<T>(hookFn: () => T) {
  let result: T;
  function TestComp() {
    result = hookFn();
    return null;
  }
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);
  act(() => {
    root.render(React.createElement(TestComp));
  });
  return {
    get current() {
      return result;
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      div.remove();
    },
  };
}

describe('useCsvJsonWorkflow direction & handoff (TDD)', () => {
  beforeEach(() => {
    consumeHandoffText();
    consumeHandoffFile();
  });

  it('initializes with default csv-to-json direction', () => {
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false));
    expect(hook.current.direction).toBe('csv-to-json');
    expect(hook.current.sourceFormat.name).toBe('CSV');
    expect(hook.current.targetFormat.name).toBe('JSON');
    hook.unmount();
  });

  it('initializes with custom json-to-csv direction when specified', () => {
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false, 'json-to-csv'));
    expect(hook.current.direction).toBe('json-to-csv');
    expect(hook.current.sourceFormat.name).toBe('JSON');
    expect(hook.current.targetFormat.name).toBe('CSV');
    hook.unmount();
  });

  it('consumes and stages handoff text on mount', () => {
    setHandoffText('col1,col2\nval1,val2');
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false));

    expect(hook.current.rawText).toBe('col1,col2\nval1,val2');
    expect(hook.current.inputMode).toBe('paste');
    expect(hook.current.isPastedStaged).toBe(true);
    hook.unmount();
  });

  it('converts with custom delimiter correctly', async () => {
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false));

    act(() => {
      hook.current.setRawText('name;age\nAlice;30');
      hook.current.setDelimiter(';');
      hook.current.setIsPastedStaged(true);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });

    expect(hook.current.result).not.toBeNull();
    const parsed = JSON.parse(hook.current.result!.textOutput);
    expect(parsed).toEqual([{ name: 'Alice', age: 30 }]);
    hook.unmount();
  });

  it('resets workflow state when handleReset is called', () => {
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false));

    act(() => {
      hook.current.setRawText('data');
      hook.current.setIsPastedStaged(true);
    });

    act(() => {
      hook.current.handleReset();
    });

    expect(hook.current.rawText).toBe('');
    expect(hook.current.isPastedStaged).toBe(false);
    expect(hook.current.result).toBeNull();
    hook.unmount();
  });

  it('switches direction and resets state cleanly on handleToggleDirection', () => {
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false));

    act(() => {
      hook.current.setRawText('test');
    });

    act(() => {
      hook.current.handleToggleDirection('json-to-csv');
    });

    expect(hook.current.direction).toBe('json-to-csv');
    expect(hook.current.rawText).toBe('');
    hook.unmount();
  });

  it('triggers isNextActionOpen after handleDownload', async () => {
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false));

    act(() => {
      hook.current.setRawText('a,b\n1,2');
      hook.current.setIsPastedStaged(true);
    });

    await act(async () => {
      await hook.current.handleConvert();
    });
    expect(hook.current.result).not.toBeNull();

    act(() => {
      hook.current.handleDownload();
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(hook.current.isNextActionOpen).toBe(true);
    hook.unmount();
  });

  it('re-reads source file reactively when encoding changes in staging', async () => {
    const file = new File(['nom,age\nÉlise,28'], 'test.csv', { type: 'text/csv' });
    const hook = renderCustomHook(() => useCsvJsonWorkflow(false));

    await act(async () => {
      await hook.current.validateAndSetFile(file);
    });

    expect(hook.current.files.length).toBe(1);
    expect(hook.current.rawText).toContain('Élise');

    // Simulate user selecting another encoding in staging
    await act(async () => {
      hook.current.setEncoding('iso-8859-1');
    });

    expect(hook.current.encoding).toBe('iso-8859-1');
    expect(hook.current.rawText).toBeTruthy();
    hook.unmount();
  });
});

