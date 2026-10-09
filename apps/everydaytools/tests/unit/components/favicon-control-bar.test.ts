import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FaviconControlBar } from '@/components/favicon-generator/FaviconControlBar';
import { TooltipProvider } from '@/components/ui/tooltip';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('FaviconControlBar background selector without parasite presets', () => {
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

  const renderComponent = async (props: Partial<Parameters<typeof FaviconControlBar>[0]> = {}) => {
    const defaultProps = {
      previewShape: 'rounded' as const,
      onShapeChange: vi.fn(),
      padding: 10,
      onPaddingChange: vi.fn(),
      bgColor: 'transparent',
      onBgColorChange: vi.fn(),
      stageView: 'grid' as const,
      browserTheme: 'dark' as const,
      onBrowserThemeChange: vi.fn(),
      isFr: true,
      ...props,
    };

    await act(async () => {
      root.render(
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(FaviconControlBar, defaultProps)
        )
      );
    });

    return defaultProps;
  };

  it('does not render separate preset color buttons (Noir Zinc, Studio Orange, Blanc)', async () => {
    await renderComponent({ isFr: true });

    // The text content should not contain separate swatch preset labels
    expect(container.textContent).not.toContain('Noir Zinc');
    expect(container.textContent).not.toContain('Studio Orange');
    expect(container.textContent).not.toContain('Blanc');
  });

  it('renders transparent button and unified color picker', async () => {
    const onBgColorChange = vi.fn();
    await renderComponent({ isFr: true, bgColor: '#FF6B35', onBgColorChange });

    expect(container.textContent).toContain('Transparent');
    expect(container.textContent).toContain('#FF6B35');
  });
});
