import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CaseTransformButtonGroup, transformCase } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('CaseTransformButtonGroup (TDD RED Phase)', () => {
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
          React.createElement(CaseTransformButtonGroup, props)
        )
      );
    });
  };

  it('renders all standard case transformation options and highlights active', async () => {
    await renderComponent({
      value: 'upper',
      onSelectCase: vi.fn(),
      isFr: true,
    });

    const buttons = container.querySelectorAll('button[data-case]');
    expect(buttons.length).toBeGreaterThanOrEqual(5);

    const activeBtn = container.querySelector('button[data-case="upper"]');
    expect(activeBtn).not.toBeNull();
    expect(activeBtn?.className).toContain('bg-[#FF6B35]');
  });

  it('calls onSelectCase when a button is clicked', async () => {
    const handleSelect = vi.fn();
    await renderComponent({
      value: 'upper',
      onSelectCase: handleSelect,
      isFr: true,
    });

    const camelBtn = container.querySelector('button[data-case="camel"]') as HTMLButtonElement;
    expect(camelBtn).not.toBeNull();

    act(() => {
      camelBtn.click();
    });

    expect(handleSelect).toHaveBeenCalledWith('camel');
  });

  it('correctly transforms text using transformCase helper', () => {
    expect(transformCase('hello world', 'upper')).toBe('HELLO WORLD');
    expect(transformCase('HELLO WORLD', 'lower')).toBe('hello world');
    expect(transformCase('hello world', 'title')).toBe('Hello World');
    expect(transformCase('hello world', 'camel')).toBe('helloWorld');
    expect(transformCase('hello world', 'snake')).toBe('hello_world');
    expect(transformCase('hello world', 'kebab')).toBe('hello-world');
  });
});
