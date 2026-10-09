import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { HashAlgorithmPills } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('HashAlgorithmPills (TDD RED Phase)', () => {
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
          React.createElement(HashAlgorithmPills, props)
        )
      );
    });
  };

  it('renders default algorithm pills and highlights active one', async () => {
    await renderComponent({
      selectedAlgorithm: 'sha-256',
      onSelectAlgorithm: vi.fn(),
      isFr: true,
    });

    const buttons = container.querySelectorAll('button[data-algorithm]');
    expect(buttons.length).toBeGreaterThanOrEqual(4);

    const activeBtn = container.querySelector('button[data-algorithm="sha-256"]');
    expect(activeBtn).not.toBeNull();
    expect(activeBtn?.className).toContain('bg-[#FF6B35]');
  });

  it('calls onSelectAlgorithm when clicking an algorithm pill', async () => {
    const handleSelect = vi.fn();
    await renderComponent({
      selectedAlgorithm: 'sha-256',
      onSelectAlgorithm: handleSelect,
      isFr: true,
    });

    const md5Btn = container.querySelector('button[data-algorithm="md5"]') as HTMLButtonElement;
    expect(md5Btn).not.toBeNull();

    act(() => {
      md5Btn.click();
    });

    expect(handleSelect).toHaveBeenCalledWith('md5');
  });
});
