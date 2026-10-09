import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { QualitySliderField } from '@workspace/ui';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('QualitySliderField (TDD RED Phase)', () => {
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
          React.createElement(QualitySliderField, props)
        )
      );
    });
  };

  it('renders label, quality percentage, and slider input', async () => {
    await renderComponent({
      label: 'Qualité d’image',
      value: 80,
      onChange: vi.fn(),
      isFr: true,
    });

    expect(container.textContent).toContain('Qualité d’image');
    expect(container.textContent).toContain('80%');
    const slider = container.querySelector('input[data-testid="quality-slider"]') as HTMLInputElement;
    expect(slider).not.toBeNull();
    expect(slider.value).toBe('80');
  });

  it('renders presets and calls onChange on preset click', async () => {
    const handleChange = vi.fn();
    const presets = [
      { id: 'low', label: 'Faible', value: 30 },
      { id: 'medium', label: 'Moyen', value: 60 },
      { id: 'high', label: 'Élevé', value: 85 },
    ];

    await renderComponent({
      value: 60,
      presets,
      onChange: handleChange,
      isFr: true,
    });

    const presetBtn = container.querySelector('button[data-preset-id="high"]') as HTMLButtonElement;
    expect(presetBtn).not.toBeNull();

    act(() => {
      presetBtn.click();
    });

    expect(handleChange).toHaveBeenCalledWith(85);
  });

  it('renders estimated size badge when provided', async () => {
    await renderComponent({
      value: 75,
      estimatedLabel: '~340 Ko (-60%)',
      onChange: vi.fn(),
    });

    expect(container.textContent).toContain('~340 Ko (-60%)');
  });
});
