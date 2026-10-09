import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PositionPlacementGrid } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('PositionPlacementGrid (TDD RED Phase)', () => {
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
          React.createElement(PositionPlacementGrid, props)
        )
      );
    });
  };

  it('renders 9 quadrant buttons and highlights active position', async () => {
    await renderComponent({
      position: 'bottom-center',
      onSelectPosition: vi.fn(),
      isFr: true,
    });

    const buttons = container.querySelectorAll('button[data-placement]');
    expect(buttons.length).toBe(9);

    const activeBtn = container.querySelector('button[data-placement="bottom-center"]');
    expect(activeBtn).not.toBeNull();
    expect(activeBtn?.className).toContain('bg-[#FF6B35]');
  });

  it('calls onSelectPosition when a quadrant is clicked', async () => {
    const handleSelect = vi.fn();
    await renderComponent({
      position: 'center',
      onSelectPosition: handleSelect,
      isFr: true,
    });

    const topLeftBtn = container.querySelector('button[data-placement="top-left"]') as HTMLButtonElement;
    expect(topLeftBtn).not.toBeNull();

    act(() => {
      topLeftBtn.click();
    });

    expect(handleSelect).toHaveBeenCalledWith('top-left');
  });
});
