import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FileSizeBadge, formatBytes } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('FileSizeBadge (TDD RED Phase)', () => {
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
          React.createElement(FileSizeBadge, props)
        )
      );
    });
  };

  it('renders single formatted file size', async () => {
    await renderComponent({
      bytes: 1048576, // 1 MB
      isFr: true,
    });

    expect(container.textContent).toMatch(/1\s*(Mo|MB)/i);
  });

  it('formats bytes properly using formatBytes helper', () => {
    expect(formatBytes(0, 1, true)).toBe('0 o');
    expect(formatBytes(1024, 1, true)).toBe('1 Ko');
    expect(formatBytes(1048576 * 2.5, 1, true)).toBe('2.5 Mo');
    expect(formatBytes(1048576 * 2.5, 1, false)).toBe('2.5 MB');
  });

  it('renders savings percentage when originalBytes and compressedBytes are provided', async () => {
    await renderComponent({
      originalBytes: 1000000,
      compressedBytes: 600000, // -40%
      showSavings: true,
      isFr: true,
    });

    const savingsBadge = container.querySelector('[data-testid="savings-badge"]');
    expect(savingsBadge).not.toBeNull();
    expect(savingsBadge?.textContent).toContain('-40%');
  });
});
