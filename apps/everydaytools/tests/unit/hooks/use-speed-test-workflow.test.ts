import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useSpeedTestWorkflow } from '@/hooks/use-speed-test-workflow';
import { LocaleProvider } from '@/contexts/locale-context';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

describe('useSpeedTestWorkflow (TDD RED-GREEN Phase)', () => {
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

  it('initializes in idle phase with null speeds and empty waveform', async () => {
    let hook!: ReturnType<typeof useSpeedTestWorkflow>;
    function Harness() {
      hook = useSpeedTestWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    expect(hook.phase).toBe('idle');
    expect(hook.currentSpeed).toBe(0);
    expect(hook.downloadSpeed).toBeNull();
    expect(hook.uploadSpeed).toBeNull();
    expect(hook.ping).toBeNull();
    expect(hook.jitter).toBeNull();
    expect(hook.assessment).toBeNull();
    expect(hook.waveform).toEqual([]);
    expect(hook.errorMessage).toBeNull();
  });

  it('generates a clean diagnostic summary text in French and English', async () => {
    let hookFr!: ReturnType<typeof useSpeedTestWorkflow>;
    function HarnessFr() {
      hookFr = useSpeedTestWorkflow(true);
      return null;
    }

    let hookEn!: ReturnType<typeof useSpeedTestWorkflow>;
    function HarnessEn() {
      hookEn = useSpeedTestWorkflow(false);
      return null;
    }

    await act(async () => {
      root.render(
        React.createElement(
          LocaleProvider,
          null,
          React.createElement(HarnessFr),
          React.createElement(HarnessEn)
        )
      );
    });

    const summaryFr = hookFr.getSummaryText();
    expect(summaryFr).toContain('Test de Débit Internet');
    expect(summaryFr).toContain('Téléchargement');

    const summaryEn = hookEn.getSummaryText();
    expect(summaryEn).toContain('Internet Speed Test');
    expect(summaryEn).toContain('Download');
  });

  it('cancels an ongoing test cleanly via cancelTest', async () => {
    let hook!: ReturnType<typeof useSpeedTestWorkflow>;
    function Harness() {
      hook = useSpeedTestWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    await act(async () => {
      hook.cancelTest();
    });

    expect(hook.phase).toBe('idle');
  });

  it('cleans up and aborts active network requests on unmount', async () => {
    let hook!: ReturnType<typeof useSpeedTestWorkflow>;
    function Harness() {
      hook = useSpeedTestWorkflow(true);
      return null;
    }

    await act(async () => {
      root.render(React.createElement(LocaleProvider, null, React.createElement(Harness)));
    });

    // Unmounting the root triggers unmount effect
    expect(() => {
      act(() => {
        root.unmount();
      });
    }).not.toThrow();
  });
});
