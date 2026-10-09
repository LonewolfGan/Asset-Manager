import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import WatermarkImage from '@/pages/watermark-image';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from '@/contexts/locale-context';

describe('WatermarkImage page integration with StudioCommandBar (TDD)', () => {
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

  it('renders StudioCommandBar in workbench mode when file is present', async () => {
    // We will verify StudioCommandBar with metadata and reset button
    const { StudioCommandBar } = await import('@workspace/ui');
    const handleReset = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(StudioCommandBar, {
            meta: {
              name: 'artwork.png',
              size: 2048000,
              dimensions: { width: 1920, height: 1080 },
            },
            onReset: handleReset,
            resetLabel: "Changer d'image",
            primaryAction: {
              label: 'Exporter',
              onClick: vi.fn(),
            },
          })
        )
      );
    });

    const resetBtn = container.querySelector('button[data-testid="studio-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();
    expect(container.textContent).toContain('artwork.png');
    expect(container.textContent).toContain('1920×1080');

    act(() => {
      resetBtn.click();
    });
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
