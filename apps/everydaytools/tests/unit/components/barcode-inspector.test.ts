import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BarcodeInspector } from '@/components/barcode-generator/BarcodeInspector';
import { getSymbologies } from '@/lib/barcode-symbologies';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BarcodeInspector', () => {
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

  it('renders without hardcoded #FF6B35 or #e85a26 and uses design system tokens', async () => {
    const activeSymbology = getSymbologies(true)[0];
    await act(async () => {
      root.render(
        React.createElement(BarcodeInspector, {
          activeSymbology,
          barWidth: 2,
          onBarWidthChange: vi.fn(),
          barHeight: 85,
          onBarHeightChange: vi.fn(),
          quietZone: 14,
          onQuietZoneChange: vi.fn(),
          displayValue: true,
          onDisplayValueChange: vi.fn(),
          fontSize: 15,
          onFontSizeChange: vi.fn(),
          textPosition: 'bottom',
          onTextPositionChange: vi.fn(),
          inkColor: '#18181b',
          onInkColorChange: vi.fn(),
          backgroundMode: 'paper',
          onBackgroundModeChange: vi.fn(),
          isFr: true,
        })
      );
    });

    const widthBtn2px = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === '2px'
    );
    expect(widthBtn2px?.className).toContain('var(--accent)');
    expect(widthBtn2px?.className).not.toContain('#FF6B35');

    const switchBtn = container.querySelector('button[role="switch"]');
    expect(switchBtn?.className).toContain('var(--accent)');
    expect(switchBtn?.className).not.toContain('#FF6B35');

    const bottomBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Dessous' || b.textContent?.trim() === 'Bottom'
    );
    expect(bottomBtn?.className).toContain('var(--accent)');
    expect(bottomBtn?.className).not.toContain('#FF6B35');
  });
});
