import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useJwtDecoderWorkflow } from '@/hooks/use-jwt-decoder-workflow';
import { SAMPLE_JWTS } from '@/lib/jwt-samples';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useJwtDecoderWorkflow', () => {
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

  it('initializes with empty state and responds to token changes', async () => {
    let hook!: ReturnType<typeof useJwtDecoderWorkflow>;
    function Harness() {
      hook = useJwtDecoderWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.tokenInput).toBe('');
    expect(hook.hasToken).toBe(false);
    expect(hook.decoded.valid).toBe(false);

    act(() => {
      hook.handleUpdateToken(SAMPLE_JWTS.activeAdmin);
    });

    expect(hook.hasToken).toBe(true);
    expect(hook.decoded.valid).toBe(true);
    expect(hook.decoded.algorithm).toBe('HS256');
  });

  it('cleans Bearer prefix properly', async () => {
    let hook!: ReturnType<typeof useJwtDecoderWorkflow>;
    function Harness() {
      hook = useJwtDecoderWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleUpdateToken(`Bearer ${SAMPLE_JWTS.activeAdmin}`);
    });

    expect(hook.tokenInput).toContain('Bearer ');

    act(() => {
      hook.handleCleanToken();
    });

    expect(hook.tokenInput).toBe(SAMPLE_JWTS.activeAdmin);
  });

  it('throttles rapid typing so history does not flood', async () => {
    let hook!: ReturnType<typeof useJwtDecoderWorkflow>;
    function Harness() {
      hook = useJwtDecoderWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleUpdateToken('a');
      hook.handleUpdateToken('ab');
      hook.handleUpdateToken('abc');
      hook.handleUpdateToken('abcd');
    });

    expect(hook.history.length).toBeLessThanOrEqual(2);
  });

  it('handles undo correctly', async () => {
    let hook!: ReturnType<typeof useJwtDecoderWorkflow>;
    function Harness() {
      hook = useJwtDecoderWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.handleUpdateToken('token-one');
    });

    act(() => {
      hook.handleClear();
    });

    expect(hook.tokenInput).toBe('');

    act(() => {
      hook.handleUndo();
    });

    expect(hook.tokenInput).toBe('token-one');
  });
});
