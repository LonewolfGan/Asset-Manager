import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { PageRangeSelector } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('PageRangeSelector (TDD RED Phase)', () => {
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
          React.createElement(PageRangeSelector, props)
        )
      );
    });
  };

  it('renders input with range value and total pages indicator', async () => {
    await renderComponent({
      value: '1-3, 5',
      totalPages: 10,
      onChange: vi.fn(),
      isFr: true,
    });

    const input = container.querySelector('input[data-testid="page-range-input"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('1-3, 5');
    expect(container.textContent).toContain('sur 10 pages');
  });

  it('triggers quick selection buttons: all, odd, even', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      value: '',
      totalPages: 6,
      onChange: handleChange,
      isFr: true,
    });

    const allBtn = container.querySelector('button[data-testid="range-quick-all"]') as HTMLButtonElement;
    expect(allBtn).not.toBeNull();

    act(() => {
      allBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith('1-6');
  });

  it('displays error badge when range exceeds total pages', async () => {
    await renderComponent({
      value: '1-15',
      totalPages: 10,
      onChange: vi.fn(),
      isFr: true,
    });

    const errorEl = container.querySelector('[data-testid="range-error"]');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toContain('Page 15 supérieure au total (10)');
  });
});
