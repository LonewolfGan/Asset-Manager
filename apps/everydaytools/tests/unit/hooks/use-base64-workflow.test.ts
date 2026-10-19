import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useBase64Workflow } from '@/hooks/use-base64-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useBase64Workflow', () => {
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

  it('initializes in encode mode and computes Base64 output reactively', async () => {
    let hook!: ReturnType<typeof useBase64Workflow>;
    function Harness() {
      hook = useBase64Workflow({ isFr: true });
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.mode).toBe('encode');
    expect(hook.input).toBe('');
    expect(hook.output).toBe('');

    act(() => {
      hook.handleInputChange('Hello World');
    });

    expect(hook.output).toBe('SGVsbG8gV29ybGQ=');
  });

  it('swaps encode and decode mode with input and output reversal', async () => {
    let hook!: ReturnType<typeof useBase64Workflow>;
    function Harness() {
      hook = useBase64Workflow({ isFr: true });
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleInputChange('Bonjour');
    });

    const encoded = hook.output;
    expect(encoded).toBeTruthy();

    act(() => {
      hook.handleSwap();
    });

    expect(hook.mode).toBe('decode');
    expect(hook.input).toBe(encoded);
    expect(hook.output).toBe('Bonjour');
  });

  it('throttles rapid typing so history does not flood', async () => {
    let hook!: ReturnType<typeof useBase64Workflow>;
    function Harness() {
      hook = useBase64Workflow({ isFr: true });
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleInputChange('a');
      hook.handleInputChange('ab');
      hook.handleInputChange('abc');
      hook.handleInputChange('abcd');
    });

    expect(hook.history.length).toBeLessThanOrEqual(2);
  });
});
