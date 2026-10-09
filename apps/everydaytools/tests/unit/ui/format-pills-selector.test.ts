import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FormatPillsSelector } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('FormatPillsSelector (TDD RED Phase)', () => {
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
          React.createElement(FormatPillsSelector, props)
        )
      );
    });
  };

  it('renders default formats and highlights active format', async () => {
    await renderComponent({
      value: 'png',
      onChange: vi.fn(),
      label: 'Format de sortie',
      isFr: true,
    });

    const buttons = container.querySelectorAll('button[data-format]');
    expect(buttons.length).toBeGreaterThanOrEqual(3);

    const activeBtn = container.querySelector('button[data-format="png"]');
    expect(activeBtn).not.toBeNull();
    expect(activeBtn?.className).toContain('bg-[#FF6B35]');
  });

  it('calls onChange when user clicks another format', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      value: 'png',
      onChange: handleChange,
      isFr: true,
    });

    const webpBtn = container.querySelector('button[data-format="webp"]') as HTMLButtonElement;
    expect(webpBtn).not.toBeNull();

    act(() => {
      webpBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith('webp');
  });
});
