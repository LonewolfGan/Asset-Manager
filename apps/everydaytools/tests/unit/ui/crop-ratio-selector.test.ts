import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CropRatioSelector } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('CropRatioSelector (TDD RED Phase)', () => {
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
          React.createElement(CropRatioSelector, props)
        )
      );
    });
  };

  it('renders default ratio options and highlights active ratio', async () => {
    await renderComponent({
      selectedRatio: '1:1',
      onSelectRatio: vi.fn(),
      isFr: true,
    });

    expect(container.textContent).toContain('1:1');
    expect(container.textContent).toContain('16:9');
    expect(container.textContent).toContain('Libre');

    const activeBtn = container.querySelector('button[data-ratio-id="1:1"]');
    expect(activeBtn).not.toBeNull();
    expect(activeBtn?.className).toContain('text-[#FF6B35]');
  });

  it('calls onSelectRatio when a ratio option is clicked', async () => {
    const handleSelectRatio = vi.fn();
    await renderComponent({
      selectedRatio: 'free',
      onSelectRatio: handleSelectRatio,
      isFr: true,
    });

    const ratioBtn = container.querySelector('button[data-ratio-id="16:9"]') as HTMLButtonElement;
    expect(ratioBtn).not.toBeNull();

    act(() => {
      ratioBtn.click();
    });

    expect(handleSelectRatio).toHaveBeenCalledTimes(1);
    expect(handleSelectRatio).toHaveBeenCalledWith(
      expect.objectContaining({ id: '16:9', ratio: 16 / 9 })
    );
  });
});
