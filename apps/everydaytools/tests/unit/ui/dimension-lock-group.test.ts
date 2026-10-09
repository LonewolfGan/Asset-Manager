import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { DimensionLockGroup } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('DimensionLockGroup (TDD RED Phase)', () => {
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
          React.createElement(DimensionLockGroup, props)
        )
      );
    });
  };

  it('renders width and height inputs with current values', async () => {
    await renderComponent({
      width: 1920,
      height: 1080,
      onWidthChange: vi.fn(),
      onHeightChange: vi.fn(),
    });

    const widthInput = container.querySelector('input[data-testid="dimension-width-input"]') as HTMLInputElement;
    const heightInput = container.querySelector('input[data-testid="dimension-height-input"]') as HTMLInputElement;

    expect(widthInput).not.toBeNull();
    expect(heightInput).not.toBeNull();
    expect(widthInput.value).toBe('1920');
    expect(heightInput.value).toBe('1080');
  });

  it('toggles aspect ratio lock when lock button is clicked', async () => {
    const handleToggleLock = vi.fn();
    await renderComponent({
      width: 800,
      height: 600,
      isLocked: true,
      onToggleLock: handleToggleLock,
    });

    const lockBtn = container.querySelector('button[data-testid="dimension-lock-btn"]') as HTMLButtonElement;
    expect(lockBtn).not.toBeNull();

    act(() => {
      lockBtn.click();
    });

    expect(handleToggleLock).toHaveBeenCalledTimes(1);
  });

  it('triggers unit change when unit selector is clicked', async () => {
    const handleUnitChange = vi.fn();
    await renderComponent({
      width: 100,
      height: 100,
      unit: 'px',
      onUnitChange: handleUnitChange,
    });

    const percentBtn = container.querySelector('button[data-testid="dimension-unit-percent"]') as HTMLButtonElement;
    expect(percentBtn).not.toBeNull();

    act(() => {
      percentBtn.click();
    });

    expect(handleUnitChange).toHaveBeenCalledWith('%');
  });

  it('triggers swap dimensions when swap button is clicked', async () => {
    const handleSwap = vi.fn();
    await renderComponent({
      width: 1920,
      height: 1080,
      onSwap: handleSwap,
    });

    const swapBtn = container.querySelector('button[data-testid="dimension-swap-btn"]') as HTMLButtonElement;
    expect(swapBtn).not.toBeNull();

    act(() => {
      swapBtn.click();
    });

    expect(handleSwap).toHaveBeenCalledTimes(1);
  });
});
