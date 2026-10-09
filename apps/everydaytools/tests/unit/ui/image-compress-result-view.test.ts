import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ImageCompressResultView } from '@/components/image-compress/ImageCompressResultView';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('ImageCompressResultView integration with StudioResultCard (TDD)', () => {
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

  const mockResult = {
    blob: new Blob(['image-bytes']),
    filename: 'banner-optimized.png',
    sizeBefore: 1500000,
    sizeAfter: 600000,
    gain: 60,
  };

  it('renders StudioResultCard monument with compression savings and action buttons', async () => {
    const handleReset = vi.fn();

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ImageCompressResultView, {
            result: mockResult,
            formatIcon: '/icons/png.svg',
            isFr: true,
            t: {},
            onReset: handleReset,
          })
        )
      );
    });

    const monument = container.querySelector('[data-testid="studio-result-monument"]');
    expect(monument).not.toBeNull();
    expect(container.textContent).toContain('banner-optimized.png');
    expect(container.textContent).toContain('-60%');

    const resetBtn = container.querySelector('button[data-testid="studio-result-reset-btn"]') as HTMLButtonElement;
    expect(resetBtn).not.toBeNull();
    act(() => {
      resetBtn.click();
    });
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
