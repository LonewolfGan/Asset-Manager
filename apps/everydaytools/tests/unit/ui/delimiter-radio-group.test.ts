import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { DelimiterRadioGroup } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('DelimiterRadioGroup (TDD RED Phase)', () => {
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
          React.createElement(DelimiterRadioGroup, props)
        )
      );
    });
  };

  it('renders standard delimiter options and highlights active delimiter', async () => {
    await renderComponent({
      value: ',',
      onChange: vi.fn(),
      label: 'Séparateur',
      isFr: true,
    });

    const buttons = container.querySelectorAll('button[data-delimiter]');
    expect(buttons.length).toBeGreaterThanOrEqual(4);

    const commaBtn = container.querySelector('button[data-delimiter=","]');
    expect(commaBtn).not.toBeNull();
    expect(commaBtn?.className).toContain('bg-[#FF6B35]');
  });

  it('calls onChange when clicking a delimiter button', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      value: ',',
      onChange: handleChange,
      isFr: true,
    });

    const semicolonBtn = container.querySelector('button[data-delimiter=";"]') as HTMLButtonElement;
    expect(semicolonBtn).not.toBeNull();

    act(() => {
      semicolonBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith(';');
  });

  it('allows custom delimiter input when allowCustom is true', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      value: 'custom',
      onChange: handleChange,
      allowCustom: true,
      isFr: true,
    });

    const customBtn = container.querySelector('button[data-delimiter="custom"]') as HTMLButtonElement;
    expect(customBtn).not.toBeNull();

    act(() => {
      customBtn.click();
    });

    const customInput = container.querySelector('input[data-testid="custom-delimiter-input"]') as HTMLInputElement;
    expect(customInput).not.toBeNull();
  });
});
