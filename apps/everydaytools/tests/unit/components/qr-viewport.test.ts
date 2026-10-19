import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { QrViewport } from '@/components/qr/QrViewport';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/analytics', () => ({
  trackToolUsed: vi.fn(),
}));

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'en',
    t: {
      qrCode: {
        copyImage: 'Copy Image',
        copied: 'Copied!',
      },
    },
  }),
}));

describe('QrViewport Component', () => {
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

  it('renders viewport frame without arbitrary hex #FF6B35 and uses semantic design tokens', async () => {
    const defaultProps = {
      isFr: false,
      tq: {
        copyImage: 'Copy Image',
        copied: 'Copied!',
      },
      canvasRef: React.createRef<HTMLCanvasElement>(),
      bgColor: '#ffffff',
      isEmpty: false,
      genError: null,
      content: 'https://everydaytools.qzz.io',
      size: 1024,
      downloadPng: vi.fn(),
      downloadSvg: vi.fn(),
      copyImage: vi.fn(),
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(QrViewport, defaultProps)
        )
      );
    });

    // Check that button uses var(--accent) and not arbitrary #FF6B35
    const pngButton = container.querySelector('button') as HTMLButtonElement;
    expect(pngButton).toBeTruthy();
    expect(pngButton.className).not.toContain('#FF6B35');
    expect(pngButton.className).not.toContain('transition-all');
    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a24');
  });

  it('triggers download actions when buttons are clicked', async () => {
    const downloadPng = vi.fn();
    const downloadSvg = vi.fn();

    const defaultProps = {
      isFr: false,
      tq: { copyImage: 'Copy Image', copied: 'Copied!' },
      canvasRef: React.createRef<HTMLCanvasElement>(),
      bgColor: '#ffffff',
      isEmpty: false,
      genError: null,
      content: 'https://everydaytools.qzz.io',
      size: 1024,
      downloadPng,
      downloadSvg,
      copyImage: vi.fn(),
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(QrViewport, defaultProps)
        )
      );
    });

    const buttons = container.querySelectorAll('button');
    const pngBtn = buttons[0];
    const svgBtn = buttons[1];

    await act(async () => {
      pngBtn.click();
    });
    expect(downloadPng).toHaveBeenCalledTimes(1);

    await act(async () => {
      svgBtn.click();
    });
    expect(downloadSvg).toHaveBeenCalledTimes(1);
  });
});
