import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useQrCodeGenerator } from '@/hooks/use-qr-code-generator';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
  trackToolError: vi.fn(),
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'en',
    t: {
      qrCode: {
        wifiSsid: 'Network Name (SSID)',
        wifiPass: 'Password',
        encryption: 'Encryption',
        fullName: 'Full Name',
        phone: 'Phone',
        email: 'Email',
        copyImage: 'Copy Image',
        copied: 'Copied!',
      },
      nav: {
        breadcrumb: {
          home: 'Home',
          calculators: 'Calculators',
        },
      },
      tools: {
        'qr-code-generator': {
          title: 'QR Code Generator',
          description: 'Generate crisp QR codes',
        },
      },
    },
  }),
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

vi.mock('@/lib/qr-code-canvas', () => ({
  renderQrToCanvas: vi.fn().mockResolvedValue(undefined),
}));

describe('useQrCodeGenerator hook', () => {
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

  it('initializes with default URL mode, high contrast and non-arbitrary color token', async () => {
    let hook!: ReturnType<typeof useQrCodeGenerator>;
    function Harness() {
      hook = useQrCodeGenerator();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.mode).toBe('url');
    expect(hook.url).toContain('https://');
    expect(hook.contrastRatio).toBeGreaterThan(4.5);
    // Design System Contract: Zero arbitrary orange hex #FF6B35
    expect(hook.iconColor.toUpperCase()).not.toBe('#FF6B35');
  });

  it('consumes URL handoff at mount and sets mode to url', async () => {
    mockHandoffText = 'https://github.com/google/everydaytools';
    let hook!: ReturnType<typeof useQrCodeGenerator>;
    function Harness() {
      hook = useQrCodeGenerator();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.mode).toBe('url');
    expect(hook.url).toBe('https://github.com/google/everydaytools');
  });

  it('consumes Wi-Fi handoff string at mount and parses parameters', async () => {
    mockHandoffText = 'WIFI:T:WPA;S:CampusNet;P:TopSecretPassword;;';
    let hook!: ReturnType<typeof useQrCodeGenerator>;
    function Harness() {
      hook = useQrCodeGenerator();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.mode).toBe('wifi');
    expect(hook.wifiSsid).toBe('CampusNet');
    expect(hook.wifiPass).toBe('TopSecretPassword');
    expect(hook.wifiEnc).toBe('WPA');
  });

  it('consumes plain text handoff at mount and sets mode to text', async () => {
    mockHandoffText = 'Simple memo payload for QR matrix';
    let hook!: ReturnType<typeof useQrCodeGenerator>;
    function Harness() {
      hook = useQrCodeGenerator();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    expect(hook.mode).toBe('text');
    expect(hook.rawText).toBe('Simple memo payload for QR matrix');
  });

  it('supports undo and redo for state changes', async () => {
    let hook!: ReturnType<typeof useQrCodeGenerator>;
    function Harness() {
      hook = useQrCodeGenerator();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const initialUrl = hook.url;

    await act(async () => {
      hook.setUrl('https://updated-domain.org');
    });

    expect(hook.url).toBe('https://updated-domain.org');
    expect(hook.canUndo).toBe(true);

    await act(async () => {
      hook.undo();
    });

    expect(hook.url).toBe(initialUrl);
    expect(hook.canRedo).toBe(true);

    await act(async () => {
      hook.redo();
    });

    expect(hook.url).toBe('https://updated-domain.org');
  });

  it('swaps foreground and background colors with invertColors', async () => {
    let hook!: ReturnType<typeof useQrCodeGenerator>;
    function Harness() {
      hook = useQrCodeGenerator();
      return null;
    }

    await act(async () => {
      root.render(React.createElement(Harness));
    });

    const prevFg = hook.fgColor;
    const prevBg = hook.bgColor;

    await act(async () => {
      hook.invertColors();
    });

    expect(hook.fgColor).toBe(prevBg);
    expect(hook.bgColor).toBe(prevFg);
  });
});
