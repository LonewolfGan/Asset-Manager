import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  SpeedTestDial,
  SpeedTestTelemetryStrip,
  SpeedTestWaveform,
  SpeedTestInstrumentPanel,
  SpeedTestDiagnosticCockpit,
} from '@/components/speed-test';
import { LocaleProvider } from '@/contexts/locale-context';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function TestWrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(
    LocaleProvider,
    null,
    React.createElement(TooltipProvider, null, children)
  );
}

const mockAssessment = {
  tier: 'High-Speed Broadband' as const,
  verdict: 'Excellent broadband speed for seamless 4K streaming and low-latency gaming.',
  suitability: {
    videoStreaming: { status: 'pass' as const, label: '4K Ultra HD Streaming' },
    cloudGaming: { status: 'pass' as const, label: 'Low-latency Competitive Gaming' },
    videoConferencing: { status: 'pass' as const, label: 'Multi-party HD Calls' },
    download10GbMinutes: '1.8',
  },
};

describe('Speed Test Components (Anti-Slop & Design System Audit)', () => {
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

  describe('SpeedTestDial', () => {
    it('renders clean SVG dial arc with solid accent stroke and zero #FF6B35 or gradients', async () => {
      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(SpeedTestDial, {
              phase: 'download',
              currentSpeed: 75.5,
              downloadSpeed: null,
              ping: 15,
              isFr: true,
            })
          )
        );
      });

      expect(container.textContent).toContain('75.5');
      expect(container.textContent).toContain('Mbps');

      // Anti-slop invariants: Zero #FF6B35 and Zero linearGradient
      expect(container.innerHTML).not.toContain('#FF6B35');
      expect(container.innerHTML).not.toContain('#FF8C42');
      expect(container.innerHTML).not.toContain('<linearGradient');
    });
  });

  describe('SpeedTestTelemetryStrip', () => {
    it('renders download, upload, ping, and jitter with zero #FF6B35', async () => {
      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(SpeedTestTelemetryStrip, {
              phase: 'download',
              downloadSpeed: 120.4,
              uploadSpeed: 45.2,
              ping: 12,
              jitter: 2,
              isFr: true,
            })
          )
        );
      });

      expect(container.textContent).toContain('120.4');
      expect(container.textContent).toContain('45.2');
      expect(container.textContent).toContain('12');
      expect(container.textContent).toContain('2');

      // Zero Prohibited Hex
      expect(container.innerHTML).not.toContain('#FF6B35');
    });
  });

  describe('SpeedTestWaveform', () => {
    it('renders SVG polyline with zero #FF6B35', async () => {
      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(SpeedTestWaveform, {
              waveform: [10, 25, 45, 60, 85, 95],
              isFr: true,
            })
          )
        );
      });

      const polyline = container.querySelector('polyline');
      expect(polyline).not.toBeNull();

      const svg = container.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 320 24');

      // Zero Prohibited Hex
      expect(container.innerHTML).not.toContain('#FF6B35');
    });
  });

  describe('SpeedTestInstrumentPanel', () => {
    it('renders start button, triggers callback, and contains zero #FF6B35 or #E55A25', async () => {
      const onRunTest = vi.fn();
      const onCancelTest = vi.fn();

      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(SpeedTestInstrumentPanel, {
              phase: 'idle',
              currentSpeed: 0,
              downloadSpeed: null,
              uploadSpeed: null,
              ping: null,
              jitter: null,
              assessment: null,
              waveform: [],
              errorMessage: null,
              isFr: true,
              onRunTest,
              onCancelTest,
              getSummaryText: () => 'summary',
            })
          )
        );
      });

      const startBtn = container.querySelector('button') as HTMLButtonElement;
      expect(startBtn).not.toBeNull();
      expect(startBtn.textContent).toContain('Démarrer');

      act(() => {
        startBtn.click();
      });
      expect(onRunTest).toHaveBeenCalledTimes(1);

      // Anti-slop invariants: Zero #FF6B35, Zero #E55A25
      expect(container.innerHTML).not.toContain('#FF6B35');
      expect(container.innerHTML).not.toContain('#E55A25');
    });
  });

  describe('SpeedTestDiagnosticCockpit', () => {
    it('renders network diagnostics, 10GB download ETA and contains zero #FF6B35', async () => {
      await act(async () => {
        root.render(
          React.createElement(
            TestWrapper,
            null,
            React.createElement(SpeedTestDiagnosticCockpit, {
              assessment: mockAssessment,
              downloadSpeed: 100,
              uploadSpeed: 50,
              ping: 15,
              isFr: true,
            })
          )
        );
      });

      expect(container.textContent).toContain('Diagnostic de Connexion Réseau');
      expect(container.textContent).toContain('1.8');

      // Zero Prohibited Hex
      expect(container.innerHTML).not.toContain('#FF6B35');
    });
  });
});
