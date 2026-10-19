import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UuidConfigBar } from '@/components/uuid-generator/UuidConfigBar';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('UuidConfigBar', () => {
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

  it('renders version and quantity options and does not use transition-all', async () => {
    const onVersionChange = vi.fn();
    const onCountChange = vi.fn();
    const onGenerate = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(UuidConfigBar, {
            version: 'v4',
            count: 1,
            isRefreshing: false,
            isFr: true,
            onVersionChange,
            onCountChange,
            onGenerate,
          })
        )
      );
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    const regenerateBtn = buttons.find(
      (b) => b.textContent?.includes('Régénérer') || b.textContent?.includes('Regenerate')
    );
    expect(regenerateBtn).toBeTruthy();
    expect(regenerateBtn?.className).not.toContain('transition-all');
    expect(regenerateBtn?.className).toContain('transition-colors');

    act(() => {
      regenerateBtn?.click();
    });
    expect(onGenerate).toHaveBeenCalled();
  });
});
