import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ColorFormatsList } from '@/components/color-converter/ColorFormatsList';
import type { ColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/hooks/use-locale', () => ({
  useLocale: () => ({
    locale: 'FR',
    t: {
      common: { copy: 'Copier', copied: 'Copié !' },
    },
  }),
}));

describe('ColorFormatsList Component', () => {
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

  const mockFormats = [
    { key: 'HEX', label: 'HEX', sub: 'Web / CSS', value: '#1A6BFF', onUpdate: vi.fn() },
    { key: 'RGB', label: 'RGB', sub: 'Écrans', value: 'rgb(26, 107, 255)', onUpdate: vi.fn() },
    { key: 'HSL', label: 'HSL', sub: 'Teinte', value: 'hsl(219, 100%, 55%)', onUpdate: vi.fn() },
    { key: 'HSV', label: 'HSV', sub: 'Design', value: 'hsv(219, 90%, 100%)', onUpdate: vi.fn() },
    { key: 'CMYK', label: 'CMYK', sub: 'Print', value: 'cmyk(90%, 58%, 0%, 0%)', onUpdate: vi.fn() },
    { key: 'CSS', label: 'CSS Var', sub: 'Tokens', value: '--color: #1A6BFF;', onUpdate: vi.fn() },
  ];

  it('renders all color format rows and copy buttons', async () => {
    const mockWorkflow = {
      formats: mockFormats,
    } as unknown as ColorConverterWorkflow;

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(ColorFormatsList, {
            workflow: mockWorkflow,
            isFr: true,
          })
        )
      );
    });

    expect(container.textContent).toContain('HEX');
    expect(container.textContent).toContain('RGB');
    expect(container.textContent).toContain('HSL');
    expect(container.textContent).toContain('CMYK');
    expect(container.textContent).toContain('CSS Var');

    const inputs = Array.from(container.querySelectorAll('input'));
    expect(inputs.length).toBe(6);
    expect(inputs[0].value).toBe('#1A6BFF');
  });
});
