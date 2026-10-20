import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useCsvToExcelWorkflow } from '@/hooks/use-csv-to-excel-workflow';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

let mockHandoffFile: File | null = null;
let mockHandoffText: string | null = null;

vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffFile: () => {
    const f = mockHandoffFile;
    mockHandoffFile = null;
    return f;
  },
  consumeHandoffText: () => {
    const t = mockHandoffText;
    mockHandoffText = null;
    return t;
  },
}));

describe('useCsvToExcelWorkflow (TDD)', () => {
  let container: HTMLDivElement;
  let root: Root;
  let hookValue: ReturnType<typeof useCsvToExcelWorkflow>;

  const TestConsumer: React.FC = () => {
    hookValue = useCsvToExcelWorkflow();
    return null;
  };

  const renderComponent = async () => {
    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(TestConsumer)
        )
      );
    });
  };

  beforeEach(() => {
    mockHandoffFile = null;
    mockHandoffText = null;
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

  it('initializes in upload mode with no file staged', async () => {
    await renderComponent();
    expect(hookValue.mode).toBe('upload');
    expect(hookValue.file).toBeUndefined();
    expect(hookValue.isStaged).toBe(false);
  });

  it('validates and stages a valid csv file', async () => {
    await renderComponent();

    const file = new File(['Col1,Col2\nVal1,Val2'], 'test.csv', { type: 'text/csv' });
    act(() => {
      hookValue.validateAndSetFile(file);
    });

    expect(hookValue.file).toBe(file);
    expect(hookValue.isStaged).toBe(true);
    expect(hookValue.stagedFile?.name).toBe('test.csv');
  });

  it('consumes handoff file on mount', async () => {
    mockHandoffFile = new File(['A,B\n1,2'], 'handoff.csv', { type: 'text/csv' });

    await renderComponent();

    expect(hookValue.isStaged).toBe(true);
    expect(hookValue.file?.name).toBe('handoff.csv');
  });

  it('consumes handoff text on mount and switches to paste mode', async () => {
    mockHandoffText = 'Produit,Prix\nPomme,2';

    await renderComponent();

    expect(hookValue.mode).toBe('paste');
    expect(hookValue.csvText).toBe('Produit,Prix\nPomme,2');
    expect(hookValue.isStaged).toBe(true);
  });

  it('resets workflow state when handleReset is called', async () => {
    await renderComponent();

    const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
    act(() => {
      hookValue.validateAndSetFile(file);
    });
    expect(hookValue.isStaged).toBe(true);

    act(() => {
      hookValue.handleReset();
    });

    expect(hookValue.file).toBeUndefined();
    expect(hookValue.isStaged).toBe(false);
    expect(hookValue.csvText).toBe('');
    expect(hookValue.result).toBeNull();
  });

  it('converts with custom delimiter correctly', async () => {
    await renderComponent();

    const file = new File(['Col1;Col2\nVal1;Val2'], 'data.csv', { type: 'text/csv' });
    act(() => {
      hookValue.validateAndSetFile(file);
    });

    act(() => {
      hookValue.setDelimiter(';');
      hookValue.setEncoding('utf-8');
    });

    await act(async () => {
      await hookValue.handleConvert();
    });

    expect(hookValue.result).not.toBeNull();
    expect(hookValue.result?.filename).toBe('data.xlsx');
    expect(hookValue.result?.sizeAfter).toBeGreaterThan(0);
  });

  it('triggers isNextActionOpen after handleDownload', async () => {
    await renderComponent();

    const file = new File(['A,B\n1,2'], 'test.csv', { type: 'text/csv' });
    act(() => {
      hookValue.validateAndSetFile(file);
    });

    await act(async () => {
      await hookValue.handleConvert();
    });
    expect(hookValue.result).not.toBeNull();

    vi.useFakeTimers();
    try {
      act(() => {
        hookValue.handleDownload();
      });

      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(hookValue.isNextActionOpen).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('converts instantly without artificial delay (no setTimeout >= 600ms during handleConvert)', async () => {
    await renderComponent();

    const file = new File(['Col1,Col2\nVal1,Val2'], 'instant.csv', { type: 'text/csv' });
    act(() => {
      hookValue.validateAndSetFile(file);
    });

    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    try {
      await act(async () => {
        await hookValue.handleConvert();
      });

      expect(hookValue.result).not.toBeNull();
      expect(hookValue.result?.sizeAfter).toBeGreaterThan(0);

      const artificialDelayCalls = setTimeoutSpy.mock.calls.filter(
        ([, delay]) => typeof delay === 'number' && delay >= 600
      );

      expect(artificialDelayCalls).toHaveLength(0);
    } finally {
      setTimeoutSpy.mockRestore();
    }
  });
});
