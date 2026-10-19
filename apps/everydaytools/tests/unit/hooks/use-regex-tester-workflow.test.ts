import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useRegexTesterWorkflow } from '@/hooks/use-regex-tester-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('useRegexTesterWorkflow', () => {
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

  it('initializes with default pattern and evaluates matches', async () => {
    let hook!: ReturnType<typeof useRegexTesterWorkflow>;
    function Harness() {
      hook = useRegexTesterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.pattern).toContain('@');
    expect(hook.flags).toBe('g');
    expect(hook.isValid).toBe(true);
    expect(hook.matches.length).toBeGreaterThan(0);
    expect(hook.hasTestContent).toBe(true);
  });

  it('toggles flags correctly', async () => {
    let hook!: ReturnType<typeof useRegexTesterWorkflow>;
    function Harness() {
      hook = useRegexTesterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.toggleFlag('i');
    });

    expect(hook.flags).toContain('i');

    act(() => {
      hook.toggleFlag('i');
    });

    expect(hook.flags).not.toContain('i');
  });

  it('applies a preset and updates pattern and sample', async () => {
    let hook!: ReturnType<typeof useRegexTesterWorkflow>;
    function Harness() {
      hook = useRegexTesterWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const targetPreset = hook.presets[1];
    act(() => {
      hook.handleApplyPreset(targetPreset);
    });

    expect(hook.pattern).toBe(targetPreset.pattern);
    expect(hook.testString).toBe(targetPreset.sample);
  });

  it('throttles rapid typing so history does not get flooded', async () => {
    let hook!: ReturnType<typeof useRegexTesterWorkflow>;
    function Harness() {
      hook = useRegexTesterWorkflow(true);
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
