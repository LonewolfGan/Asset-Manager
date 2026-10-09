import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ColorPicker } from '@/components/ui/color-picker';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('Unified ColorPicker component', () => {
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

  const renderComponent = async (props: any) => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorPicker, props)
        )
      );
    });
  };

  it('opens studio popover with in-popover nuance swatches grid when clicked', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      value: '#FF6B35',
      onChange: handleChange,
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    expect(triggerBtn).not.toBeNull();

    await act(async () => {
      triggerBtn.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]');
    expect(popover).not.toBeNull();

    // Must have in-popover swatches
    const swatches = popover?.querySelectorAll('[data-testid="popover-swatch-btn"]');
    expect(swatches).toBeDefined();
    expect(swatches!.length).toBeGreaterThan(0);
  });

  it('updates color and calls onChange when a nuance swatch is clicked in the popover', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      value: '#000000',
      onChange: handleChange,
    });

    const triggerBtn = container.querySelector('[data-testid="color-picker-trigger"]') as HTMLButtonElement;
    await act(async () => {
      triggerBtn.click();
    });

    const popover = container.querySelector('[data-testid="color-picker-popover"]');
    const swatches = popover?.querySelectorAll('[data-testid="popover-swatch-btn"]') as NodeListOf<HTMLButtonElement>;
    expect(swatches.length).toBeGreaterThan(1);

    act(() => {
      swatches[1].click();
    });

    expect(handleChange).toHaveBeenCalled();
  });
});
