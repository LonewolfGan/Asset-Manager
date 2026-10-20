import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { useJsonFormatterWorkflow } from '@/hooks/use-json-formatter-workflow';
import { useHtmlFormatterWorkflow } from '@/hooks/use-html-formatter-workflow';
import { useCssFormatterWorkflow } from '@/hooks/use-css-formatter-workflow';
import { useJsFormatterWorkflow } from '@/hooks/use-js-formatter-workflow';
import * as downloadModule from '@/lib/download';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffFile: vi.fn(() => null),
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({ isFr: true, locale: 'fr', setLocale: vi.fn(), t: (k: string) => k }),
}));

function renderHookHelper<T>(hookFn: () => T) {
  let hookValue!: T;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function Harness() {
    hookValue = hookFn();
    return null;
  }

  act(() => {
    root.render(React.createElement(Harness));
  });

  return {
    get current() {
      return hookValue;
    },
    unmount() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe('SSOT Download Unification — Hooks Integration', () => {
  let createElementSpy: any;
  let downloadTextSpy: any;
  let downloadBlobSpy: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    downloadTextSpy = vi.spyOn(downloadModule, 'downloadText').mockImplementation(() => {});
    downloadBlobSpy = vi.spyOn(downloadModule, 'downloadBlob').mockImplementation(() => {});

    const origCreateElement = document.createElement.bind(document);
    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string, options?: any) => {
        return origCreateElement(tag, options);
      });
  });

  afterEach(() => {
    createElementSpy.mockRestore();
  });

  it('useJsonFormatterWorkflow delegates download to SSOT @/lib/download without manual anchor creation', () => {
    const hook = renderHookHelper(() => useJsonFormatterWorkflow(true));
    act(() => {
      hook.current.setRawInput('{"tool":"json-formatter"}');
    });

    act(() => {
      hook.current.handleDownload();
    });

    const isDownloadCalled =
      downloadTextSpy.mock.calls.length > 0 || downloadBlobSpy.mock.calls.length > 0;
    expect(isDownloadCalled).toBe(true);

    const anchorCreated = createElementSpy.mock.calls.some(
      (args: any[]) => args[0] === 'a'
    );
    expect(anchorCreated).toBe(false);
    hook.unmount();
  });

  it('useHtmlFormatterWorkflow delegates download to SSOT @/lib/download without manual anchor creation', () => {
    const hook = renderHookHelper(() => useHtmlFormatterWorkflow(true));
    act(() => {
      hook.current.handleInputChange('<main><h1>Title</h1></main>');
    });

    act(() => {
      hook.current.handleDownload();
    });

    const isDownloadCalled =
      downloadTextSpy.mock.calls.length > 0 || downloadBlobSpy.mock.calls.length > 0;
    expect(isDownloadCalled).toBe(true);

    const anchorCreated = createElementSpy.mock.calls.some(
      (args: any[]) => args[0] === 'a'
    );
    expect(anchorCreated).toBe(false);
    hook.unmount();
  });

  it('useCssFormatterWorkflow delegates download to SSOT @/lib/download without manual anchor creation', () => {
    const hook = renderHookHelper(() => useCssFormatterWorkflow(true));
    act(() => {
      hook.current.handleInputChange('.title { font-size: 16px; }');
    });

    act(() => {
      hook.current.handleDownload();
    });

    const isDownloadCalled =
      downloadTextSpy.mock.calls.length > 0 || downloadBlobSpy.mock.calls.length > 0;
    expect(isDownloadCalled).toBe(true);

    const anchorCreated = createElementSpy.mock.calls.some(
      (args: any[]) => args[0] === 'a'
    );
    expect(anchorCreated).toBe(false);
    hook.unmount();
  });

  it('useJsFormatterWorkflow delegates download to SSOT @/lib/download without manual anchor creation', () => {
    const hook = renderHookHelper(() => useJsFormatterWorkflow());
    act(() => {
      hook.current.handleInputChange('const version = 1;');
    });

    act(() => {
      hook.current.handleDownload();
    });

    const isDownloadCalled =
      downloadTextSpy.mock.calls.length > 0 || downloadBlobSpy.mock.calls.length > 0;
    expect(isDownloadCalled).toBe(true);

    const anchorCreated = createElementSpy.mock.calls.some(
      (args: any[]) => args[0] === 'a'
    );
    expect(anchorCreated).toBe(false);
    hook.unmount();
  });

  it('ensures no workflow hook introduces artificial setTimeout >= 600ms', () => {
    vi.useFakeTimers();
    const setTimeoutSpy = vi.spyOn(window, 'setTimeout');

    const hook = renderHookHelper(() => useHtmlFormatterWorkflow(true));
    act(() => {
      hook.current.handleInputChange('<div>Fast</div>');
      hook.current.handleDownload();
    });

    const longTimeouts = setTimeoutSpy.mock.calls.filter(
      ([, delay]) => typeof delay === 'number' && delay >= 600
    );
    expect(longTimeouts.length).toBe(0);

    hook.unmount();
    vi.useRealTimers();
  });
});
