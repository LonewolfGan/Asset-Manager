import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BarcodeDataInput } from '@/components/barcode-generator/BarcodeDataInput';
import { getSymbologies } from '@/lib/barcode-symbologies';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BarcodeDataInput', () => {
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
        React.createElement(BarcodeDataInput, {
          activeSymbology,
          value: '400638133393',
          onValueChange: vi.fn(),
          validation: {
            isValid: false,
            status: 'needs_check',
            message: '12 chiffres saisis · Clé calculée : 1',
            autoFix: '4006381333931',
            expectedKey: 1,
          },
          onApplyAutoFix: vi.fn(),
          isFr: true,
        })
      );
    });

    const html = container.innerHTML;
    expect(html).not.toContain('#FF6B35');
    expect(html).not.toContain('#e85a26');
    expect(html).toContain('var(--accent)');
  });
});
