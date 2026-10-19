import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ColorConverterHeader } from '@/components/color-converter/ColorConverterHeader';
import type { ColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('ColorConverterHeader Component', () => {
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

  const mockWorkflow = {
    hex: '#1A6BFF',
    colorInput: '#1A6BFF',
    recentColors: ['#1A6BFF', '#059669', '#DC2626'],
    handleColorInputChange: vi.fn(),
    handleInputBlurOrEnter: vi.fn(),
    updateRgb: vi.fn(),
    handleRandomColor: vi.fn(),
  } as unknown as ColorConverterWorkflow;

  it('renders technical title, color input and action buttons without transition-all', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorConverterHeader, {
            workflow: mockWorkflow,
            isFr: true,
          })
        )
      );
    });

    expect(container.textContent).toContain('COLOR CONVERTER');
    expect(container.textContent).toContain('Couleur :');
    expect(container.textContent).toContain('Aléatoire');

    // Anti-slop checks
    expect(container.innerHTML).not.toContain('transition-all');
    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a26');
  });
});
