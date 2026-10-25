import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfUnlockOptions } from '@/hooks/use-pdf-unlock-options';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfUnlockOptions (Unit Test)', () => {
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

  function renderHook() {
    let hookValue!: ReturnType<typeof usePdfUnlockOptions>;
    function TestComponent() {
      hookValue = usePdfUnlockOptions();
      return null;
    }
    act(() => {
      root.render(React.createElement(TestComponent));
    });
    return {
      get current() {
        return hookValue;
      },
    };
  }

  it('initializes with empty password, hidden password, and null error', () => {
    const hook = renderHook();
    expect(hook.current.password).toBe('');
    expect(hook.current.showPassword).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.isValid).toBe(true);
  });

  it('updates password and clears error', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setError('Previous error');
    });
    expect(hook.current.error).toBe('Previous error');

    act(() => {
      hook.current.setPassword('SecretPassword2026!');
    });
    expect(hook.current.password).toBe('SecretPassword2026!');
    expect(hook.current.error).toBeNull();
    expect(hook.current.isValid).toBe(true);
  });

  it('toggles password visibility state', () => {
    const hook = renderHook();
    expect(hook.current.showPassword).toBe(false);

    act(() => {
      hook.current.toggleShowPassword();
    });
    expect(hook.current.showPassword).toBe(true);

    act(() => {
      hook.current.toggleShowPassword();
    });
    expect(hook.current.showPassword).toBe(false);
  });

  it('flags error and invalid state when password exceeds 128 characters', () => {
    const hook = renderHook();
    const longPassword = 'x'.repeat(129);

    act(() => {
      hook.current.setPassword(longPassword);
    });

    expect(hook.current.isValid).toBe(false);
    expect(hook.current.error).not.toBeNull();
    expect(hook.current.error).toMatch(/128/i);
  });

  it('resets all options back to pristine default state', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setPassword('TestPass');
      hook.current.toggleShowPassword();
      hook.current.setError('Some error');
    });

    act(() => {
      hook.current.resetOptions();
    });

    expect(hook.current.password).toBe('');
    expect(hook.current.showPassword).toBe(false);
    expect(hook.current.error).toBeNull();
    expect(hook.current.isValid).toBe(true);
  });
});
