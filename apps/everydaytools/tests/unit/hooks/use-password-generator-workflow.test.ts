import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { usePasswordGeneratorWorkflow } from '@/hooks/use-password-generator-workflow';
import { PASSWORD_PRESETS } from '@/lib/password-generator-presets';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

let mockHandoffText: string | null = null;
vi.mock('@/lib/file-handoff', () => ({
  consumeHandoffText: () => {
    const val = mockHandoffText;
    mockHandoffText = null;
    return val;
  },
  consumeHandoffFile: () => null,
}));

describe('usePasswordGeneratorWorkflow (TDD RED Phase)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
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

  const defaultLabels = {
    weak: 'Weak',
    fair: 'Fair',
    strong: 'Strong',
    exceptional: 'Exceptional',
  };

  it('initializes with a valid password, non-zero entropy and undo support', async () => {
    let hook!: ReturnType<typeof usePasswordGeneratorWorkflow>;
    function Harness() {
      hook = usePasswordGeneratorWorkflow({ labels: defaultLabels });
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.password).toHaveLength(16);
    expect(hook.entropyBits).toBeGreaterThan(60);
    expect(hook.crackTime.offlineFast).toBeDefined();
    expect(hook.canUndo).toBe(false);
  });

  it('supports undo and redo when regenerating new passwords', async () => {
    let hook!: ReturnType<typeof usePasswordGeneratorWorkflow>;
    function Harness() {
      hook = usePasswordGeneratorWorkflow({ labels: defaultLabels });
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const firstPwd = hook.password;

    await act(async () => {
      hook.regenerate();
    });

    const secondPwd = hook.password;
    expect(secondPwd).not.toBe(firstPwd);
    expect(hook.canUndo).toBe(true);

    // Undo back to first
    await act(async () => {
      hook.undo();
    });
    expect(hook.password).toBe(firstPwd);
    expect(hook.canRedo).toBe(true);

    // Redo to second
    await act(async () => {
      hook.redo();
    });
    expect(hook.password).toBe(secondPwd);
  });

  it('applies presets correctly and updates settings', async () => {
    let hook!: ReturnType<typeof usePasswordGeneratorWorkflow>;
    function Harness() {
      hook = usePasswordGeneratorWorkflow({ labels: defaultLabels });
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const pinPreset = PASSWORD_PRESETS.find((p) => p.id === 'pin-4');
    expect(pinPreset).toBeDefined();

    await act(async () => {
      hook.applyPreset(pinPreset!);
    });

    expect(hook.mode).toBe('random');
    expect(hook.length).toBe(4);
    expect(hook.numbers).toBe(true);
    expect(hook.symbols).toBe(false);
    expect(hook.activePresetId).toBe('pin-4');
  });

  it('triggers onHandoffText when handoff payload is present at mount', async () => {
    mockHandoffText = 'imported-password-from-audit';
    const handoffSpy = vi.fn();

    function Harness() {
      usePasswordGeneratorWorkflow({
        labels: defaultLabels,
        onHandoffText: handoffSpy,
      });
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(handoffSpy).toHaveBeenCalledWith('imported-password-from-audit');
  });
});
