import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import * as downloadModule from '@/lib/download';
import { useHashGeneratorWorkflow } from '@/hooks/use-hash-generator-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    isFr: true,
    t: {
      tools: {
        'hash-generator': {
          title: 'Générateur de Hash Cryptographique',
          description: 'Calculateur de hash',
        },
      },
    },
  }),
}));

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useHashGeneratorWorkflow', () => {
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

  it('initializes with default state in text mode', async () => {
    let hook!: ReturnType<typeof useHashGeneratorWorkflow>;
    function Harness() {
      hook = useHashGeneratorWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.inputMode).toBe('text');
    expect(hook.inputText).toBe('');
    expect(hook.isUppercase).toBe(false);
    expect(hook.enableHmac).toBe(false);
    expect(hook.hasData).toBe(false);
  });

  it('updates text and throttles rapid typing history updates', async () => {
    let hook!: ReturnType<typeof useHashGeneratorWorkflow>;
    function Harness() {
      hook = useHashGeneratorWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleTextChange('H');
      hook.handleTextChange('He');
      hook.handleTextChange('Hel');
      hook.handleTextChange('Hell');
      hook.handleTextChange('Hello');
    });

    expect(hook.inputText).toBe('Hello');
    expect(hook.history.length).toBeLessThanOrEqual(2);
  });

  it('supports sample loading and undo restoration', async () => {
    let hook!: ReturnType<typeof useHashGeneratorWorkflow>;
    function Harness() {
      hook = useHashGeneratorWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleTextChange('Initial text');
    });

    act(() => {
      hook.handleLoadSample('Loaded sample text');
    });

    expect(hook.inputText).toBe('Loaded sample text');

    act(() => {
      hook.handleUndo();
    });

    expect(hook.inputText).toBe('Initial text');
  });

  it('clears state on handleClear', async () => {
    let hook!: ReturnType<typeof useHashGeneratorWorkflow>;
    function Harness() {
      hook = useHashGeneratorWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleTextChange('Some payload');
    });
    expect(hook.hasData).toBe(true);

    act(() => {
      hook.handleClear();
    });

    expect(hook.inputText).toBe('');
    expect(hook.hasData).toBe(false);
  });

  it('toggles uppercase mode correctly', async () => {
    let hook!: ReturnType<typeof useHashGeneratorWorkflow>;
    function Harness() {
      hook = useHashGeneratorWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.setIsUppercase(true);
    });

    expect(hook.isUppercase).toBe(true);
  });

  it('triggers download via downloadText on handleDownloadManifest', async () => {
    const downloadTextSpy = vi.spyOn(downloadModule, 'downloadText');
    let hook!: ReturnType<typeof useHashGeneratorWorkflow>;
    function Harness() {
      hook = useHashGeneratorWorkflow();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleDownloadManifest();
    });

    expect(downloadTextSpy).toHaveBeenCalled();
  });
});
