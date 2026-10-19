import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ColorVisualMonolith } from '@/components/color-converter/ColorVisualMonolith';
import type { ColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('ColorVisualMonolith Component', () => {
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
    rgb: { r: 26, g: 107, b: 255 },
    luminance: 0.18,
    contrastTextColor: '#FFFFFF',
    contrastWithWhite: 4.5,
    contrastWithBlack: 4.6,
    spectrumStrip: ['#99ccff', '#66aaff', '#3388ff', '#1a6bff', '#0044cc', '#003399', '#002266'],
    updateRgb: vi.fn(),
  } as unknown as ColorConverterWorkflow;

  it('renders visual monolith and spectrum strip with correct hex and rgb', async () => {
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorVisualMonolith, {
            workflow: mockWorkflow,
            isFr: true,
          })
        )
      );
    });

    expect(container.textContent).toContain('#1A6BFF');
    expect(container.textContent).toContain('R 26 · G 107 · B 255');
    expect(container.textContent).toContain('LUM 18.0%');
    expect(container.textContent).toContain('TINTS');
    expect(container.textContent).toContain('SHADES');

    // Anti-slop checks
    expect(container.innerHTML).not.toContain('transition-all');
    expect(container.innerHTML).not.toContain('#FF6B35');
    expect(container.innerHTML).not.toContain('#e85a26');
  });
});
