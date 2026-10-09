import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { QrColorPalette } from '@/components/qr/QrColorPalette';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('QrColorPalette with ColorPickerField', () => {
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

  const renderComponent = async (props: Partial<Parameters<typeof QrColorPalette>[0]> = {}) => {
    const defaultProps = {
      isFr: true,
      fgColor: '#09090b',
      setFgColor: vi.fn(),
      bgColor: '#ffffff',
      setBgColor: vi.fn(),
      invertColors: vi.fn(),
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(QrColorPalette, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('renders motif and fond color fields with hex values', async () => {
    await renderComponent({ fgColor: '#FF6B35', bgColor: '#FFFFFF' });

    expect(container.textContent).toContain('Motif');
    expect(container.textContent).toContain('#FF6B35');
    expect(container.textContent).toContain('Fond');
    expect(container.textContent).toContain('#FFFFFF');
  });

  it('triggers invertColors when invert button is clicked', async () => {
    const invertColors = vi.fn();
    await renderComponent({ invertColors });

    const invertBtn = container.querySelector('button[data-testid="qr-invert-colors-btn"]') as HTMLButtonElement;
    expect(invertBtn).not.toBeNull();

    act(() => {
      invertBtn.click();
    });

    expect(invertColors).toHaveBeenCalledTimes(1);
  });

  it('does not render any predefined preset swatches (pure color picker design)', async () => {
    await renderComponent({ fgColor: '#09090b', bgColor: '#ffffff' });

    // No preset buttons container
    const presetButtons = container.querySelectorAll('.flex.items-center.gap-2 button');
    expect(presetButtons.length).toBe(0);
  });
});

