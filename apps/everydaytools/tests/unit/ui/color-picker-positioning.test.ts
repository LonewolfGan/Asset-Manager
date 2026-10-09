import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ColorPicker } from '@/components/ui/color-picker';
import { ColorPickerField } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('ColorPicker and ColorPickerField dynamic positioning & anti-clipping', () => {
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

  it('aligns to right (right-0) when align="end" is specified on ColorPicker', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorPicker, {
            value: '#FF6B35',
            onChange: vi.fn(),
            align: 'end',
          })
        )
      );
    });

    const trigger = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      trigger.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]') as HTMLElement;
    expect(popover).not.toBeNull();
    expect(popover.className).toContain('right-0');
    expect(popover.className).not.toContain('left-0');
  });

  it('flips upwards (bottom-full mb-2) when side="top" is specified on ColorPicker', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorPicker, {
            value: '#FF6B35',
            onChange: vi.fn(),
            side: 'top',
          })
        )
      );
    });

    const trigger = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      trigger.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]') as HTMLElement;
    expect(popover).not.toBeNull();
    expect(popover.className).toContain('bottom-full');
    expect(popover.className).not.toContain('top-full');
  });

  it('forwards align="end" and side="top" properly on ColorPickerField', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorPickerField, {
            label: 'Couleur',
            value: '#FF6B35',
            onChange: vi.fn(),
            align: 'end',
            side: 'top',
          })
        )
      );
    });

    const trigger = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      trigger.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]') as HTMLElement;
    expect(popover).not.toBeNull();
    expect(popover.className).toContain('right-0');
    expect(popover.className).toContain('bottom-full');
  });

  it('auto-aligns to "end" (right-0) when trigger is positioned near the right screen edge', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorPicker, {
            value: '#FF6B35',
            onChange: vi.fn(),
            align: 'auto',
          })
        )
      );
    });

    const trigger = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;

    // Mock getBoundingClientRect near the right edge of viewport
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      left: 900,
      right: 980,
      top: 200,
      bottom: 240,
      width: 80,
      height: 40,
      x: 900,
      y: 200,
      toJSON: () => {},
    });

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1000 });

    await act(async () => {
      trigger.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]') as HTMLElement;
    expect(popover).not.toBeNull();
    expect(popover.className).toContain('right-0');
  });
});
