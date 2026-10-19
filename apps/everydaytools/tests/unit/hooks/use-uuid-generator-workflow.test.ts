import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useUuidGeneratorWorkflow } from '@/hooks/use-uuid-generator-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useUuidGeneratorWorkflow', () => {
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

  it('initializes with 1 v4 UUID and generates new UUIDs', async () => {
    let hook!: ReturnType<typeof useUuidGeneratorWorkflow>;
    function Harness() {
      hook = useUuidGeneratorWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.activeTab).toBe('generator');
    expect(hook.version).toBe('v4');
    expect(hook.count).toBe(1);
    expect(hook.uuids.length).toBe(1);
    expect(hook.singleUuid).toBeTruthy();

    const firstId = hook.singleUuid;
    act(() => {
      hook.generate();
    });

    expect(hook.singleUuid).toBeTruthy();
    // With high cryptographic probability, new v4 is distinct
    expect(hook.singleUuid).not.toBe(firstId);
  });

  it('updates batch size and version', async () => {
    let hook!: ReturnType<typeof useUuidGeneratorWorkflow>;
    function Harness() {
      hook = useUuidGeneratorWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.setCount(5);
      hook.setVersion('v7');
    });

    expect(hook.uuids.length).toBe(5);
    expect(hook.version).toBe('v7');
  });

  it('inspects input accurately in inspector tab', async () => {
    let hook!: ReturnType<typeof useUuidGeneratorWorkflow>;
    function Harness() {
      hook = useUuidGeneratorWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    act(() => {
      hook.setActiveTab('inspector');
      hook.setInspectInput('c86326d9-f521-4f36-9e90-2e452601da19');
    });

    expect(hook.inspectedData.valid).toBe(true);
    expect(hook.inspectedData.version).toBe(4);
  });
});
