import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ColorPicker } from '@/components/ui/color-picker';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('ColorPicker 2D canvas cursor neutral styling', () => {
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

  it('renders a neutral 2D crosshair cursor without solid background color', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorPicker, {
            value: '#FF6B35',
            onChange: vi.fn(),
          })
        )
      );
    });

    const trigger = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      trigger.click();
    });

    const cursor = container.querySelector('[data-testid="color-canvas-cursor"]') as HTMLElement;
    expect(cursor).not.toBeNull();
    // The cursor should not take the selected color as background or border color
    expect(cursor.style.backgroundColor).not.toBe('rgb(255, 107, 53)');
    expect(cursor.style.backgroundColor).toBe('');
  });
});
