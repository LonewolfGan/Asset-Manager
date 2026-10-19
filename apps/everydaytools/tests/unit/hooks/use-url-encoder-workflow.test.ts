import { describe, it, expect } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useUrlEncoderWorkflow } from '@/hooks/use-url-encoder-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useUrlEncoderWorkflow', () => {
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

  it('initializes in encode mode and computes reactive output', async () => {
    let hook!: ReturnType<typeof useUrlEncoderWorkflow>;
    function Harness() {
      hook = useUrlEncoderWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.mode).toBe('encode');
    expect(hook.input).toBe('');
    expect(hook.output).toBe('');

    act(() => {
      hook.handleUpdateInput('https://example.com/search?q=café');
    });

    expect(hook.output).toBe('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcaf%C3%A9');
  });

  it('supports handleSwap to invert input and output with mode switch', async () => {
    let hook!: ReturnType<typeof useUrlEncoderWorkflow>;
    function Harness() {
      hook = useUrlEncoderWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleUpdateInput('hello world');
    });

    const encoded = hook.output;
    expect(encoded).toBe('hello%20world');

    act(() => {
      hook.handleSwap();
    });

    expect(hook.mode).toBe('decode');
    expect(hook.input).toBe(encoded);
    expect(hook.output).toBe('hello world');
  });

  it('throttles rapid typing history updates', async () => {
    let hook!: ReturnType<typeof useUrlEncoderWorkflow>;
    function Harness() {
      hook = useUrlEncoderWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleUpdateInput('h');
      hook.handleUpdateInput('he');
      hook.handleUpdateInput('hel');
      hook.handleUpdateInput('hell');
      hook.handleUpdateInput('hello');
    });

    expect(hook.history.length).toBeLessThanOrEqual(2);
  });
});
