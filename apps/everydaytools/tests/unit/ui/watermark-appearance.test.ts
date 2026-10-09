import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { WatermarkAppearanceSection } from '@/components/watermark-image/WatermarkAppearanceSection';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DEFAULT_WATERMARK_CONFIG, FONT_OPTIONS } from '@/lib/watermark-logic';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('WatermarkAppearanceSection with ColorPickerField (TDD)', () => {
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

  const swatches = [
    { hex: '#FFFFFF', label: 'Blanc Pur' },
    { hex: '#000000', label: 'Noir Charbon' },
    { hex: '#FF6B35', label: 'Orange Studio' },
  ];

  it('renders ColorPickerField with color swatches and inputs', async () => {
    const setConfig = vi.fn();
    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(WatermarkAppearanceSection, {
            config: DEFAULT_WATERMARK_CONFIG,
            setConfig,
            selectedFont: FONT_OPTIONS[0],
            colorSwatches: swatches,
            isFr: true,
          })
        )
      );
    });

    const colorPickerTrigger = container.querySelector('button[data-testid="color-picker-trigger"]');
    expect(colorPickerTrigger).not.toBeNull();
  });
});
