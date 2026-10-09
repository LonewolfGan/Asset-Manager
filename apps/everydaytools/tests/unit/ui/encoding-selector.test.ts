import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { EncodingSelector } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('EncodingSelector (TDD RED Phase)', () => {
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
          React.createElement(EncodingSelector, props)
        )
      );
    });
  };

  it('renders encoding options with active encoding selected', async () => {
    await renderComponent({
      value: 'utf-8',
      onChange: vi.fn(),
      label: 'Encodage',
      isFr: true,
    });

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).not.toBeNull();
    expect(select.value).toBe('utf-8');

    const options = container.querySelectorAll('option');
    expect(options.length).toBeGreaterThanOrEqual(4);
  });

  it('calls onChange when user selects a different encoding', async () => {
    const handleChange = vi.fn();
    await renderComponent({
      value: 'utf-8',
      onChange: handleChange,
      isFr: true,
    });

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).not.toBeNull();

    act(() => {
      select.value = 'windows-1252';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(handleChange).toHaveBeenCalledWith('windows-1252');
  });
});
