import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePdfProtectOptions } from '@/hooks/use-pdf-protect-options';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfProtectOptions (Unit Test)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => { root.unmount(); });
    container.remove();
  });

  function renderHook() {
    let hookValue!: ReturnType<typeof usePdfProtectOptions>;
    function TestComponent() {
      hookValue = usePdfProtectOptions();
      return null;
    }
    act(() => { root.render(React.createElement(TestComponent)); });
    return {
      get current() { return hookValue; },
    };
  }

  it('initializes with default options and invalid state (no password)', () => {
    const hook = renderHook();
    expect(hook.current.userPassword).toBe('');
    expect(hook.current.ownerPassword).toBe('');
    expect(hook.current.allowPrinting).toBe(true);
    expect(hook.current.allowCopying).toBe(true);
    expect(hook.current.allowModifying).toBe(false);
    expect(hook.current.showUserPassword).toBe(false);
    expect(hook.current.showOwnerPassword).toBe(false);
    expect(hook.current.showAdvanced).toBe(false);
    expect(hook.current.isValid).toBe(false);
    expect(hook.current.strength).toBeNull();
    expect(hook.current.passwordError).toBeNull();
  });

  it('updates user password, evaluates strength, and marks valid', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setUserPassword('SecureP@ssw0rd2026!');
    });

    expect(hook.current.userPassword).toBe('SecureP@ssw0rd2026!');
    expect(hook.current.isValid).toBe(true);
    expect(hook.current.strength).not.toBeNull();
    expect(hook.current.passwordError).toBeNull();
  });

  it('flags error and invalid state when userPassword matches ownerPassword', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setUserPassword('SameSecret123');
      hook.current.setOwnerPassword('SameSecret123');
    });

    expect(hook.current.isValid).toBe(false);
    expect(hook.current.passwordError).not.toBeNull();
  });

  it('toggles permission flags and visibility states', () => {
    const hook = renderHook();

    act(() => { hook.current.toggleAllowPrinting(); });
    expect(hook.current.allowPrinting).toBe(false);

    act(() => { hook.current.toggleAllowCopying(); });
    expect(hook.current.allowCopying).toBe(false);

    act(() => { hook.current.toggleAllowModifying(); });
    expect(hook.current.allowModifying).toBe(true);

    act(() => { hook.current.toggleShowUserPassword(); });
    expect(hook.current.showUserPassword).toBe(true);

    act(() => { hook.current.toggleShowOwnerPassword(); });
    expect(hook.current.showOwnerPassword).toBe(true);

    act(() => { hook.current.toggleShowAdvanced(); });
    expect(hook.current.showAdvanced).toBe(true);
  });

  it('generates a random secure password and shows it', () => {
    const hook = renderHook();

    act(() => { hook.current.handleGeneratePassword(); });

    expect(hook.current.userPassword.length).toBe(14);
    expect(hook.current.showUserPassword).toBe(true);
    expect(hook.current.isValid).toBe(true);
    expect(hook.current.strength).not.toBeNull();
  });

  it('resets all options back to pristine default state', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setUserPassword('TestPass');
      hook.current.toggleAllowPrinting();
      hook.current.toggleShowAdvanced();
    });

    act(() => { hook.current.resetOptions(); });

    expect(hook.current.userPassword).toBe('');
    expect(hook.current.allowPrinting).toBe(true);
    expect(hook.current.showAdvanced).toBe(false);
    expect(hook.current.isValid).toBe(false);
  });
});
